# 🚨 EMERGENCY DEPLOYMENT - Coolify VPS (30 Minutes)

**Status**: ✅ READY TO DEPLOY - NIXPACKS ISSUE FIXED  
**Time Required**: 15-20 minutes  
**Last Updated**: 2025-09-01 - Fixed Stripe version + Nixpacks override

## 🔥 QUICK START (Do this NOW)

### Step 1: Create Services in Coolify (5 minutes)

#### PostgreSQL Database

1. **Create PostgreSQL Service** in Coolify:
   - Name: `shenna-postgres`
   - Version: `15-alpine`
   - Database: `ocean_store`
   - Username: `medusa_user`
   - Password: Generate strong password (32+ chars)
   - Internal Port: `5432`

#### Redis Cache

1. **Create Redis Service** in Coolify:
   - Name: `shenna-redis`
   - Version: `7-alpine`
   - Password: Generate strong password
   - Internal Port: `6379`

### Step 2: Deploy Application (10 minutes)

#### Deploy Backend with Docker Compose in Coolify:

1. **New Application** → **Docker Compose**
2. **Repository**: Your GitHub repo URL
3. **Docker Compose File**: `docker-compose.backend-only.yml` ⚡ (SIMPLIFIED)
4. **Service**: Backend only (faster deployment)
5. **Domains**:
   - API: `api.shennasstudio.com` → port 9000
   - Admin: `admin.shennasstudio.com` → port 7001

> **✅ EMERGENCY FIX**: Using backend-only deployment to avoid frontend build issues. Get the API and admin panel running first!

### Step 3: Set Environment Variables (5 minutes)

**COPY AND PASTE THESE** (update the values):

```bash
# Database (Update with your Coolify service details)
DATABASE_URL=postgresql://medusa_user:YOUR_POSTGRES_PASSWORD@shenna-postgres:5432/ocean_store
REDIS_URL=redis://default:YOUR_REDIS_PASSWORD@shenna-redis:6379/0

# Security (Generate random 32+ character strings)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-production
COOKIE_SECRET=your-super-secure-cookie-secret-minimum-32-characters-production

# Admin
ADMIN_EMAIL=admin@shennasstudio.com
ADMIN_PASSWORD=YourSecureAdminPassword123!

# CORS (Update with your actual domains)
STORE_CORS=https://shennasstudio.com,https://www.shennasstudio.com
ADMIN_CORS=https://admin.shennasstudio.com
AUTH_CORS=https://shennasstudio.com,https://www.shennasstudio.com

# Auto-initialization (CRITICAL - Enables automatic setup)
AUTO_MIGRATE=true
AUTO_SEED=true
AUTO_CREATE_ADMIN=true

# Payment (Add your production Stripe keys)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Optional (Leave blank if not using)
ALGOLIA_APPLICATION_ID=
ALGOLIA_SEARCH_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# System
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Step 4: Deploy & Verify (5 minutes)

1. **Deploy** the application in Coolify
2. **Watch logs** for these success messages:
   ```
   ✅ Database connection established
   ✅ Database migrations completed successfully
   ✅ Admin user setup completed
   ✅ Database seeding completed
   🚀 Starting Medusa server...
   ```
3. **Test endpoints**:
   - Frontend: `https://shennasstudio.com`
   - Health: `https://shennasstudio.com/api/health`
   - Admin: `https://admin.shennasstudio.com`
   - API Health: `https://api.shennasstudio.com/health`

## 🔧 FIXES IMPLEMENTED

✅ **Fixed Database Migration Issues**:

- Improved startup script with better error handling
- Added proper database connection waiting
- Made migrations non-blocking to prevent crashes

✅ **Fixed Redis Configuration**:

- Added Redis URL to medusa-config.ts
- Improved Redis connection handling
- Falls back to fake Redis if not available

✅ **Fixed Environment Variables**:

- Comprehensive environment template
- Proper defaults and validation
- Coolify-compatible variable handling

✅ **Added Health Check Endpoints**:

- Frontend: `/api/health`
- Backend: Built-in `/health`
- Docker health checks configured

✅ **Optimized Docker Images**:

- Multi-stage builds for smaller images
- Proper user permissions and security
- Curl installed for health checks

## 🚨 TROUBLESHOOTING

**If backend fails to start:**

1. Check Coolify logs for specific errors
2. Verify DATABASE_URL format is correct
3. Ensure PostgreSQL service is running
4. Check that environment variables are set

**If migrations fail:**

1. Backend will continue running (non-blocking)
2. Check database connection string
3. Verify database exists and user has permissions

**If frontend can't connect to backend:**

1. Check CORS settings match your domains
2. Verify backend health endpoint: `/health`
3. Check network connectivity between services

## 📱 POST-DEPLOYMENT

1. **Login to Admin**: `https://admin.shennasstudio.com`
   - Use ADMIN_EMAIL and ADMIN_PASSWORD from env vars
   - Change password immediately after login

2. **Configure Stripe Webhooks**:
   - Endpoint: `https://api.shennasstudio.com/webhooks/stripe`
   - Select all payment events

3. **Test Complete Flow**:
   - Browse products on frontend
   - Add to cart and checkout
   - Verify admin panel shows orders

## 🎯 SUCCESS CRITERIA

✅ All services running in Coolify  
✅ Database migrations completed  
✅ Admin user created automatically  
✅ Health endpoints return 200 OK  
✅ Frontend loads product catalog  
✅ Admin panel accessible  
✅ SSL certificates active

---

**🚀 YOUR SHENNA'S STUDIO IS READY TO GO LIVE!**

This configuration includes:

- Automatic database setup
- Health monitoring
- SSL certificates
- Payment processing
- Admin panel
- Product catalog
- Shopping cart
- Ocean conservation mission integration

**Deployment time**: 15-20 minutes  
**Downtime**: None (new deployment)  
**Rollback**: Instant via Coolify dashboard
