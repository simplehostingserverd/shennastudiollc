import { NextRequest, NextResponse } from 'next/server'
import { generateBlogPost } from '@/lib/seo/openai'
import { analyzeCompetition } from '@/lib/seo/serper'

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, category = 'Conservation' } = await request.json()

    if (!topic || !keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'Topic and keywords array required' },
        { status: 400 }
      )
    }

    // Generate blog post content
    const blogPost = await generateBlogPost(topic, keywords, category)

    // Analyze competition for the topic
    const competition = await analyzeCompetition(keywords[0])

    // Generate SEO recommendations
    const seoRecommendations = generateSEORecommendations(blogPost, competition)

    return NextResponse.json({
      blogPost,
      competition,
      seoRecommendations,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}

function generateSEORecommendations(blogPost: any, competition: any): string[] {
  const recommendations: string[] = []

  // Title recommendations
  if (blogPost.title.length < 30) {
    recommendations.push('Consider making the title longer for better SEO (aim for 50-60 characters)')
  }

  // Keyword recommendations
  if (!blogPost.content.toLowerCase().includes(blogPost.keywords[0].toLowerCase())) {
    recommendations.push(`Ensure primary keyword "${blogPost.keywords[0]}" appears naturally in the content`)
  }

  // Content length recommendations
  const wordCount = blogPost.content.split(/\s+/).length
  if (wordCount < 1500) {
    recommendations.push('Consider expanding content to 1500+ words for better ranking potential')
  }

  // Heading structure recommendations
  if (blogPost.headings.length < 4) {
    recommendations.push('Add more H2 headings to improve content structure and SEO')
  }

  // Competition-based recommendations
  if (competition.competitionLevel === 'High' || competition.competitionLevel === 'Very High') {
    recommendations.push('High competition detected - focus on long-tail keywords and unique angles')
    recommendations.push('Consider creating comprehensive guides or case studies to differentiate from competitors')
  }

  // Meta description recommendations
  if (blogPost.metaDescription.length < 120) {
    recommendations.push('Expand meta description to 150-160 characters for better SERP display')
  }

  return recommendations
}

// Auto-generate and publish workflow
export async function PUT(request: NextRequest) {
  try {
    const { topic, keywords, category, schedulePublish = false, publishDate } = await request.json()

    if (!topic || !keywords) {
      return NextResponse.json(
        { error: 'Topic and keywords required' },
        { status: 400 }
      )
    }

    // Generate content
    const blogPost = await generateBlogPost(topic, keywords, category)

    // Create the blog post in database
    const dbResponse = await createBlogPostInDB(blogPost, schedulePublish, publishDate)

    return NextResponse.json({
      success: true,
      blogPost: dbResponse,
      message: schedulePublish ? 'Blog post scheduled for publication' : 'Blog post created and published'
    })
  } catch (error) {
    console.error('Auto-publish error:', error)
    return NextResponse.json({ error: 'Failed to create and publish blog post' }, { status: 500 })
  }
}

async function createBlogPostInDB(blogPost: any, schedulePublish: boolean, publishDate?: string) {
  // This would integrate with your existing blog creation API
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...blogPost,
      published: !schedulePublish,
      publishedAt: publishDate ? new Date(publishDate).toISOString() : null,
      authorId: 'seo-automation-system'
    })
  })

  if (!response.ok) {
    throw new Error('Failed to save blog post to database')
  }

  return await response.json()
}