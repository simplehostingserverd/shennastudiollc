FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache curl netcat-openbsd bash

WORKDIR /app

# Set production environment by default
ENV NODE_ENV=production

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install all dependencies including dev dependencies (needed for TypeScript build)
RUN npm ci --include=dev && npm cache clean --force

# Install PM2 globally
RUN npm install -g pm2

# Copy source code
COPY . .

# Build the application
RUN npm run build && mkdir -p logs

# Expose port for API (admin is served at /app on same port)
EXPOSE 9000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 \
    CMD curl -f http://localhost:9000/health || exit 1

# Start command: run migrations then start with PM2
CMD ["sh", "-c", "npx medusa db:migrate && pm2-runtime start ecosystem.config.js"]