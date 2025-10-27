'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!gaId) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    // Send pageview with gtag
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', gaId, {
        page_path: url,
      })
    }
  }, [pathname, searchParams, gaId])

  if (!gaId) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Client-side event tracking functions
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track blog post views
export const trackBlogView = (postSlug: string, postTitle: string) => {
  event({
    action: 'view_blog_post',
    category: 'Blog',
    label: `${postTitle} (${postSlug})`,
  })
}

// Track product views
export const trackProductView = (productId: string, productName: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'view_item', {
      currency: 'USD',
      value: 0,
      items: [{
        item_id: productId,
        item_name: productName,
      }]
    })
  }
}

// Track add to cart
export const trackAddToCart = (productId: string, productName: string, price: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
      }]
    })
  }
}

// Track purchases
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
      items: items,
    })
  }
}
