import { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http'

// Simple in-memory cache (upgrade to Redis for production/distributed systems)
const cache = new Map<string, { data: unknown; expiresAt: number }>()

interface CacheOptions {
  ttl?: number // Time to live in seconds
  keyGenerator?: (req: MedusaRequest) => string // Custom cache key generator
}

export function createCacheMiddleware(options: CacheOptions = {}) {
  const {
    ttl = 300, // 5 minutes default
    keyGenerator = (req) => `${req.method}:${req.url}`,
  } = options

  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    const cacheKey = keyGenerator(req)
    const now = Date.now()

    // Check if cached data exists and is not expired
    const cached = cache.get(cacheKey)
    if (cached && now < cached.expiresAt) {
      // Return cached data
      res.setHeader('X-Cache', 'HIT')
      res.setHeader('X-Cache-Expires', new Date(cached.expiresAt).toISOString())
      return res.json(cached.data)
    }

    // Mark as cache miss
    res.setHeader('X-Cache', 'MISS')

    // Store original json method
    const originalJson = res.json.bind(res)

    // Override json method to cache the response
    res.json = function (data: unknown) {
      // Cache the response
      cache.set(cacheKey, {
        data,
        expiresAt: now + ttl * 1000,
      })

      // Send the response
      return originalJson(data)
    }

    next()
  }
}

// Clean up expired cache entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key)
    }
  }
}, 5 * 60 * 1000)

// Export method to clear cache (useful for debugging or manual cache invalidation)
export function clearCache(pattern?: RegExp) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (pattern.test(key)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}

// Predefined cache configurations for different use cases

// Short cache for frequently changing data (1 minute)
export const shortCache = createCacheMiddleware({ ttl: 60 })

// Standard cache for moderate data (5 minutes)
export const standardCache = createCacheMiddleware({ ttl: 300 })

// Long cache for static data (1 hour)
export const longCache = createCacheMiddleware({ ttl: 3600 })

// Product list cache with custom key (includes query params)
export const productCache = createCacheMiddleware({
  ttl: 600, // 10 minutes
  keyGenerator: (req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const params = url.searchParams
    // Include important query params in cache key
    const limit = params.get('limit') || '50'
    const offset = params.get('offset') || '0'
    const collection_id = params.get('collection_id') || 'all'
    return `products:${collection_id}:${limit}:${offset}`
  },
})
