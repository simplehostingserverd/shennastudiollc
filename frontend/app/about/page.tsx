import Button from '@/app/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Shenna\'s Studio | Family-Owned Ocean Conservation Business',
  description: 'Learn about Shenna\'s Studio, a family-owned business creating ocean-inspired products with 10% of proceeds donated to marine conservation. Meet our founders and discover our mission.',
  keywords: 'about Shenna Studio, family business, ocean conservation, marine preservation, Brownsville Texas, ocean-themed business, eco-friendly company, sustainable business',
  openGraph: {
    title: 'About Shenna\'s Studio | Ocean Conservation & Family Values',
    description: 'Discover our family story and commitment to ocean conservation. 10% of proceeds support marine preservation.',
    url: 'https://shennastudio.com/about',
    type: 'website',
    images: [
      {
        url: '/ShennasLogo.png',
        width: 1200,
        height: 630,
        alt: 'Shenna\'s Studio - Family-Owned Ocean Business'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Shenna\'s Studio',
    description: 'Family-owned business supporting ocean conservation through beautiful products.',
    images: ['/ShennasLogo.png']
  },
  alternates: {
    canonical: '/about'
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ocean-50">
      {/* Hero Section */}
      <section className="relative py-20 ocean-gradient text-white overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          autoPlay
          loop
          playsInline
          controls={false}
          preload="metadata"
          poster="/ShennasLogo.png"
        >
          <source src="/IFEO3426.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-ocean-500 opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🌊</div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            About Shenna&apos;s Studio
          </h1>
          <p className="text-xl md:text-2xl text-ocean-100 max-w-3xl mx-auto leading-relaxed">
            A family business born from passion, crafted with love, and
            dedicated to bringing the beauty of the ocean into your everyday
            life.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-ocean-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-ocean-700 leading-relaxed">
                <p>
                  What started as a simple idea has blossomed into a thriving
                  family business that brings the wonder and beauty of ocean
                  life to homes across the world. Shenna&apos;s Studio was born
                  from a deep love for marine conservation and artisan
                  craftsmanship.
                </p>
                <p>
                  Our journey began when Shenna, inspired by countless hours
                  spent by the ocean, envisioned creating products that would
                  not only celebrate the beauty of marine life but also support
                  ocean conservation efforts. Every piece tells a story of the
                  sea.
                </p>
                <p>
                  Today, Shenna&apos;s Studio has grown into a full-fledged,
                  beautiful family-owned business that is prospering online,
                  reaching ocean lovers around the globe while maintaining our
                  commitment to quality, authenticity, and environmental
                  responsibility.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-ocean-100 rounded-2xl p-8 transform rotate-3 shadow-lg">
                <div className="text-6xl text-center mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-display font-bold text-ocean-900 text-center mb-4">
                  Family First
                </h3>
                <p className="text-ocean-700 text-center">
                  Every product is created with the same care and attention we
                  put into our own family treasures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-ocean-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ocean-900 mb-4">
              Meet Our Founders
            </h2>
            <p className="text-lg text-ocean-600 max-w-2xl mx-auto">
              The passionate duo behind Shenna&apos;s Studio, combining
              creativity with technical expertise to create something beautiful.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Shenna */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg card-hover text-center">
              <div className="w-24 h-24 bg-coral-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl text-white">S</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-2">
                Shenna
              </h3>
              <p className="text-coral-600 font-medium mb-4">
                Creative Founder &amp; Visionary
              </p>
              <p className="text-ocean-600 leading-relaxed mb-6">
                The creative heart behind Shenna&apos;s Studio. Shenna&apos;s
                passion for ocean conservation and artistic expression drives
                every design decision, ensuring each product captures the true
                essence of marine beauty.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <span className="text-ocean-600">🎨</span>
                </div>
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <span className="text-ocean-600">🌊</span>
                </div>
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <span className="text-ocean-600">💖</span>
                </div>
              </div>
            </div>

            {/* Michael */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg card-hover text-center">
              <div className="w-24 h-24 bg-ocean-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl text-white">M</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-2">
                Michael
              </h3>
              <p className="text-ocean-600 font-medium mb-4">
                Technical Co-Founder &amp; Owner of SoftwarePros Inc
              </p>
              <p className="text-ocean-600 leading-relaxed mb-6">
                A 20-year software architecture veteran who brings technical
                excellence to Shenna&apos;s Studio. As owner of SoftwarePros
                Inc, Michael&apos;s expertise ensures our online presence is as
                beautiful and reliable as our products.
              </p>
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <span className="text-ocean-600">💻</span>
                </div>
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <span className="text-ocean-600">🔧</span>
                </div>
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <span className="text-ocean-600">🚀</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Link
                  href="https://www.softwarepros.org/"
                  target="_blank"
                  className="text-ocean-600 hover:text-ocean-800 transition-colors font-medium"
                >
                  SoftwarePros Inc
                </Link>
                <span className="text-ocean-300 hidden sm:inline">•</span>
                <Link
                  href="https://www.linkedin.com/in/michael-t-538480375/"
                  target="_blank"
                  className="text-ocean-600 hover:text-ocean-800 transition-colors"
                >
                  LinkedIn
                </Link>
                <span className="text-ocean-300 hidden sm:inline">•</span>
                <Link
                  href="https://instagram.com/softwareprosdev"
                  target="_blank"
                  className="text-ocean-600 hover:text-ocean-800 transition-colors"
                >
                  @softwareprosdev
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ocean-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-ocean-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Shenna&apos;s
              Studio.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl text-white">🌊</span>
              </div>
              <h3 className="text-xl font-display font-bold text-ocean-900 mb-4">
                Ocean Conservation
              </h3>
              <p className="text-ocean-600">
                We donate 10% of all proceeds to marine conservation
                organizations, helping protect the oceans that inspire us.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-seafoam-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl text-white">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-display font-bold text-ocean-900 mb-4">
                Family Values
              </h3>
              <p className="text-ocean-600">
                As a family business, we treat every customer like family,
                ensuring personal attention and care in every interaction.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl text-white">✨</span>
              </div>
              <h3 className="text-xl font-display font-bold text-ocean-900 mb-4">
                Quality Craftsmanship
              </h3>
              <p className="text-ocean-600">
                Every product is carefully selected and crafted to meet our high
                standards of beauty, durability, and authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 ocean-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Visit Our Studio
          </h2>
          <p className="text-xl text-ocean-100 mb-8 max-w-2xl mx-auto">
            We&apos;d love to welcome you to our family! Come visit us in
            beautiful Brownsville, Texas.
          </p>

          <div className="bg-white bg-opacity-10 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="text-3xl mb-4">📍</div>
            <div className="text-lg space-y-2">
              <p className="font-semibold">Shenna&apos;s Studio</p>
              <p>2436 Pablo Kisel Boulevard</p>
              <p>Brownsville, Texas 78526</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="maroon" size="lg">
                Shop Our Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-ocean-600"
              >
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
