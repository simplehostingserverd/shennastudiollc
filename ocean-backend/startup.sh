#!/bin/sh
echo "🌊 Starting Shenna Studio Backend..."

# Set default Redis URL if not provided
if [ -z "$REDIS_URL" ]; then
  echo "⚠️  REDIS_URL not set, using fake redis"
else
  echo "✅ Using Redis: $REDIS_URL"
fi

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
# Extract host and port from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\([^:]*\):.*/\1/p")
DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*:\([0-9]*\)\/.*/\1/p")
DB_PORT=${DB_PORT:-5432}
if [ -n "$DB_HOST" ]; then
  echo "Checking connection to $DB_HOST:$DB_PORT..."
  until nc -z $DB_HOST $DB_PORT; do
    echo "Waiting for database..."
    sleep 3
  done
  echo "✅ Database connection established"
else
  echo "⚠️  Could not parse DATABASE_URL, skipping connection check"
fi

# Auto-migrate if enabled
if [ "$AUTO_MIGRATE" = "true" ]; then
  echo "🔄 Running database migrations..."
  if npx medusa db:migrate; then
    echo "✅ Database migrations completed successfully"
  else
    echo "❌ Database migrations failed, but continuing..."
  fi
fi

# Auto-create admin if enabled
if [ "$AUTO_CREATE_ADMIN" = "true" ]; then
  echo "👤 Creating admin user..."
  if npm run create-admin; then
    echo "✅ Admin user setup completed"
  else
    echo "⚠️  Admin user creation failed or user already exists"
  fi
fi

# Auto-seed if enabled
if [ "$AUTO_SEED" = "true" ]; then
  echo "🌱 Seeding database with sample data..."
  if npm run seed; then
    echo "✅ Database seeding completed"
  else
    echo "⚠️  Database seeding failed, but continuing..."
  fi
fi

echo "🚀 Starting Medusa server..."
exec npm start