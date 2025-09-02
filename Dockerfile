FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Set production environment by default
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy source code (excluding ocean-backend via .dockerignore)
COPY . .

# Build the Next.js app
RUN npm run build

# Remove dev dependencies
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=90s --retries=5 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]