import Link from 'next/link'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPostData[params.slug]
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Shenna\'s Studio'
    }
  }

  return {
    title: `${post.title} | Shenna's Studio Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://shennastudio.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['Shenna\'s Studio'],
      images: [
        {
          url: '/ShennasLogo.png',
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/ShennasLogo.png']
    },
    alternates: {
      canonical: `/blog/${params.slug}`
    }
  }
}

const blogPostData: Record<string, {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  keywords: string
  content: string[]
}> = {
  'importance-of-ocean-conservation': {
    title: 'The Importance of Ocean Conservation',
    excerpt: 'Discover why protecting our oceans is crucial for the future of our planet and how every purchase at Shenna\'s Studio contributes to marine preservation.',
    category: 'Conservation',
    date: '2024-01-15',
    readTime: '5 min read',
    keywords: 'ocean conservation, marine preservation, ocean protection, environmental conservation, marine ecosystem',
    content: [
      'Our oceans cover more than 70% of Earth\'s surface and are home to an estimated 50-80% of all life on our planet. Yet, these vital ecosystems face unprecedented threats from pollution, overfishing, climate change, and habitat destruction.',
      'At Shenna\'s Studio, we believe that every action counts. That\'s why we donate 10% of all proceeds to marine conservation organizations working tirelessly to protect our oceans.',
      'Ocean conservation isn\'t just about saving marine life—it\'s about preserving the life support system of our entire planet. Oceans produce at least 50% of the planet\'s oxygen, absorb about 30% of carbon dioxide produced by humans, and regulate our climate.',
      'When you purchase from Shenna\'s Studio, you\'re not just buying beautiful ocean-themed products—you\'re directly contributing to organizations that work on critical initiatives like coral reef restoration, sea turtle protection, and ocean cleanup efforts.',
      'Together, we can make a difference. Every purchase, every donation, and every action to reduce our environmental impact helps protect the oceans that give us life.'
    ]
  },
  'sea-turtle-conservation': {
    title: 'Sea Turtle Conservation: How We Help',
    excerpt: 'Learn about sea turtle populations, threats they face, and how our donations support organizations protecting these magnificent creatures.',
    category: 'Conservation',
    date: '2024-01-10',
    readTime: '7 min read',
    keywords: 'sea turtle conservation, marine turtle protection, endangered sea turtles, ocean wildlife',
    content: [
      'Sea turtles have roamed our oceans for over 100 million years, but today, nearly all species are endangered. These ancient mariners face numerous threats including plastic pollution, fishing nets, habitat loss, and climate change.',
      'Through our partnership with marine conservation organizations, a portion of every sale at Shenna\'s Studio goes directly toward sea turtle protection programs. These programs include beach monitoring, nest protection, rescue and rehabilitation, and public education.',
      'One of the most critical aspects of sea turtle conservation is protecting nesting beaches. Female sea turtles return to the same beaches where they were born to lay their eggs. Development, artificial lighting, and beach erosion threaten these vital nesting sites.',
      'The organizations we support work year-round to monitor nesting beaches, relocate vulnerable nests, and ensure hatchlings make it safely to the ocean. They also rescue injured turtles, provide medical treatment, and release them back into the wild.',
      'Your support makes a real difference. In the past year alone, our contributions have helped protect over 500 sea turtle nests and rescue more than 50 injured turtles. Thank you for being part of this important mission.'
    ]
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPostData[params.slug]

  if (!post) {
    return (
      <div className="min-h-screen bg-ocean-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-ocean-600 mb-8">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Shenna\'s Studio',
      url: 'https://shennastudio.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shenna\'s Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shennastudio.com/ShennasLogo.png'
      }
    },
    image: 'https://shennastudio.com/ShennasLogo.png',
    articleSection: post.category,
    keywords: post.keywords,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://shennastudio.com/blog/${params.slug}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="min-h-screen bg-ocean-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-ocean-600 hover:text-ocean-800 mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-semibold text-ocean-600 bg-ocean-100 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-ocean-500">{post.readTime}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ocean-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-ocean-600 text-sm">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2">•</span>
              <span>By Shenna's Studio</span>
            </div>
          </header>

          <div className="h-64 bg-ocean-200 rounded-2xl mb-10 flex items-center justify-center text-ocean-400 text-8xl">
            🌊
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="prose prose-lg prose-ocean max-w-none">
              {post.content.map((paragraph, index) => (
                <p key={index} className="text-ocean-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-ocean-200">
              <div className="bg-gradient-to-br from-ocean-50 to-seafoam-50 rounded-2xl p-8">
                <h3 className="text-2xl font-display font-bold text-ocean-900 mb-4">
                  Support Ocean Conservation
                </h3>
                <p className="text-ocean-700 mb-6">
                  Every purchase at Shenna's Studio contributes 10% to marine conservation efforts. Browse our collection of ocean-themed products and make a difference today.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors font-semibold"
                >
                  Shop Ocean Products
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-display font-bold text-ocean-900 mb-6">
              Related Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/blog"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h4 className="text-lg font-bold text-ocean-900 mb-2">
                  More Ocean Conservation Stories
                </h4>
                <p className="text-ocean-600 text-sm">
                  Explore our blog for more insights on marine life and conservation
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(blogPostData).map((slug) => ({
    slug
  }))
}
