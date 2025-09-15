/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'shennastudio.com', 'www.shennastudio.com'],
    unoptimized: true, // For static assets in production
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  serverExternalPackages: ['@medusajs/js-sdk'],
  // Ensure static assets are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;