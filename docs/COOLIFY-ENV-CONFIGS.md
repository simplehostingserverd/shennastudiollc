# Coolify Environment Variables Configuration Guide

This document contains the complete environment variable configurations for all services in your Coolify deployment.

---

## 1. PostgreSQL Database (`shennastudio`)

### Database Configuration

In Coolify, go to **Databases** → **shennastudio** → **Environment Variables**

```bash
# PostgreSQL Settings (Usually auto-configured by Coolify)
POSTGRES_DB=medusa_db
POSTGRES_USER=medusa_user
POSTGRES_PASSWORD=<GENERATE_STRONG_PASSWORD>

# Optional: Set specific PostgreSQL version
# POSTGRES_VERSION=15
```

**Important:**
- Generate a strong password using: `openssl rand -hex 32`
- Save the credentials - you'll need them for the backend configuration
- Coolify usually auto-generates these, so check existing values first

---

## 2. Redis Database (`redis-database`)

### Redis Configuration

In Coolify, go to **Databases** → **redis-database** → **Environment Variables**

```bash
# Redis Settings (Usually minimal configuration needed)
# Redis typically runs without authentication in internal Docker networks

# Optional: Set Redis password for security
# REDIS_PASSWORD=<GENERATE_STRONG_PASSWORD>
```

**Important:**
- If you set a password, update backend REDIS_URL to: `redis://:password@redis-database:6379`
- For internal use, authentication is optional

---

## 3. Backend (`medusa-backend-server`)

### Application: medusa-backend-server
### Domain: https://admin.shennastudio.com

In Coolify, go to **Applications** → **medusa-backend-server** → **Environment Variables**

```bash
# ===========================================
# DATABASE CONFIGURATION (REQUIRED)
# ===========================================
DATABASE_URL=postgresql://medusa_user:<POSTGRES_PASSWORD>@shennastudio:5432/medusa_db
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# ===========================================
# REDIS CONFIGURATION (REQUIRED)
# ===========================================
REDIS_URL=redis://redis-database:6379

# If Redis has password:
# REDIS_URL=redis://:password@redis-database:6379

# ===========================================
# SECURITY SECRETS (REQUIRED)
# ===========================================
# Generate with: openssl rand -hex 32
JWT_SECRET=<GENERATE_64_CHAR_SECRET>
COOKIE_SECRET=<GENERATE_64_CHAR_SECRET>

# ===========================================
# WORKER MODE (OPTIONAL)
# ===========================================
WORKER_MODE=shared

# ===========================================
# CORS CONFIGURATION (REQUIRED)
# ===========================================
STORE_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com

# ===========================================
# ADMIN DASHBOARD CONFIGURATION
# ===========================================
DISABLE_ADMIN=false
BACKEND_URL=https://admin.shennastudio.com
MEDUSA_BACKEND_URL=https://admin.shennastudio.com

# ===========================================
# ADMIN USER SETUP
# ===========================================
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<GENERATE_STRONG_PASSWORD>

# ===========================================
# DEPLOYMENT CONFIGURATION
# ===========================================
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true

# ===========================================
# ENVIRONMENT SETTINGS
# ===========================================
NODE_ENV=production
```

**Build Configuration:**
- Base Directory: `ocean-backend`
- Build Command: `npm run build`
- Start Command: `npm start`

---

## 4. Frontend (`medusa-storefront`)

### Application: medusa-storefront
### Domains:
- https://www.shennastudio.com (primary)
- https://shennastudio.com (redirect)
- https://shop.shennastudio.com (redirect)

In Coolify, go to **Applications** → **medusa-storefront** → **Environment Variables**

```bash
# ===========================================
# BACKEND API CONFIGURATION (REQUIRED)
# ===========================================
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://admin.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<YOUR_MEDUSA_PUBLISHABLE_KEY>

# ===========================================
# PAYMENT PROCESSING - STRIPE
# ===========================================
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>

# ===========================================
# SEARCH - ALGOLIA (OPTIONAL)
# ===========================================
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=<YOUR_ALGOLIA_APP_ID>
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=<YOUR_ALGOLIA_SEARCH_KEY>
ALGOLIA_ADMIN_API_KEY=<YOUR_ALGOLIA_ADMIN_KEY>

# ===========================================
# IMAGE OPTIMIZATION - CLOUDINARY (OPTIONAL)
# ===========================================
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_SECRET>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_NAME>

# ===========================================
# NEXTAUTH CONFIGURATION (IF USING)
# ===========================================
NEXTAUTH_URL=https://www.shennastudio.com
NEXTAUTH_SECRET=<GENERATE_STRONG_SECRET>

# ===========================================
# DATABASE (FRONTEND PRISMA - IF USING)
# ===========================================
# If your frontend has its own Prisma database
DATABASE_URL=<YOUR_FRONTEND_DATABASE_URL>
DIRECT_URL=<YOUR_FRONTEND_DIRECT_URL>

# ===========================================
# ENVIRONMENT SETTINGS
# ===========================================
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**Build Configuration:**
- Base Directory: `/` (root)
- Build Command: `npm run build`
- Start Command: `npm start`

---

## 5. Worker (`ocean-worker`)

### Application: ocean-worker
### Description: Background job processor for MedusaJS

In Coolify, go to **Applications** → **ocean-worker** → **Environment Variables**

```bash
# ===========================================
# DATABASE CONFIGURATION (REQUIRED)
# ===========================================
DATABASE_URL=postgresql://medusa_user:<POSTGRES_PASSWORD>@shennastudio:5432/medusa_db
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# ===========================================
# REDIS CONFIGURATION (REQUIRED)
# ===========================================
REDIS_URL=redis://redis-database:6379

