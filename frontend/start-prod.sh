#!/bin/bash
set -e  # Exit on error

echo "🌊 Starting Shenna's Studio Production Environment"

# Set production environment
export NODE_ENV=production
export HOSTNAME=0.0.0.0
# Use PORT from environment or default to 3000
export PORT=${PORT:-3000}

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down services..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    wait
    exit 0
}

# Trap signals for graceful shutdown
trap shutdown SIGTERM SIGINT EXIT

# Start backend in background with proper environment
echo "🚀 Starting Medusa backend with environment variables..."
echo "  Redis URL: ${REDIS_URL:0:20}..."
echo "  JWT Secret: ${JWT_SECRET:0:10}..."
echo "  Database URL: ${DATABASE_URL:0:30}..."
cd /app/ocean-backend && /app/ocean-backend/startup.sh &
BACKEND_PID=$!

# Wait for backend to be ready (health check)
echo "⏳ Waiting for backend to be ready..."
BACKEND_READY=false
TIMEOUT=180
COUNTER=0
while [ $COUNTER -lt $TIMEOUT ]; do
    if curl -f http://localhost:9000/health >/dev/null 2>&1; then
        echo "✅ Backend is ready!"
        BACKEND_READY=true
        break
    fi
    echo "Waiting for backend... ($COUNTER/$TIMEOUT)"
    sleep 5
    COUNTER=$((COUNTER + 5))
done

if [ "$BACKEND_READY" = "false" ]; then
    echo "❌ Backend failed to start within ${TIMEOUT}s"
    exit 1
fi

# Now build frontend with backend available
cd /app
echo "🔨 Building Next.js frontend with production environment variables..."
echo "  Backend URL: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL}"
if ! npm run build; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Verify standalone build exists
if [ ! -f "/app/.next/standalone/server.js" ]; then
    echo "❌ Standalone build not found at /app/.next/standalone/server.js"
    echo "This usually means the build failed or standalone output is not configured."
    exit 1
fi

# Copy static assets to standalone build
echo "📦 Copying static assets..."
mkdir -p /app/.next/standalone/.next/static
mkdir -p /app/.next/standalone/public
cp -r /app/.next/static /app/.next/standalone/.next/ 2>/dev/null || echo "⚠️  No static assets to copy"
cp -r /app/public /app/.next/standalone/ 2>/dev/null || echo "⚠️  No public assets to copy"

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd /app/.next/standalone
node server.js &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
FRONTEND_READY=false
TIMEOUT=120
COUNTER=0
while [ $COUNTER -lt $TIMEOUT ]; do
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        FRONTEND_READY=true
        break
    fi
    echo "Waiting for frontend... ($COUNTER/$TIMEOUT)"
    sleep 5
    COUNTER=$((COUNTER + 5))
done

if [ "$FRONTEND_READY" = "false" ]; then
    echo "⚠️  Frontend did not respond within ${TIMEOUT}s, but continuing..."
fi

echo "✅ All services started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:9000"
echo "👤 Admin Panel: http://localhost:9000/app"

# Keep script running and monitor processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend process died"
        exit 1
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend process died"
        exit 1
    fi
    sleep 10
done
