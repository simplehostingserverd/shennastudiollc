"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/app/components/ProductGrid"
import { Product } from "@/src/lib/medusa"
import medusa from "@/src/lib/medusa"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await medusa.store.products.list({ limit: 50 })
      if (response.products) {
        setProducts(response.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
              Our Products
            </h1>
            <p className="text-lg text-ocean-600">
              Loading our beautiful ocean-themed collection...
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl h-64 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-white rounded w-3/4"></div>
                  <div className="h-3 bg-white rounded w-1/2"></div>
                  <div className="h-6 bg-white rounded w-1/4"></div>
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
      <div className="min-h-screen bg-ocean-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-8">🌊</div>
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-ocean-600 mb-8">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-ocean-500 text-white px-8 py-3 rounded-lg hover:bg-ocean-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ocean-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-ocean-600 max-w-2xl mx-auto">
            Discover our complete collection of ocean-themed treasures, 
            each one carefully crafted to celebrate the beauty of marine life.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <ProductGrid products={products} />
            <div className="text-center mt-12">
              <p className="text-ocean-600">
                Showing {products.length} products
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐠</div>
            <h2 className="text-2xl font-display font-bold text-ocean-900 mb-4">
              No products found
            </h2>
            <p className="text-ocean-600">
              Check back soon for new arrivals from the deep blue sea!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}