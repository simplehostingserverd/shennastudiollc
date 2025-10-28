'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import posthog from 'posthog-js'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  keywords: string
  metaDescription: string | null
  readTime: string | null
  coverImage: string | null
  createdAt: string
  publishedAt: string | null
  views: number
  author: {
    name: string
  } | null
  comments: Array<{
    id: string
    userName: string
    content: string
    createdAt: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (slug) {
      fetchBlogPost()
    }
  }, [slug])

  const fetchBlogPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blog/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)

        if (data.category) {
          const relatedResponse = await fetch(`/api/blog?category=${data.category}&published=true&limit=3`)
          const relatedData = await relatedResponse.json()
          setRelatedPosts(relatedData.posts.filter((p: BlogPost) => p.slug !== slug).slice(0, 2))
        }
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-50 py-20 flex items-center justify-center">
        <div className="text-ocean-600 text-lg">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-ocean-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-ocean-600 mb-8">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.createdAt,
    author: {
      '@type': 'Organization',
      name: post.author?.name || 'Shenna\'s Studio',
      url: 'https://shennastudio.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shenna\'s Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shennastudio.com/ShennasLogo.png'
      }
    },
    image: post.coverImage || 'https://shennastudio.com/ShennasLogo.png',
    articleSection: post.category,
    keywords: post.keywords,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://shennastudio.com/blog/${params.slug}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="min-h-screen bg-ocean-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-ocean-600 hover:text-ocean-800 mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-semibold text-ocean-600 bg-ocean-100 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-ocean-500">{post.readTime || '5 min read'}</span>
              <span className="text-sm text-ocean-500">{post.views} views</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ocean-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-ocean-600 text-sm">
              <time dateTime={post.publishedAt || post.createdAt}>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2">•</span>
              <span>By {post.author?.name || 'Shenna\'s Studio'}</span>
            </div>
          </header>

          {post.coverImage ? (
            <div className="h-64 md:h-96 bg-ocean-200 rounded-2xl mb-10 overflow-hidden">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-64 bg-ocean-200 rounded-2xl mb-10 flex items-center justify-center text-ocean-400 text-8xl">
              🌊
            </div>
          )}

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="prose prose-lg prose-ocean max-w-none">
              <div 
                className="text-ocean-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            <div className="mt-12 pt-8 border-t border-ocean-200">
              <div className="bg-gradient-to-br from-ocean-50 to-seafoam-50 rounded-2xl p-8">
                <h3 className="text-2xl font-display font-bold text-ocean-900 mb-4">
                  Support Ocean Conservation
                </h3>
                <p className="text-ocean-700 mb-6">
                  Every purchase at Shenna's Studio contributes 10% to marine conservation efforts. Browse our collection of ocean-themed products and make a difference today.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors font-semibold"
                  onClick={() => {
                    posthog.capture('blog_cta_clicked', {
                      cta_text: 'Shop Ocean Products',
                      cta_destination: '/products',
                      post_slug: post.slug,
                      post_title: post.title,
                      post_category: post.category
                    })
                  }}
                >
                  Shop Ocean Products
                </Link>
              </div>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-6">
                Related Articles
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => {
                      posthog.capture('related_article_clicked', {
                        current_post_slug: post.slug,
                        clicked_post_slug: relatedPost.slug,
                        clicked_post_title: relatedPost.title
                      })
                    }}
                  >
                    <h4 className="text-lg font-bold text-ocean-900 mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-ocean-600 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  )
}
