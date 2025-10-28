import { PostHog } from 'posthog-node'

export async function register() {
  // Server-side PostHog instrumentation
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 20,
      flushInterval: 10000,
    })

    // Graceful shutdown
    if (typeof process !== 'undefined') {
      const shutdownHandler = async () => {
        await posthogClient.shutdown()
      }

      process.on('SIGINT', shutdownHandler)
      process.on('SIGTERM', shutdownHandler)
    }

    console.log('PostHog server-side instrumentation loaded')
  }
}
