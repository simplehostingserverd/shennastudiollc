# Railway 502 Error Fix Guide

## 🚨 Problem: 502 Bad Gateway Error

Your services show **green checkmarks** ✅ but return **502 errors** when accessing the website.

This means:
- ✅ Service is deployed
- ✅ Service is running
- ❌ Service can't handle HTTP requests

---

## 🔍 Most Common Causes

### 1. **Port Binding Issue** (90% of 502 errors)
Service is not listening on the correct port or not binding to `0.0.0.0`

### 2. **Application Crashes After Start**
App starts, passes health check, then crashes immediately

### 3. **Missing Environment Variables**
App starts but crashes when it tries to use undefined variables

### 4. **Database/Redis Connection Issues**
App can't connect to database or Redis

---

## 🚀 Quick Fix Steps

### Step 1: Check Deploy Logs

**In Railway Dashboard:**
1. Go to the service showing 502 errors
2. Click **Deployments** tab
3. Click on the latest deployment
4. Click **Deploy Logs** tab
5. Scroll to the **bottom** of logs

**Look for:**
```
❌ Error: listen EADDRINUSE :::3000
❌ Error: Cannot find module
❌ Error: connect ECONNREFUSED
❌ UnhandledPromiseRejectionWarning
❌ Application crashed
❌ Port 3000 is already in use
```

### Step 2: Fix Port Binding (Most Common Issue)

**For Frontend (Next.js):**

**In Frontend Service → Variables, verify these exist:**
```bash
PORT=3000
HOSTNAME=0.0.0.0
NODE_ENV=production
```

**If missing, add them and redeploy!**

**For Backend (Medusa):**

**In Backend Service → Variables, verify:**
```bash
PORT=9000
NODE_ENV=production
```

### Step 3: Verify Start Command

**Frontend should use:**
```bash
npm start
```
Which runs: `node .next/standalone/server.js`

**Backend should use:**
```bash
npm start
```
Which runs: `npx medusa start`

**Check in Railway:**
- Service → Settings → Deploy section
- Look for "Start Command"
- Should say: `npm start` (from railway.json)

### Step 4: Check Health Check Settings

**Frontend Health Check:**
- Path: `/`
- Timeout: 300 seconds

**Backend Health Check:**
- Path: `/health`
- Timeout: 300 seconds

**In Railway:**
- Service → Settings → Deploy section
- Look for "Health Check Path"
- Verify it matches above

---

## 🔧 Detailed Troubleshooting

### Issue 1: Frontend 502 - Port Binding

**Symptoms:**
- Deploy logs show "Ready in X.Xs"
- Service is green ✅
- But 502 when accessing URL

**Cause:** Next.js standalone server not binding to Railway's network interface

**Fix:**

1. **Go to Frontend Service → Variables**
2. **Add or verify:**
   ```bash
   HOSTNAME=0.0.0.0
   PORT=3000
   ```
3. **Redeploy**

**Why:** Railway needs services to bind to `0.0.0.0` (all interfaces), not `localhost` or `127.0.0.1`

### Issue 2: Backend 502 - Database Connection

**Symptoms:**
- Deploy logs show "Server is ready on port: 9000"
- Then: "Error: connect ECONNREFUSED" or "Database connection failed"
- Service crashes and restarts repeatedly

**Cause:** Can't connect to PostgreSQL or Redis

**Fix:**

1. **Verify PostgreSQL addon is connected:**
   - Project → PostgreSQL → Check it's running
   - Backend Service → Variables → Verify `DATABASE_URL` exists

2. **Verify Redis addon is connected:**
   - Project → Redis → Check it's running
   - Backend Service → Variables → Verify `REDIS_URL` exists

3. **Check database URL format:**
   ```bash
   DATABASE_URL=postgresql://username:password@host:5432/database
   REDIS_URL=redis://host:6379
   ```

4. **If using Railway addons, should be:**
   ```bash
   DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   ```

### Issue 3: Missing Environment Variables

**Symptoms:**
- Deploy logs show errors like:
  - "NEXT_PUBLIC_MEDUSA_BACKEND_URL is not defined"
  - "JWT_SECRET is required"
  - "Cannot read property of undefined"

**Fix:**

**Frontend - Verify ALL these exist:**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

**Backend - Verify ALL these exist:**
```bash
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<32-char-secret>
COOKIE_SECRET=<32-char-secret>
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<secure-password>
STORE_CORS=https://${{Frontend.RAILWAY_PUBLIC_DOMAIN}},https://shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://${{Frontend.RAILWAY_PUBLIC_DOMAIN}},https://shennastudio.com
NODE_ENV=production
PORT=9000
```

### Issue 4: Build Succeeds But Runtime Fails

**Symptoms:**
- Build logs show "✅ Compiled successfully"
- Deploy logs show app starting
- Then crashes with module not found or runtime error

**Common Causes:**
1. Missing dependencies in package.json
2. Environment-specific code failing in production
3. File path issues (case sensitivity)

**Fix:**

1. **Check Deploy Logs for specific error:**
   ```bash
   Error: Cannot find module '@medusajs/js-sdk'
   Error: Cannot find module 'next/dist/...'
   ```

2. **If module missing, verify package.json:**
   - Module should be in `dependencies`, not `devDependencies`
   - Run `npm install <module>` locally
   - Commit package.json and package-lock.json
   - Push to trigger rebuild

3. **For Next.js specific issues:**
   - Verify `output: 'standalone'` in next.config.js
   - Check start command is: `node .next/standalone/server.js`
   - Or use: `npm start` which should map to above

