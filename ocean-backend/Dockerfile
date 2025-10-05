# Multi-stage build for MedusaJS v2
# Based on official MedusaJS v2 Dockerfile

FROM node:20 as builder

WORKDIR /app

# Copy all files
COPY . .

# Clean node_modules if exists
RUN rm -rf node_modules

# Install Python dependencies for build tools
RUN apt-get update && apt-get install -y python3 python3-pip python-is-python3

# Install dependencies with npm (using npm instead of yarn for consistency)
RUN npm install --loglevel=error --legacy-peer-deps

# Build the application - outputs to .medusa directory
RUN npm run build


# Production stage
FROM node:20

# Coolify bug workaround - declare build args
# https://github.com/coollabsio/coolify/issues/1930
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

# Install system dependencies for runtime
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python-is-python3 \
    curl \
    netcat-openbsd \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Create .medusa directory
RUN mkdir -p .medusa

# Copy built artifacts from builder stage
COPY --from=builder /app/.medusa ./.medusa

# Copy configuration file (required by medusa-config.ts or medusa-config.js)
COPY --from=builder /app/medusa-config.* ./

# Copy source directory (needed for scripts like create-admin, seed, etc.)
COPY --from=builder /app/src ./src

# Copy package files for production dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm install --production --legacy-peer-deps && npm cache clean --force

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

# Expose port for API (admin is served at /app on same port)
EXPOSE 9000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 \
    CMD curl -f http://localhost:9000/health || exit 1

# Use startup script which handles migrations and starts server
CMD ["./startup.sh"]
