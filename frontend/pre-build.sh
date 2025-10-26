#!/bin/bash

echo "================================================"
echo "🔧 Pre-Build Environment Check"
echo "================================================"
echo ""
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo "NODE_ENV: $NODE_ENV"
echo ""
echo "🔑 Checking NEXT_PUBLIC Environment Variables:"
echo ""

if [ -n "$NEXT_PUBLIC_MEDUSA_BACKEND_URL" ]; then
    echo "✅ NEXT_PUBLIC_MEDUSA_BACKEND_URL: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL:0:50}..."
else
    echo "❌ NEXT_PUBLIC_MEDUSA_BACKEND_URL: NOT SET"
fi

if [ -n "$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" ]; then
    echo "✅ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: ${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:0:30}..."
else
    echo "❌ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: NOT SET"
    echo ""
    echo "⚠️  WARNING: Products will NOT load without publishable key!"
fi

echo ""
echo "🧹 Clearing build caches (keeping node_modules for faster builds)..."
echo "Removing .next directory..."
rm -rf .next
echo "Removing node_modules/.cache..."
rm -rf node_modules/.cache
echo "Removing .turbo cache..."
rm -rf .turbo
echo "✅ Build caches cleared (node_modules preserved)"
echo ""

echo "================================================"
echo "🗄️  Running Database Migrations"
echo "================================================"
echo ""

if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL is set"
    echo ""
    echo "📦 Generating Prisma Client..."
    npx prisma generate

    echo ""
    echo "🔄 Running database migrations..."
    npx prisma migrate deploy

    if [ $? -eq 0 ]; then
        echo "✅ Database migrations completed successfully!"
    else
        echo "⚠️  Warning: Database migration failed, but continuing build..."
    fi
else
    echo "⚠️  DATABASE_URL not set - skipping database migrations"
    echo "   Note: Blog and order features require database"
fi

echo ""
echo "================================================"
