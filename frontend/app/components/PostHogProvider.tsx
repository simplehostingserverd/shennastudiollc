'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import type PostHog from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [posthog, setPostHog] = useState<PostHog | null>(null)

  useEffect(() => {
    // Dynamically import PostHog client-side only
    const loadPostHog = async () => {
      if (typeof window !== 'undefined') {
        const posthogModule = await import('../../instrumentation-client')
        setPostHog(posthogModule.default)
      }
    }
    loadPostHog()
  }, [])

  if (!posthog) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackPageView = async () => {
      if (pathname && typeof window !== 'undefined') {
        const posthogModule = await import('../../instrumentation-client')
        const posthog = posthogModule.default

        let url = window.origin + pathname
        if (searchParams && searchParams.toString()) {
          url = url + `?${searchParams.toString()}`
        }
        posthog.capture('$pageview', {
          $current_url: url,
        })
      }
    }
    trackPageView()
  }, [pathname, searchParams])

  return null
}
