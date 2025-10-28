import posthog from 'posthog-js'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    ui_host: 'https://us.posthog.com',
    defaults: '2025-05-24',
    person_profiles: 'identified_only',
    capture_pageview: false, // We handle pageviews manually
    capture_pageleave: true,
    autocapture: true,
    // Enhanced tracking options
    capture_performance: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-private]',
    },
    // Advanced features
    bootstrap: {
      featureFlags: {},
    },
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('PostHog loaded successfully')
      }
    },
  })
}

export default posthog
