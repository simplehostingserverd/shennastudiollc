import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/src/lib/auth'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const { title, url, description, placement, isActive } =
      await request.json()

    const affiliate = await prisma.affiliateLink.update({
      where: { id },
      data: {
        title,
        url,
        description,
        placement,
        isActive,
      },
    })

    return NextResponse.json({ affiliate, message: 'Affiliate link updated' })
  } catch (error) {
    console.error('Error updating affiliate:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    await prisma.affiliateLink.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Affiliate link deleted' })
  } catch (error) {
    console.error('Error deleting affiliate:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
