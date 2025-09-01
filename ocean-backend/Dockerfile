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
    echo '# Wait for database to be ready' >> /app/startup.sh && \
    echo 'echo "⏳ Waiting for database connection..."' >> /app/startup.sh && \
    echo 'until nc -z postgres 5432; do' >> /app/startup.sh && \
    echo '  sleep 1' >> /app/startup.sh && \
    echo 'done' >> /app/startup.sh && \
    echo 'echo "✅ Database connection established"' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Auto-migrate if enabled' >> /app/startup.sh && \
    echo 'if [ "$AUTO_MIGRATE" = "true" ]; then' >> /app/startup.sh && \
    echo '  echo "🔄 Running database migrations..."' >> /app/startup.sh && \
    echo '  npx medusa db:migrate' >> /app/startup.sh && \
    echo '  echo "✅ Database migrations completed"' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Auto-create admin if enabled' >> /app/startup.sh && \
    echo 'if [ "$AUTO_CREATE_ADMIN" = "true" ]; then' >> /app/startup.sh && \
    echo '  echo "👤 Creating admin user..."' >> /app/startup.sh && \
    echo '  npm run create-admin' >> /app/startup.sh && \
    echo '  echo "✅ Admin user setup completed"' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo '# Auto-seed if enabled' >> /app/startup.sh && \
    echo 'if [ "$AUTO_SEED" = "true" ]; then' >> /app/startup.sh && \
    echo '  echo "🌱 Seeding database with sample data..."' >> /app/startup.sh && \
    echo '  npm run seed' >> /app/startup.sh && \
    echo '  echo "✅ Database seeding completed"' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "🚀 Starting Medusa server..."' >> /app/startup.sh && \
    echo 'npm start' >> /app/startup.sh && \
    chmod +x /app/startup.sh

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

# Expose ports
EXPOSE 9000 7001

# Use startup script
CMD ["/app/startup.sh"]