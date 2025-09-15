"use client"

import Link from "next/link"
import { Collection } from "@/src/lib/medusa"

interface CategoryGridProps {
  collections: Collection[]
}

export default function CategoryGrid({ collections }: CategoryGridProps) {
  if (!collections.length) {
    return (
      <div className="text-center py-12">
        <p className="text-ocean-600">No categories available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection) => (
        <Link
          key={collection.id}
          href={`/products?collection=${collection.handle}`}
          className="group"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-gradient-to-br from-ocean-100 to-ocean-200 flex items-center justify-center">
              <div className="text-4xl text-ocean-600">🌊</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors">
                {collection.title}
              </h3>
              <p className="text-ocean-600 mt-2">
                Explore our {collection.title.toLowerCase()} collection
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}