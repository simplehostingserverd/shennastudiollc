import googleTrends from 'google-trends-api'

export interface TrendsData {
  interest_over_time?: Array<{
    date: string
    value: number
  }>
  related_queries?: Array<{
    query: string
    value: number
  }>
  related_topics?: Array<{
    topic: string
    value: number
  }>
}

interface GoogleTrendsOptions {
  keyword: string
  startTime: Date
  geo: string
  category?: string
}

interface GoogleTrendsTimelineItem {
  time: string
  value: number[]
}

interface GoogleTrendsRankedItem {
  query?: string
  value: number
  topic?: {
    title: string
  }
}

interface GoogleTrendsResponse {
  default: {
    timelineData?: GoogleTrendsTimelineItem[]
    rankedList?: Array<{
      rankedKeyword?: GoogleTrendsRankedItem[]
    }>
  }
}

export async function getGoogleTrendsData(keyword: string, category?: string): Promise<TrendsData> {
  try {
    const options: GoogleTrendsOptions = {
      keyword,
      startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Last year
      geo: 'US',
    }

    if (category) {
      options.category = category
    }

    const results = await googleTrends.interestOverTime(options)
    const data: GoogleTrendsResponse = JSON.parse(results)

    return {
      interest_over_time: data.default.timelineData?.map((item) => ({
        date: item.time,
        value: item.value[0]
      })) || [],
      related_queries: data.default.rankedList?.[0]?.rankedKeyword?.map((item) => ({
        query: item.query || '',
        value: item.value
      })) || [],
      related_topics: data.default.rankedList?.[1]?.rankedKeyword?.map((item) => ({
        topic: item.topic?.title || '',
        value: item.value
      })) || []
    }
  } catch (error) {
    console.error('Google Trends API error:', error)
    return {}
  }
}

interface DailyTrendsItem {
  title: {
    query: string
  }
  formattedTraffic: string
}

interface DailyTrendsResponse {
  default: {
    trendingSearchesDays?: Array<{
      trendingSearches?: DailyTrendsItem[]
    }>
  }
}

export async function getRisingTopics(_category: string = 'ocean conservation'): Promise<Array<{
  title: string
  value: string
  formattedValue: string
}>> {
  try {
    const results = await googleTrends.dailyTrends({
      trendDate: new Date(),
      geo: 'US',
    })

    const data: DailyTrendsResponse = JSON.parse(results)

    // Filter for relevant topics
    return data.default.trendingSearchesDays?.[0]?.trendingSearches
      ?.filter((item) =>
        item.title.query.toLowerCase().includes('ocean') ||
        item.title.query.toLowerCase().includes('conservation') ||
        item.title.query.toLowerCase().includes('marine') ||
        item.title.query.toLowerCase().includes('sea') ||
        item.title.query.toLowerCase().includes('beach')
      )
      ?.map((item) => ({
        title: item.title.query,
        value: item.formattedTraffic,
        formattedValue: item.formattedTraffic
      })) || []
  } catch (error) {
    console.error('Rising topics error:', error)
    return []
  }
}