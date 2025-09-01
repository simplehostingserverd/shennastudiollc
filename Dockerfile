# Simple Backend Dockerfile for Coolify (Single Service)
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache curl netcat-openbsd

WORKDIR /app

# Copy backend files only
COPY ocean-backend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY ocean-backend/ ./

# Build the application
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🌊 Starting Shenna Studio Backend..."' >> /app/start.sh && \
    echo 'echo "Database: $DATABASE_URL"' >> /app/start.sh && \
    echo 'echo "Redis: $REDIS_URL"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'if [ "$AUTO_MIGRATE" = "true" ]; then' >> /app/start.sh && \
    echo '  echo "🔄 Running database migrations..."' >> /app/start.sh && \
    echo '  npx medusa db:migrate || echo "Migration failed, continuing..."' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'if [ "$AUTO_CREATE_ADMIN" = "true" ]; then' >> /app/start.sh && \
    echo '  echo "👤 Creating admin user..."' >> /app/start.sh && \
    echo '  npm run create-admin || echo "Admin creation failed, continuing..."' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'if [ "$AUTO_SEED" = "true" ]; then' >> /app/start.sh && \
    echo '  echo "🌱 Seeding database..."' >> /app/start.sh && \
    echo '  npm run seed || echo "Seeding failed, continuing..."' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "🚀 Starting server..."' >> /app/start.sh && \
    echo 'exec npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 9000 7001

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=5 \
  CMD curl -f http://localhost:9000/health || exit 1

# Start the application
CMD ["/app/start.sh"]