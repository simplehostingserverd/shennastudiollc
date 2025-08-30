"use client"

import { useCart } from "@/app/context/CartContext"
import Button from "@/app/components/ui/Button"
import { formatPrice } from "@/src/lib/utils"
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function CartPage() {
  const { items, updateItem, removeItem, clearCart, total, subtotal, itemCount, isLoading } = useCart()

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId)
    } else {
      await updateItem(itemId, newQuantity)
    }
  }

  return (
    <div className="min-h-screen bg-ocean-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-ocean-600">
            {itemCount === 0 ? "Your cart is empty" : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🌊</div>
            <h2 className="text-2xl font-bold text-ocean-900 mb-4">Your cart is empty</h2>
            <p className="text-ocean-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any ocean treasures to your cart yet. 
              Start exploring our collection!
            </p>
            <Link href="/">
              <Button variant="primary" size="lg" className="inline-flex items-center">
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.thumbnail || "/placeholder-product.jpg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-lg font-semibold text-ocean-900 mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-ocean-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Variant Options */}
                      {item.variant.options && Object.keys(item.variant.options).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {Object.entries(item.variant.options).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-block bg-ocean-100 text-ocean-700 text-xs px-2 py-1 rounded-full"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price */}
                      <div className="text-xl font-bold text-ocean-900 mb-3">
                        {formatPrice(item.unit_price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-ocean-700">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isLoading}
                              className="w-8 h-8 rounded-full bg-ocean-100 text-ocean-600 hover:bg-ocean-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-ocean-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              className="w-8 h-8 rounded-full bg-ocean-100 text-ocean-600 hover:bg-ocean-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="text-coral-500 hover:text-coral-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  disabled={isLoading}
                  className="text-coral-600 border-coral-600 hover:bg-coral-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
                <h3 className="text-xl font-semibold text-ocean-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-ocean-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ocean-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-ocean-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <hr className="border-ocean-200" />
                  <div className="flex justify-between text-xl font-bold text-ocean-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full mb-4"
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={async () => {
                    // TODO: Implement Stripe checkout
                    console.log("Proceeding to checkout...")
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Link href="/">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
