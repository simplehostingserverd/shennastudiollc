#!/bin/bash

# Railway Production Start Script for Next.js Standalone
# This script ensures the standalone build starts correctly on Railway

set -e

echo "🚀 Starting Shenna's Studio Frontend..."
echo "================================================"
echo ""

# Check multiple possible locations for server.js
if [ -f "server.js" ]; then
    SERVER_PATH="server.js"
    echo "✅ Found server.js in root"
elif [ -f ".next/standalone/server.js" ]; then
    SERVER_PATH=".next/standalone/server.js"
    echo "✅ Found server.js in .next/standalone"
else
    echo "❌ ERROR: server.js not found!"
    echo "   Searched:"
    echo "   - ./server.js"
    echo "   - ./.next/standalone/server.js"
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
echo ""

# Set default port if not specified
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-0.0.0.0}

echo "✨ Starting Next.js server on $HOSTNAME:$PORT..."
echo "   Using: $SERVER_PATH"
echo ""

# Start the server
exec node "$SERVER_PATH"
