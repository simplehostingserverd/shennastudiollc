#!/bin/sh
echo "🌊 Starting Shenna Studio Backend..."
echo "🔧 Startup Mode: ${STARTUP_MODE:-full}"

# Set default Redis URL if not provided
if [ -z "$REDIS_URL" ]; then
  echo "⚠️  REDIS_URL not set, using fake redis"
else
  echo "✅ Using Redis: $REDIS_URL"
fi

# Wait for database to be ready with timeout
echo "⏳ Waiting for database connection..."
# Extract host and port from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\([^:/]*\):.*/\1/p")
DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*:\([0-9]*\)\/.*/\1/p")
DB_PORT=${DB_PORT:-5432}
if [ -n "$DB_HOST" ]; then
  echo "Checking connection to $DB_HOST:$DB_PORT..."
  TIMEOUT=60
  COUNTER=0
  until nc -z $DB_HOST $DB_PORT || [ $COUNTER -eq $TIMEOUT ]; do
    echo "Waiting for database... ($COUNTER/$TIMEOUT)"
    sleep 3
    COUNTER=$((COUNTER + 3))
  done
  
  if [ $COUNTER -lt $TIMEOUT ]; then
    echo "✅ Database connection established"
  else
    echo "❌ Database connection timeout after ${TIMEOUT}s, continuing anyway..."
  fi
else
  echo "⚠️  Could not parse DATABASE_URL, skipping connection check"
fi

# Auto-migrate if enabled
if [ "$AUTO_MIGRATE" = "true" ]; then
  echo "🔄 Running database migrations..."
  if timeout 180 npx medusa db:migrate 2>/dev/null; then
    echo "✅ Database migrations completed successfully"
  else
    echo "❌ Database migrations failed or timed out, but continuing..."
    # Try to continue even if migrations fail
  fi
fi

# Auto-create admin if enabled
if [ "$AUTO_CREATE_ADMIN" = "true" ]; then
  echo "👤 Creating admin user..."
  if timeout 60 npm run create-admin 2>/dev/null; then
    echo "✅ Admin user created successfully"
  else
    echo "⚠️  Admin user creation failed or timed out, but continuing..."
    echo "   You can create admin manually later with: npm run create-admin"
  fi
fi

# Auto-seed if enabled (skip on errors to allow server to start)
if [ "$AUTO_SEED" = "true" ]; then
  echo "🌱 Seeding database with sample data..."
  if timeout 120 npm run seed 2>/dev/null; then
    echo "✅ Database seeding completed"
  else
    echo "⚠️  Database seeding failed or timed out, but continuing to allow server startup..."
  fi
fi

# Skip build - already done at Docker build time
echo "⏭️  Skipping build (already completed at Docker build time)"

echo "🚀 Starting Medusa server..."
echo "Server will bind to 0.0.0.0:9000 (includes admin at /app)"
echo "Build output located in .medusa/server directory"
export HOST=0.0.0.0
export PORT=9000

# Start the server from the built location
cd /app/.medusa/server
exec node index.js