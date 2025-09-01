import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'shennastudio.com', 'www.shennastudio.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  serverExternalPackages: ['@medusajs/js-sdk'],
};

export default nextConfig;
