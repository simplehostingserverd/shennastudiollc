"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Button from "@/app/components/ui/Button"
import Link from "next/link"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderNumber] = useState(() => 
    `SO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  )

  useEffect(() => {
    // Clear cart after successful checkout
    if (sessionId) {
      localStorage.removeItem("cart_id")
      // You can also call your cart context's clearCart method here
    }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-ocean-50 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="mb-8">
            <CheckCircleIcon className="h-16 w-16 text-seafoam-500 mx-auto mb-4" />
            <h1 className="text-3xl font-display font-bold text-ocean-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-ocean-600">
              Thank you for your purchase from Shenna&apos;s Studio
            </p>
          </div>

          <div className="bg-ocean-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-ocean-900 mb-2">
              Order Details
            </h2>
            <div className="text-ocean-700 space-y-1">
              <p><strong>Order Number:</strong> {orderNumber}</p>
              {sessionId && (
                <p><strong>Session ID:</strong> {sessionId}</p>
              )}
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-4 text-ocean-600">
            <p>
              🌊 Your order is being prepared with care at Shenna&apos;s Studio
            </p>
            <p>
              📧 A confirmation email has been sent to your email address
            </p>
            <p>
              🚚 We&apos;ll notify you when your ocean treasures are on their way
            </p>
            <p className="text-sm text-coral-600 mt-6">
              💝 Thank you for supporting ocean conservation - 10% of your purchase 
              goes directly to marine protection efforts!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ocean-50 py-20 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-ocean-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}