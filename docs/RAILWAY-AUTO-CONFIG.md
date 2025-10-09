# Railway Auto-Configuration Guide for Shenna's Studio

## 🚀 Automated Setup with Config-as-Code

This guide explains how to use Railway's config-as-code files to automatically configure both frontend and backend services without manual dashboard configuration.

---

## 📁 Configuration Files Overview

### Backend Service (Medusa API)
- **Location:** `ocean-backend/`
- **Config Files:**
  - `ocean-backend/railway.json` - Railway service configuration
  - `ocean-backend/nixpacks.toml` - Build configuration
  - `ocean-backend/medusa-config.ts` - Medusa configuration

### Frontend Service (Next.js Storefront)
- **Location:** Root directory
- **Config Files:**
  - `railway-frontend.json` - Railway service configuration
  - `nixpacks-frontend.toml` - Build configuration
  - `next.config.js` - Next.js configuration

---

## 🎯 Quick Setup (Recommended Approach)

### Option 1: Separate Services (Recommended)

Deploy frontend and backend as **two separate Railway services** for better isolation and scaling.

#### Step 1: Create Backend Service

1. **Create New Service in Railway Dashboard**
   - Click "New Service" → "GitHub Repo"
   - Select `shennastudiollc` repository
   - Name: "Medusa Backend"

2. **Configure Service Settings**
   - **Root Directory:** `ocean-backend` ⚠️ CRITICAL
   - **Config File:** `railway.json` (auto-detected from ocean-backend/)
   - **Nixpacks Config:** `nixpacks.toml` (auto-detected)

3. **Add PostgreSQL**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically sets `DATABASE_URL`

4. **Add Redis**
   - Click "New" → "Database" → "Add Redis"
   - Railway automatically sets `REDIS_URL`

5. **Set Environment Variables**
   ```bash
   # Generate secrets
   JWT_SECRET=$(openssl rand -base64 32)
   COOKIE_SECRET=$(openssl rand -base64 32)
   
   # Add to Railway Variables tab:
   JWT_SECRET=<generated-value>
   COOKIE_SECRET=<generated-value>
   NODE_ENV=production
   ADMIN_EMAIL=admin@shennastudio.com
   ADMIN_PASSWORD=<your-secure-password>
   STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
   ADMIN_CORS=https://api.shennastudio.com
   AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com
   ```

6. **Deploy**
   - Railway will automatically:
     - Use `ocean-backend/railway.json` for build/deploy config
     - Run `npm ci && npm run build`
     - Start with `npm start`
     - Health check at `/health`
     - Restart on failure (max 10 retries)

#### Step 2: Create Frontend Service

1. **Create New Service in Railway Dashboard**
   - Click "New Service" → "GitHub Repo"
   - Select `shennastudiollc` repository
   - Name: "Next.js Frontend"

2. **Configure Service Settings**
   - **Root Directory:** `.` (repository root)
   - **Config File:** Rename `railway-frontend.json` to `railway.json` OR set manually
   - **Nixpacks Config:** Rename `nixpacks-frontend.toml` to `nixpacks.toml` OR set manually

3. **Set Environment Variables**
   ```bash
   # Generate NEXTAUTH_SECRET
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   
   # Add to Railway Variables tab:
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<get-from-admin-panel>
   STRIPE_SECRET_KEY=sk_live_51RdPwMP4GPds5FMq...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMq...
   NEXTAUTH_SECRET=<generated-value>
   NEXTAUTH_URL=https://shennastudio.com
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   HOSTNAME=0.0.0.0
   PORT=3000
   ```

4. **Deploy**
   - Railway will automatically:
     - Use `railway.json` for build/deploy config
     - Run `npm ci && npm run build`
     - Start with `npm start`
     - Health check at `/` (homepage)
     - Restart on failure (max 10 retries)

---

## 📋 Configuration Files Explained

### Backend: `ocean-backend/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

