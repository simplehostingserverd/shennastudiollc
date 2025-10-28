'use client'

import { useState, useEffect } from 'react'
import { getBlogAnalytics, getOverallAnalytics, getCompetitorAnalysis, getKeywordTrackingData } from '@/lib/seo/analytics'

interface KeywordRanking {
  keyword: string
  position: number
  searchVolume: number
  change: number
}

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
  keywordRankings: KeywordRanking[]
  conversionRate: number
}

interface OverallAnalytics {
  totalPosts: number
  totalViews: number
  totalOrganicTraffic: number
  avgConversionRate: number
  totalBacklinks: number
  totalSocialShares: number
  topKeywords: Array<{
    keyword: string
    avgPosition: number
    totalSearchVolume: number
    postsRanking: number
  }>
  trafficTrend: Array<{
    month: string
    organicTraffic: number
    totalViews: number
  }>
  revenueGenerated: {
    affiliateRevenue: number
    adRevenue: number
    productRevenue: number
    total: number
  }
}

interface CompetitorData {
  domain: string
  blogPosts: number
  monthlyTraffic: number
  topKeywords: string[]
  backlinks: number
  socialFollowing: number
}

interface KeywordData {
  keyword: string
  currentPosition: number
  previousPosition: number
  searchVolume: number
  competition: 'Low' | 'Medium' | 'High'
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [overallAnalytics, setOverallAnalytics] = useState<OverallAnalytics | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPostAnalytics[]>([])
  const [competitors, setCompetitors] = useState<CompetitorData[]>([])
  const [keywords, setKeywords] = useState<KeywordData[]>([])

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const overall = getOverallAnalytics()
      const posts = getBlogAnalytics()
      const competitorData = getCompetitorAnalysis()
      const keywordData = getKeywordTrackingData()

      setOverallAnalytics(overall)
      setBlogPosts(posts)
      setCompetitors(competitorData)
      setKeywords(keywordData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Overall Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Posts</div>
            <div className="text-3xl font-bold text-blue-900 mt-1">{overallAnalytics?.totalPosts || 0}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Total Views</div>
            <div className="text-3xl font-bold text-green-900 mt-1">
              {(overallAnalytics?.totalViews || 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Organic Traffic</div>
            <div className="text-3xl font-bold text-purple-900 mt-1">
              {(overallAnalytics?.totalOrganicTraffic || 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">Est. Revenue</div>
            <div className="text-3xl font-bold text-orange-900 mt-1">
              ${(overallAnalytics?.revenueGenerated?.total || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Avg Conversion Rate</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {((overallAnalytics?.avgConversionRate || 0) * 100).toFixed(2)}%
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Total Backlinks</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {overallAnalytics?.totalBacklinks || 0}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Social Shares</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {overallAnalytics?.totalSocialShares || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Post Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Posts</h2>

        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-500">/{post.slug}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Views</div>
                  <div className="text-xl font-bold text-gray-900">{post.views.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div>
                  <div className="text-gray-600">Organic Traffic</div>
                  <div className="font-semibold text-gray-900">{post.organicTraffic.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Time</div>
                  <div className="font-semibold text-gray-900">{post.avgTimeOnPage.toFixed(1)}m</div>
                </div>
                <div>
                  <div className="text-gray-600">Bounce Rate</div>
                  <div className="font-semibold text-gray-900">{(post.bounceRate * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Backlinks</div>
                  <div className="font-semibold text-gray-900">{post.backlinks}</div>
                </div>
                <div>
                  <div className="text-gray-600">Conversion</div>
                  <div className="font-semibold text-gray-900">{(post.conversionRate * 100).toFixed(1)}%</div>
                </div>
              </div>

              {post.keywordRankings && post.keywordRankings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Top Keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {post.keywordRankings.slice(0, 3).map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {kw.keyword} (#{kw.position})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Tracking */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Keyword Rankings</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Search Volume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competition</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keywords.map((kw, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{kw.keyword}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">#{kw.currentPosition}</td>
                  <td className="px-4 py-3 text-sm">
                    {kw.trend === 'up' && (
                      <span className="text-green-600">↑ {kw.previousPosition - kw.currentPosition}</span>
                    )}
                    {kw.trend === 'down' && (
                      <span className="text-red-600">↓ {kw.currentPosition - kw.previousPosition}</span>
                    )}
                    {kw.trend === 'stable' && (
                      <span className="text-gray-500">−</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{kw.searchVolume.toLocaleString()}/mo</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      kw.competition === 'Low' ? 'bg-green-100 text-green-800' :
                      kw.competition === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {kw.competition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Competitor Analysis</h2>

        <div className="grid gap-4">
          {competitors.map((competitor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{competitor.domain}</h3>
                  <p className="text-sm text-gray-500">{competitor.blogPosts} blog posts</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Monthly Traffic</div>
                  <div className="text-lg font-bold text-gray-900">
                    {competitor.monthlyTraffic.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                <div>
                  <div className="text-gray-600">Backlinks</div>
                  <div className="font-semibold text-gray-900">{competitor.backlinks.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Social Following</div>
                  <div className="font-semibold text-gray-900">{competitor.socialFollowing.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Top Keywords</div>
                  <div className="font-semibold text-gray-900">{competitor.topKeywords.length}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {competitor.topKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
