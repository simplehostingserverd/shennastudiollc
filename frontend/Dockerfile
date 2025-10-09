# Production Dockerfile for Shenna's Studio Frontend
# Multi-stage build for optimized Next.js standalone deployment

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including sharp for image optimization
RUN npm install --legacy-peer-deps && \
    npm install sharp --legacy-peer-deps && \
    npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js with standalone output
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    bash \
    netcat-openbsd

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create node user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy the server.js file to root if it exists in standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/server.js ./server.js 2>/dev/null || true

# Copy startup script
COPY --chown=nextjs:nodejs railway-start.sh ./
RUN chmod +x railway-start.sh

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["bash", "railway-start.sh"]