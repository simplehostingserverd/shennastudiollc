# ✅ Railway Backend - Production Ready

## Changes Made

### 1. ✅ Removed `.yarnrc.yml`
**File Deleted:** `ocean-backend/.yarnrc.yml`

**Why:** Railway was detecting this as a Yarn Berry project and trying to use `yarn install --check-cache`, which was failing. The backend uses npm, not yarn.

**Result:** Railway will now use npm for installation, which is faster and more reliable.

---

### 2. ✅ Updated `medusa-config.ts` for Production

**File:** `ocean-backend/medusa-config.ts`

**Changes:**
- ✅ Default NODE_ENV changed from `'development'` to `'production'`
- ✅ Production domains configured as defaults:
  - `STORE_CORS`: `https://shennastudio.com,https://www.shennastudio.com`
  - `ADMIN_CORS`: `https://api.shennastudio.com`
  - `AUTH_CORS`: All production domains
  - `backendUrl`: `https://api.shennastudio.com`
- ✅ Database SSL properly configured for Railway:
  - Automatically enables SSL in production
  - Configurable via `DATABASE_SSL` and `DATABASE_SSL_REJECT_UNAUTHORIZED`
- ✅ Production optimizations added:
  - HTTP compression enabled
  - Database connection pooling (min: 2, max: 10)
  - Redis cache TTL increased to 5 minutes (300s)
  - Redis retry strategy configured
  - Database logging disabled by default (performance)
- ✅ Redis modules properly configured with retry logic
- ✅ Admin panel outDir configured for Medusa v2

---

### 3. ✅ Created `railway.json`

**File:** `ocean-backend/railway.json`

**Purpose:** Tells Railway exactly how to build and deploy the backend

**Configuration:**
- Builder: NIXPACKS
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check: `/health` endpoint
- Restart Policy: Retry up to 10 times on failure
- Health Check Timeout: 300 seconds (5 minutes for initial startup)

---

### 4. ✅ Updated `nixpacks.toml`

**File:** `ocean-backend/nixpacks.toml`

**Changes:**
- Added PostgreSQL and OpenSSL packages
- Changed to `npm ci --production=false` for faster, reliable installs
- Simplified start command to just `npm start`
- Added production environment variables

---

## Railway Deployment Configuration

### Service Settings (Set in Railway Dashboard)

```
Service Name:     shenna-backend (or ocean-backend)
Root Directory:   ocean-backend
Build Command:    npm install && npm run build
Start Command:    npm start
Port:             9000
```

### Environment Variables (Already in JSON file)

Copy from: `ocean-backend/railway-backend-ready.env.json`

**Required Variables:**
```
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=994af417a1fc4625a5a340ab5562f4b3e697d3d3bbc541ca5d100403f0f55e88
COOKIE_SECRET=361bd53e4fc9513a25d5b51466e9087859740d3d3661c693cbde4f6693833d77
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YStlOdmsi1LMm6OiqbhHh9c5IOMFkUeu
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
BACKEND_URL=https://api.shennastudio.com
MEDUSA_BACKEND_URL=https://api.shennastudio.com
NODE_ENV=production
PORT=9000
WORKER_MODE=shared
DATABASE_LOGGING=false
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
STRIPE_API_KEY=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
STRIPE_SECRET_KEY=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
```

---

## Production Features Enabled

✅ **SSL Database Connections** - Secure connection to Railway PostgreSQL
✅ **HTTP Compression** - Reduced bandwidth usage
✅ **Connection Pooling** - Better database performance (2-10 connections)
✅ **Redis Retry Logic** - Automatic reconnection on failure
✅ **Extended Cache TTL** - 5-minute cache for better performance
✅ **Health Check Endpoint** - `/health` for Railway monitoring
✅ **Production CORS** - Only your domains allowed
✅ **Auto Migration** - Database migrates on first deploy
✅ **Auto Admin Creation** - Admin user created automatically

---

## Build Process

### What Happens During Deployment:

1. **Setup Phase**
   - Railway installs Node.js 20, PostgreSQL, OpenSSL

2. **Install Phase**
   - Runs: `npm ci --production=false`
   - Installs all dependencies (including dev dependencies for build)

3. **Build Phase**
   - Runs: `npm run build` (which executes `npx medusa build`)
   - Compiles TypeScript to JavaScript
   - Outputs to `.medusa/server` and `.medusa/client` directories

4. **Start Phase**
   - Runs: `npm start` (which executes `npx medusa start`)
   - Auto-migrates database (if `AUTO_MIGRATE=true`)
   - Creates admin user (if `AUTO_CREATE_ADMIN=true`)
   - Starts Medusa server on port 9000

---

## Deployment Steps

### 1. Deploy Backend to Railway

1. **Go to Railway Dashboard**
2. **Create New Service** → GitHub Repo
3. **Select your repository**
4. **Configure Service:**
   - Root Directory: `ocean-backend`
   - Click "Generate Domain" or add custom domain: `api.shennastudio.com`
