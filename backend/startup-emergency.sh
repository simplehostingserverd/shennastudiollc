#!/bin/sh
set -e
echo "🆘 Emergency Startup Mode - Minimal Configuration"

# Check environment
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is required"
  exit 1
fi

echo "✅ Starting with minimal configuration..."
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
echo "NODE_ENV: ${NODE_ENV:-development}"

# Disable Redis temporarily
export REDIS_URL=""
export DISABLE_REDIS=true

# Disable admin completely
export ADMIN_DISABLED=true

# Build with minimal config
echo "🔨 Building Medusa (minimal)..."
if npm run build; then
  echo "✅ Build completed"
else
  echo "⚠️ Build failed, trying to start anyway..."
fi

# Start with minimal configuration
echo "🚀 Starting Medusa API only..."
export HOST=0.0.0.0
export PORT=9000

# Start the server
exec npm start