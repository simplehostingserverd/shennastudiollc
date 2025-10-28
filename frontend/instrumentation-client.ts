import posthog from 'posthog-js'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We handle pageviews manually
    capture_pageleave: true,
    autocapture: true,
  })
}

export default posthog
