import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

interface CartItem {
  title: string
  description: string
  thumbnail: string
  unit_price: number
  quantity: number
}

// Initialize Stripe only when needed to avoid build-time errors
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-03-31.basil',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, cartId } = body

    console.log('Checkout request received:', { itemCount: items?.length, cartId })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Get Stripe instance
    const stripe = getStripe()

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => {
      // Medusa v2 returns unit_price in dollars (e.g., 34.99)
      // Stripe expects amount in cents (e.g., 3499)
      const unitAmount = Math.round(item.unit_price * 100)

      console.log('Processing item:', {
        title: item.title,
        unit_price: item.unit_price,
        unitAmount,
        quantity: item.quantity,
        thumbnail: item.thumbnail
      })

      // Validate price
      if (!unitAmount || unitAmount <= 0) {
        throw new Error(`Invalid price for item: ${item.title} (${unitAmount})`)
      }

      // Validate image URL - must be absolute URL starting with http/https
      const isValidUrl = (url: string) => {
        try {
          const parsed = new URL(url)
          return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        } catch {
          return false
        }
      }

      const validImages = item.thumbnail && isValidUrl(item.thumbnail)
        ? [item.thumbnail]
        : []

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: item.description || 'Product from Shenna\'s Studio',
            images: validImages,
          },
          unit_amount: unitAmount, // Stripe expects amount in cents
        },
        quantity: item.quantity,
      }
    })

    // Determine base URL based on environment
    // Ensure we always have a valid absolute URL with protocol
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''

    if (!baseUrl && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    }

    if (!baseUrl) {
      // Fallback: Try to get from request headers
      const host = request.headers.get('host')
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      baseUrl = host ? `${protocol}://${host}` : 'https://www.shennastudio.com'
    }

    console.log('Using base URL for Stripe redirect:', baseUrl)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        cart_id: cartId || '',
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
    })

    console.log('Stripe session created successfully:', session.id)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)

    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
