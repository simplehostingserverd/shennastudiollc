# Multi-stage build for MedusaJS v2
# Using Debian Bookworm base directly to avoid Docker registry issues

FROM debian:bookworm-slim as builder

WORKDIR /app

# Install Node.js 20 and build tools
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs python3 python3-pip python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy all files
COPY . .

# Clean node_modules if exists
RUN rm -rf node_modules

# Install dependencies with npm
RUN npm install --loglevel=error --legacy-peer-deps

# Build the application
ENV DISABLE_ADMIN=false
RUN npm run build

# Verify admin build exists
RUN ls -la .medusa/ && \
    if [ -d ".medusa/client" ]; then \
      echo "✅ Admin client build found"; \
      ls -la .medusa/client/; \
    else \
      echo "⚠️  Admin client build not found - this may cause issues"; \
    fi


# Production stage
FROM debian:bookworm-slim

# Coolify bug workaround - declare build args
ARG COOKIE_SECRET
ARG JWT_SECRET
ARG STORE_CORS
ARG ADMIN_CORS
ARG AUTH_CORS
ARG DISABLE_ADMIN
ARG WORKER_MODE
ARG PORT
ARG DATABASE_URL
ARG REDIS_URL
ARG BACKEND_URL
ARG AUTO_MIGRATE
ARG AUTO_SEED
ARG AUTO_CREATE_ADMIN
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD

WORKDIR /app

# Install Node.js 20 and runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    netcat-openbsd \
    bash \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs python3 python3-pip python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Create .medusa directory
RUN mkdir -p .medusa

# Copy built artifacts from builder stage
COPY --from=builder /app/.medusa ./.medusa

# Verify admin build was copied
RUN if [ -f ".medusa/client/index.html" ]; then \
      echo "✅ Admin panel index.html found in production stage"; \
    else \
      echo "❌ ERROR: Admin panel index.html NOT found in production stage"; \
      echo "Contents of .medusa directory:"; \
      ls -la .medusa/ || true; \
      echo "Contents of .medusa/client directory (if exists):"; \
      ls -la .medusa/client/ || true; \
    fi

# Copy configuration file
COPY --from=builder /app/medusa-config.* ./

# Copy source directory
COPY --from=builder /app/src ./src

# Copy package files
COPY package*.json ./

# Copy tsconfig for runtime TypeScript compilation
COPY --from=builder /app/tsconfig.json ./

# Install ALL dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy migrations script
COPY migrations.sh ./migrations.sh
RUN chmod +x ./migrations.sh

# Copy startup script
COPY startup.sh ./startup.sh
RUN chmod +x ./startup.sh

# Create logs directory
RUN mkdir -p logs

# Set working directory to where the built server is
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Expose port for API
EXPOSE 9000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 \
    CMD curl -f http://localhost:9000/health || exit 1

# Use startup script which handles migrations and starts server
CMD ["./startup.sh"]
