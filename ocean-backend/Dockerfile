FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for building)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies after build
RUN npm ci --only=production && npm cache clean --force

# Create startup script with auto-initialization
RUN echo '#!/bin/sh' > /app/startup.sh && \
    echo 'echo "🌊 Starting Shenna Studio Backend..."' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Set default Redis URL if not provided' >> /app/startup.sh && \
    echo 'if [ -z "$REDIS_URL" ]; then' >> /app/startup.sh && \
    echo '  echo "⚠️  REDIS_URL not set, using fake redis"' >> /app/startup.sh && \
    echo 'else' >> /app/startup.sh && \
    echo '  echo "✅ Using Redis: $REDIS_URL"' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Wait for database to be ready' >> /app/startup.sh && \
    echo 'echo "⏳ Waiting for database connection..."' >> /app/startup.sh && \
    echo '# Extract host and port from DATABASE_URL' >> /app/startup.sh && \
    echo 'DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\\([^:]*\\):.*/\\1/p")' >> /app/startup.sh && \
    echo 'DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*:\\([0-9]*\\)\/.*/\\1/p")' >> /app/startup.sh && \
    echo 'DB_PORT=${DB_PORT:-5432}' >> /app/startup.sh && \
    echo 'if [ -n "$DB_HOST" ]; then' >> /app/startup.sh && \
    echo '  echo "Checking connection to $DB_HOST:$DB_PORT..."' >> /app/startup.sh && \
    echo '  until nc -z $DB_HOST $DB_PORT; do' >> /app/startup.sh && \
    echo '    echo "Waiting for database..."' >> /app/startup.sh && \
    echo '    sleep 3' >> /app/startup.sh && \
    echo '  done' >> /app/startup.sh && \
    echo '  echo "✅ Database connection established"' >> /app/startup.sh && \
    echo 'else' >> /app/startup.sh && \
    echo '  echo "⚠️  Could not parse DATABASE_URL, skipping connection check"' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Auto-migrate if enabled' >> /app/startup.sh && \
    echo 'if [ "$AUTO_MIGRATE" = "true" ]; then' >> /app/startup.sh && \
    echo '  echo "🔄 Running database migrations..."' >> /app/startup.sh && \
    echo '  if npx medusa db:migrate; then' >> /app/startup.sh && \
    echo '    echo "✅ Database migrations completed successfully"' >> /app/startup.sh && \
    echo '  else' >> /app/startup.sh && \
    echo '    echo "❌ Database migrations failed, but continuing..."' >> /app/startup.sh && \
    echo '  fi' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Auto-create admin if enabled' >> /app/startup.sh && \
    echo 'if [ "$AUTO_CREATE_ADMIN" = "true" ]; then' >> /app/startup.sh && \
    echo '  echo "👤 Creating admin user..."' >> /app/startup.sh && \
    echo '  if npm run create-admin; then' >> /app/startup.sh && \
    echo '    echo "✅ Admin user setup completed"' >> /app/startup.sh && \
    echo '  else' >> /app/startup.sh && \
    echo '    echo "⚠️  Admin user creation failed or user already exists"' >> /app/startup.sh && \
    echo '  fi' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Auto-seed if enabled' >> /app/startup.sh && \
    echo 'if [ "$AUTO_SEED" = "true" ]; then' >> /app/startup.sh && \
    echo '  echo "🌱 Seeding database with sample data..."' >> /app/startup.sh && \
    echo '  if npm run seed; then' >> /app/startup.sh && \
    echo '    echo "✅ Database seeding completed"' >> /app/startup.sh && \
    echo '  else' >> /app/startup.sh && \
    echo '    echo "⚠️  Database seeding failed, but continuing..."' >> /app/startup.sh && \
    echo '  fi' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "🚀 Starting Medusa server..."' >> /app/startup.sh && \
    echo 'exec npm start' >> /app/startup.sh && \
    chmod +x /app/startup.sh

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

# Expose ports
EXPOSE 9000 7001

# Use startup script
CMD ["/app/startup.sh"]