import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const channels = await prisma.channel.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    })

    return NextResponse.json(channels)
  } catch (error) {
    console.error('Error fetching channels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, icon, color, isPrivate, order } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const existingChannel = await prisma.channel.findUnique({
      where: { slug },
    })

    if (existingChannel) {
      return NextResponse.json(
        { error: 'Channel with this slug already exists' },
        { status: 400 }
      )
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        slug,
        description,
        icon: icon || '💬',
        color,
        isPrivate: isPrivate || false,
        order: order || 0,
      },
    })

    return NextResponse.json(channel, { status: 201 })
  } catch (error) {
    console.error('Error creating channel:', error)
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    )
  }
}
