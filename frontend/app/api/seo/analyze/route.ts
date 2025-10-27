import { NextRequest, NextResponse } from 'next/server'
import { optimizeContent } from '@/lib/seo/openai'

export async function POST(request: NextRequest) {
  try {
    const { content, keywords, title } = await request.json()

    if (!content || !keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'Content and keywords array required' },
        { status: 400 }
      )
    }

    // Analyze content for SEO optimization
    const analysis = await analyzeSEOContent(content, keywords, title)

    // Get optimization suggestions
    const optimization = await optimizeContent(content, keywords)

    return NextResponse.json({
      analysis,
      optimization,
      score: calculateOverallScore(analysis, optimization.seoScore)
    })
  } catch (error) {
    console.error('SEO analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 })
  }
}

async function analyzeSEOContent(
  content: string,
  keywords: string[],
  title?: string
): Promise<{
  keywordAnalysis: any
  structureAnalysis: any
  readabilityAnalysis: any
  technicalSEO: any
}> {
  const primaryKeyword = keywords[0] || ''
  const secondaryKeywords = keywords.slice(1)

  // Keyword analysis
  const keywordDensity = calculateKeywordDensity(content, primaryKeyword)
  const keywordPlacement = analyzeKeywordPlacement(content, primaryKeyword)

  // Structure analysis
  const headings = extractHeadings(content)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
  const wordCount = content.split(/\s+/).length

  // Readability analysis
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length
  const avgWordsPerParagraph = wordCount / paragraphs.length

  return {
    keywordAnalysis: {
      primaryKeyword,
      density: keywordDensity,
      placement: keywordPlacement,
      secondaryKeywordsUsed: secondaryKeywords.filter(k => content.toLowerCase().includes(k.toLowerCase()))
    },
    structureAnalysis: {
      headingsCount: headings.length,
      h2Count: headings.filter(h => h.level === 2).length,
      h3Count: headings.filter(h => h.level === 3).length,
      wordCount,
      paragraphCount: paragraphs.length,
      avgWordsPerParagraph: Math.round(avgWordsPerParagraph)
    },
    readabilityAnalysis: {
      avgSentenceLength: Math.round(avgSentenceLength),
      fleschScore: calculateFleschScore(sentences, wordCount),
      readingTime: Math.ceil(wordCount / 200)
    },
    technicalSEO: {
      titleLength: title ? title.length : 0,
      metaDescriptionLength: 0, // Would need to be passed separately
      imagesWithAlt: 0, // Would need HTML parsing
      internalLinks: 0, // Would need HTML parsing
      externalLinks: 0  // Would need HTML parsing
    }
  }
}

function calculateKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/)
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length
  return Math.round((keywordCount / words.length) * 100 * 100) / 100 // Percentage with 2 decimals
}

function analyzeKeywordPlacement(content: string, keyword: string): {
  inTitle: boolean
  inFirstParagraph: boolean
  inLastParagraph: boolean
  inHeadings: number
} {
  const lowerContent = content.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const paragraphs = content.split('\n\n')
  const headings = extractHeadings(content)

  return {
    inTitle: false, // Would need title parameter
    inFirstParagraph: paragraphs[0]?.toLowerCase().includes(lowerKeyword) || false,
    inLastParagraph: paragraphs[paragraphs.length - 1]?.toLowerCase().includes(lowerKeyword) || false,
    inHeadings: headings.filter(h => h.text.toLowerCase().includes(lowerKeyword)).length
  }
}

function extractHeadings(content: string): Array<{ level: number; text: string }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Array<{ level: number; text: string }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim()
    })
  }

  return headings
}

function calculateFleschScore(sentences: string[], wordCount: number): number {
  // Simplified Flesch Reading Ease score
  const avgSentenceLength = wordCount / sentences.length
  const avgSyllablesPerWord = 1.5 // Rough estimate
  return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
}

function calculateOverallScore(analysis: any, openaiScore: number): number {
  let score = 0

  // Keyword optimization (30%)
  if (analysis.keywordAnalysis.density >= 1 && analysis.keywordAnalysis.density <= 3) score += 20
  if (analysis.keywordAnalysis.placement.inFirstParagraph) score += 10

  // Content structure (25%)
  if (analysis.structureAnalysis.h2Count >= 3) score += 10
  if (analysis.structureAnalysis.wordCount >= 1500) score += 10
  if (analysis.structureAnalysis.avgWordsPerParagraph <= 150) score += 5

  // Readability (20%)
  if (analysis.readabilityAnalysis.avgSentenceLength <= 25) score += 10
  if (analysis.readabilityAnalysis.fleschScore >= 60) score += 10

  // Technical SEO (15%)
  if (analysis.technicalSEO.titleLength >= 30 && analysis.technicalSEO.titleLength <= 60) score += 15

  // OpenAI analysis (10%)
  score += Math.round(openaiScore * 0.1)

  return Math.min(100, Math.max(0, score))
}