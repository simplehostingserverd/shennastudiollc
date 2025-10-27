import { NextRequest, NextResponse } from 'next/server'
import { generateBlogPost } from '@/lib/seo/openai'

interface ScheduledPost {
  id: string
  topic: string
  keywords: string[]
  category: string
  publishDate: string
  status: 'scheduled' | 'generating' | 'ready' | 'published' | 'failed'
  generatedContent?: any
  createdAt: string
  updatedAt: string
}

// In-memory storage for scheduled posts (in production, use database)
let scheduledPosts: ScheduledPost[] = []

export async function GET() {
  return NextResponse.json({ scheduledPosts })
}

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, category, publishDate } = await request.json()

    if (!topic || !keywords || !publishDate) {
      return NextResponse.json(
        { error: 'Topic, keywords, and publish date required' },
        { status: 400 }
      )
    }

    const scheduledPost: ScheduledPost = {
      id: `scheduled_${Date.now()}`,
      topic,
      keywords,
      category: category || 'Conservation',
      publishDate,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    scheduledPosts.push(scheduledPost)

    // Schedule content generation (in production, use a job queue)
    scheduleContentGeneration(scheduledPost.id)

    return NextResponse.json({
      success: true,
      scheduledPost
    })
  } catch (error) {
    console.error('Scheduling error:', error)
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, action } = await request.json()

    const postIndex = scheduledPosts.findIndex(p => p.id === id)
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Scheduled post not found' }, { status: 404 })
    }

    const post = scheduledPosts[postIndex]

    if (action === 'generate') {
      post.status = 'generating'
      post.updatedAt = new Date().toISOString()

      try {
        const generatedContent = await generateBlogPost(post.topic, post.keywords, post.category)
        post.generatedContent = generatedContent
        post.status = 'ready'
      } catch (error) {
        console.error('Content generation failed:', error)
        post.status = 'failed'
      }

      post.updatedAt = new Date().toISOString()
    } else if (action === 'publish') {
      if (!post.generatedContent) {
        return NextResponse.json({ error: 'No generated content to publish' }, { status: 400 })
      }

      // Publish to blog
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post.generatedContent,
          published: true,
          publishedAt: post.publishDate,
          authorId: 'seo-automation-system'
        })
      })

      if (response.ok) {
        post.status = 'published'
        post.updatedAt = new Date().toISOString()
      } else {
        throw new Error('Failed to publish post')
      }
    }

    return NextResponse.json({
      success: true,
      scheduledPost: post
    })
  } catch (error) {
    console.error('Action error:', error)
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    scheduledPosts = scheduledPosts.filter(p => p.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete scheduled post' }, { status: 500 })
  }
}

// Helper function to schedule content generation
function scheduleContentGeneration(postId: string) {
  // In production, use a proper job queue like Bull or Agenda
  setTimeout(async () => {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/seo/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, action: 'generate' })
      })

      if (response.ok) {
        console.log(`Content generated for scheduled post: ${postId}`)
      }
    } catch (error) {
      console.error('Scheduled generation failed:', error)
    }
  }, 1000) // Generate immediately for demo (in production, schedule based on publishDate)
}

// Auto-publish scheduled posts (call this from a cron job)
export async function PATCH() {
  try {
    const now = new Date()

    const postsToPublish = scheduledPosts.filter(post =>
      post.status === 'ready' &&
      new Date(post.publishDate) <= now
    )

    for (const post of postsToPublish) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/seo/schedule`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: post.id, action: 'publish' })
        })
        console.log(`Auto-published scheduled post: ${post.topic}`)
      } catch (error) {
        console.error(`Failed to auto-publish post ${post.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      published: postsToPublish.length
    })
  } catch (error) {
    console.error('Auto-publish error:', error)
    return NextResponse.json({ error: 'Failed to auto-publish posts' }, { status: 500 })
  }
}