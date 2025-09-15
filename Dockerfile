# 1. Build Stage
FROM node:20-alpine AS builder

# Install system dependencies for build
RUN apk add --no-cache libc6-compat

# Install pnpm to handle SWC dependencies
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set environment to disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# 2. Production Runtime Stage
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache curl

WORKDIR /app

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy package.json and node_modules for npm start
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create Next.js cache directory
RUN mkdir -p .next && chown -R nextjs:nodejs .next

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=15s --start-period=90s --retries=5 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["npm", "start"]