**What this does:**
- ✅ Uses Nixpacks builder (auto-detects Node.js)
- ✅ Installs dependencies with `npm ci` (deterministic)
- ✅ Builds backend with `npm run build` → creates `.medusa/` folder
- ✅ Starts server with `npm start` → runs `npx medusa start`
- ✅ Health checks at `/health` endpoint
- ✅ Auto-restarts on crash (up to 10 times)
- ✅ Times out health check after 5 minutes

### Backend: `ocean-backend/nixpacks.toml`

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "openssl", "postgresql"]

[phases.install]
cmds = ["npm ci --production=false"]

[phases.build]
cmds = [
  "npm run build",
  "echo 'Build completed successfully'"
]

[start]
cmd = "npm start"

[variables]
NODE_ENV = "production"
PORT = "9000"
```

**What this does:**
- ✅ Installs Node.js 20, OpenSSL, PostgreSQL client
- ✅ Runs install phase with dev dependencies
- ✅ Builds Medusa backend (creates `.medusa/server` and `.medusa/client`)
- ✅ Starts on port 9000
- ✅ Sets NODE_ENV=production automatically

### Frontend: `railway-frontend.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/",
    "healthcheckTimeout": 300
  }
}
```

**What this does:**
- ✅ Uses Nixpacks builder
- ✅ Installs dependencies with `npm ci`
- ✅ Builds Next.js with `npm run build` → creates `.next/` and standalone output
- ✅ Starts server with `npm start` → runs standalone server
- ✅ Health checks at `/` (homepage)
- ✅ Auto-restarts on crash (up to 10 times)

### Frontend: `nixpacks-frontend.toml`

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "openssl"]

[phases.install]
cmds = [
  "npm ci --production=false || npm install",
  "echo 'Frontend dependencies installed'"
]

[phases.build]
cmds = [
  "npm run build",
  "echo 'Frontend build completed successfully'"
]

[start]
cmd = "npm start"

[variables]
NODE_ENV = "production"
PORT = "3000"
HOSTNAME = "0.0.0.0"
NEXT_TELEMETRY_DISABLED = "1"
```

**What this does:**
- ✅ Installs Node.js 20 and OpenSSL
- ✅ Runs install with fallback to `npm install`
- ✅ Builds Next.js (outputs to `.next/standalone/`)
- ✅ Starts on port 3000 (bound to 0.0.0.0 for Railway)
- ✅ Disables Next.js telemetry

---

## 🔧 Using Config Files

### Method 1: Automatic Detection (Easiest)

Railway automatically detects and uses these files:

**For Backend Service:**
1. Set Root Directory to `ocean-backend`
2. Railway finds `ocean-backend/railway.json`
3. Railway finds `ocean-backend/nixpacks.toml`
4. Automatic configuration applied ✅

**For Frontend Service:**
1. Rename files in repository root:
   ```bash
   mv railway-frontend.json railway.json
   mv nixpacks-frontend.toml nixpacks.toml
   ```
2. Push to GitHub
3. Railway finds `railway.json` and `nixpacks.toml` in root
4. Automatic configuration applied ✅

### Method 2: Manual Configuration (If auto-detection fails)

**In Railway Dashboard → Service Settings:**

1. **Build Command:**
   ```bash
   npm ci && npm run build
   ```

2. **Start Command:**
   - Backend: `npm start` (runs `npx medusa start`)
   - Frontend: `npm start` (runs Next.js standalone server)

3. **Root Directory:**
   - Backend: `ocean-backend`
   - Frontend: `.` (or leave empty)

4. **Health Check Path:**
   - Backend: `/health`
   - Frontend: `/`

5. **Restart Policy:**
   - Type: ON_FAILURE
   - Max Retries: 10

---

## 🚨 Common Issues & Solutions

### Issue 1: Backend crashes - "Backend build not found"

**Cause:** Root Directory not set to `ocean-backend`

**Fix:**
1. Go to Backend Service → Settings
2. Set **Root Directory** to `ocean-backend`
3. Redeploy

**Why it works:** Railway needs to run build commands from inside the `ocean-backend/` folder where `package.json` and `medusa-config.ts` are located.

### Issue 2: Frontend crashes - "Module not found"

