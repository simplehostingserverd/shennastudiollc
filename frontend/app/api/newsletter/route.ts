import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address required' },
        { status: 400 }
      )
    }

    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingSubscription) {
      if (existingSubscription.subscribed) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        )
      } else {
        await prisma.newsletter.update({
          where: { email: email.toLowerCase() },
          data: { subscribed: true },
        })
        return NextResponse.json({
          message: 'Successfully resubscribed to newsletter',
        })
      }
    }

    await prisma.newsletter.create({
      data: {
        email: email.toLowerCase(),
        subscribed: true,
      },
    })

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address required' },
        { status: 400 }
      )
    }

    await prisma.newsletter.update({
      where: { email: email.toLowerCase() },
      data: { subscribed: false },
    })

    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter',
    })
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const subscribers = await prisma.newsletter.findMany({
      where: { subscribed: true },
      select: {
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ subscribers, total: subscribers.length })
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}
