"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/app/components/ProductGrid"
import SearchBar from "@/app/components/SearchBar"
import Button from "@/app/components/ui/Button"
import { Product } from "@/src/lib/medusa"
import medusa from "@/src/lib/medusa"
import Link from "next/link"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const response = await medusa.store.products.list({ limit: 8 })
      if (response.products) {
        setFeaturedProducts(response.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-800 text-white overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videobackground.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ocean-500 opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <div className="text-8xl mb-4 animate-float">🐢</div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gradient-coral">
              Shenna's Studio
            </h1>
            <p className="text-xl md:text-2xl text-ocean-100 mb-8 max-w-2xl mx-auto">
              A family business crafting beautiful ocean-themed treasures that celebrate marine life 
              and support ocean conservation efforts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#featured">
              <Button 
                variant="coral" 
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
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-ocean-600"
              >
                Our Mission
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-60">🌊</div>
        <div className="absolute top-40 right-16 text-3xl animate-float opacity-40" style={{ animationDelay: '1s' }}>🐠</div>
        <div className="absolute bottom-32 left-20 text-3xl animate-float opacity-50" style={{ animationDelay: '2s' }}>🐙</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float opacity-30" style={{ animationDelay: '3s' }}>🦀</div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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

      {/* Featured Products */}
      <section id="featured" className="py-20 bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ocean-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-ocean-600 max-w-2xl mx-auto">
              Handpicked treasures from the depths of our collection, each one celebrating 
              the beauty and wonder of ocean life.
            </p>
          </div>

          <ProductGrid products={featuredProducts} />

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
            <Button variant="seafoam" size="lg">
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
        </div>
      </section>
    </div>
  )
}
