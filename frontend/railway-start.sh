#!/bin/bash

# Railway Production Start Script for Next.js Standalone
# This script ensures the standalone build starts correctly on Railway

set -e

echo "🚀 Starting Shenna's Studio Frontend..."
echo "================================================"
echo ""

# Check if standalone build exists
if [ ! -f ".next/standalone/server.js" ]; then
    echo "❌ ERROR: Standalone build not found!"
    echo "   Expected: .next/standalone/server.js"
    echo ""
    echo "   This usually means the build didn't complete successfully."
    echo "   Check build logs for errors."
    echo ""
    ls -la .next/ 2>/dev/null || echo "   .next directory doesn't exist!"
    exit 1
fi

echo "✅ Standalone build found"
echo ""

# Copy public and static files if needed
if [ -d "public" ] && [ -d ".next/standalone" ]; then
    echo "📁 Copying public files to standalone..."
    cp -r public .next/standalone/ 2>/dev/null || true
fi

if [ -d ".next/static" ] && [ -d ".next/standalone/.next" ]; then
    echo "📁 Copying static files to standalone..."
    cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
fi

echo ""
echo "🌐 Environment:"
echo "   NODE_ENV: ${NODE_ENV:-development}"
echo "   PORT: ${PORT:-3000}"
echo "   Backend URL: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL:-not set}"
echo ""

# Set default port if not specified
export PORT=${PORT:-3000}

echo "✨ Starting Next.js server on port $PORT..."
echo ""

# Start the server
exec node .next/standalone/server.js
