"use client"

import { useState, useEffect, useCallback } from "react"
import CategoryGrid from "@/app/components/CategoryGrid"
import SearchBar from "@/app/components/SearchBar"
import Button from "@/app/components/ui/Button"
import { Collection } from "@/src/lib/medusa"

interface MedusaClient {
  store?: {
    collection?: {
      list?: (params?: { limit?: number }) => Promise<{ collections?: Collection[] }>
    }
  }
}
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [, setLoading] = useState(true)
  const [medusa, setMedusa] = useState<MedusaClient | null>(null)

  useEffect(() => {
    const initMedusa = async () => {
      try {
        const createMedusaClient = await import("@/src/lib/medusa")
        const client = await createMedusaClient.default()
        setMedusa(client as unknown as MedusaClient)
      } catch (error) {
        console.error("Failed to initialize Medusa client:", error)
      }
    }
    initMedusa()
  }, [])

  const fetchCollections = useCallback(async () => {
    if (!medusa) return

    try {
      setLoading(true)
      // Check if medusa client is properly initialized
      if (!medusa?.store?.collection?.list) {
        console.warn("Medusa collection API not available")
        return
      }

      const response = await medusa.store.collection.list({
        limit: 6
      })

      if (response?.collections) {
        setCollections(response.collections as Collection[])
      }
    } catch (error) {
      console.error("Error fetching collections:", error)
      // Set empty array on error to prevent UI issues
      setCollections([])
    } finally {
      setLoading(false)
    }
  }, [medusa])

  useEffect(() => {
    if (medusa) {
      fetchCollections()
    }
  }, [medusa, fetchCollections])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-800 text-white overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          autoPlay
          loop
          playsInline
          webkit-playsinline="true"
          controls={false}
          preload="metadata"
          poster="/ShennasLogo.png"
        >
          <source src="/IFEO3426.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-ocean-500 opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              Shenna&apos;s Studio
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#categories">
              <Button
                variant="maroon"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Shop by Category
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/ShennasLogo.png"
                alt="Shenna's Studio Logo"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-display font-bold text-ocean-900 mb-4">
              Find Your Perfect Ocean Treasure
            </h2>
            <p className="text-lg text-ocean-600 mb-8">
              Search through our carefully curated collection of ocean-inspired products
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ocean-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-ocean-600 max-w-2xl mx-auto">
              Discover our carefully curated collections, each designed to bring
              the beauty and wonder of the ocean into your life.
            </p>
          </div>

          <CategoryGrid collections={collections} />

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="primary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Conservation Message */}
      <section className="py-20 ocean-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-8">🌊</div>
          <h2 className="text-4xl font-display font-bold mb-6">
            Supporting Ocean Conservation
          </h2>
          <p className="text-xl text-ocean-100 mb-8 leading-relaxed">
            Every purchase helps protect our oceans. We donate 10% of all proceeds 
            to marine conservation organizations working tirelessly to preserve 
            ocean ecosystems for future generations.
          </p>
          <Link href="/conservation">
            <Button variant="maroon" size="lg">
              Learn More About Our Impact
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-ocean-900 mb-4">
            Stay Connected with the Ocean
          </h2>
          <p className="text-lg text-ocean-600 mb-8">
            Get updates on new arrivals, conservation efforts, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-ocean-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
            <Button variant="primary" className="px-8">
              Subscribe
            </Button>
          </div>

          {/* Moved buttons to bottom */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/products">
              <Button
                variant="maroon"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Explore Products
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-ocean-600 text-ocean-600 hover:bg-ocean-600 hover:text-white"
              >
                Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
