#!/bin/bash

# Railway Production Startup Script
# Starts both frontend and backend services

set -e

echo "🚂 Starting Shenna's Studio on Railway..."
echo "📁 Working directory: $(pwd)"
echo "📦 Node version: $(node --version)"

# Check if backend build exists
if [ ! -d "ocean-backend/.medusa" ]; then
  echo "⚠️  Backend build not found, building now..."
  cd ocean-backend
  npx medusa build
  cd ..
fi

# Run migrations if AUTO_MIGRATE is true
if [ "$AUTO_MIGRATE" = "true" ]; then
  echo "🔄 Running database migrations..."
  cd ocean-backend
  npx medusa db:migrate || echo "⚠️  Migrations failed or already applied"
  cd ..
fi

# Create admin if AUTO_CREATE_ADMIN is true
if [ "$AUTO_CREATE_ADMIN" = "true" ]; then
  echo "👤 Creating admin user..."
  cd ocean-backend
  npm run create-admin || echo "⚠️  Admin creation failed or already exists"
  cd ..
fi

# Start backend in the background
echo "🔧 Starting Medusa backend on port $BACKEND_PORT..."
cd ocean-backend
npx medusa start &
BACKEND_PID=$!
cd ..

# Give backend time to start
echo "⏳ Waiting for backend to initialize..."
sleep 10

# Start frontend
echo "🎨 Starting Next.js frontend on port $PORT..."
npm start &
FRONTEND_PID=$!

# Wait for both processes
echo "✅ Both services started!"
echo "   Backend PID: $BACKEND_PID (port $BACKEND_PORT)"
echo "   Frontend PID: $FRONTEND_PID (port $PORT)"
echo "   Backend URL: http://localhost:$BACKEND_PORT"
echo "   Frontend URL: http://localhost:$PORT"

# Keep the script running and monitor processes
wait -n

# If either process exits, kill the other and exit
echo "⚠️  One process exited, stopping all services..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
exit $?
