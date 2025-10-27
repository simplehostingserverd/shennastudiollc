#!/bin/bash

# Manual Railway Database Seeding Script
# Run this script on Railway to manually seed the blog posts
# Railway CLI: railway run bash railway-seed.sh

set -e

echo "🌱 Manual Blog Post Seeding Script"
echo "===================================="
echo ""

echo "📊 Running Prisma migrations..."
npx prisma migrate deploy

echo ""
echo "🌱 Seeding blog posts..."
npx tsx scripts/seed-blog-posts.ts

echo ""
echo "✅ Seeding complete!"
echo ""
echo "Blog posts have been added to your database."
echo "Visit your blog at: https://www.shennastudio.com/blog"
