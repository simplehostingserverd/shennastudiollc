import Button from '@/app/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Exchanges | 30-Day Return Policy | Shenna\'s Studio',
  description: 'Easy 30-day returns and exchanges for Shenna\'s Studio ocean products. Free return shipping on defective items. Simple return process with prepaid labels.',
  keywords: 'returns policy, exchange policy, 30-day returns, refund policy, product returns',
  openGraph: {
    title: 'Returns & Exchanges | Shenna\'s Studio',
    description: '30-day hassle-free returns. Your satisfaction is our priority.',
    url: 'https://shennastudio.com/returns',
    type: 'website'
  },
  alternates: {
    canonical: '/returns'
  }
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-ocean-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Returns &amp; Exchanges
          </h1>
          <p className="text-lg text-ocean-600">
            Your satisfaction is our priority - easy returns within 30 days
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Return Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">
              Return Policy
            </h2>
            <div className="prose prose-ocean max-w-none">
              <p className="text-ocean-700 mb-4">
                We want you to love your ocean treasures! If you&apos;re not
                completely satisfied with your purchase, you can return items
                within <strong>30 days</strong> of delivery for a full refund.
              </p>
              <ul className="text-ocean-700 space-y-2">
                <li>Items must be in original condition</li>
                <li>Original packaging required</li>
                <li>Return shipping is free for defective items</li>
                <li>Customer covers return shipping for exchanges/refunds</li>
              </ul>
            </div>
          </section>

          {/* How to Return */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">
              How to Start a Return
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-ocean-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                  Contact Us
                </h3>
                <p className="text-ocean-600 text-sm">
                  Email us with your order number and reason for return
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-ocean-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                  Get Label
                </h3>
                <p className="text-ocean-600 text-sm">
                  We&apos;ll send you a prepaid return shipping label
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-ocean-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                  Ship Back
                </h3>
                <p className="text-ocean-600 text-sm">
                  Pack securely and ship using the provided label
                </p>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">
              Exchanges
            </h2>
            <div className="bg-seafoam-50 rounded-lg p-6">
              <p className="text-seafoam-800 mb-4">
                Need a different size or color? We&apos;re happy to exchange
                items within 30 days. Simply follow the return process above and
                let us know what you&apos;d like instead.
              </p>
              <p className="text-seafoam-700">
                We&apos;ll process exchanges as soon as we receive your returned
                item.
              </p>
            </div>
          </section>

          {/* Damaged Items */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">
              Damaged or Defective Items
            </h2>
            <div className="bg-coral-50 rounded-lg p-6">
              <p className="text-coral-800 mb-4">
                If your item arrives damaged or defective, we&apos;ll make it
                right immediately:
              </p>
              <ul className="text-coral-800 space-y-2">
                <li>• Free return shipping</li>
                <li>• Full refund or replacement</li>
                <li>• Priority processing</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-ocean-900 mb-4">
              Need Help with a Return?
            </h2>
            <p className="text-ocean-600 mb-6">
              Our customer service team is ready to assist you with any return
              questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Contact Support
                </Button>
              </Link>
              <Link href="mailto:support@shennastudio.com">
                <Button variant="outline" size="lg">
                  Email Us
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
