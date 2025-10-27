import { NextRequest, NextResponse } from 'next/server'
import { getGoogleTrendsData } from '@/lib/seo/google-trends'
import { searchSerper } from '@/lib/seo/serper'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')
    const category = searchParams.get('category') || 'ocean conservation'

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword parameter required' }, { status: 400 })
    }

    // Get Google Trends data
    const trendsData = await getGoogleTrendsData(keyword, category)

    // Get SERP data for keyword research
    const serpData = await searchSerper(keyword)

    // Analyze keyword difficulty, volume, and competition
    const keywordAnalysis = {
      keyword,
      searchVolume: trendsData.interest_over_time?.length > 0 ?
        Math.round(trendsData.interest_over_time.reduce((sum: number, item: any) => sum + item.value, 0) / trendsData.interest_over_time.length) : 0,
      competition: serpData.organic_results?.length || 0,
      difficulty: calculateKeywordDifficulty(serpData),
      relatedKeywords: serpData.related_searches?.map((item: any) => item.query) || [],
      trends: trendsData.interest_over_time || [],
      topResults: serpData.organic_results?.slice(0, 10) || []
    }

    return NextResponse.json(keywordAnalysis)
  } catch (error) {
    console.error('Keyword research error:', error)
    return NextResponse.json({ error: 'Failed to analyze keyword' }, { status: 500 })
  }
}

function calculateKeywordDifficulty(serpData: any): string {
  const results = serpData.organic_results || []
  const totalResults = results.length

  // Simple difficulty calculation based on domain authority and result count
  if (totalResults < 5) return 'Easy'
  if (totalResults < 10) return 'Medium'
  if (totalResults < 20) return 'Hard'
  return 'Very Hard'
}