import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/src/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    await requireAdmin()

    const affiliates = await prisma.affiliateLink.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ affiliates })
  } catch (error) {
    console.error('Error fetching affiliates:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const { title, url, description, placement } = await request.json()

    if (!title || !url || !placement) {
      return NextResponse.json(
        { error: 'Title, URL, and placement are required' },
        { status: 400 }
      )
    }

    const affiliate = await prisma.affiliateLink.create({
      data: {
        title,
        url,
        description: description || '',
        placement,
      },
    })

    return NextResponse.json({ affiliate, message: 'Affiliate link created' })
  } catch (error) {
    console.error('Error creating affiliate:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
