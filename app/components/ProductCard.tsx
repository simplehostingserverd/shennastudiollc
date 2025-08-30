"use client"

import { useState } from "react"
import { useCart } from "@/app/context/CartContext"
import Button from "./ui/Button"
import { formatPrice } from "@/src/lib/utils"
import { HeartIcon, ShoppingCartIcon, EyeIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import Link from "next/link"
import { Product } from "@/src/lib/medusa"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  // Get the first available variant and its price
  const variant = product.variants?.[0]
  const price = variant?.prices?.find(p => p.currency_code === 'usd')
  const imageUrl = product.images?.[0]?.url || '/placeholder-product.jpg'

  const handleAddToCart = async () => {
    if (variant) {
      await addItem(variant.id, quantity)
      setQuantity(1)
    }
  }

  const increase = () => setQuantity((q) => q + 1)
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1))

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl card-hover">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="relative h-64 bg-ocean-50">
          {imageLoading && (
            <div className="absolute inset-0 animate-pulse bg-ocean-100"></div>
          )}
          <img
            src={imageUrl}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
              <Link
                href={`/product/${product.handle}`}
                className="bg-white text-ocean-600 p-2 rounded-full shadow-lg hover:bg-ocean-50 transition-colors"
              >
                <EyeIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="bg-white text-coral-500 p-2 rounded-full shadow-lg hover:bg-coral-50 transition-colors"
              >
                {isLiked ? (
                  <HeartIconSolid className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Badge */}
        {product.status === 'published' && (
          <div className="absolute top-3 left-3 bg-seafoam-gradient text-white px-2 py-1 rounded-full text-xs font-medium">
            New
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-display font-bold text-lg text-ocean-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-ocean-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          {price && (
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-ocean-900">
                {formatPrice(price.amount, price.currency_code)}
              </span>
              <span className="text-sm text-ocean-500">
                {price.currency_code.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Variant Options */}
        {variant?.options && Object.keys(variant.options).length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {Object.entries(variant.options).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-block bg-ocean-100 text-ocean-700 text-xs px-2 py-1 rounded-full"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-ocean-700">Qty:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={decrease}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full bg-ocean-100 text-ocean-600 hover:bg-ocean-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-medium text-ocean-900">
                {quantity}
              </span>
              <button
                onClick={increase}
                className="w-8 h-8 rounded-full bg-ocean-100 text-ocean-600 hover:bg-ocean-200 flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!variant || isLoading}
          loading={isLoading}
          className="w-full"
          variant="primary"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
