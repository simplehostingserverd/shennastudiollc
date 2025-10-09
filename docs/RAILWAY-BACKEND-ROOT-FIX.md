# Railway Backend Root Directory Configuration

## Problem

Railway is deploying from the **repository root** (`/app`), but the Medusa backend is located in the **`ocean-backend/`** subdirectory. This causes the build to fail because Railway can't find the backend files.

**Error:**
```
❌ Backend build not found! Check Railway build logs.
Expected: ocean-backend/.medusa
```

## Solution: Configure Root Directory in Railway Dashboard

Railway **requires** you to manually set the Root Directory for services in subdirectories. The `railway.json` and `nixpacks.toml` files **cannot** override this setting.

---

## Step-by-Step Fix

### 1. Open Railway Dashboard

Go to: https://railway.app/project/your-project-id

### 2. Select Backend Service

Click on your **Medusa Backend** service (the one that's failing to build).

### 3. Go to Settings

Click the **Settings** tab in the service view.

### 4. Configure Service Settings

Scroll to **Service Settings** and configure:

#### **Root Directory**
```
ocean-backend
```
⚠️ **CRITICAL**: This tells Railway to treat `ocean-backend/` as the root for build commands.

#### **Build Command** (optional override)
```
npm ci && npm run build
```

#### **Start Command** (optional override)
```
npm start
```

#### **Watch Paths** (optional)
```
ocean-backend/**
```

### 5. Environment Variables

Ensure these are set in the **Variables** tab:

**Required:**
- `DATABASE_URL` - From Railway PostgreSQL addon
- `REDIS_URL` - From Railway Redis addon
- `JWT_SECRET` - Min 32 characters
- `COOKIE_SECRET` - Min 32 characters
- `NODE_ENV` - Set to `production`

**Admin Setup:**
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD` - Your admin password (min 8 chars)

**Optional but Recommended:**
- `STORE_CORS` - `https://shennastudio.com,https://www.shennastudio.com`
- `ADMIN_CORS` - `https://api.shennastudio.com`
- `AUTH_CORS` - `https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com`
- `DATABASE_LOGGING` - `false` (for production)

### 6. Custom Domain (if applicable)

In **Settings** → **Networking**:
- Add custom domain: `api.shennastudio.com`
- Configure DNS CNAME to point to Railway's generated domain

### 7. Health Check

Railway will automatically use the `healthcheckPath` from `railway.json`:
- Path: `/health`
- Timeout: 300 seconds

### 8. Redeploy

After setting the Root Directory:

1. Click **Deploy** → **Redeploy**
2. Or push a new commit to trigger automatic deployment

---

## Verify Deployment

### Check Build Logs

After redeploying, check the build logs. You should see:

```
✅ Compiling backend source...
✅ Backend build completed successfully
✅ Frontend build completed successfully
```

### Check Runtime Logs

After deployment starts, check runtime logs. You should see:

```
🚂 Starting Shenna's Studio on Railway...
📁 Working directory: /app
✅ Backend build found: .medusa
🚀 Starting Medusa backend on port 9000...
```

### Test Health Endpoint

```bash
curl https://api.shennastudio.com/health
```

Expected response:
```json
{"status":"ok"}
```

### Test Admin Panel

Visit: https://api.shennastudio.com/app

Login with:
- Email: Your `ADMIN_EMAIL`
- Password: Your `ADMIN_PASSWORD`

---

## Alternative: Monorepo Setup

If you want to deploy **both** frontend and backend from the same repository:

### Create Two Services

1. **Backend Service**
   - Root Directory: `ocean-backend`
   - Port: 9000
   - Domain: `api.shennastudio.com`

2. **Frontend Service**
   - Root Directory: `.` (repository root)
   - Port: 3000
   - Domain: `shennastudio.com`

### Railway Project Structure

```
Railway Project: Shenna's Studio
├── Service: Medusa Backend
│   ├── Root Directory: ocean-backend
│   ├── Build: npm ci && npm run build
│   ├── Start: npm start
│   └── Domain: api.shennastudio.com
│
├── Service: Next.js Frontend
│   ├── Root Directory: . (root)
│   ├── Build: npm ci && npm run build
│   ├── Start: npm start
│   └── Domain: shennastudio.com
│
├── PostgreSQL
│   └── DATABASE_URL → Backend service
│
└── Redis
    └── REDIS_URL → Backend service
```

---

## Common Issues

### Issue 1: "Backend build not found"

**Cause:** Root Directory not set to `ocean-backend`

**Fix:** Set Root Directory in Settings → Service Settings → Root Directory: `ocean-backend`

### Issue 2: Build succeeds but crashes on start

**Cause:** Missing environment variables

**Fix:** Check Variables tab and ensure all required vars are set (DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET)

### Issue 3: "Cannot find module '@medusajs/framework'"

**Cause:** Dependencies not installed or wrong Node version

**Fix:** 
- Ensure Build Command includes `npm ci` or `npm install`
- Check nixpacks.toml specifies `nodejs_20`

### Issue 4: Database connection errors

**Cause:** DATABASE_URL not set or SSL issues

**Fix:**
- Verify DATABASE_URL in Variables tab
- Ensure `medusa-config.ts` has SSL configuration for production

### Issue 5: Redis connection errors

**Cause:** REDIS_URL not set

**Fix:** Add Railway Redis addon and link to backend service

---

## Files Reference

The following files are already configured for Railway deployment:

### `ocean-backend/railway.json`
Configures build and deploy settings (used AFTER Root Directory is set).

### `ocean-backend/nixpacks.toml`
Configures Nixpacks build with Node.js 20 and PostgreSQL.

### `ocean-backend/medusa-config.ts`
Medusa configuration with production SSL, CORS, and pooling settings.

### `ocean-backend/package.json`
Contains build and start scripts:
- `npm run build` → `npx medusa build`
- `npm start` → `npx medusa start`

---

## Support

If you continue to have issues:

1. Check Railway build logs (click on deployment → Build Logs)
2. Check Railway runtime logs (click on deployment → Deploy Logs)
3. Verify all environment variables are set correctly
4. Ensure Root Directory is set to `ocean-backend`
5. Try a manual redeploy after configuration changes

---

## Quick Checklist

- [ ] Root Directory set to `ocean-backend` in Railway Settings
- [ ] DATABASE_URL environment variable set (from PostgreSQL addon)
- [ ] REDIS_URL environment variable set (from Redis addon)
- [ ] JWT_SECRET set (min 32 characters)
- [ ] COOKIE_SECRET set (min 32 characters)
- [ ] NODE_ENV set to `production`
- [ ] ADMIN_EMAIL set
- [ ] ADMIN_PASSWORD set
- [ ] Custom domain configured (if applicable)
- [ ] Redeployed after configuration changes
- [ ] Health check passing at `/health`
- [ ] Admin panel accessible at `/app`

---

**Last Updated:** 2025-01-07
**Railway Version:** Nixpacks 1.x
**Medusa Version:** 2.10.1
**Node Version:** 20.19.5