import { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http'

// Simple in-memory rate limiter (use Redis for production/distributed systems)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs?: number // Time window in milliseconds
  max?: number // Max requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean
}

export function createRateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute default
    max = 120, // 120 requests per minute (Railway standard)
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
  } = options

  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    // Get client identifier (IP address or user ID)
    const identifier =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress ||
      'unknown'

    const key = `rate-limit:${identifier}`
    const now = Date.now()

    // Get or create rate limit record
    let record = requestCounts.get(key)

    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      record = {
        count: 0,
        resetTime: now + windowMs,
      }
      requestCounts.set(key, record)
    }

    // Increment request count
    record.count++

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max.toString())
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count).toString())
    res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString())

    // Check if limit exceeded
    if (record.count > max) {
      res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      })
      return
    }

    // Continue to next middleware if successful request or skip not enabled
    next()
  }
}

// Clean up old entries periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime + 60000) {
      // Remove if expired for more than 1 minute
      requestCounts.delete(key)
    }
  }
}, 10 * 60 * 1000)

// Stricter rate limit for expensive operations
export const strictRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests to this endpoint. Please slow down.',
})

// Standard rate limit for general API use
export const standardRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  message: 'Rate limit exceeded. Please try again in a moment.',
})

// Lenient rate limit for auth endpoints
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: 'Too many authentication attempts. Please try again later.',
})
