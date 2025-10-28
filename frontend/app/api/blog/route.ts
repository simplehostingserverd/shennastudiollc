import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build WHERE clause for raw query
    let whereClause = 'WHERE "published" = true'
    const params: any[] = []
    let paramIndex = 1

    if (category && category !== 'All') {
      whereClause += ` AND "category" = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    // Fetch posts using raw query to avoid Prisma schema issues
    const posts = await prisma.$queryRawUnsafe<any[]>(`
      SELECT
        bp.*,
        u.id as "author_id",
        u.email as "author_email",
        COALESCE(u.first_name || ' ' || u.last_name, u.email) as "author_name"
      FROM "BlogPost" bp
      LEFT JOIN "user" u ON bp."authorId" = u.id
      ${whereClause}
      ORDER BY bp."createdAt" DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, ...params, limit, offset)

    const totalResult = await prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*) as count FROM "BlogPost" ${whereClause}
    `, ...params)

    const total = parseInt(totalResult[0]?.count || '0')

    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      ...post,
      author: {
        id: post.author_id,
        email: post.author_email,
        name: post.author_name || 'Shenna\'s Studio',
      },
      _count: {
        comments: 0, // We'll add comment counting later if needed
      },
    }))

    return NextResponse.json({
      posts: formattedPosts,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      keywords,
      metaDescription,
      authorId,
      published,
      readTime,
    } = body

    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        coverImage,
        category: category || 'Uncategorized',
        tags: tags || [],
        keywords: keywords || '',
        metaDescription,
        authorId,
        published: published || false,
        publishedAt: published ? new Date() : null,
        readTime,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
