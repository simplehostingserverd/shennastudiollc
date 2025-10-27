import { NextRequest, NextResponse } from 'next/server'
import { getRisingTopics } from '@/lib/seo/google-trends'
import { getKeywordSuggestions, analyzeCompetition } from '@/lib/seo/serper'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'ocean conservation'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get trending topics from Google Trends
    const trendingTopics = await getRisingTopics(category)

    // Generate topic ideas using OpenAI
    const topicIdeas = await generateTopicIdeas(category, limit)

    // Analyze competition for top topics
    const analyzedTopics = await Promise.all(
      topicIdeas.slice(0, 5).map(async (topic) => {
        try {
          const competition = await analyzeCompetition(topic.title)
          return {
            ...topic,
            competition
          }
        } catch (error) {
          return {
            ...topic,
            competition: { competitionLevel: 'Medium', topDomains: [], averageDomainAuthority: 50 }
          }
        }
      })
    )

    return NextResponse.json({
      trendingTopics,
      topicIdeas: analyzedTopics,
      category
    })
  } catch (error) {
    console.error('Topic discovery error:', error)
    return NextResponse.json({ error: 'Failed to discover topics' }, { status: 500 })
  }
}

async function generateTopicIdeas(category: string, limit: number): Promise<Array<{
  title: string
  description: string
  keywords: string[]
  estimatedTraffic: string
}>> {
  try {
    const prompt = `Generate ${limit} high-converting blog post ideas for the "${category}" niche. Each idea should include:

1. Compelling title (SEO optimized)
2. Brief description (2-3 sentences)
3. Primary and secondary keywords
4. Estimated monthly search volume

Focus on topics that:
- Have commercial intent or educational value
- Target long-tail keywords
- Solve problems or answer questions
- Can rank well in search engines

Format as JSON array with objects containing: title, description, keywords (array), estimatedTraffic`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a SEO expert and content strategist. Generate high-quality blog post ideas that will drive organic traffic." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    const topicIdeas = JSON.parse(response)
    return topicIdeas
  } catch (error) {
    console.error('OpenAI topic generation error:', error)
    // Fallback to basic topic ideas
    return [
      {
        title: `The Ultimate Guide to ${category}`,
        description: `Comprehensive guide covering everything you need to know about ${category}.`,
        keywords: [category, `${category} guide`, `learn ${category}`],
        estimatedTraffic: "1K-10K"
      }
    ]
  }
}