'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ShippingLabelPrinter from '@/app/components/ShippingLabelPrinter'

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  customerEmail: string
  customerName: string
  customerPhone: string
  shippingName: string
  shippingLine1: string
  shippingLine2: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  billingName: string
  billingLine1: string
  billingLine2: string
  billingCity: string
  billingState: string
  billingPostalCode: string
  billingCountry: string
  stripeSessionId: string
  items: Array<{
    id: string
    productId: string
    quantity: number
    price: number
  }>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showPrinter, setShowPrinter] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const url = filter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${filter}`
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrintLabel = (order: Order) => {
    setSelectedOrder(order)
    setShowPrinter(true)
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and print shipping labels</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  filter === 'all'
                    ? 'border-ocean-600 text-ocean-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  filter === 'completed'
                    ? 'border-ocean-600 text-ocean-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  filter === 'pending'
                    ? 'border-ocean-600 text-ocean-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending
              </button>
            </nav>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Orders will appear here when customers make purchases</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.stripeSessionId?.substring(8, 17).toUpperCase() || order.id.substring(0, 8)}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        {/* Customer Info */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Customer</h4>
                          <p className="text-sm text-gray-900">{order.customerName || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{order.customerEmail || 'N/A'}</p>
                          {order.customerPhone && (
                            <p className="text-sm text-gray-600">{order.customerPhone}</p>
                          )}
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
                          {order.shippingLine1 ? (
                            <>
                              <p className="text-sm text-gray-900">{order.shippingName}</p>
                              <p className="text-sm text-gray-600">{order.shippingLine1}</p>
                              {order.shippingLine2 && (
                                <p className="text-sm text-gray-600">{order.shippingLine2}</p>
                              )}
                              <p className="text-sm text-gray-600">
                                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                              </p>
                              <p className="text-sm text-gray-600">{order.shippingCountry}</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No shipping address</p>
                          )}
                        </div>

                        {/* Order Details */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Order Details</h4>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Items: {order.items?.length || 0}
                          </p>
                          <p className="text-lg font-bold text-ocean-600 mt-1">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.shippingLine1 && (
                      <button
                        onClick={() => handlePrintLabel(order)}
                        className="ml-4 px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                        Print Label
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shipping Label Printer Modal */}
        {showPrinter && selectedOrder && (
          <ShippingLabelPrinter
            order={selectedOrder}
            onClose={() => {
              setShowPrinter(false)
              setSelectedOrder(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