**Cause:** Dependencies not installed correctly

**Fix:**
1. Check Build Logs for errors
2. Ensure `package-lock.json` is committed to Git
3. Try changing build command to: `npm install && npm run build`
4. Redeploy

### Issue 3: "failed to parse railway.json"

**Cause:** JSON syntax error

**Fix:**
1. Validate JSON: `cat railway.json | python3 -m json.tool`
2. Check for:
   - Missing commas
   - Trailing commas
   - Invalid property names
3. Use provided config files (already validated)

### Issue 4: Service keeps restarting

**Causes:**
- Missing environment variables
- Database connection failed
- Port binding issue

**Fix:**
1. Check Deploy Logs for error messages
2. Verify all required env vars are set:
   - Backend: DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET
   - Frontend: NEXT_PUBLIC_MEDUSA_BACKEND_URL, NEXTAUTH_SECRET
3. Ensure health check endpoints return 200 OK:
   - Backend: `curl https://your-backend.railway.app/health`
   - Frontend: `curl https://your-frontend.railway.app/`

### Issue 5: CORS errors in browser

**Cause:** Frontend domain not in backend STORE_CORS

**Fix:**
1. Add to Backend Variables:
   ```bash
   STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
   ```
2. Redeploy backend
3. See `CORS-CONFIGURATION.md` for details

---

## ✅ Deployment Checklist

### Backend Deployment

- [ ] PostgreSQL addon added to project
- [ ] Redis addon added to project
- [ ] Root Directory set to `ocean-backend`
- [ ] `railway.json` detected (check Settings)
- [ ] `nixpacks.toml` detected (check Settings)
- [ ] JWT_SECRET generated and set (32+ chars)
- [ ] COOKIE_SECRET generated and set (32+ chars)
- [ ] ADMIN_EMAIL set
- [ ] ADMIN_PASSWORD set (secure password)
- [ ] NODE_ENV=production
- [ ] STORE_CORS includes frontend domains
- [ ] Build completes successfully
- [ ] Health check passes: `/health` returns 200
- [ ] Admin panel accessible: `/app`
- [ ] No crash loops in logs

### Frontend Deployment

- [ ] Backend deployed and healthy
- [ ] `railway.json` in root (or railway-frontend.json renamed)
- [ ] `nixpacks.toml` in root (or nixpacks-frontend.toml renamed)
- [ ] NEXT_PUBLIC_MEDUSA_BACKEND_URL set to backend domain
- [ ] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY set (from admin panel)
- [ ] NEXTAUTH_SECRET generated and set (32+ chars)
- [ ] NEXTAUTH_URL set to frontend domain
- [ ] STRIPE keys set (both secret and publishable)
- [ ] NODE_ENV=production
- [ ] Build completes successfully
- [ ] Health check passes: `/` returns 200
- [ ] Homepage loads without errors
- [ ] Products fetch from backend (no CORS errors)
- [ ] No crash loops in logs

---

## 🎯 Expected Build Output

### Backend Build (Success)

```
[nixpacks] Installing Node.js 20.19.5
[nixpacks] Running: npm ci --production=false
[nixpacks] Running: npm run build
info: Starting build...
info: Compiling backend source...
info: Backend build completed successfully (3.42s)
info: Compiling frontend source...
info: Frontend build completed successfully (22.18s)
✅ Build completed
```

### Backend Start (Success)

```
🚂 Starting Shenna's Studio on Railway...
📁 Working directory: /app
✅ Backend build found: .medusa
🚀 Starting Medusa backend on port 9000...
info: Database migrated successfully
info: Processing 1 migrations(s)...
info: Migrations completed
Server is ready on port: 9000
```

### Frontend Build (Success)

```
[nixpacks] Installing Node.js 20.19.5
[nixpacks] Running: npm ci --production=false
[nixpacks] Running: npm run build
▲ Next.js 15.5.3
- Creating an optimized production build...
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Finalizing page optimization
✅ Build completed
```

### Frontend Start (Success)

