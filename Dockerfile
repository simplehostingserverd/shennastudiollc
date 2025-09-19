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

# Copy and make production startup script executable
COPY start-prod.sh /app/
RUN chmod +x /app/start-prod.sh

# Make backend startup script executable too
RUN chmod +x /app/ocean-backend/startup.sh

# Create uploads and static directories
RUN mkdir -p /app/ocean-backend/uploads /app/ocean-backend/static && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Expose ports
EXPOSE 3000 9000 7001

# Health check for the combined service
HEALTHCHECK --interval=30s --timeout=15s --start-period=180s --retries=5 \
    CMD curl -f http://localhost:3000 >/dev/null 2>&1 && curl -f http://localhost:9000/health >/dev/null 2>&1 || exit 1

# Use production startup script
CMD ["/app/start-prod.sh"]