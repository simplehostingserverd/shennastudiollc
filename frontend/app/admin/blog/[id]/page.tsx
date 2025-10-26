'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/app/components/ImageUpload'

interface BlogEditPageProps {
  params: {
    id: string
  }
}

export default function EditBlogPostPage({ params }: BlogEditPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Conservation',
    tags: '',
    keywords: '',
    metaDescription: '',
    published: false,
    readTime: '',
  })

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`)
      if (response.ok) {
        const post = await response.json()
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          coverImage: post.coverImage || '',
          category: post.category || 'Conservation',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          keywords: post.keywords || '',
          metaDescription: post.metaDescription || '',
          published: post.published,
          readTime: post.readTime || '',
        })
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          published: publish !== undefined ? publish : formData.published,
        }),
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-gray-600">Loading post...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="text-ocean-600 hover:text-ocean-800 inline-flex items-center mb-4"
          >
            ← Back to Posts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        </div>

        <form className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                placeholder="post-url-slug"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /blog/{formData.slug || 'post-url-slug'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                placeholder="Brief description for preview cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent font-mono text-sm"
                placeholder="Write your blog post content (HTML supported)"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                >
                  <option value="Conservation">Conservation</option>
                  <option value="Marine Life">Marine Life</option>
                  <option value="Product Care">Product Care</option>
                  <option value="Behind the Scenes">Behind the Scenes</option>
                  <option value="Gift Guide">Gift Guide</option>
                  <option value="News">News</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  placeholder="5 min read"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                placeholder="ocean, conservation, marine life (comma-separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                placeholder="Keywords for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={2}
                maxLength={160}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                placeholder="SEO description (max 160 characters)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>

            <div>
              <ImageUpload
                label="Cover Image"
                currentImage={formData.coverImage}
                onUploadComplete={(url) => setFormData({ ...formData, coverImage: url })}
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={saving}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={saving}
                className="px-6 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
            <Link
              href="/admin/blog"
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
