import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

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
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, cartId } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      )
    }

    // Get Stripe instance
    const stripe = getStripe()

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.description,
          images: [item.thumbnail].filter(Boolean),
        },
        unit_amount: Math.round(item.unit_price), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      metadata: {
        cart_id: cartId || "",
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      billing_address_collection: "required",
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}