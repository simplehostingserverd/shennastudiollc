# Production Dockerfile for Shenna's Studio Frontend
# Using Alpine base directly to avoid Docker registry issues

# Stage 1: Dependencies
FROM alpine:3.20 AS deps
RUN apk add --no-cache nodejs npm libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including sharp for image optimization
RUN npm install --legacy-peer-deps && \
    npm install sharp --legacy-peer-deps && \
    npm cache clean --force

# Stage 2: Builder
FROM alpine:3.20 AS builder
RUN apk add --no-cache nodejs npm
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# CRITICAL: Define build-time arguments for NEXT_PUBLIC environment variables
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Pass NEXT_PUBLIC vars as environment variables for the build
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Verify environment variables are set before building
RUN echo "🔍 Build-time environment check:" && \
    echo "NEXT_PUBLIC_MEDUSA_BACKEND_URL: ${NEXT_PUBLIC_MEDUSA_BACKEND_URL:0:50}..." && \
    echo "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: ${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:0:30}..." && \
    echo "NEXT_PUBLIC_BASE_URL: $NEXT_PUBLIC_BASE_URL"

# Build Next.js with standalone output
RUN npm run build

# Stage 3: Runner
FROM alpine:3.20 AS runner
RUN apk add --no-cache nodejs npm curl bash netcat-openbsd
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create node user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

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
