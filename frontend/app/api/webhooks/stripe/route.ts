import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  sendCustomerReceipt,
  sendAdminNotification,
  OrderEmailData,
} from '@/src/lib/resend'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Checkout session completed:', session.id)

        // Extract order details
        try {
          // Retrieve full session with line items
          const fullSession = await stripe.checkout.sessions.retrieve(
            session.id,
            {
              expand: ['line_items', 'customer', 'shipping_details'],
            }
          )

          // Get customer details
          const customerName =
            fullSession.customer_details?.name || 'Valued Customer'
          const customerEmail =
            fullSession.customer_details?.email || session.customer_email || ''

          // Get shipping address
          const shippingDetails = fullSession.shipping_details
          const shippingAddress = {
            name: shippingDetails?.name || customerName,
            line1: shippingDetails?.address?.line1 || '',
            line2: shippingDetails?.address?.line2 || undefined,
            city: shippingDetails?.address?.city || '',
            state: shippingDetails?.address?.state || '',
            postal_code: shippingDetails?.address?.postal_code || '',
            country: shippingDetails?.address?.country || '',
          }

          // Get line items
          const lineItems = fullSession.line_items?.data || []
          const items = lineItems.map((item) => ({
            title: item.description || 'Product',
            quantity: item.quantity || 1,
            price: item.amount_total || 0,
          }))

          // Calculate totals (amounts are in cents)
          const subtotal = fullSession.amount_subtotal || 0
          const total = fullSession.amount_total || 0
          const shipping = fullSession.total_details?.amount_shipping || 0
          const tax = fullSession.total_details?.amount_tax || 0

          // Create email data
          const emailData: OrderEmailData = {
            orderNumber: `SO-${session.id.substring(8, 17).toUpperCase()}`,
            customerName,
            customerEmail,
            items,
            subtotal,
            shipping,
            tax,
            total,
            shippingAddress,
            orderDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          }

          // Send emails
          if (customerEmail) {
            const customerResult = await sendCustomerReceipt(emailData)
            if (customerResult.success) {
              console.log('Customer receipt sent successfully')
            } else {
              console.error('Failed to send customer receipt:', customerResult.error)
            }
          }

          const adminResult = await sendAdminNotification(emailData)
          if (adminResult.success) {
            console.log('Admin notification sent successfully')
          } else {
            console.error('Failed to send admin notification:', adminResult.error)
          }
        } catch (emailError) {
          console.error('Error processing emails:', emailError)
          // Don't fail the webhook - the payment was successful
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('PaymentIntent succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('PaymentIntent failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Disable body parsing, need raw body for signature verification
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
