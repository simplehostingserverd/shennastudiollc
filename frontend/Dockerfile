# Production Dockerfile for Shenna's Studio Frontend
# For Coolify deployment with separate backend service

FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    curl \
    bash \
    netcat-openbsd

WORKDIR /app

# Copy package files for frontend only
COPY package*.json ./

# Install frontend dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy all source code (but backend won't be used in this container)
COPY . .

# Skip frontend build at Docker build time - will build at runtime with env vars
ENV NEXT_TELEMETRY_DISABLED=1

# Copy and make frontend startup script executable
COPY start-frontend-only.sh /app/
RUN chmod +x /app/start-frontend-only.sh

# Set ownership
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose frontend port only
EXPOSE 3000

# Health check for frontend
HEALTHCHECK --interval=30s --timeout=15s --start-period=180s --retries=5 \
    CMD curl -f http://localhost:3000 >/dev/null 2>&1 || exit 1

# Use frontend-only startup script for Coolify (backend runs separately)
CMD ["/app/start-frontend-only.sh"]