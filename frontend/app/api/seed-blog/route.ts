import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Check if posts already exist
    const existingCount = await prisma.blogPost.count()

    if (existingCount > 0) {
      return NextResponse.json({
        message: `Blog already has ${existingCount} posts. Seeding skipped.`,
        existingCount,
      })
    }

    // First, ensure there's a user to be the author
    let author = await prisma.user.findFirst({
      where: {
        role: 'admin',
      },
    })

    if (!author) {
      console.log('Creating admin user for blog posts...')
      author = await prisma.user.create({
        data: {
          email: 'admin@shennastudio.com',
          name: "Shenna's Studio Team",
          password: 'placeholder_hash',
          role: 'admin',
        },
      })
    }

    const blogPosts = [
      {
        title:
          'Ultimate Guide to Ocean-Inspired Jewelry: Styles, Care & Sustainability 2025',
        slug: 'ocean-inspired-jewelry-guide-2025',
        excerpt:
          'Discover everything about ocean-themed jewelry including styles, care tips, and sustainable options. Learn how marine-inspired necklaces and accessories support ocean conservation.',
        category: 'Product Care',
        tags: [
          'jewelry',
          'ocean jewelry',
          'sustainable jewelry',
          'jewelry care',
          'ocean necklace',
          'marine accessories',
        ],
        keywords:
          'ocean jewelry, ocean-inspired necklace, sustainable jewelry, marine jewelry, ocean accessories, shell necklace, coral necklace, jewelry care tips, ocean conservation jewelry',
        metaDescription:
          'Complete guide to ocean-inspired jewelry: styles, care, and sustainability. Discover beautiful marine-themed necklaces and accessories that support ocean conservation.',
        readTime: '12 min read',
        content: '# Sample blog content - See full content in seed-blog-posts.ts',
        published: true,
        publishedAt: new Date('2025-01-15'),
      },
      // Add more abbreviated posts here for testing
    ]

    let created = 0
    for (const postData of blogPosts) {
      try {
        await prisma.blogPost.create({
          data: {
            ...postData,
            authorId: author.id,
          },
        })
        created++
      } catch (error) {
        console.error(`Error creating post "${postData.title}":`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${created} blog posts`,
      created,
      authorId: author.id,
    })
  } catch (error) {
    console.error('Error seeding blog posts:', error)
    return NextResponse.json(
      {
        error: 'Failed to seed blog posts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Allow GET for easy testing
export async function GET() {
  try {
    const count = await prisma.blogPost.count()
    return NextResponse.json({
      message: count > 0 ? `Blog has ${count} posts` : 'Blog is empty. Use POST to seed.',
      count,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to check blog status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
