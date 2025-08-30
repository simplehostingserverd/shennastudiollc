# Multi-service Dockerfile for Shenna's Studio Ocean Store
# This builds both the frontend and backend services

FROM node:20-alpine AS base
RUN apk add --no-cache curl

# Build Frontend
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY ocean-store/package*.json ./
RUN npm ci --only=production
COPY ocean-store/ ./
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Build Backend
FROM base AS backend-builder  
WORKDIR /app/backend
COPY ocean-store/ocean-backend/package*.json ./
RUN npm ci --only=production
COPY ocean-store/ocean-backend/ ./
RUN npm run build

# Production Frontend Image
FROM base AS frontend
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# Production Backend Image
FROM base AS backend
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-builder /app/backend ./
EXPOSE 9000 7001
CMD ["npm", "start"]