import OpenAI from 'openai'

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set')
  }
  return new OpenAI({ apiKey })
}

export interface BlogPostContent {
  title: string
  excerpt: string
  content: string
  keywords: string[]
  metaDescription: string
  headings: string[]
  category: string
  tags: string[]
  readTime: number
}

export async function generateBlogPost(
  topic: string,
  keywords: string[],
  category: string = 'Conservation'
): Promise<BlogPostContent> {
  try {
    const openai = getOpenAIClient()

    const prompt = `Write a comprehensive, SEO-optimized blog post about "${topic}" for the ocean conservation niche.

Requirements:
- Title: SEO-friendly, engaging, under 60 characters
- Excerpt: Compelling preview, 150-160 characters
- Content: 1500-2500 words, well-structured with H2/H3 headings
- Include primary keyword: "${keywords[0]}" in title, first paragraph, and conclusion
- Include secondary keywords naturally: ${keywords.slice(1).join(', ')}
- Meta description: 150-160 characters, includes primary keyword
- Category: ${category}
- Tags: 5-8 relevant tags
- Reading time estimate

Structure:
1. Introduction with hook
2. 4-6 main sections with descriptive H2 headings
3. Each section should have 2-3 H3 subheadings
4. Include statistics, facts, and expert insights
5. Call-to-action conclusion
6. Internal/external link suggestions

Write in engaging, authoritative tone. Use transition words. Include bullet points and numbered lists where appropriate.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert SEO content writer specializing in ocean conservation and environmental topics. Create high-quality, engaging content that ranks well in search engines." },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    return parseBlogPostResponse(response, topic, keywords, category)
  } catch (error) {
    console.error('OpenAI content generation error:', error)
    throw error
  }
}

function parseBlogPostResponse(
  response: string,
  topic: string,
  keywords: string[],
  category: string
): BlogPostContent {
  // Extract title (first line or line starting with #)
  const lines = response.split('\n')
  const title = lines.find(line => line.startsWith('# '))?.replace('# ', '') ||
                lines[0].replace(/^Title:\s*/i, '') ||
                topic

  // Extract headings
  const headings = response.match(/^#{2,3} .+$/gm)?.map(h => h.replace(/^#{2,3} /, '')) || []

  // Estimate word count and reading time
  const wordCount = response.split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200) // Average reading speed

  return {
    title: title.substring(0, 60),
    excerpt: generateExcerpt(response),
    content: cleanContent(response),
    keywords,
    metaDescription: generateMetaDescription(response, keywords[0]),
    headings,
    category,
    tags: generateTags(topic, keywords, category),
    readTime
  }
}

function generateExcerpt(content: string): string {
  // Extract first paragraph or first 160 characters
  const paragraphs = content.split('\n\n')
  const firstPara = paragraphs.find(p => p.length > 50 && !p.startsWith('#'))
  return firstPara ? firstPara.substring(0, 160) : content.substring(0, 160)
}

function cleanContent(content: string): string {
  // Remove title if it's at the beginning
  return content.replace(/^# .+\n/, '').trim()
}

function generateMetaDescription(content: string, primaryKeyword: string): string {
  const excerpt = generateExcerpt(content)
  if (excerpt.includes(primaryKeyword)) return excerpt
  return `${primaryKeyword} - ${excerpt}`.substring(0, 160)
}

function generateTags(topic: string, keywords: string[], category: string): string[] {
  const tags = new Set([
    category.toLowerCase(),
    ...keywords.map(k => k.toLowerCase()),
    ...topic.toLowerCase().split(' ').filter(word => word.length > 3)
  ])

  return Array.from(tags).slice(0, 8)
}

export async function optimizeContent(
  content: string,
  keywords: string[]
): Promise<{
  optimizedContent: string
  seoScore: number
  suggestions: string[]
}> {
  try {
    const openai = getOpenAIClient()

    const prompt = `Analyze and optimize this blog content for SEO. Primary keyword: "${keywords[0]}"

Content to analyze:
${content}

Provide:
1. SEO score (0-100)
2. List of specific optimization suggestions
3. Optimized version of key sections

Focus on:
- Keyword density and placement
- Heading structure (H1, H2, H3)
- Content length and readability
- Internal/external linking opportunities
- Call-to-action optimization`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an SEO optimization expert. Analyze content and provide actionable improvements." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.3
    })

    const response = completion.choices[0]?.message?.content || ''

    return {
      optimizedContent: content, // Keep original for now
      seoScore: extractScore(response),
      suggestions: extractSuggestions(response)
    }
  } catch (error) {
    console.error('SEO optimization error:', error)
    return {
      optimizedContent: content,
      seoScore: 70,
      suggestions: ['Content analysis failed - please review manually']
    }
  }
}

function extractScore(response: string): number {
  const scoreMatch = response.match(/SEO score:?\s*(\d+)/i)
  return scoreMatch ? parseInt(scoreMatch[1]) : 75
}

function extractSuggestions(response: string): string[] {
  const suggestions = response.split('\n')
    .filter(line => line.startsWith('-') || line.match(/^\d+\./))
    .map(line => line.replace(/^[-•]\s*|\d+\.\s*/, '').trim())
    .filter(line => line.length > 10)

  return suggestions.length > 0 ? suggestions : ['Review keyword placement', 'Check heading structure', 'Add internal links']
}