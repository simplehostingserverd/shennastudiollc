import Button from '@/app/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Information | Free Shipping Over $75 | Shenna\'s Studio',
  description: 'Learn about Shenna\'s Studio shipping options: Standard (5-7 days, $5.99) and Express (2-3 days, $12.99). Free shipping on orders over $75. International shipping available.',
  keywords: 'shipping information, free shipping, express shipping, international shipping, delivery times',
  openGraph: {
    title: 'Shipping Information | Shenna\'s Studio',
    description: 'Fast, reliable shipping for ocean-themed products. Free on orders over $75.',
    url: 'https://shennastudio.com/shipping',
    type: 'website'
  },
  alternates: {
    canonical: '/shipping'
  }
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-ocean-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-lg text-ocean-600">
            Everything you need to know about shipping and delivery
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Shipping Methods */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">
              Shipping Methods
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-ocean-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-ocean-900 mb-3">
                  Standard Shipping
                </h3>
                <p className="text-ocean-600 mb-3">5-7 business days</p>
                <p className="text-2xl font-bold text-ocean-900 mb-3">$5.99</p>
                <p className="text-sm text-ocean-500">
                  Free on orders over $75
                </p>
              </div>
              <div className="border border-ocean-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-ocean-900 mb-3">
                  Express Shipping
                </h3>
                <p className="text-ocean-600 mb-3">2-3 business days</p>
                <p className="text-2xl font-bold text-ocean-900 mb-3">$12.99</p>
                <p className="text-sm text-ocean-500">
                  Available for all orders
                </p>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">
              Processing Time
            </h2>
            <div className="bg-ocean-50 rounded-lg p-6">
              <p className="text-ocean-700 mb-4">
                All orders are carefully handpacked and processed within 1-2
                business days. You&apos;ll receive a tracking number via email
                once your order ships.
              </p>
              <p className="text-ocean-600">
                Orders placed after 2 PM EST will be processed the next business
                day.
              </p>
            </div>
          </section>

          {/* International Shipping */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">
              International Shipping
            </h2>
            <p className="text-ocean-700 mb-4">
              We currently ship to select international destinations. Shipping
              costs and delivery times vary by location.
            </p>
            <p className="text-ocean-600">
              International customers are responsible for any customs duties or
              taxes that may apply.
            </p>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-ocean-900 mb-4">
              Questions About Your Order?
            </h2>
            <p className="text-ocean-600 mb-6">
              Our customer service team is here to help with any shipping
              questions.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Contact Us
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
