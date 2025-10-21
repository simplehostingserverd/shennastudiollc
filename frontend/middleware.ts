import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /scrapy/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
]

// Known good bots (allow these)
const ALLOWED_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /slackbot/i,
  /twitterbot/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /whatsapp/i,
]

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100 // 100 requests per minute per IP
const PRODUCTS_PAGE_LIMIT = 20 // Stricter limit for products page

// Suspicious patterns in URLs that scrapers often use
const SUSPICIOUS_PATTERNS = [
  /admin/i,
  /wp-admin/i,
  /phpmyadmin/i,
  /\.env/i,
  /\.git/i,
  /config/i,
  /backup/i,
]

function isAllowedBot(userAgent: string): boolean {
  return ALLOWED_BOTS.some((pattern) => pattern.test(userAgent))
}

function isSuspiciousBot(userAgent: string): boolean {
  if (isAllowedBot(userAgent)) return false
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent))
}

function checkRateLimit(
  ip: string,
  limit: number = MAX_REQUESTS_PER_WINDOW
): boolean {
  const now = Date.now()
  const clientData = rateLimit.get(ip)

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (clientData.count >= limit) {
    return false
  }

  clientData.count++
  return true
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of rateLimit.entries()) {
    if (now > data.resetTime) {
      rateLimit.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const pathname = request.nextUrl.pathname

  // Check for suspicious URL patterns
  if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(pathname))) {
    console.warn(`Blocked suspicious request: ${pathname} from ${ip}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Block suspicious bots
  if (isSuspiciousBot(userAgent)) {
    console.warn(`Blocked suspicious bot: ${userAgent} from ${ip}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Apply stricter rate limiting to products and API endpoints
  const limit = pathname.startsWith('/products')
    ? PRODUCTS_PAGE_LIMIT
    : pathname.startsWith('/api')
      ? 30
      : MAX_REQUESTS_PER_WINDOW

  // Check rate limit
  if (!checkRateLimit(ip, limit)) {
    console.warn(`Rate limit exceeded for ${ip} on ${pathname}`)
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': '0',
      },
    })
  }

  // Add security headers
  const response = NextResponse.next()

  // Add rate limit headers
  const clientData = rateLimit.get(ip)
  if (clientData) {
    response.headers.set(
      'X-RateLimit-Limit',
      limit.toString()
    )
    response.headers.set(
      'X-RateLimit-Remaining',
      Math.max(0, limit - clientData.count).toString()
    )
  }

  return response
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, videos, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|mp4|mov)).*)',
  ],
}
