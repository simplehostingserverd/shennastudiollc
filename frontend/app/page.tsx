'use client'

import { useState, useEffect, useCallback } from 'react'
import SearchBar from '@/app/components/SearchBar'
import Button from '@/app/components/ui/Button'
import { Product } from '@/src/lib/medusa'
import Link from 'next/link'
import Image from 'next/image'

interface MedusaClient {
  store?: {
    product?: {
      list?: (params?: { limit?: number }) => Promise<{ products?: Product[] }>
    }
  }
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [medusa, setMedusa] = useState<MedusaClient | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)

  useEffect(() => {
    const initMedusa = async () => {
      try {
        const createMedusaClient = await import('@/src/lib/medusa')
        const client = await createMedusaClient.default()
        setMedusa(client as unknown as MedusaClient)
      } catch (error) {
        console.error('Failed to initialize Medusa client:', error)
      }
    }
    initMedusa()
  }, [])

  const fetchProducts = useCallback(async () => {
    if (!medusa) return

    try {
      setLoading(true)
      // Check if medusa client is properly initialized
      if (!medusa?.store?.product?.list) {
        console.warn('Medusa product API not available')
        return
      }

      const response = await medusa.store.product.list({
        limit: 50,
      })

      if (response?.products) {
        setProducts(response.products as Product[])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Set empty array on error to prevent UI issues
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [medusa])

  useEffect(() => {
    if (medusa) {
      fetchProducts()
    }
  }, [medusa, fetchProducts])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingNewsletter(true)
    setNewsletterStatus({ type: null, message: '' })

    // Temporarily disabled - show message
    setTimeout(() => {
      setNewsletterStatus({
        type: 'success',
        message: 'Newsletter signup is temporarily unavailable. Please email us at shenna@shennastudio.com to be added to our mailing list!',
      })
      setIsSubmittingNewsletter(false)
    }, 500)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-900 via-ocean-700 to-teal-600 text-white overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="metadata"
          poster="/ShennasLogo.png"
        >
          <source src="/IFEO3426.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Elegant overlay with subtle animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/30 to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <div className="mb-6">
              <Image
                src="/ShennasLogo.png"
                alt="Shenna's Studio - Ocean Conservation & Marine Life Products"
                width={200}
                height={200}
                className="mb-8 opacity-90 hover:opacity-100 transition-opacity duration-300"
                priority
              />
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              Shenna&apos;s Studio
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl font-light">
              Discover exquisite ocean-inspired treasures that celebrate marine
              life while supporting ocean conservation.
              <span className="block mt-2 text-lg text-teal-200">
                Every purchase helps protect our precious oceans 🌊
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Link href="#products">
              <Button
                variant="primary"
                size="lg"
                className="text-lg px-10 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Explore Our Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-4 border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Our Ocean Mission
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-gradient-to-b from-white to-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-900 mb-6">
              Find Your Perfect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                Ocean Treasure
              </span>
            </h2>
            <p className="text-xl text-ocean-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Search through our carefully curated collection of ocean-inspired
              products, each piece thoughtfully designed to bring the beauty of
              marine life into your world.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-900 mb-6">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                Ocean Collection
              </span>
            </h2>
            <p className="text-xl text-ocean-600 max-w-3xl mx-auto leading-relaxed">
              Each piece in our collection is carefully crafted to celebrate the
              beauty of marine life while supporting ocean conservation efforts.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
              <p className="mt-4 text-ocean-600 text-lg">
                Loading our beautiful collection...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(0, 12).map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-ocean-200"
                >
                  <div className="relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.title}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-ocean-100 to-ocean-200 flex items-center justify-center">
                        <div className="text-ocean-400 text-4xl">🌊</div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-ocean-800">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-ocean-900 mb-2 group-hover:text-ocean-700 transition-colors">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-ocean-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    {product.variants &&
                      product.variants.length > 0 &&
                      product.variants[0].prices && (
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-ocean-900">
                            $
                            {(
                              product.variants[0].prices[0]?.amount / 100 || 0
                            ).toFixed(2)}
                          </span>
                          <Link href={`/products/${product.handle}`}>
                            <Button
                              variant="primary"
                              size="sm"
                              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🌊</div>
              <h3 className="text-2xl font-bold text-ocean-900 mb-4">
                Coming Soon
              </h3>
              <p className="text-ocean-600 text-lg">
                Our beautiful ocean collection is being prepared. Check back
                soon!
              </p>
            </div>
          )}

          {products.length > 12 && (
            <div className="text-center mt-16">
              <Link href="/products">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-lg px-12 py-4 transform hover:scale-105 transition-all duration-300"
                >
                  View All {products.length} Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-gradient-to-b from-ocean-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-ocean-900 mb-6">
              Ocean{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                Conservation Blog
              </span>
            </h2>
            <p className="text-xl text-ocean-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover ocean conservation stories, marine life insights, and product care tips
              from our team dedicated to protecting our precious oceans.
            </p>
            <Link href="/blog">
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-lg px-12 py-4 transform hover:scale-105 transition-all duration-300"
              >
                Explore Our Blog
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-ocean-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🌊</div>
                <h3 className="text-xl font-bold text-ocean-900 mb-3">Conservation Stories</h3>
                <p className="text-ocean-600">
                  Learn about ocean conservation efforts and how your purchases make a difference
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🐠</div>
                <h3 className="text-xl font-bold text-ocean-900 mb-3">Marine Life Education</h3>
                <p className="text-ocean-600">
                  Discover fascinating facts about ocean creatures and ecosystems
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-xl font-bold text-ocean-900 mb-3">Product Care Tips</h3>
                <p className="text-ocean-600">
                  Expert advice on caring for your ocean-inspired jewelry and accessories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Message */}
      <section className="py-24 bg-gradient-to-br from-ocean-900 via-ocean-800 to-teal-800 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-20 w-32 h-32 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 border border-white/15 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-12">
            <div className="text-8xl mb-8 animate-pulse">🌊</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Supporting{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
                Ocean Conservation
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">💙</div>
              <h3 className="text-xl font-bold mb-3">10% Donated</h3>
              <p className="text-blue-100">
                Every purchase directly funds marine conservation efforts
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🐢</div>
              <h3 className="text-xl font-bold mb-3">Wildlife Protection</h3>
              <p className="text-blue-100">
                Supporting sea turtle sanctuaries and marine life rescue
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3">Global Impact</h3>
              <p className="text-blue-100">
                Partnering with worldwide ocean preservation organizations
              </p>
            </div>
          </div>

          <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-4xl mx-auto">
            Every purchase helps protect our oceans. We donate 10% of all
            proceeds to marine conservation organizations working tirelessly to
            preserve ocean ecosystems for future generations.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/conservation">
              <Button
                variant="maroon"
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
              >
                Learn About Our Impact
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white/10 text-lg px-8 py-4 transition-all duration-300"
              >
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-b from-ocean-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-ocean-100">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-ocean-900 mb-6">
                Stay Connected with the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                  Ocean
                </span>
              </h2>
              <p className="text-xl text-ocean-600 leading-relaxed max-w-3xl mx-auto">
                Join our community and get updates on new arrivals, conservation
                efforts, and exclusive offers. Be the first to know about our
                ocean-saving initiatives.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto mb-12"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-4 border-2 border-ocean-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-lg transition-all duration-300"
                  disabled={isSubmittingNewsletter}
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmittingNewsletter}
                >
                  {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {newsletterStatus.type && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center ${
                    newsletterStatus.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {newsletterStatus.message}
                </div>
              )}
              <p className="text-sm text-ocean-500 mt-3 text-center">
                🔒 We respect your privacy and never share your email
              </p>
            </form>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-bold text-ocean-900 mb-2">New Arrivals</h3>
                <p className="text-ocean-600 text-sm">
                  Be first to see our latest ocean treasures
                </p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-3">🌊</div>
                <h3 className="font-bold text-ocean-900 mb-2">
                  Conservation Updates
                </h3>
                <p className="text-ocean-600 text-sm">
                  Learn about our impact on ocean preservation
                </p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="font-bold text-ocean-900 mb-2">
                  Exclusive Offers
                </h3>
                <p className="text-ocean-600 text-sm">
                  Special discounts for our community members
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
