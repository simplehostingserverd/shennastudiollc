# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 2. Production Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only necessary files from the builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Adjust ownership for security
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=15s --start-period=90s --retries=5 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "server.js"]
