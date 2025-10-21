'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  createdAt: string
  publishedAt: string | null
  readTime: string | null
  coverImage: string | null
  _count: {
    comments: number
  }
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')

  const categories = ['All', 'Conservation', 'Product Care', 'Behind the Scenes', 'Marine Life', 'Gift Guide']

  useEffect(() => {
    fetchBlogPosts()
  }, [selectedCategory])

  const fetchBlogPosts = async () => {
    setLoading(true)
    try {
      const categoryParam = selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''
      const response = await fetch(`/api/blog?published=true${categoryParam}`)
      const data = await response.json()
      setBlogPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || subscribing) return
    
    setSubscribing(true)
    setSubscribeMessage('')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        setSubscribeMessage('Thanks for subscribing! Check your email for confirmation.')
        setEmail('')
      } else {
        const data = await response.json()
        setSubscribeMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setSubscribeMessage('Failed to subscribe. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Shenna\'s Studio Ocean Conservation Blog',
    description: 'Educational content about ocean conservation, marine life, and sustainable living',
    url: 'https://shennastudio.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Shenna\'s Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shennastudio.com/ShennasLogo.png'
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="min-h-screen bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ocean-900 mb-4">
              Ocean Conservation Blog
            </h1>
            <p className="text-xl text-ocean-600 max-w-3xl mx-auto">
              Explore stories about ocean conservation, marine life, product care tips, and behind-the-scenes looks at our mission to protect our oceans.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border transition-colors font-medium text-sm ${
                  selectedCategory === category
                    ? 'bg-ocean-600 text-white border-ocean-600'
                    : 'bg-white text-ocean-700 border-ocean-200 hover:bg-ocean-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-ocean-600 text-lg">Loading posts...</div>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-ocean-900 mb-2">No Posts Yet</h3>
              <p className="text-ocean-600">Check back soon for ocean conservation content!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-ocean-200 relative">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-ocean-400 text-6xl">
                        🌊
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-ocean-600 bg-ocean-100 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-ocean-500">{post.readTime || '5 min read'}</span>
                    </div>
                    <h2 className="text-xl font-bold text-ocean-900 mb-3 hover:text-ocean-700 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-ocean-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ocean-500">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-ocean-600 hover:text-ocean-800 font-semibold text-sm transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16 bg-gradient-to-br from-ocean-500 to-seafoam-400 rounded-3xl p-10 text-white text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Get the latest ocean conservation news, product updates, and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-ocean-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
                disabled={subscribing}
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-white text-ocean-600 rounded-lg font-semibold hover:bg-ocean-50 transition-colors disabled:opacity-50"
                disabled={subscribing}
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribeMessage && (
              <p className="mt-4 text-white/90">{subscribeMessage}</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
