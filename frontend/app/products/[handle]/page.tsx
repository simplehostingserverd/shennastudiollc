'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import type { StoreProduct } from '@medusajs/types'
import createMedusaClient from '@/src/lib/medusa'
import { useCart } from '@/app/context/CartContext'
import Button from '@/app/components/ui/Button'
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'
import Image from 'next/image'
import ProductComments from '@/app/components/ProductComments'
import posthog from 'posthog-js'

export default function ProductDetailPage() {
  const params = useParams()
  const handle = params.handle as string
  const { addItem, isLoading: cartLoading } = useCart()

  const [product, setProduct] = useState<StoreProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const medusa = await createMedusaClient()
      const response = await medusa.store.product.list({
        handle,
        fields: '+variants,+variants.calculated_price'
      })
      if (response.products && response.products.length > 0) {
        const foundProduct = response.products[0] as StoreProduct
        setProduct(foundProduct)
        // Select first variant by default
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }, [handle])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    posthog.capture('product-added-to-cart', {
      product_id: product?.id,
      product_title: product?.title,
      variant_id: selectedVariant,
      quantity: quantity,
      price: priceInDollars,
    })

    try {
      setIsAddingToCart(true)
      await addItem(selectedVariant, quantity)
      // Show success message or toast here
      alert(`Added ${quantity} item(s) to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen product-detail-background py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-ocean-100 rounded-2xl h-96"></div>
              <div className="space-y-6">
                <div className="h-8 bg-ocean-100 rounded w-3/4"></div>
                <div className="h-6 bg-ocean-100 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-ocean-100 rounded"></div>
                  <div className="h-4 bg-ocean-100 rounded w-5/6"></div>
                  <div className="h-4 bg-ocean-100 rounded w-4/6"></div>
                </div>
                <div className="h-12 bg-ocean-100 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen product-detail-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="text-6xl mb-6">🌊</div>
          <h1 className="text-2xl font-bold text-ocean-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-ocean-600 mb-8">
            The ocean treasure you&apos;re looking for seems to have drifted
            away.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const selectedVariantData = product.variants?.find(
    (v) => v.id === selectedVariant
  )
  // Use calculated_price from the variant (Medusa v2 structure)
  // NOTE: calculated_price.calculated_amount is in dollars (not cents)
  const variantWithPrice = selectedVariantData as { calculated_price?: { calculated_amount?: number } } | undefined
  const priceInDollars = variantWithPrice?.calculated_price?.calculated_amount || 0
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInDollars) // Already in dollars, no need to divide

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `Beautiful handcrafted ${product.title} from Shenna's Studio`,
    image: product.images?.map(img => img.url) || [],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: "Shenna's Studio",
    },
    offers: {
      '@type': 'Offer',
      url: `https://shennastudio.com/products/${product.handle}`,
      priceCurrency: 'USD',
      price: priceInDollars,
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        name: "Shenna's Studio",
        url: 'https://shennastudio.com'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '5.99',
          currency: 'USD'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 5,
            maxValue: 7,
            unitCode: 'DAY'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '24',
      bestRating: '5',
      worstRating: '1'
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="min-h-screen product-detail-background py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <Link href="/" className="hover:text-blue-800">
              Home
            </Link>
            <span>→</span>
            <Link href="/products" className="hover:text-blue-800">
              Products
            </Link>
            <span>→</span>
            <span className="text-blue-900 font-medium">{product.title}</span>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="relative h-96">
                <Image
                  src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="bg-white rounded-lg p-2 shadow">
                    <div className="relative h-20">
                      <Image
                        src={image.url}
                        alt={`${product.title} ${index + 2}`}
                        fill
                        sizes="100px"
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 bg-white rounded-2xl p-6 shadow-lg">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-display font-bold text-blue-900">
                  {product.title}
                </h1>
                <button
                  onClick={() => {
                    const newFavoriteState = !isFavorite
                    setIsFavorite(newFavoriteState)
                    posthog.capture('product-favorite-toggled', {
                      product_id: product.id,
                      product_title: product.title,
                      favorited: newFavoriteState,
                    })
                  }}
                  className="p-2 text-coral-500 hover:text-coral-600 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-6 w-6" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="text-2xl font-bold text-blue-900">
                  {formattedPrice}
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarSolidIcon
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-blue-600 ml-1">
                    (24 reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="prose text-blue-700">
              <p>{product.description || 'No description available'}</p>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Options
                </h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        checked={selectedVariant === variant.id}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-blue-700">{variant.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium text-blue-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariant || isAddingToCart || cartLoading}
                loading={isAddingToCart}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <div className="text-sm text-blue-600 space-y-1">
                <p>🚚 Free shipping on orders over $50</p>
                <p>🔒 Secure checkout with Stripe</p>
                <p>🌊 10% goes to ocean conservation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-display font-bold text-blue-900 mb-6">
            Why Choose Shenna&apos;s Studio?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Ocean Conservation
              </h3>
              <p className="text-blue-600 text-sm">
                Every purchase supports marine protection efforts
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Family Crafted
              </h3>
              <p className="text-blue-600 text-sm">
                Made with love by our family for yours
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-blue-600 text-sm">
                Carefully selected materials and craftsmanship
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <ProductComments productId={product.id} />
      </div>
    </div>
    </>
  )
}