### Issue 5: Health Check Timing Out

**Symptoms:**
- Service never shows green ✅
- Railway keeps restarting service
- Logs show "Health check timed out"

**Fix:**

1. **Increase health check timeout:**
   - Service → Settings → Deploy
   - Or in railway.json:
     ```json
     {
       "deploy": {
         "healthcheckTimeout": 300
       }
     }
     ```

2. **Verify health check endpoint works:**
   - Backend: `curl https://backend-url.railway.app/health`
   - Frontend: `curl https://frontend-url.railway.app/`

3. **Check if endpoint is actually implemented:**
   - Backend: Medusa has `/health` by default
   - Frontend: Next.js serves homepage at `/` by default

---

## 🎯 Step-by-Step Diagnostic

### Run This Checklist:

#### Frontend Service:
- [ ] Deploy logs show "Ready in X.Xs" with no errors after
- [ ] Variables include: `HOSTNAME=0.0.0.0`
- [ ] Variables include: `PORT=3000`
- [ ] Variables include: `NODE_ENV=production`
- [ ] Variables include: `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
- [ ] Start command is: `npm start`
- [ ] Health check path is: `/`
- [ ] No error in logs about missing modules
- [ ] No error in logs about undefined variables

#### Backend Service:
- [ ] Deploy logs show "Server is ready on port: 9000"
- [ ] Variables include: `PORT=9000`
- [ ] Variables include: `NODE_ENV=production`
- [ ] Variables include: `DATABASE_URL` (from addon)
- [ ] Variables include: `REDIS_URL` (from addon)
- [ ] Variables include: `JWT_SECRET` (32+ chars)
- [ ] Variables include: `COOKIE_SECRET` (32+ chars)
- [ ] Start command is: `npm start`
- [ ] Health check path is: `/health`
- [ ] PostgreSQL addon is running (green)
- [ ] Redis addon is running (green)

---

## 🧪 Testing Commands

### Test Backend Directly:
```bash
# Health check
curl https://your-backend.railway.app/health

# Store API
curl https://your-backend.railway.app/store/products

# Admin panel (in browser)
open https://your-backend.railway.app/app
```

### Test Frontend Directly:
```bash
# Homepage
curl -I https://your-frontend.railway.app/

# Should return 200, not 502
```

### Check Logs in Real-Time:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs (follow mode)
railway logs -f
```

---

## 🔄 Nuclear Option: Clean Redeploy

If nothing works, try a clean redeploy:

### Option 1: Trigger Manual Redeploy
1. Service → Deployments
2. Click "Deploy" button
3. Select "Redeploy"
4. Wait for build to complete

### Option 2: Force Rebuild from GitHub
1. Make a small change to code (add comment)
2. Commit and push:
   ```bash
   git commit --allow-empty -m "Force redeploy"
   git push origin main
   ```
3. Railway auto-redeploys

### Option 3: Delete and Recreate Service
**⚠️ Last resort only!**
1. Copy all environment variables
2. Delete service
3. Create new service
4. Add all variables back
5. Deploy

---

## 💡 Quick Wins

### Most Likely Fix (Try This First):

**Add these to Frontend Variables if missing:**
```bash
HOSTNAME=0.0.0.0
PORT=3000
```

**Add these to Backend Variables if missing:**
```bash
PORT=9000
```

**Then redeploy both services.**

This fixes **90% of 502 errors**!

---

## 📊 Common Error Patterns

### Pattern 1: Frontend 502 Only
**Likely:** Port binding issue or missing `HOSTNAME=0.0.0.0`

### Pattern 2: Backend 502 Only
**Likely:** Database connection issue or missing JWT_SECRET/COOKIE_SECRET

### Pattern 3: Both 502
**Likely:** Build issue or missing critical environment variable

### Pattern 4: Intermittent 502
**Likely:** Service crashing and restarting due to memory/resource issue

---

## 🆘 Still Not Working?

### Get Detailed Logs:

1. **Railway Dashboard Logs:**
   - Service → Deployments → Latest → Deploy Logs
   - Copy entire log output

2. **Railway CLI Logs:**
   ```bash
   railway logs > logs.txt
   ```

3. **Check for specific errors:**
   - Module not found → Dependency issue
   - EADDRINUSE → Port already in use (shouldn't happen on Railway)
   - ECONNREFUSED → Database/Redis connection
   - Undefined variable → Missing environment variable

### Common Log Messages Decoded:

```
"listen EADDRINUSE" → Port conflict (add PORT and HOSTNAME vars)
"Cannot find module" → Missing dependency in package.json
"connect ECONNREFUSED" → Can't reach database/Redis
"JWT_SECRET is required" → Missing JWT_SECRET variable
"Invalid publishable key" → Wrong NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
"CORS error" → Backend STORE_CORS doesn't include frontend domain
```

---

## ✅ Success Indicators

You've fixed it when:
- ✅ No 502 errors when visiting URLs
- ✅ Frontend homepage loads
- ✅ Backend `/health` returns `{"status":"ok"}`
- ✅ Backend `/app` loads admin panel
- ✅ Frontend can fetch products from backend
- ✅ No errors in Deploy Logs
- ✅ Services stay green (no restart loops)

---

**Last Updated:** 2025-01-07  
**Railway Platform:** v2  
**Most Common Fix:** Add `HOSTNAME=0.0.0.0` and `PORT=3000` to Frontend variables