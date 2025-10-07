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
    domains: [
      'localhost',
      'res.cloudinary.com',
      'shennastudio.com',
      'www.shennastudio.com',
      'api.shennastudio.com',
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
  // Ensure static files are properly handled in production (moved out of experimental)
  outputFileTracingIncludes: {
    '/': ['./public/**/*', './app/globals.css'],
  },

  // CORS and Security Headers Configuration
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: '/:path*',
        headers: [
          // CORS Headers - Allow backend API access
          {
            key: 'Access-Control-Allow-Origin',
            value:
              process.env.NODE_ENV === 'production'
                ? 'https://api.shennastudio.com'
                : '*',
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
        // Additional headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value:
              process.env.NODE_ENV === 'production'
                ? 'https://api.shennastudio.com'
                : '*',
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
