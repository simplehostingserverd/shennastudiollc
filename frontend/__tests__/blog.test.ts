import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Blog System Tests', () => {
  let testUserId: string
  let testPostId: string

  beforeAll(async () => {
    // Create a test user for blog posts
    const testUser = await prisma.user.findFirst({
      where: { email: { contains: 'admin' } },
    })

    if (testUser) {
      testUserId = testUser.id
    } else {
      // Create a test user if none exists
      const newUser = await prisma.user.create({
        data: {
          email: 'test@shennastudio.com',
          name: 'Test Admin',
          password: 'hashed_password',
          role: 'admin',
        },
      })
      testUserId = newUser.id
    }
  })

  afterAll(async () => {
    // Clean up test data
    if (testPostId) {
      await prisma.blogPost.delete({ where: { id: testPostId } }).catch(() => {})
    }
    await prisma.$disconnect()
  })

  it('should create a blog post', async () => {
    const post = await prisma.blogPost.create({
      data: {
        title: 'Test Ocean Conservation Post',
        slug: 'test-ocean-conservation-post',
        excerpt: 'This is a test post about ocean conservation.',
        content: 'This is the full content of the test post.',
        category: 'Conservation',
        tags: ['ocean', 'conservation', 'test'],
        keywords: 'ocean conservation, marine life',
        metaDescription: 'A test post about ocean conservation',
        authorId: testUserId,
        published: false,
      },
    })

    expect(post).toBeDefined()
    expect(post.title).toBe('Test Ocean Conservation Post')
    expect(post.slug).toBe('test-ocean-conservation-post')
    expect(post.published).toBe(false)

    testPostId = post.id
  })

  it('should retrieve a blog post by slug', async () => {
    const post = await prisma.blogPost.findUnique({
      where: { slug: 'test-ocean-conservation-post' },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    expect(post).toBeDefined()
    expect(post?.title).toBe('Test Ocean Conservation Post')
    expect(post?.author).toBeDefined()
  })

  it('should update a blog post', async () => {
    const updated = await prisma.blogPost.update({
      where: { id: testPostId },
      data: {
        published: true,
        publishedAt: new Date(),
      },
    })

    expect(updated.published).toBe(true)
    expect(updated.publishedAt).toBeDefined()
  })

  it('should retrieve only published posts', async () => {
    const publishedPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })

    expect(publishedPosts).toBeDefined()
    expect(Array.isArray(publishedPosts)).toBe(true)
    publishedPosts.forEach((post) => {
      expect(post.published).toBe(true)
    })
  })

  it('should filter posts by category', async () => {
    const conservationPosts = await prisma.blogPost.findMany({
      where: {
        category: 'Conservation',
        published: true,
      },
    })

    expect(conservationPosts).toBeDefined()
    conservationPosts.forEach((post) => {
      expect(post.category).toBe('Conservation')
    })
  })

  it('should create a blog comment', async () => {
    const comment = await prisma.blogComment.create({
      data: {
        postId: testPostId,
        name: 'Test Commenter',
        email: 'commenter@test.com',
        content: 'This is a test comment.',
        approved: false,
      },
    })

    expect(comment).toBeDefined()
    expect(comment.approved).toBe(false)
    expect(comment.content).toBe('This is a test comment.')

    // Clean up
    await prisma.blogComment.delete({ where: { id: comment.id } })
  })

  it('should count comments for a post', async () => {
    const post = await prisma.blogPost.findUnique({
      where: { id: testPostId },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    })

    expect(post?._count).toBeDefined()
    expect(typeof post?._count.comments).toBe('number')
  })

  it('should delete a blog post', async () => {
    const deleted = await prisma.blogPost.delete({
      where: { id: testPostId },
    })

    expect(deleted).toBeDefined()
    expect(deleted.id).toBe(testPostId)

    // Verify deletion
    const found = await prisma.blogPost.findUnique({
      where: { id: testPostId },
    })

    expect(found).toBeNull()
  })
})
