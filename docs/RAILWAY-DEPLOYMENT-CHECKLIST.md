# Railway Deployment Checklist for Shenna's Studio Backend

## 🎯 Quick Fix Summary

Two critical issues were preventing your Railway deployment:

1. ❌ **Root Directory not configured** → Railway was building from wrong location
2. ❌ **Invalid railway.json syntax** → JSON parsing error

Both issues are now **FIXED** in the codebase. Follow the steps below to complete deployment.

---

## ✅ Pre-Deployment Checklist

### Code Fixes (Already Completed ✅)

- [x] Fixed `databaseExtraOptions` → `databaseDriverOptions` in medusa-config.ts
- [x] Merged duplicate `databaseDriverOptions` properties
- [x] Fixed `railway.json` syntax error (removed invalid `environments` section)
- [x] Backend builds successfully locally (`npm run build` passes)
- [x] All changes pushed to GitHub main branch

### Railway Dashboard Configuration (YOU MUST DO THIS)

- [ ] **Set Root Directory to `ocean-backend`** in Service Settings
- [ ] Verify DATABASE_URL is set (from PostgreSQL addon)
- [ ] Verify REDIS_URL is set (from Redis addon)
- [ ] Set JWT_SECRET (min 32 characters, generate with: `openssl rand -base64 32`)
- [ ] Set COOKIE_SECRET (min 32 characters, generate with: `openssl rand -base64 32`)
- [ ] Set NODE_ENV=production
- [ ] Set ADMIN_EMAIL (your admin email)
- [ ] Set ADMIN_PASSWORD (min 8 characters, secure password)
- [ ] Set STORE_CORS (optional: `https://shennastudio.com,https://www.shennastudio.com`)
- [ ] Set ADMIN_CORS (optional: `https://api.shennastudio.com`)
- [ ] Configure custom domain: `api.shennastudio.com` (if applicable)
- [ ] Trigger manual redeploy after configuration

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Configure Root Directory (CRITICAL)

1. **Open Railway Dashboard**: https://railway.app/
2. **Select your Backend Service** (the one showing errors)
3. **Click "Settings"** tab
4. **Find "Service Settings" or "Source"** section
5. **Set "Root Directory"**: 
   ```
   ocean-backend
   ```
6. **Save changes**

> **Why this is critical:** Railway needs to know your backend code is in the `ocean-backend/` subdirectory, not the repository root. Without this, Railway can't find `package.json` or run build commands in the correct location.

### Step 2: Set Environment Variables

Click the **"Variables"** tab in your backend service and add:

#### Required Variables

```bash
# Database (auto-populated by PostgreSQL addon)
DATABASE_URL=postgresql://...

# Redis (auto-populated by Redis addon)
REDIS_URL=redis://...

# Security Secrets (GENERATE NEW ONES!)
JWT_SECRET=<your-32-char-secret>
COOKIE_SECRET=<your-32-char-secret>

# Environment
NODE_ENV=production

# Admin User
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<your-secure-password>
```

#### Generate Secrets

Run these commands locally to generate secure secrets:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate COOKIE_SECRET
openssl rand -base64 32
```

Copy the output and paste into Railway Variables.

#### Optional Variables (Recommended)

```bash
# CORS Configuration
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com

# Database Settings
DATABASE_LOGGING=false
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Worker Mode
WORKER_MODE=shared
```

### Step 3: Verify Build Configuration

Your service should have these settings (check Settings tab):

- **Builder**: NIXPACKS (auto-detected)
- **Build Command**: `npm ci && npm run build` (from railway.json)
- **Start Command**: `npm start` (from railway.json)
- **Port**: 9000 (auto-detected from code)

### Step 4: Deploy

1. **Trigger Deploy**:
   - Option A: Click **"Deploy"** → **"Redeploy"** in Railway dashboard
   - Option B: Push a new commit to GitHub (auto-deploys if connected)

2. **Watch Build Logs**:
   - Click on the deployment
   - Watch the "Build" tab
   - You should see:
     ```
     ✅ Backend build completed successfully (X.XXs)
     ✅ Frontend build completed successfully (X.XXs)
     ```

3. **Watch Deploy Logs**:
   - Click the "Deploy" tab
   - You should see:
     ```
     🚂 Starting Shenna's Studio on Railway...
     ✅ Backend build found: .medusa
     🚀 Starting Medusa backend on port 9000...
     Server is ready on port: 9000
     ```

### Step 5: Verify Deployment

#### Test Health Endpoint

```bash
curl https://<your-railway-domain>/health
# or
curl https://api.shennastudio.com/health
```

**Expected Response:**
```json
{"status":"ok"}
```

#### Test Admin Panel

1. Open: `https://<your-railway-domain>/app` or `https://api.shennastudio.com/app`
2. Login with your ADMIN_EMAIL and ADMIN_PASSWORD
3. You should see the Medusa admin dashboard

