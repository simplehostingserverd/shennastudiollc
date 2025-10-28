'use client'

import { useState } from 'react'
import { useCart } from '@/app/context/CartContext'
import Button from './ui/Button'
import { formatPrice } from '@/src/lib/utils'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Product, ProductOptionValue } from '@/src/lib/medusa'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [imageLoading, setImageLoading] = useState(true)

  // Get the first available variant and its price
  const variant = product.variants?.[0]
  // Try calculated_price first, fall back to prices array
  const calculatedPrice = variant?.calculated_price
  // NOTE: calculated_price.calculated_amount is already in dollars (e.g., 34.99)
  const price = calculatedPrice ? {
    amount: calculatedPrice.calculated_amount,
    currency_code: calculatedPrice.currency_code
  } : variant?.prices?.find((p) => p.currency_code === 'usd')
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
      {/* Product Image - Click to view details */}
      <Link href={`/products/${product.handle}`} className="block relative h-64 bg-ocean-50 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 animate-pulse bg-ocean-100"></div>
        )}
        <Image
          src={imageUrl}
          alt={`${product.title} - Ocean-inspired product from Shenna's Studio`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />

        {/* Badge */}
        {product.status === 'published' && (
          <div className="absolute top-3 left-3 bg-seafoam-gradient text-white px-2 py-1 rounded-full text-xs font-medium">
            New
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-display font-bold text-lg text-ocean-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-ocean-600 mb-3 line-clamp-2">
            {product.description || 'No description available'}
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
              {Object.entries(variant.options).map(
                ([key, value]: [string, ProductOptionValue]) => (
                  <span
                    key={key}
                    className="inline-block bg-ocean-100 text-ocean-700 text-xs px-2 py-1 rounded-full"
                  >
                    {value.value}
                  </span>
                )
              )}
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
