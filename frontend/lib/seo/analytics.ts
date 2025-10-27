import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface BlogPostAnalytics {
  id: string
  title: string
  slug: string
  publishedAt: string
  views: number
  uniqueViews: number
  avgTimeOnPage: number
  bounceRate: number
  organicTraffic: number
  socialShares: number
  backlinks: number
  keywordRankings: Array<{
    keyword: string
    position: number
    searchVolume: number
    change: number
  }>
  conversionRate: number
}

interface GAPageView {
  pagePath: string
  pageTitle: string
  screenPageViews: string
  totalUsers: string
  averageSessionDuration: string
  bounceRate: string
}

interface GAMetrics {
  views: number
  uniqueUsers: number
  avgSessionDuration: number
  bounceRate: number
}

/**
 * Fetch Google Analytics 4 data using the Google Analytics Data API
 * Requires GA4_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS environment variables
 */
async function fetchGA4Data(path: string, dateRange: { startDate: string; endDate: string }): Promise<GAMetrics | null> {
  try {
    // Check if GA4 is configured
    const propertyId = process.env.GA4_PROPERTY_ID
    if (!propertyId) {
      console.log('GA4_PROPERTY_ID not configured, skipping analytics fetch')
      return null
    }

    // Note: In production, you would use the Google Analytics Data API here
    // This requires @google-analytics/data package and service account credentials
    // Example implementation:
    /*
    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    const analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: path,
          },
        },
      },
    });

    const row = response.rows?.[0];
    if (!row) return null;

    return {
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      uniqueUsers: parseInt(row.metricValues?.[1]?.value || '0'),
      avgSessionDuration: parseFloat(row.metricValues?.[2]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
    };
    */

    // For now, return null to indicate GA4 data is not available
    return null
  } catch (error) {
    console.error('Error fetching GA4 data:', error)
    return null
  }
}

/**
 * Track page view - stores in database for analytics
 */
export async function trackPageView(postId: string, userAgent: string, referrer?: string) {
  try {
    // Get the blog post
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      console.warn(`Blog post ${postId} not found`)
      return
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    // You can also log to an analytics table here for more detailed tracking
    // await prisma.pageView.create({
    //   data: {
    //     postId,
    //     userAgent,
    //     referrer,
    //     timestamp: new Date(),
    //   },
    // })

    console.log(`Page view tracked for post ${postId}`)
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

/**
 * Get blog post analytics combining database views with GA4 data
 */
export async function getBlogAnalytics(): Promise<BlogPostAnalytics[]> {
  try {
    // Fetch published blog posts from database
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        views: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        views: true,
        keywords: true,
      },
    })

    // Enhance with GA4 data if available
    const enhancedPosts: BlogPostAnalytics[] = await Promise.all(
      posts.map(async (post) => {
        // Try to fetch GA4 metrics for this post
        const ga4Data = await fetchGA4Data(`/blog/${post.slug}`, {
          startDate: '30daysAgo',
          endDate: 'today',
        })

        // Parse keywords for ranking data (if available from external SEO tools)
        const keywordRankings = parseKeywordRankings(post.keywords || '')

        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
          views: post.views,
          uniqueViews: ga4Data?.uniqueUsers || Math.floor(post.views * 0.7), // Estimate if GA4 not available
          avgTimeOnPage: ga4Data?.avgSessionDuration || 0,
          bounceRate: ga4Data?.bounceRate || 0,
          organicTraffic: Math.floor(post.views * 0.6), // Estimate organic traffic
          socialShares: 0, // Would come from social media APIs
          backlinks: 0, // Would come from SEO tools like Ahrefs, SEMrush
          keywordRankings,
          conversionRate: 0.02, // 2% default conversion rate
        }
      })
    )

    return enhancedPosts
  } catch (error) {
    console.error('Error fetching blog analytics:', error)
    return []
  }
}

/**
 * Parse keywords from blog post metadata into ranking data
 */
function parseKeywordRankings(keywords: string): BlogPostAnalytics['keywordRankings'] {
  if (!keywords) return []

  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean)

  // In production, you would query actual ranking data from SEO tools
  // For now, return empty array since we need external APIs for this
  return []
}

/**
 * Get overall analytics summary
 */
export async function getOverallAnalytics() {
  const posts = await getBlogAnalytics()

  return {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalOrganicTraffic: posts.reduce((sum, post) => sum + post.organicTraffic, 0),
    avgConversionRate: posts.length > 0
      ? posts.reduce((sum, post) => sum + post.conversionRate, 0) / posts.length
      : 0,
    totalBacklinks: posts.reduce((sum, post) => sum + post.backlinks, 0),
    totalSocialShares: posts.reduce((sum, post) => sum + post.socialShares, 0),
    topKeywords: getTopPerformingKeywords(posts),
    trafficTrend: await getTrafficTrend(),
    revenueGenerated: calculateRevenueFromBlog(posts),
  }
}