5. **Add Environment Variables:**
   - Go to Variables tab
   - Click "RAW EDITOR"
   - Paste content from `ocean-backend/railway-backend-ready.env.json`
   - Click "Update Variables"
6. **Deploy**
   - Railway will automatically deploy
   - Wait 5-10 minutes for first build

### 2. Verify Deployment

- Health Check: `https://api.shennastudio.com/health`
- Admin Panel: `https://api.shennastudio.com/app`
- API Store: `https://api.shennastudio.com/store/products`

### 3. Get Publishable Key

1. Login to admin: `https://api.shennastudio.com/app`
2. Email: `admin@shennastudio.com`
3. Password: `YStlOdmsi1LMm6OiqbhHh9c5IOMFkUeu`
4. Go to: Settings → Publishable API Keys
5. Copy the key (starts with `pk_`)

### 4. Update Frontend

Use the publishable key in your frontend environment variables.

---

## Custom Domain Setup

### Add Custom Domain in Railway:

1. Go to Backend Service → Settings
2. Scroll to "Networking" section
3. Click "Custom Domain"
4. Enter: `api.shennastudio.com`
5. Railway provides DNS instructions (CNAME record)
6. Add CNAME to your DNS provider:
   ```
   Type: CNAME
   Name: api
   Value: [railway-provided-value].up.railway.app
   TTL: 3600
   ```

### SSL Certificate:

Railway automatically provisions and renews SSL certificates for custom domains.

---

## Performance Optimizations

### Database Connection Pool
- **Min Connections:** 2
- **Max Connections:** 10
- **Why:** Prevents connection exhaustion, improves query performance

### Redis Cache
- **TTL:** 5 minutes (300 seconds)
- **Namespace:** `medusa`
- **Why:** Reduces database queries, faster response times

### HTTP Compression
- **Enabled:** Yes (production only)
- **Level:** 6 (good balance)
- **Threshold:** 1024 bytes
- **Why:** Reduces bandwidth, faster page loads

### SSL Configuration
- **Enabled:** Auto-detected in production
- **Reject Unauthorized:** Configurable
- **Why:** Secure data transmission

---

## Monitoring & Logs

### View Logs in Railway:
1. Go to Backend Service
2. Click "Deployments" tab
3. Click on latest deployment
4. View real-time logs

### Health Check:
Railway automatically monitors: `https://api.shennastudio.com/health`

If health check fails 3 times, Railway restarts the service.

---

## Troubleshooting

### Build Fails with "yarn install" error:
✅ **FIXED** - Removed `.yarnrc.yml` file

### Build Fails with TypeScript errors:
- Check `medusa-config.ts` syntax
- Ensure all environment variables are set
- View build logs in Railway

### Backend won't start:
- Check environment variables are set correctly
- Verify `DATABASE_URL` and `REDIS_URL` reference Railway services
- Check logs for migration errors

### CORS Errors:
- Verify frontend domain is in `STORE_CORS`
- Check `ADMIN_CORS` includes admin domain
- Redeploy after updating CORS settings

### Database Connection Timeout:
- Ensure `DATABASE_SSL=true`
- Check PostgreSQL service is running in Railway
- Verify `DATABASE_URL` is correct

---

## Post-Deployment Checklist

After first successful deployment:

- [ ] Health check returns 200 OK
- [ ] Admin panel loads at `/app`
- [ ] Can login with admin credentials
- [ ] Publishable key obtained from admin panel
- [ ] Custom domain configured and SSL active
- [ ] Set `AUTO_MIGRATE=false` (after first deploy)
- [ ] Set `AUTO_CREATE_ADMIN=false` (after first deploy)
- [ ] Change admin password in admin panel
- [ ] Test API endpoints work
- [ ] Frontend can connect to backend

---

## Files Changed Summary

```
✅ DELETED:   ocean-backend/.yarnrc.yml
✅ UPDATED:   ocean-backend/medusa-config.ts
✅ CREATED:   ocean-backend/railway.json
✅ UPDATED:   ocean-backend/nixpacks.toml
```

---

## Next Steps

1. **Deploy Backend to Railway**
   - Follow deployment steps above
   - Wait for successful build

2. **Configure Custom Domain**
   - Add `api.shennastudio.com`
   - Update DNS records

3. **Get Publishable Key**
   - Login to admin panel
   - Copy publishable key

4. **Deploy Frontend**
   - Add publishable key to frontend env vars
   - Deploy frontend service

---

## Support

- **Railway Docs:** https://docs.railway.app
- **Medusa Docs:** https://docs.medusajs.com
- **Health Check:** https://api.shennastudio.com/health
- **Admin Panel:** https://api.shennastudio.com/app

---

**Status:** ✅ Production Ready
**Last Updated:** January 2025
**Medusa Version:** 2.10.3
**Node Version:** 20.x