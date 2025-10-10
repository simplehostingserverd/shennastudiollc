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
echo "🧹 Cleaning Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""
echo "================================================"
