import { MetadataRoute } from 'next'
import createMedusaClient from '@/src/lib/medusa'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shennastudio.com'

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  try {
    // Fetch products from Medusa
    const medusa = await createMedusaClient()
    const response = await medusa.store.product.list({ limit: 100 })

    const productPages =
      response.products?.map((product) => ({
        url: `${baseUrl}/products/${product.handle}`,
        lastModified: new Date(product.updated_at || product.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) || []

    // Fetch blog posts from Prisma
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
    })

    const blogPages = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    await prisma.$disconnect()

    return [...staticPages, ...productPages, ...blogPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    await prisma.$disconnect()
    return staticPages
  }
}
