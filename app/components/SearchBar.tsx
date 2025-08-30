"use client"

import { useState } from "react"
import { algoliaClient } from "@/src/lib/algolia"
import ProductGrid from "./ProductGrid"
import { Product } from "@/src/lib/medusa"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)

    if (q.length > 1) {
      try {
        setIsSearching(true)
        const searchResults = await algoliaClient.search({
          requests: [{
            indexName: 'products',
            query: q,
            hitsPerPage: 20
          }]
        })
        
        const hits = searchResults.results[0]?.hits || []
        
        // Transform Algolia results to Product format
        const transformedResults: Product[] = hits.map((hit: any) => ({
          id: hit.objectID,
          title: hit.title,
          description: hit.description,
          handle: hit.handle,
          status: hit.status,
          images: [{ url: hit.image, alt: hit.title }],
          variants: hit.variants?.map((v: any) => ({
            id: v.id,
            title: v.title,
            sku: '',
            inventory_quantity: 100,
            prices: [{
              id: `price_${v.id}`,
              amount: v.price * 100, // Convert back to cents
              currency_code: v.currency.toLowerCase()
            }],
            options: v.options
          })) || [],
          weight: 0,
          created_at: new Date(hit.created_at || Date.now()).toISOString(),
          updated_at: new Date(hit.created_at || Date.now()).toISOString()
        }))
        
        setResults(transformedResults)
      } catch (error) {
        console.warn("Search not available:", error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    } else {
      setResults([])
      setIsSearching(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search ocean treasures..."
          value={query}
          onChange={handleSearch}
          className="w-full p-3 pr-10 rounded-xl border border-ocean-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-ocean-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-ocean-900 mb-4">
            Found {results.length} ocean treasures
          </h3>
          <ProductGrid products={results} />
        </div>
      )}

      {query.length > 1 && results.length === 0 && !isSearching && (
        <div className="mt-6 text-center py-8">
          <div className="text-4xl mb-2">🏝️</div>
          <p className="text-ocean-600">No treasures found for "{query}". Try different keywords!</p>
        </div>
      )}
    </div>
  )
}
