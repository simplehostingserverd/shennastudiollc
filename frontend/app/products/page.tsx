'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductGrid from '@/app/components/ProductGrid'
import { Product, MedusaClient } from '@/src/lib/medusa'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ocean-Themed Products | Sea Turtle Jewelry, Nautical Decor & Marine Gifts | Shenna\'s Studio',
  description: 'Shop premium ocean-inspired products including sea turtle jewelry, coral accessories, nautical home decor, marine life gifts, and eco-friendly treasures. 10% of proceeds support ocean conservation.',
  keywords: 'ocean products, sea turtle jewelry, coral jewelry, nautical decor, marine life gifts, ocean conservation gifts, beach lifestyle products, ocean themed home decor, eco-friendly ocean gifts, sustainable marine products',
  openGraph: {
    title: 'Ocean-Themed Products & Marine Conservation Gifts',
    description: 'Discover beautiful ocean-inspired products that support marine conservation. Shop sea turtle jewelry, nautical decor, and more.',
    url: 'https://shennastudio.com/products',
    type: 'website',
    images: [
      {
        url: '/ShennasLogo.png',
        width: 1200,
        height: 630,
        alt: 'Shenna\'s Studio Ocean Products Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ocean-Themed Products | Shenna\'s Studio',
    description: 'Beautiful ocean treasures supporting marine conservation.',
    images: ['/ShennasLogo.png']
  },
  alternates: {
    canonical: '/products'
  }
}

const collections = [
  {
    id: 'all',
    name: 'All Products',
    description: 'Browse our complete collection',
    handle: null,
  },
  {
    id: 'salesandclearance',
    name: 'Sales and Clearance',
    description: 'Amazing deals on ocean treasures',
    handle: '/salesandclearance',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Comfortable ocean-themed apparel',
    handle: '/clothing',
  },
  {
    id: 'specialoccasions',
    name: 'Special Occasions',
    description: 'Perfect gifts for memorable moments',
    handle: '/specialoccasions',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Ocean-inspired jewelry and accessories',
    handle: '/jewelry',
  },
  {
    id: 'homedecor',
    name: 'Home Decor',
    description: 'Beautiful ocean-themed home accessories',
    handle: '/homedecor',
  },
  {
    id: 'pets',
    name: 'Pets',
    description: 'Ocean-themed items for your furry friends',
    handle: '/pets',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Ocean-inspired furniture pieces',
    handle: '/furniture',
  },
  {
    id: 'booksandgifts',
    name: 'Books and Gifts',
    description: 'Educational books and special gifts',
    handle: '/booksandgifts',
  },
  {
    id: 'holidayideas',
    name: 'Holiday Ideas',
    description: 'Seasonal and holiday-themed treasures',
    handle: '/holidayideas',
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [medusa, setMedusa] = useState<MedusaClient | null>(null)
  const [selectedCollection, setSelectedCollection] = useState('all')

  const fetchProducts = useCallback(
    async (collectionHandle?: string) => {
      if (!medusa) return

      try {
        setLoading(true)
        setError(null)

        // Check if medusa client is properly initialized
        if (!medusa.store?.product?.list) {
          setError(
            'Product service not available. Please check if the backend is running.'
          )
          return
        }

        // Build query parameters
        const queryParams: Record<string, unknown> = {
          limit: 50,
          fields: '+variants,+variants.calculated_price'
        }

        // If a specific collection is selected, add collection filter
        if (collectionHandle && collectionHandle !== 'all') {
          // Try to fetch products by collection handle
          try {
            const collectionResponse = await medusa.store.collection.list({
              handle: collectionHandle.replace('/', ''),
            })
            if (collectionResponse?.collections?.length > 0) {
              queryParams.collection_id = (
                collectionResponse.collections[0] as unknown as { id: string }
              ).id
            }
          } catch (collectionError) {
            console.warn(
              'Collection not found, showing all products:',
              collectionError
            )
          }
        }

        const response = await medusa.store.product.list(queryParams)
        if (response?.products) {
          const productList = response.products as unknown as Product[]
          if (!collectionHandle || collectionHandle === 'all') {
            setProducts(productList)
            setFilteredProducts(productList)
          } else {
            setFilteredProducts(productList)
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(
          'Failed to load products. Please check if the backend is running and try again.'
        )
      } finally {
        setLoading(false)
      }
    },
    [medusa]
  )

  // Updated to handle collection filtering via API calls
  const handleCollectionFilter = useCallback(
    async (collectionId: string) => {
      setSelectedCollection(collectionId)

      if (collectionId === 'all') {
        // Show all products
        await fetchProducts()
      } else {
        // Find the collection handle
        const collection = collections.find((c) => c.id === collectionId)
        if (collection?.handle) {
          await fetchProducts(collection.handle)
        } else {
          // Fallback to keyword-based filtering for compatibility
          setFilteredProducts(
            products.filter((product) => {
              const searchText = (
                product.title +
                ' ' +
                (product.description || '')
              ).toLowerCase()

              switch (collectionId) {
                case 'salesandclearance':
                  return (
                    searchText.includes('sale') ||
                    searchText.includes('clearance') ||
                    searchText.includes('discount')
                  )
                case 'jewelry':
                  return (
                    searchText.includes('jewelry') ||
                    searchText.includes('necklace') ||
                    searchText.includes('bracelet') ||
                    searchText.includes('earring')
                  )
                case 'clothing':
                  return (
                    searchText.includes('shirt') ||
                    searchText.includes('clothing') ||
                    searchText.includes('apparel')
                  )
                case 'homedecor':
                  return (
                    searchText.includes('home') ||
                    searchText.includes('decor') ||
                    searchText.includes('decoration')
                  )
                case 'pets':
                  return (
                    searchText.includes('pet') ||
                    searchText.includes('dog') ||
                    searchText.includes('cat')
                  )
                case 'furniture':
                  return (
                    searchText.includes('furniture') ||
                    searchText.includes('chair') ||
                    searchText.includes('table')
                  )
                case 'booksandgifts':
                  return (
                    searchText.includes('book') ||
                    searchText.includes('gift') ||
                    searchText.includes('educational')
                  )
                case 'specialoccasions':
                  return (
                    searchText.includes('occasion') ||
                    searchText.includes('special') ||
                    searchText.includes('celebration')
                  )
                case 'holidayideas':
                  return (
                    searchText.includes('holiday') ||
                    searchText.includes('christmas') ||
                    searchText.includes('seasonal')
                  )
                default:
                  return true
              }
            })
          )
        }
      }
    },
    [fetchProducts, products]
  )

  const handleCollectionChange = useCallback(
    (collectionId: string) => {
      handleCollectionFilter(collectionId)
    },
    [handleCollectionFilter]
  )

  useEffect(() => {
    const initMedusa = async () => {
      try {
        const createMedusaClient = await import('@/src/lib/medusa')
        const client = await createMedusaClient.default()
        setMedusa(client)
      } catch (error) {
        console.error('Failed to initialize Medusa client:', error)
        setError('Failed to initialize. Please refresh the page.')
      }
    }
    initMedusa()
  }, [])

  // Initial load of all products
  useEffect(() => {
    if (medusa && selectedCollection === 'all') {
      fetchProducts()
    }
  }, [medusa, fetchProducts, selectedCollection])

  if (loading) {
    return (
      <div className="min-h-screen products-page-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-blue-900 mb-4">
              Our Products
            </h1>
            <p className="text-lg text-blue-700">
              Loading our beautiful ocean-themed collection...
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-blue-100 rounded-2xl h-64 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                  <div className="h-3 bg-blue-100 rounded w-1/2"></div>
                  <div className="h-6 bg-blue-100 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen products-page-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="text-6xl mb-8">🌊</div>
          <h1 className="text-4xl font-display font-bold text-blue-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-blue-700 mb-8">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen products-page-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-blue-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto mb-8">
            Discover our complete collection of ocean-themed treasures, each one
            carefully crafted to celebrate the beauty of marine life.
          </p>

          {/* Collections Sub-Menu */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">
              Collections
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleCollectionChange(collection.id)}
                  className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    selectedCollection === collection.id
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'bg-white/80 text-blue-700 border border-blue-200 hover:bg-white/90'
                  }`}
                >
                  {collection.name}
                </button>
              ))}
            </div>

            {/* Collection Description */}
            <div className="mt-6">
              <p className="text-blue-600 italic text-center">
                {
                  collections.find((c) => c.id === selectedCollection)
                    ?.description
                }
              </p>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          filteredProducts.length > 0 ? (
            <>
              <ProductGrid products={filteredProducts} />
              <div className="text-center mt-12">
                <p className="text-blue-700">
                  Showing {filteredProducts.length} of {products.length}{' '}
                  products
                  {selectedCollection !== 'all' && (
                    <span className="ml-2 text-blue-900 font-medium">
                      in{' '}
                      {
                        collections.find((c) => c.id === selectedCollection)
                          ?.name
                      }
                    </span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-display font-bold text-blue-900 mb-4">
                No products found in this collection
              </h2>
              <p className="text-blue-700 mb-6">
                Try browsing a different collection or check back soon for new
                arrivals!
              </p>
              <button
                onClick={() => handleCollectionChange('all')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                View All Products
              </button>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐠</div>
            <h2 className="text-2xl font-display font-bold text-blue-900 mb-4">
              No products found
            </h2>
            <p className="text-blue-700">
              Check back soon for new arrivals from the deep blue sea!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
