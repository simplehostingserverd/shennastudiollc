import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ocean Conservation Blog | Marine Life Education | Shenna\'s Studio',
  description: 'Explore ocean conservation, marine life education, product care guides, and behind-the-scenes stories from Shenna\'s Studio. Learn about protecting our oceans.',
  keywords: 'ocean conservation blog, marine life education, ocean protection, sea turtle conservation, coral reef preservation, ocean cleanup, marine biology',
  openGraph: {
    title: 'Ocean Conservation & Marine Life Blog',
    description: 'Educational content about ocean conservation and marine life from Shenna\'s Studio.',
    url: 'https://shennastudio.com/blog',
    type: 'website'
  },
  alternates: {
    canonical: '/blog'
  }
}

const blogPosts = [
  {
    id: 1,
    title: 'The Importance of Ocean Conservation',
    slug: 'importance-of-ocean-conservation',
    excerpt: 'Discover why protecting our oceans is crucial for the future of our planet and how every purchase at Shenna\'s Studio contributes to marine preservation.',
    category: 'Conservation',
    date: '2024-01-15',
    image: '/ocean-conservation.jpg',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Sea Turtle Conservation: How We Help',
    slug: 'sea-turtle-conservation',
    excerpt: 'Learn about sea turtle populations, threats they face, and how our donations support organizations protecting these magnificent creatures.',
    category: 'Conservation',
    date: '2024-01-10',
    image: '/sea-turtle.jpg',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'Caring for Your Ocean-Themed Jewelry',
    slug: 'caring-for-ocean-jewelry',
    excerpt: 'Expert tips on maintaining the beauty and longevity of your ocean-inspired jewelry pieces, from cleaning to storage.',
    category: 'Product Care',
    date: '2024-01-05',
    image: '/jewelry-care.jpg',
    readTime: '4 min read'
  },
  {
    id: 4,
    title: 'Behind the Scenes: How We Source Our Products',
    slug: 'behind-the-scenes-sourcing',
    excerpt: 'Take a peek into our sourcing process and learn how we ensure every product meets our standards for quality and sustainability.',
    category: 'Behind the Scenes',
    date: '2023-12-28',
    image: '/sourcing.jpg',
    readTime: '6 min read'
  },
  {
    id: 5,
    title: 'Coral Reefs: The Rainforests of the Sea',
    slug: 'coral-reefs-rainforests-of-sea',
    excerpt: 'Explore the fascinating world of coral reefs, their importance to marine ecosystems, and conservation efforts we support.',
    category: 'Marine Life',
    date: '2023-12-20',
    image: '/coral-reef.jpg',
    readTime: '8 min read'
  },
  {
    id: 6,
    title: 'Ocean-Friendly Gift Ideas for Every Occasion',
    slug: 'ocean-friendly-gift-ideas',
    excerpt: 'Find the perfect ocean-themed gifts that celebrate marine life while supporting conservation efforts.',
    category: 'Gift Guide',
    date: '2023-12-15',
    image: '/gift-guide.jpg',
    readTime: '5 min read'
  }
]

const categories = ['All', 'Conservation', 'Product Care', 'Behind the Scenes', 'Marine Life', 'Gift Guide']

export default function BlogPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Shenna\'s Studio Ocean Conservation Blog',
    description: 'Educational content about ocean conservation, marine life, and sustainable living',
    url: 'https://shennastudio.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Shenna\'s Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shennastudio.com/ShennasLogo.png'
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="min-h-screen bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ocean-900 mb-4">
              Ocean Conservation Blog
            </h1>
            <p className="text-xl text-ocean-600 max-w-3xl mx-auto">
              Explore stories about ocean conservation, marine life, product care tips, and behind-the-scenes looks at our mission to protect our oceans.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-white text-ocean-700 rounded-full border border-ocean-200 hover:bg-ocean-100 transition-colors font-medium text-sm"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-ocean-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-ocean-400 text-6xl">
                    🌊
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-ocean-600 bg-ocean-100 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-ocean-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-ocean-900 mb-3 hover:text-ocean-700 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-ocean-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ocean-500">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-ocean-600 hover:text-ocean-800 font-semibold text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-ocean-500 to-seafoam-400 rounded-3xl p-10 text-white text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Get the latest ocean conservation news, product updates, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-ocean-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-ocean-600 rounded-lg font-semibold hover:bg-ocean-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
