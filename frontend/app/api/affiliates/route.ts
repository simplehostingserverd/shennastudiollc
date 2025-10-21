import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placement = searchParams.get('placement')

    const where = {
      isActive: true,
      ...(placement && { placement }),
    }

    const affiliates = await prisma.affiliateLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ affiliates })
  } catch (error) {
    console.error('Error fetching affiliates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliates' },
      { status: 500 }
    )
  }
}
