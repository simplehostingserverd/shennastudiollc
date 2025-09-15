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

# Copy and make startup scripts executable
COPY startup.sh startup-simple.sh /app/
RUN chmod +x /app/startup.sh /app/startup-simple.sh

# Create uploads and static directories with proper permissions
RUN mkdir -p /app/uploads /app/static && \
    chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose ports for API and Admin
EXPOSE 9000 7001

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

# Use startup script based on STARTUP_MODE
CMD ["sh", "-c", "if [ \"$STARTUP_MODE\" = \"simple\" ]; then exec /app/startup-simple.sh; else exec /app/startup.sh; fi"]