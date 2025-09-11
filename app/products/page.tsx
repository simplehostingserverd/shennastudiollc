"use client"

import { useState, useEffect, useCallback } from "react"
import ProductGrid from "@/app/components/ProductGrid"
import { Product } from "@/src/lib/medusa"
import Medusa from "@medusajs/js-sdk"

const collections = [
  { id: 'all', name: 'All Products', description: 'Browse our complete collection' },
  { id: 'sale-clearance', name: 'Sale & Clearance', description: 'Amazing deals on ocean treasures' },
  { id: 'occasions', name: 'Special Occasions', description: 'Perfect gifts for memorable moments' },
  { id: 'jewelry', name: 'Jewelry', description: 'Ocean-inspired accessories' },
  { id: 'clothing', name: 'Clothing', description: 'Comfortable ocean-themed apparel' },
  { id: 'home-decor', name: 'Home Decor', description: 'Beautiful ocean-themed home accessories' },
  { id: 'pet', name: 'Pet', description: 'Ocean-themed items for your furry friends' },
  { id: 'furniture', name: 'Furniture', description: 'Ocean-inspired furniture pieces' },
  { id: 'books-gifts', name: 'Books & Gifts', description: 'Educational and gift items' },
  { id: 'holiday-ideas', name: 'Holiday Ideas', description: 'Seasonal and holiday-themed treasures' }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [medusa, setMedusa] = useState<Medusa | null>(null)
  const [selectedCollection, setSelectedCollection] = useState('all')

  const fetchProducts = useCallback(async () => {
    if (!medusa) return

    try {
      setLoading(true)
      setError(null)
      
      // Check if medusa client is properly initialized
      if (!medusa.store?.product?.list) {
        setError("Product service not available. Please check if the backend is running.")
        return
      }
      
      const response = await medusa.store.product.list({ limit: 50 })
      if (response?.products) {
        const productList = response.products as Product[]
        setProducts(productList)
        setFilteredProducts(productList)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please check if the backend is running and try again.")
    } finally {
      setLoading(false)
    }
  }, [medusa])

  const filterProducts = useCallback((collectionId: string) => {
    if (collectionId === 'all') {
      setFilteredProducts(products)
      return
    }

    // Filter based on product title and description keywords
    const filtered = products.filter(product => {
      const searchText = (product.title + ' ' + (product.description || '')).toLowerCase()
      
      switch (collectionId) {
        case 'sale-clearance':
          return searchText.includes('sale') ||
                 searchText.includes('clearance') ||
                 searchText.includes('discount') ||
                 searchText.includes('deal') ||
                 searchText.includes('special price') ||
                 searchText.includes('reduced')
        case 'jewelry':
          return searchText.includes('jewelry') ||
                 searchText.includes('necklace') ||
                 searchText.includes('bracelet') ||
                 searchText.includes('earring') ||
                 searchText.includes('ring') ||
                 searchText.includes('accessory') ||
                 searchText.includes('pendant')
        case 'clothing':
          return searchText.includes('shirt') ||
                 searchText.includes('tee') ||
                 searchText.includes('clothing') ||
                 searchText.includes('apparel') ||
                 searchText.includes('wear') ||
                 searchText.includes('hoodie') ||
                 searchText.includes('jacket')
        case 'home-decor':
          return searchText.includes('home') ||
                 searchText.includes('decor') ||
                 searchText.includes('decoration') ||
                 searchText.includes('wall') ||
                 searchText.includes('art') ||
                 searchText.includes('poster') ||
                 searchText.includes('frame') ||
                 searchText.includes('candle')
        case 'pet':
          return searchText.includes('pet') ||
                 searchText.includes('dog') ||
                 searchText.includes('cat') ||
                 searchText.includes('animal') ||
                 searchText.includes('collar') ||
                 searchText.includes('leash') ||
                 searchText.includes('toy')
        case 'furniture':
          return searchText.includes('furniture') ||
                 searchText.includes('chair') ||
                 searchText.includes('table') ||
                 searchText.includes('shelf') ||
                 searchText.includes('cabinet') ||
                 searchText.includes('desk') ||
                 searchText.includes('stool')
        case 'books-gifts':
          return searchText.includes('book') ||
                 searchText.includes('gift') ||
                 searchText.includes('educational') ||
                 searchText.includes('learn') ||
                 searchText.includes('guide') ||
                 searchText.includes('manual') ||
                 searchText.includes('present')
        case 'occasions':
          return searchText.includes('occasion') ||
                 searchText.includes('special') ||
                 searchText.includes('celebration') ||
                 searchText.includes('wedding') ||
                 searchText.includes('birthday') ||
                 searchText.includes('anniversary') ||
                 searchText.includes('graduation')
        case 'holiday-ideas':
          return searchText.includes('holiday') ||
                 searchText.includes('christmas') ||
                 searchText.includes('halloween') ||
                 searchText.includes('valentine') ||
                 searchText.includes('easter') ||
                 searchText.includes('thanksgiving') ||
                 searchText.includes('seasonal') ||
                 searchText.includes('winter') ||
                 searchText.includes('summer')
        default:
          return true
      }
    })
    
    setFilteredProducts(filtered)
  }, [products])

  const handleCollectionChange = useCallback((collectionId: string) => {
    setSelectedCollection(collectionId)
  }, [])

  useEffect(() => {
    const initMedusa = async () => {
      try {
        const { default: medusaClient } = await import("@/src/lib/medusa")
        setMedusa(medusaClient)
      } catch (error) {
        console.error("Failed to initialize Medusa client:", error)
        setError("Failed to initialize. Please refresh the page.")
      }
    }
    initMedusa()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Filter products when collection changes
  useEffect(() => {
    if (products.length > 0) {
      filterProducts(selectedCollection)
    }
  }, [selectedCollection, products, filterProducts])


  if (loading) {
    return (
      <div className="min-h-screen products-page-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-200">
              Loading our beautiful ocean-themed collection...
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-2xl h-64 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  <div className="h-6 bg-white/10 rounded w-1/4"></div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-8">🌊</div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-gray-200 mb-8">{error}</p>
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
    <div className="min-h-screen products-page-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
            Discover our complete collection of ocean-themed treasures,
            each one carefully crafted to celebrate the beauty of marine life.
          </p>
          
          {/* Collections Sub-Menu */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-6">Collections</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleCollectionChange(collection.id)}
                  className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    selectedCollection === collection.id
                      ? 'bg-ocean-500 text-white shadow-lg transform scale-105'
                      : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                  }`}
                >
                  {collection.name}
                </button>
              ))}
            </div>
            
            {/* Collection Description */}
            <div className="mt-6">
              <p className="text-gray-300 italic text-center">
                {collections.find(c => c.id === selectedCollection)?.description}
              </p>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          filteredProducts.length > 0 ? (
            <>
              <ProductGrid products={filteredProducts} />
              <div className="text-center mt-12">
                <p className="text-gray-200">
                  Showing {filteredProducts.length} of {products.length} products
                  {selectedCollection !== 'all' && (
                    <span className="ml-2 text-cyan-300 font-medium">
                      in {collections.find(c => c.id === selectedCollection)?.name}
                    </span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                No products found in this collection
              </h2>
              <p className="text-gray-200 mb-6">
                Try browsing a different collection or check back soon for new arrivals!
              </p>
              <button
                onClick={() => handleCollectionChange('all')}
                className="bg-ocean-500 text-white px-6 py-3 rounded-lg hover:bg-ocean-600 transition-colors font-medium"
              >
                View All Products
              </button>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐠</div>
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              No products found
            </h2>
            <p className="text-gray-200">
              Check back soon for new arrivals from the deep blue sea!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}