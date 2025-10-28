import type { Metadata } from 'next'
import Script from 'next/script'
import PlausibleProvider from 'next-plausible'
import { CartProvider } from '@/app/context/CartContext'
import Navbar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import GoogleAnalytics from '@/app/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title:
    "Shenna's Studio - Premium Ocean-Inspired Products & Marine Conservation",
  description:
    'Discover exquisite ocean-themed treasures that celebrate marine life while supporting ocean conservation. Family-owned business donating 10% to marine preservation. Shop sea turtle mugs, coral jewelry, nautical decor & more.',
  keywords: [
    'ocean products',
    'marine life gifts',
    'sea turtle accessories',
    'coral jewelry',
    'nautical home decor',
    'ocean conservation',
    'marine preservation',
    'eco-friendly gifts',
    'handcrafted ocean art',
    'beach lifestyle',
    'sustainable products',
    'family business',
    'ocean charity donations',
  ].join(', '),
  authors: [{ name: "Shenna's Studio" }],
  creator: "Shenna's Studio",
  publisher: "Shenna's Studio",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/ShennasLogo.png',
  },
  metadataBase: new URL('https://shennastudio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Shenna's Studio - Premium Ocean-Inspired Products",
    description:
      'Exquisite ocean-themed treasures supporting marine conservation. 10% of proceeds donated to ocean preservation.',
    url: 'https://shennastudio.com',
    siteName: "Shenna's Studio",
    images: [
      {
        url: '/ShennasLogo.png',
        width: 1200,
        height: 630,
        alt: "Shenna's Studio - Ocean Conservation & Marine Life Products",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shenna's Studio - Ocean-Inspired Products",
    description:
      'Beautiful ocean treasures supporting marine conservation. Shop now and help save our oceans.',
    images: ['/ShennasLogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enhanced JSON-LD schemas for comprehensive SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Shenna's Studio",
    description:
      'Premium ocean-inspired products supporting marine conservation',
    url: 'https://shennastudio.com',
    logo: 'https://shennastudio.com/ShennasLogo.png',
    image: 'https://shennastudio.com/ShennasLogo.png',
    telephone: '+1-956-XXX-XXXX',
    email: 'contact@shennastudio.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2436 Pablo Kisel Boulevard',
      addressLocality: 'Brownsville',
      addressRegion: 'TX',
      postalCode: '78526',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@shennastudio.com',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://www.facebook.com/shennastudio',
      'https://www.instagram.com/shennastudio',
    ],
    foundingDate: '2024',
    founder: [
      {
        '@type': 'Person',
        name: 'Shenna',
        jobTitle: 'Creative Founder',
      },
      {
        '@type': 'Person',
        name: 'Michael',
        jobTitle: 'Technical Co-Founder',
        affiliation: {
          '@type': 'Organization',
          name: 'SoftwarePros Inc',
          url: 'https://www.softwarepros.org/',
        },
      },
    ],
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: "Shenna's Studio",
    description:
      'Family-owned business offering ocean-inspired products with 10% of proceeds donated to marine conservation',
    url: 'https://shennastudio.com',
    logo: 'https://shennastudio.com/ShennasLogo.png',
    image: 'https://shennastudio.com/ShennasLogo.png',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2436 Pablo Kisel Boulevard',
      addressLocality: 'Brownsville',
      addressRegion: 'TX',
      postalCode: '78526',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.9017',
      longitude: '-97.4975',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    paymentAccepted: 'Credit Card, Debit Card, Visa, Mastercard, Stripe',
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Shenna's Studio",
    url: 'https://shennastudio.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://shennastudio.com/products?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <PlausibleProvider domain="www.shennastudio.com">
          {typeof process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== 'undefined' && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
          )}
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
          <Script
            src="https://app.rybbit.io/api/script.js"
            data-site-id="a56da861ea4f"
            strategy="afterInteractive"
          />
        </PlausibleProvider>
      </body>
    </html>
  )
}
