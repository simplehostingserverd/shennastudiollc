#!/bin/sh
echo "🌊 Starting Shenna Studio Backend..."
echo "🔧 Startup Mode: ${STARTUP_MODE:-full}"
echo "📍 Current directory: $(pwd)"
echo "📂 Directory contents:"
ls -la

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
  if timeout 180 npx medusa db:migrate 2>&1; then
    echo "✅ Database migrations completed successfully"
  else
    EXIT_CODE=$?
    echo "⚠️  Database migrations failed with exit code $EXIT_CODE, but continuing..."
    # Try to continue even if migrations fail
  fi
fi

# Auto-create admin if enabled
if [ "$AUTO_CREATE_ADMIN" = "true" ]; then
  echo "👤 Creating admin user..."
  # Use timeout with || true to ensure we never fail here
  timeout 60 npm run create-admin 2>&1 || {
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 0 ]; then
      echo "✅ Admin user created/verified successfully"
    else
      echo "⚠️  Admin user creation exited with code $EXIT_CODE, but continuing..."
      echo "   You can create admin manually later with: npm run create-admin"
    fi
  }
fi

# Auto-seed if enabled (skip on errors to allow server to start)
if [ "$AUTO_SEED" = "true" ]; then
  echo "🌱 Seeding database with sample data..."
  if timeout 120 npm run seed 2>&1; then
    echo "✅ Database seeding completed"
  else
    EXIT_CODE=$?
    echo "⚠️  Database seeding failed with exit code $EXIT_CODE, but continuing..."
  fi
fi

# Check if build exists, if not rebuild
if [ ! -f ".medusa/client/index.html" ]; then
  echo "⚠️  Admin build not found, running build now..."
  echo "🔨 Building Medusa (this may take a few minutes)..."
  export DISABLE_ADMIN=false
  if timeout 300 npm run build 2>&1; then
    echo "✅ Build completed successfully"
  else
    echo "❌ Build failed or timed out"
    exit 1
  fi
else
  echo "✅ Build files found, skipping build"
fi

echo "🚀 Starting Medusa server..."
echo "Server will bind to 0.0.0.0:9000 (includes admin at /app)"
echo "Build output located in .medusa/server directory"

# Verify build exists before starting
if [ ! -d ".medusa/server" ]; then
  echo "❌ ERROR: .medusa/server directory not found!"
  echo "Directory contents:"
  ls -la .medusa/ || echo "No .medusa directory"
  exit 1
fi

export HOST=0.0.0.0
export PORT=9000

# Show environment info for debugging
echo "🔍 Environment check:"
echo "  NODE_ENV: $NODE_ENV"
echo "  HOST: $HOST"
echo "  PORT: $PORT"
echo "  DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "  REDIS_URL: $REDIS_URL"

# Verify npm start script exists
echo "📝 Package.json scripts:"
grep -A5 '"scripts"' package.json || echo "Could not read package.json scripts"

# Start the server using medusa start command (runs the built server)
echo "📦 Starting server from $(pwd)"
echo "🚀 Executing: npm start"
exec npm start