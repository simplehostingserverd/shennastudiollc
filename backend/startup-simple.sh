#!/bin/sh
set -e  # Exit on any error
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

# Check if we can connect to database
echo "🔍 Testing database connectivity..."
DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\([^:]*\):.*/\1/p")
DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*:\([0-9]*\)\/.*/\1/p")
DB_PORT=${DB_PORT:-5432}

if [ -n "$DB_HOST" ]; then
  echo "Testing connection to $DB_HOST:$DB_PORT..."
  if nc -z $DB_HOST $DB_PORT; then
    echo "✅ Database is reachable"
  else
    echo "⚠️  Database not reachable, but continuing..."
  fi
fi

# Check Node.js and npm
echo "🔍 Checking Node.js environment..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Files in /app: $(ls -la /app | head -10)"

# Build app at runtime (when env vars are available)
echo "🔨 Building Medusa application..."
if npm run build; then
  echo "✅ Build completed successfully"
else
  echo "⚠️  Build failed, but continuing to start server..."
fi

# Start server directly without complex initialization
echo "🚀 Starting Medusa server..."
echo "Server will bind to 0.0.0.0:9000 (admin at /app path)"
export HOST=0.0.0.0
export PORT=9000

echo "📋 Final environment check before starting:"
echo "HOST: $HOST"
echo "PORT: $PORT"

echo "🎬 Executing: npm start"
exec npm start