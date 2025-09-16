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
COPY ocean-backend/package*.json ./ocean-backend/

# Install dependencies for both frontend and backend
RUN npm install --legacy-peer-deps && \
    cd ocean-backend && \
    npm install --legacy-peer-deps && \
    cd .. && \
    npm cache clean --force

# Copy all source code
COPY . .

# Build frontend (Next.js)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Build backend (Medusa)
RUN cd ocean-backend && npm run build

# Create uploads and static directories
RUN mkdir -p /app/ocean-backend/uploads /app/ocean-backend/static && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Expose ports
EXPOSE 3000 9000 7001

# Health check for the combined service
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:3000 || curl -f http://localhost:9000/health || exit 1

# Use start-dev.js to run both services
CMD ["node", "start-dev.js"]