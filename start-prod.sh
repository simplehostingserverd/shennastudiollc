#!/bin/bash
echo "🌊 Starting Shenna's Studio Production Environment"

# Set production environment
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export PORT=3000

# Start backend in background with proper environment
echo "🚀 Starting Medusa backend with environment variables..."
echo "  Redis URL: ${REDIS_URL:0:20}..."
echo "  JWT Secret: ${JWT_SECRET:0:10}..."
echo "  Database URL: ${DATABASE_URL:0:30}..."
cd /app/ocean-backend && exec /app/ocean-backend/startup.sh &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 5

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd /app
exec node .next/standalone/server.js &
FRONTEND_PID=$!

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait
    exit 0
}

# Trap signals for graceful shutdown
trap shutdown SIGTERM SIGINT

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