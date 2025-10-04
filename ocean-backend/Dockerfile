FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache curl netcat-openbsd bash

WORKDIR /app

# Set production environment by default
ENV NODE_ENV=production

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install all dependencies including dev dependencies (needed for TypeScript build)
RUN npm install --include=dev --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Build the application (done at build time since we have all dependencies)
RUN npm run build && mkdir -p logs

# Make startup script executable
RUN chmod +x startup.sh

# Expose port for API (admin is served at /app on same port)
EXPOSE 9000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 \
    CMD curl -f http://localhost:9000/health || exit 1

# Use startup script which handles migrations and starts server
CMD ["./startup.sh"]