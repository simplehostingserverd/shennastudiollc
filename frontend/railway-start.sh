#!/bin/bash

# Railway Production Start Script for Next.js Standalone
# This script ensures the standalone build starts correctly on Railway

set -e

echo "🚀 Starting Shenna's Studio Frontend..."
echo "================================================"
echo ""

# Check if we have a standalone build
if [ -d ".next/standalone" ]; then
    echo "✅ Found standalone build"
    
    # Ensure static files are in place
    if [ ! -d ".next/standalone/.next/static" ]; then
        echo "⚠️  Static files not found in standalone, copying..."
        mkdir -p .next/standalone/.next
        cp -r .next/static .next/standalone/.next/static 2>/dev/null || echo "No .next/static to copy"
    fi
    
    if [ ! -d ".next/standalone/public" ]; then
        echo "⚠️  Public files not found in standalone, copying..."
        cp -r public .next/standalone/public 2>/dev/null || echo "No public to copy"
    fi
    
    # Change to standalone directory
    cd .next/standalone
    SERVER_PATH="server.js"
    echo "✅ Running from standalone directory"
elif [ -f "server.js" ]; then
    SERVER_PATH="server.js"
    echo "✅ Found server.js in root"
else
    echo "❌ ERROR: No valid Next.js build found!"
    echo "   Searched:"
    echo "   - ./.next/standalone/server.js"
    echo "   - ./server.js"
    echo ""
    echo "   Current directory contents:"
    ls -la
    echo ""
    echo "   .next directory contents:"
    ls -la .next/ 2>/dev/null || echo "   .next directory doesn't exist!"
    exit 1
fi

echo ""
echo "🌐 Environment:"
echo "   NODE_ENV: ${NODE_ENV:-development}"
echo "   PORT: ${PORT:-3000}"
echo "   Backend URL: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL:-not set}"
echo "   Current directory: $(pwd)"
echo ""

# Set default port if not specified
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-0.0.0.0}

echo "✨ Starting Next.js server on $HOSTNAME:$PORT..."
echo "   Using: $SERVER_PATH"
echo ""

# Verify static files exist
if [ -d ".next/static" ]; then
    echo "✅ Static files found at: .next/static"
else
    echo "⚠️  WARNING: .next/static directory not found!"
fi

if [ -d "public" ]; then
    echo "✅ Public files found at: public"
else
    echo "⚠️  WARNING: public directory not found!"
fi

echo ""

# Start the server
exec node "$SERVER_PATH"
