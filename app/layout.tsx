import type { Metadata } from 'next'
import { CartProvider } from '@/app/context/CartContext'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: "Shenna's Studio",
              description:
                'Premium ocean-inspired products supporting marine conservation',
              url: 'https://shennastudio.com',
              logo: 'https://shennastudio.com/ShennasLogo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'contact@shennastudio.com',
              },
              sameAs: [
                'https://www.facebook.com/shennastudio',
                'https://www.instagram.com/shennastudio',
              ],
              foundingDate: '2024',
              founder: {
                '@type': 'Person',
                name: 'Shenna',
              },
              makesOffer: {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  category:
                    'Ocean-inspired products, Marine life accessories, Nautical home decor',
                },
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
