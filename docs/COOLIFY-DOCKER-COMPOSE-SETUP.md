# Coolify Docker Compose Deployment Guide

## Overview

This guide shows you how to deploy the entire Shenna's Studio stack (PostgreSQL, Redis, Backend, Frontend, Worker) as a **single Docker Compose service** in Coolify.

## Benefits of Docker Compose Deployment

✅ **All-in-one deployment** - One service contains everything
✅ **No Nixpacks issues** - Uses Dockerfiles directly
✅ **Automatic service discovery** - Services communicate via container names
✅ **Built-in health checks** - Proper startup ordering
✅ **Easier management** - Update all services at once

---

## Step-by-Step Deployment

### Step 1: Create Docker Compose Service in Coolify

1. Log into your Coolify dashboard
2. Click **+ New** → Select **Docker Compose**
3. Configure the service:
   - **Name**: `shenna-studio-production`
   - **Repository**: `https://github.com/simplehostingserverd/shennastudiollc`
   - **Branch**: `main`
   - **Docker Compose File**: `docker-compose.coolify.yml`

### Step 2: Configure Domains

After creating the service, configure domains for exposed services:

**Backend (admin.shennastudio.com)**
- Service: `backend`
- Port: `9000`
- Domain: `admin.shennastudio.com`
- Enable HTTPS: ✅

**Frontend (www.shennastudio.com)**
- Service: `frontend`
- Port: `3000`
- Domains: `www.shennastudio.com`, `shennastudio.com`, `shop.shennastudio.com`
- Enable HTTPS: ✅

### Step 3: Set Environment Variables

Go to **Environment Variables** tab and add the following:

#### Required Variables

```bash
# ============================================
# DATABASE CREDENTIALS
# ============================================
POSTGRES_DB=medusa_db
POSTGRES_USER=medusa_user
POSTGRES_PASSWORD=<GENERATE_WITH: openssl rand -hex 32>

# ============================================
# SECURITY SECRETS (Required - 64 characters)
# ============================================
JWT_SECRET=<GENERATE_WITH: openssl rand -hex 32>
COOKIE_SECRET=<GENERATE_WITH: openssl rand -hex 32>

# ============================================
# CORS CONFIGURATION
# ============================================
STORE_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com

# ============================================
# BACKEND URLS
# ============================================
BACKEND_URL=https://admin.shennastudio.com
MEDUSA_BACKEND_URL=https://admin.shennastudio.com
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://admin.shennastudio.com

# ============================================
# ADMIN USER
# ============================================
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<GENERATE_WITH: openssl rand -base64 24>

# ============================================
# AUTO-INITIALIZATION
# ============================================
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true

# ============================================
# STRIPE PAYMENT (Required for checkout)
# ============================================
STRIPE_SECRET_KEY=sk_live_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx

# ============================================
# MEDUSA PUBLISHABLE KEY
# ============================================
# Get this AFTER first deployment from admin panel
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<GET_FROM_ADMIN_PANEL>

# ============================================
# OPTIONAL: ALGOLIA SEARCH
# ============================================
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=
ALGOLIA_ADMIN_API_KEY=

# ============================================
# OPTIONAL: CLOUDINARY IMAGES
# ============================================
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ============================================
# DOMAIN LABELS (For Coolify routing)
# ============================================
BACKEND_DOMAIN=admin.shennastudio.com
FRONTEND_DOMAINS=www.shennastudio.com,shennastudio.com,shop.shennastudio.com
```

#### Optional Variables (Advanced)

```bash
# Database SSL (for external databases)
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Worker mode for backend (shared = API + workers in one process)
BACKEND_WORKER_MODE=shared

# Disable admin on worker service
DISABLE_ADMIN=false
```

### Step 4: Generate Required Secrets

Run these commands locally to generate secure secrets:

```bash
# JWT Secret (64 characters)
openssl rand -hex 32

# Cookie Secret (64 characters)
openssl rand -hex 32

# Admin Password (32 characters)
openssl rand -base64 24
```

**Important**: Save these values in a password manager!

### Step 5: Deploy

1. Click **Deploy** button in Coolify
2. Monitor the deployment logs
3. Services will start in this order:
   - PostgreSQL (waits for healthy)
   - Redis (waits for healthy)
   - Backend (waits for DB + Redis, runs migrations)
   - Frontend (waits for backend)
   - Worker (waits for all services)

### Step 6: Get Medusa Publishable Key

After successful deployment:

1. Go to `https://admin.shennastudio.com/app`
2. Login with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Navigate to **Settings** → **Publishable API Keys**
4. Copy the default publishable key
5. In Coolify, add environment variable:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxx
   ```
6. **Redeploy** the stack to apply the key

### Step 7: Verify Deployment

Check each service:

```bash
# Backend API health
curl https://admin.shennastudio.com/health

