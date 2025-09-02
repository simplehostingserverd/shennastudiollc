#!/bin/sh
echo "🌊 Starting Shenna Studio Backend (Simple Mode)..."

# Basic environment check
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is required"
  exit 1
fi

echo "✅ Environment variables loaded"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..." # Show first 20 chars only for security

# Start server directly without complex initialization
echo "🚀 Starting Medusa server..."
exec npm start