#!/bin/bash
set -e  # Exit on error

echo "🌊 Starting Shenna's Studio Frontend (Production)"

# Set production environment
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export PORT=${PORT:-3000}

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down frontend..."
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    wait
    exit 0
}

# Trap signals for graceful shutdown
trap shutdown SIGTERM SIGINT EXIT

# Wait for backend service to be ready (different container)
echo "⏳ Waiting for backend service to be ready..."
BACKEND_HOST=${BACKEND_HOST:-backend}
BACKEND_PORT=${BACKEND_PORT:-9000}
BACKEND_READY=false
TIMEOUT=180
COUNTER=0

while [ $COUNTER -lt $TIMEOUT ]; do
    if curl -f http://${BACKEND_HOST}:${BACKEND_PORT}/health >/dev/null 2>&1; then
        echo "✅ Backend service is ready at ${BACKEND_HOST}:${BACKEND_PORT}"
        BACKEND_READY=true
        break
    fi
    echo "Waiting for backend service... ($COUNTER/$TIMEOUT)"
    sleep 5
    COUNTER=$((COUNTER + 5))
done

if [ "$BACKEND_READY" = "false" ]; then
    echo "❌ Backend service failed to become ready within ${TIMEOUT}s"
    echo "⚠️  Attempting to continue anyway..."
fi

# Build frontend with environment variables
cd /app
echo "🔨 Building Next.js frontend with production environment variables..."
echo "  Backend URL: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL}"
echo "  Publishable Key: ${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:0:20}..."

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

echo "✅ Frontend build completed successfully"

# Copy static assets to standalone build
echo "📦 Copying static assets to standalone build..."
mkdir -p /app/.next/standalone/.next/static
mkdir -p /app/.next/standalone/public

if [ -d "/app/.next/static" ]; then
    cp -r /app/.next/static /app/.next/standalone/.next/
    echo "✅ Copied .next/static"
else
    echo "⚠️  No .next/static directory found"
fi

if [ -d "/app/public" ]; then
    cp -r /app/public /app/.next/standalone/
    echo "✅ Copied public assets"
else
    echo "⚠️  No public directory found"
fi

# Start frontend
echo "🎨 Starting Next.js frontend server..."
cd /app/.next/standalone

node server.js &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to respond..."
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
    echo "⚠️  Frontend did not respond within ${TIMEOUT}s"
    echo "   Checking if process is still running..."
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend process died"
        exit 1
    fi
    echo "   Process is running, continuing anyway..."
fi

echo "✅ Frontend started successfully!"
echo "🌐 Frontend listening on: http://0.0.0.0:3000"
echo "🔗 Connecting to backend: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL}"

# Keep script running and monitor process
while true; do
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend process died unexpectedly"
        exit 1
    fi
    sleep 10
done
