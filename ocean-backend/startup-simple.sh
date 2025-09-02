#!/bin/sh
echo "🌊 Starting Shenna Studio Backend (Simple Mode)..."

# Basic environment check
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is required"
  exit 1
fi

echo "✅ Environment variables loaded"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..." # Show first 20 chars only for security
echo "NODE_ENV: ${NODE_ENV:-development}"
echo "STORE_CORS: ${STORE_CORS:-not set}"
echo "ADMIN_CORS: ${ADMIN_CORS:-not set}"
echo "AUTH_CORS: ${AUTH_CORS:-not set}"

# Start server directly without complex initialization
echo "🚀 Starting Medusa server..."
echo "Server will bind to 0.0.0.0:9000 and 0.0.0.0:7001"
export HOST=0.0.0.0
export PORT=9000
export ADMIN_PORT=7001
exec npm start