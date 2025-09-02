"use client"

import { useState, useEffect, useCallback } from "react"
import ProductCard from "./ProductCard"
import { Product } from "@/src/lib/medusa"
import medusa from "@/src/lib/medusa"

interface ProductGridProps {
  products?: Product[]
  category?: string
  searchQuery?: string
  className?: string
}

export default function ProductGrid({ 
  products: initialProducts, 
  category, 
  searchQuery,
  className = "" 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [loading, setLoading] = useState(!initialProducts)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const queryParams: Record<string, unknown> = {
        limit: 20,
      }

      if (category) {
        queryParams.category_id = category
      }

      if (searchQuery) {
        queryParams.q = searchQuery
      }

      const response = await medusa.store.product.list(queryParams)
      
      if (response.products) {
        setProducts(response.products)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, searchQuery])

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts()
    }
  }, [initialProducts, fetchProducts])

  if (loading) {
    return (
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-ocean-100 rounded-2xl h-64 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-ocean-100 rounded w-3/4"></div>
              <div className="h-3 bg-ocean-100 rounded w-1/2"></div>
              <div className="h-6 bg-ocean-100 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-coral-600 text-lg font-medium mb-2">
          Oops! Something went wrong
        </div>
        <p className="text-ocean-600 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-ocean-500 text-white px-4 py-2 rounded-lg hover:bg-ocean-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🌊</div>
        <div className="text-ocean-600 text-lg font-medium mb-2">
          No products found
        </div>
        <p className="text-ocean-500">
          {searchQuery 
            ? `We couldn&apos;t find any products matching &quot;${searchQuery}&quot;`
            : "Check back soon for new arrivals!"
          }
        </p>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
