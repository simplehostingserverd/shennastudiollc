# Multi-stage build for Shenna's Studio (Frontend + Backend)
# This Dockerfile builds both Next.js frontend and MedusaJS backend in one container

FROM debian:bookworm-slim as backend-builder

WORKDIR /app/backend

# Install Node.js 20 and build tools
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs python3 python3-pip python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY backend/ .

# Build backend
ENV DISABLE_ADMIN=false
RUN npm run build

# Verify admin build exists
RUN ls -la .medusa/ && \
    if [ -d ".medusa/client" ]; then \
      echo "✅ Admin client build found"; \
    else \
      echo "⚠️  Admin client build not found"; \
    fi

# Frontend builder stage
FROM debian:bookworm-slim as frontend-builder

WORKDIR /app/frontend

# Install Node.js 20
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy frontend files
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ .

# Generate Prisma client before building
RUN npx prisma generate || echo "Prisma generate failed, continuing..."

# Build arguments for Next.js
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_ALGOLIA_APPLICATION_ID
ARG NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true

# Build frontend with standalone output
RUN npm run build

# Production stage - combines both frontend and backend
FROM debian:bookworm-slim

# Build args for runtime environment
ARG COOKIE_SECRET
ARG JWT_SECRET
ARG STORE_CORS
ARG ADMIN_CORS
ARG AUTH_CORS

WORKDIR /app

# Install Node.js 20 and runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    netcat-openbsd \
    bash \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs python3 python3-pip python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Create directory structure
RUN mkdir -p backend frontend

# ===== BACKEND SETUP =====
WORKDIR /app/backend

# Copy backend built artifacts
COPY --from=backend-builder /app/backend/.medusa ./.medusa
COPY --from=backend-builder /app/backend/medusa-config.* ./
COPY --from=backend-builder /app/backend/src ./src
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/tsconfig.json ./

# Install backend production dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy backend scripts
COPY backend/migrations.sh ./migrations.sh
COPY backend/startup.sh ./startup.sh
RUN chmod +x ./migrations.sh ./startup.sh

# ===== FRONTEND SETUP =====
WORKDIR /app/frontend

# Copy frontend standalone build
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static ./.next/static
COPY --from=frontend-builder /app/frontend/public ./public

# Copy frontend startup script
COPY frontend/railway-start.sh ./start.sh
RUN chmod +x ./start.sh 2>/dev/null || echo "No startup script found"

# ===== FINAL SETUP =====
WORKDIR /app

# Create startup orchestrator script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "🚀 Starting Shenna Studio services..."\n\
\n\
# Start backend in background\n\
cd /app/backend\n\
./startup.sh &\n\
BACKEND_PID=$!\n\
\n\
# Wait for backend to be ready\n\
echo "⏳ Waiting for backend to be ready..."\n\
for i in {1..60}; do\n\
  if curl -f http://localhost:9000/health 2>/dev/null; then\n\
    echo "✅ Backend is ready"\n\
    break\n\
  fi\n\
  sleep 2\n\
done\n\
\n\
# Start frontend\n\
cd /app/frontend\n\
echo "🎨 Starting frontend..."\n\
NODE_ENV=production node server.js\n\
' > /app/start-all.sh && chmod +x /app/start-all.sh

# Set production environment
ENV NODE_ENV=production

# Expose ports
EXPOSE 3000 9000

# Health check (check both services)
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:3000 || curl -f http://localhost:9000/health || exit 1

# Start all services
CMD ["/app/start-all.sh"]
