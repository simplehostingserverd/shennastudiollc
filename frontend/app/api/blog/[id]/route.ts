import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params

    // Try to find by ID first, then by slug
    let posts = await prisma.$queryRawUnsafe<any[]>(`
      SELECT
        bp.*,
        u.id as "author_id",
        u.email as "author_email",
        COALESCE(u.first_name || ' ' || u.last_name, u.email) as "author_name"
      FROM "BlogPost" bp
      LEFT JOIN "user" u ON bp."authorId" = u.id
      WHERE bp.id = $1 OR bp.slug = $1
      LIMIT 1
    `, params.id)

    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const post = posts[0]

    // Increment view count
    await prisma.$executeRawUnsafe(`
      UPDATE "BlogPost"
      SET views = views + 1
      WHERE id = $1
    `, post.id)

    // Format post for frontend
    const formattedPost = {
      ...post,
      author: {
        id: post.author_id,
        email: post.author_email,
        name: post.author_name || 'Shenna\'s Studio',
      },
      comments: [], // We'll add comment fetching later if needed
    }

    return NextResponse.json(formattedPost)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
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
      published,
      readTime,
    } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) updateData.content = content
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = tags
    if (keywords !== undefined) updateData.keywords = keywords
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (readTime !== undefined) updateData.readTime = readTime
    
    if (published !== undefined) {
      updateData.published = published
      if (published && !updateData.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    await prisma.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