/**
 * Get top performing keywords across all posts
 */
function getTopPerformingKeywords(posts: BlogPostAnalytics[]): Array<{
  keyword: string
  avgPosition: number
  totalSearchVolume: number
  postsRanking: number
}> {
  const keywordMap = new Map<string, {
    positions: number[]
    searchVolumes: number[]
    postCount: number
  }>()

  posts.forEach(post => {
    post.keywordRankings.forEach(kw => {
      if (!keywordMap.has(kw.keyword)) {
        keywordMap.set(kw.keyword, { positions: [], searchVolumes: [], postCount: 0 })
      }
      const data = keywordMap.get(kw.keyword)!
      data.positions.push(kw.position)
      data.searchVolumes.push(kw.searchVolume)
      data.postCount++
    })
  })

  return Array.from(keywordMap.entries())
    .map(([keyword, data]) => ({
      keyword,
      avgPosition: data.positions.reduce((a, b) => a + b, 0) / data.positions.length,
      totalSearchVolume: data.searchVolumes.reduce((a, b) => a + b, 0),
      postsRanking: data.postCount,
    }))
    .sort((a, b) => a.avgPosition - b.avgPosition)
    .slice(0, 10)
}

/**
 * Get traffic trend from GA4 or database
 */
async function getTrafficTrend(): Promise<Array<{
  month: string
  organicTraffic: number
  totalViews: number
}>> {
  try {
    // In production, fetch actual monthly data from GA4
    // For now, calculate from database views
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: {
          not: null,
        },
      },
      select: {
        views: true,
        publishedAt: true,
      },
    })

    // Group by month
    const monthlyData = new Map<string, { views: number; organic: number }>()

    posts.forEach(post => {
      if (!post.publishedAt) return

      const monthKey = post.publishedAt.toISOString().substring(0, 7) // YYYY-MM
      const existing = monthlyData.get(monthKey) || { views: 0, organic: 0 }

      monthlyData.set(monthKey, {
        views: existing.views + post.views,
        organic: existing.organic + Math.floor(post.views * 0.6),
      })
    })

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        organicTraffic: data.organic,
        totalViews: data.views,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months
  } catch (error) {
    console.error('Error getting traffic trend:', error)
    return []
  }
}

/**
 * Calculate estimated revenue from blog traffic
 */
function calculateRevenueFromBlog(posts: BlogPostAnalytics[]): {
  affiliateRevenue: number
  adRevenue: number
  productRevenue: number
  total: number
} {
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const avgConversionRate = posts.length > 0
    ? posts.reduce((sum, post) => sum + post.conversionRate, 0) / posts.length
    : 0.02

  // Conservative revenue estimates
  const affiliateRevenue = totalViews * avgConversionRate * 0.3 * 45 // 30% commission on $45 avg
  const adRevenue = totalViews * 0.001 * 2 // $2 CPM
  const productRevenue = totalViews * avgConversionRate * 0.2 * 35 // 20% direct sales at $35

  return {
    affiliateRevenue: Math.round(affiliateRevenue),
    adRevenue: Math.round(adRevenue),
    productRevenue: Math.round(productRevenue),
    total: Math.round(affiliateRevenue + adRevenue + productRevenue),
  }
}

/**
 * Get competitor analysis
 * Note: Requires external SEO tools API integration (Ahrefs, SEMrush, etc.)
 */
export function getCompetitorAnalysis(): Array<{
  domain: string
  blogPosts: number
  monthlyTraffic: number
  topKeywords: string[]
  backlinks: number
  socialFollowing: number
}> {
  // This would integrate with SEO tools APIs in production
  // For now, return empty array
  return []
}

/**
 * Get keyword tracking data
 * Note: Requires external SEO tools API integration
 */
export function getKeywordTrackingData(): Array<{
  keyword: string
  currentPosition: number
  previousPosition: number
  searchVolume: number
  competition: string
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}> {
  // This would integrate with SEO tools APIs in production
  // For now, return empty array
  return []
}

/**
 * Track custom events
 */
export async function trackEvent(eventName: string, properties: Record<string, any>) {
  try {
    console.log(`Event tracked: ${eventName}`, properties)

    // You could store these in a database table for custom event tracking
    // await prisma.analyticsEvent.create({
    //   data: {
    //     eventName,
    //     properties: JSON.stringify(properties),
    //     timestamp: new Date(),
    //   },
    // })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}