# ===========================================
# SECURITY SECRETS (REQUIRED - MUST MATCH BACKEND)
# ===========================================
JWT_SECRET=<SAME_AS_BACKEND>
COOKIE_SECRET=<SAME_AS_BACKEND>

# ===========================================
# WORKER MODE (REQUIRED)
# ===========================================
WORKER_MODE=worker

# ===========================================
# CORS CONFIGURATION (SAME AS BACKEND)
# ===========================================
STORE_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com

# ===========================================
# BACKEND URL
# ===========================================
BACKEND_URL=https://admin.shennastudio.com
MEDUSA_BACKEND_URL=https://admin.shennastudio.com

# ===========================================
# ENVIRONMENT SETTINGS
# ===========================================
NODE_ENV=production
```

**Build Configuration:**
- Base Directory: `ocean-backend`
- Build Command: `npm run build`
- Start Command: Set WORKER_MODE=worker and run: `npm start`

---

## Important Notes

### 1. Secret Generation Commands

```bash
# Generate JWT Secret (64 characters)
openssl rand -hex 32

# Generate Cookie Secret (64 characters)
openssl rand -hex 32

# Generate Admin Password (strong)
openssl rand -base64 24
```

### 2. Container Name Reference

Use these **internal container names** for service-to-service communication:

- PostgreSQL: `shennastudio` (port 5432)
- Redis: `redis-database` (port 6379)
- Backend API: `medusa-backend-server` (port 9000)
- Frontend: `medusa-storefront` (port 3000)
- Worker: `ocean-worker` (no exposed port)

### 3. Public URLs

Use these **public URLs** for browser and external access:

- Backend API & Admin: `https://admin.shennastudio.com`
- Frontend/Shop: `https://shop.shennastudio.com`, `https://www.shennastudio.com`, `https://shennastudio.com`

### 4. Getting Medusa Publishable Key

After the backend is deployed and running:

1. Access admin panel: `https://admin.shennastudio.com/app`
2. Login with your admin credentials
3. Go to **Settings** → **Publishable API Keys**
4. Copy the publishable key
5. Add it to the frontend's `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

### 5. Deployment Order

Deploy services in this order:

1. **PostgreSQL** (`shennastudio`) - Deploy first
2. **Redis** (`redis-database`) - Deploy second
3. **Backend** (`medusa-backend-server`) - Deploy third (wait for migrations)
4. **Worker** (`ocean-worker`) - Deploy fourth
5. **Frontend** (`medusa-storefront`) - Deploy last

### 6. Verification Steps

After deployment, verify each service:

```bash
# Check PostgreSQL is running
docker exec -it <postgres-container> psql -U medusa_user -d medusa_db -c "SELECT version();"

# Check Redis is running
docker exec -it <redis-container> redis-cli ping

# Check Backend API
curl https://admin.shennastudio.com/health

# Check Frontend
curl https://www.shennastudio.com
```

### 7. Common Issues

**Backend can't connect to database:**
- Verify `DATABASE_URL` uses container name `shennastudio` not `localhost`
- Check PostgreSQL credentials match

**Backend can't connect to Redis:**
- Verify `REDIS_URL` uses container name `redis-database` not `localhost`
- Check if Redis has password set

**Frontend can't connect to backend:**
- Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` uses public URL `https://admin.shennastudio.com`
- Check CORS settings in backend allow frontend domain

**Admin panel 404:**
- MedusaJS v2 admin is at `/app` path: `https://admin.shennastudio.com/app`

---

## Next Steps

1. **Save all generated secrets** in a secure password manager
2. **Copy-paste** the environment variables into each Coolify application
3. **Replace placeholders** (`<GENERATE_STRONG_PASSWORD>`, etc.) with actual values
4. **Deploy in order**: Database → Redis → Backend → Worker → Frontend
5. **Test each service** after deployment
6. **Get publishable key** from admin panel and update frontend
7. **Redeploy frontend** with the publishable key

---

## Support

If you encounter issues:

1. Check Coolify logs for each service
2. Verify network connectivity between containers
3. Ensure all environment variables are set correctly
4. Check that domains are properly configured in Coolify
5. Verify SSL certificates are active

---

**Last Updated:** 2025-10-04
**Deployment Platform:** Coolify
**Architecture:** Monorepo with separate frontend/backend containers
