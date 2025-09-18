/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
}

export default nextConfig
