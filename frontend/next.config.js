/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Disable linting and type checking during build (for faster deployments)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  allowedDevOrigins: ['10.0.3.10'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'shennastudio.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shennastudio.com',
      },
      {
        protocol: 'https',
        hostname: 'api.shennastudio.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true, // For static assets in production
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  serverExternalPackages: ['@medusajs/js-sdk'],
  // Configure static export behavior
  trailingSlash: false,
  // Disable asset optimization that can cause issues in containers
  generateEtags: false,
  // Ensure static files are properly handled in production
  outputFileTracingIncludes: {
    '/': ['./public/**/*', './app/globals.css'],
  },
  // Output file tracing root (moved out of experimental in Next.js 15)
  outputFileTracingRoot: process.cwd(),

  // CORS and Security Headers Configuration
  async headers() {
    return [
      {
        // Apply security headers to HTML pages only (exclude static assets)
        source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|mp4|mov|css|js)).*)',
        headers: [
          // CORS Headers - Allow backend API access
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-Requested-With, Content-Type, Authorization, X-Medusa-Access-Token',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          // Security Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Proper Content-Type headers for static JavaScript files
        source: '/_next/static/:path*.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Proper Content-Type headers for static CSS files
        source: '/_next/static/:path*.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Additional headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-Requested-With, Content-Type, Authorization, X-Medusa-Access-Token',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },

  // Rewrites for backend API proxy (optional - useful for development)
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

    return [
      {
        source: '/backend-api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