# Backend admin panel
open https://admin.shennastudio.com/app

# Frontend
open https://www.shennastudio.com

# Check PostgreSQL (from Coolify terminal)
docker exec -it <postgres-container> psql -U medusa_user -d medusa_db -c "SELECT version();"

# Check Redis (from Coolify terminal)
docker exec -it <redis-container> redis-cli ping
```

---

## Service Architecture

```
┌─────────────────────────────────────────────────┐
│          Coolify Docker Compose Stack           │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │PostgreSQL│  │  Redis   │  │  Worker  │     │
│  │  :5432   │  │  :6379   │  │ (no port)│     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │              │           │
│       └─────────┬───┴──────────────┘           │
│                 │                               │
│           ┌─────▼─────┐                        │
│           │  Backend  │                        │
│           │   :9000   │◄────────────┐          │
│           └─────┬─────┘             │          │
│                 │                    │          │
│           ┌─────▼─────┐              │          │
│           │ Frontend  │              │          │
│           │   :3000   │──────────────┘          │
│           └───────────┘                         │
│                                                 │
└─────────────────────────────────────────────────┘
         ▲                      ▲
         │                      │
    admin.shennastudio.com  www.shennastudio.com
         (Port 9000)         (Port 3000)
```

---

## Troubleshooting

### Issue: Backend can't connect to PostgreSQL

**Solution**: Ensure `DATABASE_URL` uses the service name `postgres`:
```
postgresql://medusa_user:password@postgres:5432/medusa_db
```

### Issue: Frontend can't connect to backend

**Solution**:
- For public URL: Use `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://admin.shennastudio.com`
- Check CORS settings include your frontend domains

### Issue: Admin panel shows 404

**Solution**: MedusaJS v2 serves admin at `/app` path:
- Correct: `https://admin.shennastudio.com/app`
- Incorrect: `https://admin.shennastudio.com:7001`

### Issue: Deployment fails during build

**Solution**: Check Coolify build logs:
1. Click on the service
2. Go to **Deployments** tab
3. Click on failed deployment
4. View **Build Logs** for errors

### Issue: Services not communicating

**Solution**: All services must be in the same Docker Compose stack. They communicate via service names (`postgres`, `redis`, `backend`, etc.)

---

## Updating the Application

### Update Code

1. Push changes to GitHub
2. In Coolify, click **Redeploy**
3. Coolify will pull latest code and rebuild

### Update Environment Variables

1. Go to **Environment Variables** tab
2. Modify or add variables
3. Click **Save**
4. Click **Redeploy** to apply changes

### Database Migrations

Migrations run automatically on startup if `AUTO_MIGRATE=true`. To run manually:

```bash
# SSH into Coolify server or use Coolify terminal
docker exec -it <backend-container> npx medusa db:migrate
```

---

## Scaling Considerations

### Horizontal Scaling

To scale for high traffic:

1. Keep PostgreSQL and Redis as single instances
2. Scale backend: `docker-compose up -d --scale backend=3`
3. Scale worker: `docker-compose up -d --scale worker=2`
4. Scale frontend: `docker-compose up -d --scale frontend=3`
5. Use a load balancer (Coolify handles this automatically)

### Worker Configuration

- **Shared mode** (`WORKER_MODE=shared`): Backend handles both API and background jobs
- **Worker mode** (`WORKER_MODE=worker`): Separate containers for API and background jobs
- **Server mode** (`WORKER_MODE=server`): API only, no background jobs

For production with high job volume, use separate worker containers.

---

## Backup and Restore

### Backup PostgreSQL

```bash
docker exec <postgres-container> pg_dump -U medusa_user medusa_db > backup.sql
```

### Restore PostgreSQL

```bash
cat backup.sql | docker exec -i <postgres-container> psql -U medusa_user -d medusa_db
```

### Backup Uploads

```bash
docker cp <backend-container>:/app/uploads ./uploads-backup
```

---

## Security Checklist

- [ ] Strong `POSTGRES_PASSWORD` set (min 32 characters)
- [ ] Strong `JWT_SECRET` set (64 characters)
- [ ] Strong `COOKIE_SECRET` set (64 characters)
- [ ] Strong `ADMIN_PASSWORD` set (min 16 characters)
- [ ] HTTPS enabled for all domains
- [ ] CORS properly configured (no wildcard `*` in production)
- [ ] Secrets stored in password manager
- [ ] Database backups scheduled
- [ ] Security updates enabled for containers

---

## Support

If you encounter issues:

1. Check Coolify deployment logs
2. Check individual container logs: `docker logs <container-name>`
3. Verify environment variables are set correctly
4. Ensure domains are pointing to Coolify server
5. Check firewall allows ports 80, 443

---

**Deployment Platform**: Coolify
**Architecture**: Docker Compose with multi-service stack
**Last Updated**: 2025-10-05
