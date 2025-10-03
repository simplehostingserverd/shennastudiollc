# Production Dockerfile for Shenna's Studio
# Uses unified approach with start-dev.js for both frontend and backend

FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    curl \
    bash \
    netcat-openbsd

WORKDIR /app

# Copy package files for both frontend and backend
COPY package*.json ./

# Install frontend dependencies first
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy all source code
COPY . .

# Install backend dependencies
RUN cd ocean-backend && npm install --legacy-peer-deps && npm cache clean --force

# Skip frontend build at Docker build time - will build at runtime with env vars
ENV NEXT_TELEMETRY_DISABLED=1

# Skip backend build at Docker build time (will build at runtime with env vars)

# Copy and make production startup scripts executable
COPY start-prod.sh /app/
COPY start-frontend-only.sh /app/
RUN chmod +x /app/start-prod.sh /app/start-frontend-only.sh

# Make backend startup script executable too (not used in this container)
RUN chmod +x /app/ocean-backend/startup.sh

# Create uploads and static directories
RUN mkdir -p /app/ocean-backend/uploads /app/ocean-backend/static && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Expose port for frontend only
EXPOSE 3000

# Health check for frontend only
HEALTHCHECK --interval=30s --timeout=15s --start-period=180s --retries=5 \
    CMD curl -f http://localhost:3000 >/dev/null 2>&1 || exit 1

# Use frontend-only startup script for Coolify (separate backend container)
# For standalone deployments, use start-prod.sh instead
CMD ["/app/start-frontend-only.sh"]