```
▲ Next.js 15.5.3
- Local: http://0.0.0.0:3000
- Network: http://0.0.0.0:3000
✓ Ready in 1.2s
```

---

## 🔄 Automatic Restarts

Both services are configured to automatically restart on failure:

```json
"restartPolicyType": "ON_FAILURE",
"restartPolicyMaxRetries": 10
```

**What this means:**
- If service crashes, Railway automatically restarts it
- Up to 10 restart attempts
- If all 10 fail, service is marked as failed
- You'll receive notification of persistent failures

**Common restart triggers:**
- Database connection lost → Auto-restart → Reconnect
- Out of memory → Auto-restart → Fresh memory
- Unhandled exception → Auto-restart → Recover
- Health check timeout → Auto-restart → Try again

---

## 📊 Health Checks

### Backend Health Check

**Endpoint:** `/health`

**Expected Response:**
```json
{"status":"ok"}
```

**Test:**
```bash
curl https://your-backend.railway.app/health
```

**What Railway checks:**
- Response status: 200 OK
- Response time: < 300 seconds
- Checks every 30 seconds
- 3 failed checks = unhealthy

### Frontend Health Check

**Endpoint:** `/` (homepage)

**Expected Response:** HTML page with status 200

**Test:**
```bash
curl -I https://your-frontend.railway.app/
```

**What Railway checks:**
- Response status: 200 OK
- Response time: < 300 seconds
- Checks every 30 seconds
- 3 failed checks = unhealthy

---

## 🎉 Success Criteria

Your deployment is successful when:

### Backend
- ✅ Build logs show "Backend build completed successfully"
- ✅ Deploy logs show "Server is ready on port: 9000"
- ✅ Health endpoint returns `{"status":"ok"}`
- ✅ Admin panel loads at `/app`
- ✅ Can login with ADMIN_EMAIL and ADMIN_PASSWORD
- ✅ Service status shows "Active" (green)
- ✅ No crash loops in logs

### Frontend
- ✅ Build logs show "Compiled successfully"
- ✅ Deploy logs show "Ready in X.Xs"
- ✅ Homepage loads without errors
- ✅ Products page fetches data from backend
- ✅ Cart functionality works
- ✅ No CORS errors in browser console
- ✅ Service status shows "Active" (green)
- ✅ No crash loops in logs

---

## 📚 Related Documentation

- [RAILWAY-DEPLOYMENT-CHECKLIST.md](./RAILWAY-DEPLOYMENT-CHECKLIST.md) - Complete deployment guide
- [RAILWAY-BACKEND-ROOT-FIX.md](./RAILWAY-BACKEND-ROOT-FIX.md) - Root directory configuration
- [CORS-CONFIGURATION.md](./CORS-CONFIGURATION.md) - CORS setup guide
- [railway-backend-ready.env](./ocean-backend/railway-backend-ready.env) - Backend env template
- [railway-frontend-production.env](./railway-frontend-production.env) - Frontend env template

---

## 🆘 Still Having Issues?

### Debug Steps

1. **Check Build Logs**
   - Go to service → Click deployment → "Build" tab
   - Look for error messages
   - Verify all commands completed successfully

2. **Check Deploy Logs**
   - Go to service → Click deployment → "Deploy" tab
   - Look for crash messages
   - Check for missing environment variables

3. **Verify Config Detection**
   - Go to Settings → scroll to "Build Settings"
   - Verify it shows: "Detected from railway.json"
   - If not, Railway isn't finding your config file

4. **Test Manually**
   ```bash
   # Clone repo
   git clone <your-repo>
   cd shennastudiollc
   
   # Test backend build
   cd ocean-backend
   npm ci
   npm run build  # Should succeed
   
   # Test frontend build
   cd ..
   npm ci
   npm run build  # Should succeed
   ```

5. **Railway CLI Debug**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Link to project
   railway link
   
   # View logs
   railway logs
   
   # Check variables
   railway variables
   ```

---

**Last Updated:** 2025-01-07  
**Railway Platform:** v2  
**Node Version:** 20.19.5  
**Medusa Version:** 2.10.1  
**Next.js Version:** 15.5.3