#### Test API

```bash
curl https://<your-railway-domain>/store/products
```

**Expected Response:**
```json
{"products":[],"count":0,"offset":0,"limit":15}
```

---

## 🔧 Troubleshooting

### Issue: "Backend build not found"

**Symptoms:**
```
❌ Backend build not found! Check Railway build logs.
Expected: ocean-backend/.medusa
```

**Fix:**
- Root Directory is NOT set to `ocean-backend`
- Go to Settings → Set Root Directory to `ocean-backend`
- Redeploy

### Issue: "failed to parse railway.json"

**Symptoms:**
```
failed to parse ocean-backend/railway.json: failed to decode json file
```

**Fix:**
- This is now fixed in the codebase (commit 999a6be)
- Pull latest changes: `git pull origin main`
- Redeploy

### Issue: Build succeeds but crashes on start

**Symptoms:**
```
Error: Missing required environment variables
```

**Fix:**
- Check that all required env vars are set (DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET)
- Go to Variables tab and verify each one
- Redeploy after adding missing variables

### Issue: Database connection errors

**Symptoms:**
```
Error: Connection terminated unexpectedly
```

**Fix:**
- Verify DATABASE_URL is set correctly
- Ensure PostgreSQL addon is attached to the service
- Check that DATABASE_SSL=true is set
- Verify medusa-config.ts has SSL configuration (already in code)

### Issue: Redis connection errors

**Symptoms:**
```
Error: connect ECONNREFUSED (Redis)
```

**Fix:**
- Verify REDIS_URL is set correctly
- Ensure Redis addon is attached to the service
- Redis is required for Medusa v2 in production

---

## 📋 Quick Reference

### Railway Service Configuration

```
Service Name: Medusa Backend (or whatever you named it)
Root Directory: ocean-backend
Build Command: npm ci && npm run build
Start Command: npm start
Port: 9000
Health Check: /health
```

### Required Environment Variables

| Variable | Source | Example |
|----------|--------|---------|
| DATABASE_URL | PostgreSQL addon | `postgresql://user:pass@host:5432/db` |
| REDIS_URL | Redis addon | `redis://host:6379` |
| JWT_SECRET | Manual | `<32-char-random-string>` |
| COOKIE_SECRET | Manual | `<32-char-random-string>` |
| NODE_ENV | Manual | `production` |
| ADMIN_EMAIL | Manual | `admin@shennastudio.com` |
| ADMIN_PASSWORD | Manual | `<secure-password>` |

### Useful Railway Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Deploy manually
railway up

# Open service in browser
railway open
```

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Build logs show "Backend build completed successfully"
- ✅ Deploy logs show "Server is ready on port: 9000"
- ✅ Health endpoint returns `{"status":"ok"}`
- ✅ Admin panel loads at `/app`
- ✅ Can login to admin with ADMIN_EMAIL and ADMIN_PASSWORD
- ✅ No crash loops in Deploy logs
- ✅ Service shows "Active" status in Railway dashboard

---

## 📚 Related Documentation

- [RAILWAY-BACKEND-ROOT-FIX.md](./RAILWAY-BACKEND-ROOT-FIX.md) - Detailed root directory configuration guide
- [RAILWAY-JSON-SETUP.md](./RAILWAY-JSON-SETUP.md) - Railway configuration file reference
- [ocean-backend/railway.json](./ocean-backend/railway.json) - Service configuration
- [ocean-backend/nixpacks.toml](./ocean-backend/nixpacks.toml) - Build configuration
- [ocean-backend/medusa-config.ts](./ocean-backend/medusa-config.ts) - Medusa configuration

---

## 🆘 Still Having Issues?

1. **Check Build Logs** in Railway dashboard (click deployment → Build tab)
2. **Check Deploy Logs** in Railway dashboard (click deployment → Deploy tab)
3. **Verify Root Directory** is set to `ocean-backend` in Settings
4. **Verify All Environment Variables** are set in Variables tab
5. **Check GitHub** - ensure latest code is pushed (commit 999a6be or later)
6. **Try Manual Redeploy** - click Deploy → Redeploy

If all else fails, check Railway's documentation or contact their support.

---

**Last Updated:** 2025-01-07  
**Required Commits:** 999a6be or later  
**Railway CLI Version:** 3.x  
**Node Version:** 20.19.5  
**Medusa Version:** 2.10.1