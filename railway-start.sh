#!/bin/bash

# Railway Production Startup Script
# Starts both frontend and backend services

set -e

echo "🚂 Starting Shenna's Studio on Railway..."

# Start backend in the background
echo "🔧 Starting Medusa backend..."
cd ocean-backend
npm start &
BACKEND_PID=$!
cd ..

# Give backend a moment to start
sleep 5

# Start frontend
echo "🎨 Starting Next.js frontend..."
npm start &
FRONTEND_PID=$!

# Wait for both processes
echo "✅ Both services started!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"

# Keep the script running and monitor processes
wait -n

# If either process exits, kill the other and exit
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
exit $?
