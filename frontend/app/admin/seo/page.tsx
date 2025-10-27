'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBlogAnalytics, getOverallAnalytics, getCompetitorAnalysis, getKeywordTrackingData } from '@/lib/seo/analytics'
import AnalyticsDashboard from './components/AnalyticsDashboard'

interface TopicIdea {
  title: string
  description: string
  keywords: string[]
  estimatedTraffic: string
  competition?: {
    competitionLevel: string
    topDomains: string[]
    averageDomainAuthority: number
  }
}

interface KeywordAnalysis {
  keyword: string
  searchVolume: number
  competition: number
  difficulty: string
  relatedKeywords: string[]
  trends: Array<{ date: string; value: number }>
  topResults: Array<{ title: string; link: string; snippet: string }>
}

export default function SEODashboardPage() {
  const [activeTab, setActiveTab] = useState('topics')
  const [topicIdeas, setTopicIdeas] = useState<TopicIdea[]>([])
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')

  const tabs = [
    { id: 'topics', label: 'Topic Discovery', icon: '🎯' },
    { id: 'keywords', label: 'Keyword Research', icon: '🔍' },
    { id: 'generate', label: 'Content Generation', icon: '✍️' },
    { id: 'analytics', label: 'Performance Analytics', icon: '📊' }
  ]

  useEffect(() => {
    if (activeTab === 'topics') {
      loadTopicIdeas()
    }
  }, [activeTab])

  const loadTopicIdeas = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seo/topics?category=ocean%20conservation&limit=10')
      const data = await response.json()
      setTopicIdeas(data.topicIdeas || [])
    } catch (error) {
      console.error('Failed to load topic ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeKeyword = async () => {
    if (!keyword.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/seo/keywords?keyword=${encodeURIComponent(keyword)}`)
      const data = await response.json()
      setKeywordAnalysis(data)
    } catch (error) {
      console.error('Failed to analyze keyword:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="text-ocean-600 hover:text-ocean-800 inline-flex items-center mb-4"
          >
            ← Back to Blog Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">SEO Automation Dashboard</h1>
          <p className="text-gray-600 mt-2">Discover topics, research keywords, and generate high-converting content</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-ocean-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Topic Discovery Tab */}
        {activeTab === 'topics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Topic Discovery</h2>
                <button
                  onClick={loadTopicIdeas}
                  disabled={loading}
                  className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh Ideas'}
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Discovering high-converting topics...</div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {topicIdeas.map((topic, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-ocean-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                          <p className="text-gray-600 mb-3">{topic.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {topic.keywords.map((kw, i) => (
                              <span key={i} className="px-2 py-1 bg-ocean-100 text-ocean-800 text-xs rounded">
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📈 {topic.estimatedTraffic} traffic</span>
                            {topic.competition && (
                              <span className={`px-2 py-1 rounded text-xs ${
                                topic.competition.competitionLevel === 'Low' ? 'bg-green-100 text-green-800' :
                                topic.competition.competitionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {topic.competition.competitionLevel} competition
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {/* Generate content for this topic */}}
                          className="ml-4 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 text-sm"
                        >
                          Generate Content
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Keyword Research Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Keyword Research</h2>

              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter keyword to analyze..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && analyzeKeyword()}
                />
                <button
                  onClick={analyzeKeyword}
                  disabled={loading || !keyword.trim()}
                  className="px-6 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>

              {keywordAnalysis && (
                <div className="space-y-6">
                  {/* Keyword Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{keywordAnalysis.searchVolume}</div>
                      <div className="text-sm text-gray-600">Est. Monthly Searches</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{keywordAnalysis.competition}</div>
                      <div className="text-sm text-gray-600">Competition Level</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className={`text-2xl font-bold ${
                        keywordAnalysis.difficulty === 'Easy' ? 'text-green-600' :
                        keywordAnalysis.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {keywordAnalysis.difficulty}
                      </div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{keywordAnalysis.relatedKeywords.length}</div>
                      <div className="text-sm text-gray-600">Related Keywords</div>
                    </div>
                  </div>

                  {/* Related Keywords */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Related Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {keywordAnalysis.relatedKeywords.slice(0, 10).map((kw, index) => (
                        <button
                          key={index}
                          onClick={() => setKeyword(kw)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Top Results */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Top 10 Search Results</h3>
                    <div className="space-y-3">
                      {keywordAnalysis.topResults.map((result, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <span className="text-gray-400 font-mono text-sm">{index + 1}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-600 hover:underline cursor-pointer">
                                {result.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.snippet}</p>
                              <p className="text-xs text-gray-500 mt-1">{result.link}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Generation Tab */}
        {activeTab === 'generate' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Generation</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Content Creation</h3>
              <p className="text-gray-600 mb-6">Generate high-converting blog posts with SEO optimization</p>
              <button className="px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700">
                Start Creating Content
              </button>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </div>
    </div>
  )
}