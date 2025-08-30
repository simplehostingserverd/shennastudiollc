"use client"

import { useState } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import ProductGrid from "./ProductGrid"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchResults(true)
    } else {
      setSearchResults(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ocean-400" />
          <input
            type="text"
            placeholder="Search for sea turtle mugs, coral jewelry, ocean prints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-ocean-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-all duration-200 bg-white shadow-lg"
          />
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 ocean-gradient text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
        >
          Search
        </button>
      </form>

      {searchResults && query && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-ocean-900 mb-6">
            Search results for "{query}"
          </h3>
          <ProductGrid searchQuery={query} />
        </div>
      )}
    </div>
  )
}
