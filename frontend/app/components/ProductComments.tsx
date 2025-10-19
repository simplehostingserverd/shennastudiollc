'use client'

import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Button from '@/app/components/ui/Button'

interface Comment {
  id: string
  productId: string
  customerName: string
  email: string
  comment: string
  rating: number
  createdAt: string
}

interface ProductCommentsProps {
  productId: string
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    comment: '',
    rating: 5,
  })

  useEffect(() => {
    fetchComments()
  }, [productId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?productId=${productId}`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Thank you for your comment! We appreciate your feedback.')
        setFormData({ customerName: '', email: '', comment: '', rating: 5 })
        setShowForm(false)
        fetchComments()
      } else {
        alert(data.error || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-blue-900">
          Customer Comments & Feedback
        </h2>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Leave a Comment'}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-blue-50 rounded-xl space-y-4"
        >
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-blue-900 mb-1"
            >
              Your Name *
            </label>
            <input
              type="text"
              id="customerName"
              required
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-900 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-blue-900 mb-2"
            >
              Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  {star <= formData.rating ? (
                    <StarIcon className="h-8 w-8 text-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
                  ) : (
                    <StarOutlineIcon className="h-8 w-8 text-blue-300 cursor-pointer hover:scale-110 transition-transform" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-blue-900 mb-1"
            >
              Your Comment *
            </label>
            <textarea
              id="comment"
              required
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us what you think about this bracelet! Which ones do you like? What would you like us to make?"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={submitting}
          >
            Submit Comment
          </Button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-blue-50 rounded-xl p-6 space-y-3"
            >
              <div className="h-4 bg-blue-200 rounded w-1/4"></div>
              <div className="h-3 bg-blue-200 rounded w-1/2"></div>
              <div className="h-3 bg-blue-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-blue-600 text-lg mb-2">
            No comments yet. Be the first!
          </p>
          <p className="text-blue-500 text-sm">
            Share your thoughts about this bracelet or tell us what you&apos;d
            like to see next.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-blue-100 pb-6 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {comment.customerName}
                  </h3>
                  <p className="text-sm text-blue-500">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < comment.rating
                          ? 'text-yellow-400'
                          : 'text-blue-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-blue-700 leading-relaxed">{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
