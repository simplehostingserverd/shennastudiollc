# Railway Config File Path Setup Guide

## Overview

Railway allows you to specify custom config file paths in the Service Settings, making it easy to manage separate configurations for frontend and backend in a monorepo.

---

## 🎯 How It Works

Railway supports two config file formats:
- `railway.json` (JSON format)
- `railway.toml` (TOML format)

You can specify which file to use in **Service Settings → Config File Path**.

---

## 📁 Our Monorepo Structure

```
shennastudiollc/
├── railway.json              ← Frontend config
├── nixpacks.toml            ← Frontend build config
├── ocean-backend/
│   ├── railway.json         ← Backend config
│   └── nixpacks.toml        ← Backend build config
└── (other files)
```

---

## 🚀 Setup Instructions

### Backend Service Setup

1. **Create Backend Service in Railway**
   - Dashboard → New Service → GitHub Repo
   - Select `shennastudiollc`
   - Name: "Medusa Backend"

2. **Configure Service Settings**
   - Go to: Settings → Service Settings
   - **Root Directory**: `ocean-backend`
   - **Config File Path**: `railway.json` (Railway will look in ocean-backend/)
   
   OR leave Config File Path empty - Railway auto-detects `railway.json` in the root directory (which is `ocean-backend/` due to Root Directory setting)

3. **Add Environment Variables**
   ```bash
   # Required
   DATABASE_URL=<from-postgresql-addon>
   REDIS_URL=<from-redis-addon>
   JWT_SECRET=<generate-with-openssl-rand-base64-32>
   COOKIE_SECRET=<generate-with-openssl-rand-base64-32>
   NODE_ENV=production
   ADMIN_EMAIL=admin@shennastudio.com
   ADMIN_PASSWORD=<your-secure-password>
   
   # CORS
   STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
   ADMIN_CORS=https://api.shennastudio.com
   AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com
   ```

4. **Deploy**
   - Railway will use `ocean-backend/railway.json`
   - Auto-detects `ocean-backend/nixpacks.toml`
   - Builds and deploys automatically

### Frontend Service Setup

1. **Create Frontend Service in Railway**
   - Dashboard → New Service → GitHub Repo
   - Select `shennastudiollc`
   - Name: "Next.js Frontend"

2. **Configure Service Settings**
   - Go to: Settings → Service Settings
   - **Root Directory**: `.` (or leave empty for repository root)
   - **Config File Path**: `railway.json` (Railway will look in root/)
   
   OR leave Config File Path empty - Railway auto-detects `railway.json` in root

3. **Add Environment Variables**
   ```bash
   # Backend Connection
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<get-from-admin-panel>
   
   # Stripe
   STRIPE_SECRET_KEY=sk_live_51RdPwMP4GPds5FMq...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMq...
   
   # NextAuth
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=https://shennastudio.com
   
   # Server
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   HOSTNAME=0.0.0.0
   PORT=3000
   ```

4. **Deploy**
   - Railway will use `railway.json` from root
   - Auto-detects `nixpacks.toml` from root
   - Builds and deploys automatically

---

## 📋 Configuration Files Summary

### Backend: `ocean-backend/railway.json`

```json
{
  "$schema": "https://railway.com/railway.schema.json",
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

**What it does:**
- ✅ Uses Nixpacks builder
- ✅ Installs with `npm ci` (deterministic)
- ✅ Builds Medusa: `npm run build` → `npx medusa build`
- ✅ Starts: `npm start` → `npx medusa start`
- ✅ Health check at `/health`
- ✅ Auto-restarts on failure (max 10 retries)

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

**What it does:**
- ✅ Installs Node.js 20, OpenSSL, PostgreSQL
- ✅ Runs `npm ci` with dev dependencies
- ✅ Builds Medusa backend
- ✅ Starts on port 9000

### Frontend: `railway.json` (root)

```json
{
  "$schema": "https://railway.com/railway.schema.json",
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

**What it does:**
- ✅ Uses Nixpacks builder
- ✅ Installs with `npm ci`
- ✅ Builds Next.js: `npm run build` → creates `.next/standalone/`
- ✅ Starts: `npm start` → runs standalone server
- ✅ Health check at `/` (homepage)
- ✅ Auto-restarts on failure (max 10 retries)

### Frontend: `nixpacks.toml` (root)

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

**What it does:**
- ✅ Installs Node.js 20, OpenSSL
- ✅ Runs `npm ci` with fallback
- ✅ Builds Next.js
- ✅ Starts on port 3000, binds to 0.0.0.0

---

## 🎨 Visual Guide: Service Settings

### Backend Service Settings

```
Service: Medusa Backend
├── Source
│   └── GitHub: simplehostingserverd/shennastudiollc
│       └── Branch: main
│
├── Build & Deploy
│   ├── Root Directory: ocean-backend       ← CRITICAL!
│   ├── Config File: railway.json           ← Railway finds ocean-backend/railway.json
│   ├── Build Command: (from config)        ← npm ci && npm run build
│   └── Start Command: (from config)        ← npm start
│
├── Health Check
│   ├── Path: /health                       ← (from config)
│   └── Timeout: 300s                       ← (from config)
│
└── Variables
    ├── DATABASE_URL: (from PostgreSQL addon)
    ├── REDIS_URL: (from Redis addon)
    ├── JWT_SECRET: <your-secret>
    ├── COOKIE_SECRET: <your-secret>
    ├── ADMIN_EMAIL: admin@shennastudio.com
    ├── ADMIN_PASSWORD: <secure-password>
    └── (CORS variables...)
```

### Frontend Service Settings

```
Service: Next.js Frontend
├── Source
│   └── GitHub: simplehostingserverd/shennastudiollc
│       └── Branch: main
│
├── Build & Deploy
│   ├── Root Directory: . (or empty)        ← Repository root
│   ├── Config File: railway.json           ← Railway finds railway.json in root
│   ├── Build Command: (from config)        ← npm ci && npm run build
│   └── Start Command: (from config)        ← npm start
│
├── Health Check
│   ├── Path: /                             ← (from config) Homepage
│   └── Timeout: 300s                       ← (from config)
│
└── Variables
    ├── NEXT_PUBLIC_MEDUSA_BACKEND_URL: https://api.shennastudio.com
    ├── NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: <from-admin>
    ├── NEXTAUTH_SECRET: <your-secret>
    ├── STRIPE_SECRET_KEY: sk_live_...
    └── (other variables...)
```

---

## ✅ Verification Steps

### After Backend Deploy

1. **Check Build Logs**
   ```
   ✅ Should see: "Backend build completed successfully"
   ✅ Should see: ".medusa/server" and ".medusa/client" created
   ```

2. **Check Deploy Logs**
   ```
   ✅ Should see: "Server is ready on port: 9000"
   ✅ No crash loops
   ```

3. **Test Health Endpoint**
   ```bash
   curl https://your-backend.railway.app/health
   # Expected: {"status":"ok"}
   ```

4. **Test Admin Panel**
   - Visit: `https://your-backend.railway.app/app`
   - Login with ADMIN_EMAIL and ADMIN_PASSWORD
   - Should load successfully

### After Frontend Deploy

1. **Check Build Logs**
   ```
   ✅ Should see: "Compiled successfully"
   ✅ Should see: ".next/standalone" created
   ```

2. **Check Deploy Logs**
   ```
   ✅ Should see: "Ready in X.Xs"
   ✅ No crash loops
   ```

3. **Test Homepage**
   ```bash
   curl https://your-frontend.railway.app/
   # Expected: HTML response with status 200
   ```

4. **Test in Browser**
   - Visit: `https://your-frontend.railway.app`
   - Should load without errors
   - Check browser console for CORS errors (should be none)

---

## 🚨 Common Issues & Solutions

### Issue: "Config file not found"

**Cause:** Config File Path is incorrect or Root Directory is wrong

**Fix:**
1. Go to Service Settings
2. Verify **Root Directory** is correct
3. Verify **Config File Path** is `railway.json` (or leave empty for auto-detect)
4. If using custom path, ensure it's relative to Root Directory

### Issue: Backend builds but crashes immediately

**Symptoms:**
```
❌ Backend build not found! Check Railway build logs.
Expected: ocean-backend/.medusa
```

**Fix:**
1. Root Directory **MUST** be `ocean-backend`
2. Check that `ocean-backend/railway.json` exists
3. Redeploy after setting Root Directory

### Issue: Frontend can't connect to backend (CORS errors)

**Symptoms:**
```
Access to fetch at 'https://api.shennastudio.com/store/products' 
from origin 'https://shennastudio.com' has been blocked by CORS policy
```

**Fix:**
1. Add to Backend Variables:
   ```
   STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
   ```
2. Redeploy backend
3. Clear browser cache and test again

### Issue: Service keeps restarting

**Symptoms:** Logs show restart loop, never stays running

**Fix:**
1. Check Deploy Logs for error messages
2. Verify all required environment variables are set
3. For Backend: DATABASE_URL and REDIS_URL must be set
4. For Frontend: NEXT_PUBLIC_MEDUSA_BACKEND_URL must be set
5. Check health check endpoint is responding

---

## 📚 Configuration Reference

### Available Settings in railway.json

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS" | "DOCKERFILE",
    "buildCommand": "string",
    "watchPatterns": ["string"]
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "string",
    "restartPolicyType": "ON_FAILURE" | "ALWAYS" | "NEVER",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "preDeployCommand": ["string"]
  }
}
```

### Key Settings Explained

**builder**: Build system to use
- `NIXPACKS` - Auto-detects language and builds (recommended)
- `DOCKERFILE` - Uses your Dockerfile

**buildCommand**: Command to build your app
- Backend: `npm ci && npm run build`
- Frontend: `npm ci && npm run build`

**startCommand**: Command to start your app
- Backend: `npm start` → runs `npx medusa start`
- Frontend: `npm start` → runs standalone Next.js server

**restartPolicyType**: When to restart on failure
- `ON_FAILURE` - Only restart if process exits with error (recommended)
- `ALWAYS` - Always restart, even on success
- `NEVER` - Never restart

**restartPolicyMaxRetries**: Max restart attempts (10 recommended)

**healthcheckPath**: Endpoint to check if service is healthy
- Backend: `/health`
- Frontend: `/` (homepage)

**healthcheckTimeout**: How long to wait for health check (300s = 5 minutes)

---

## 🎉 Success Checklist

### Backend
- [ ] Root Directory set to `ocean-backend`
- [ ] Config File Path set to `railway.json` (or empty)
- [ ] PostgreSQL addon added
- [ ] Redis addon added
- [ ] All environment variables set
- [ ] Build succeeds: "Backend build completed successfully"
- [ ] Deploy succeeds: "Server is ready on port: 9000"
- [ ] Health check passes: `/health` returns 200
- [ ] Admin panel loads: `/app`
- [ ] No crash loops

### Frontend
- [ ] Root Directory set to `.` or empty
- [ ] Config File Path set to `railway.json` (or empty)
- [ ] Backend deployed and healthy
- [ ] Publishable key obtained from admin
- [ ] All environment variables set
- [ ] Build succeeds: "Compiled successfully"
- [ ] Deploy succeeds: "Ready in X.Xs"
- [ ] Health check passes: `/` returns 200
- [ ] Homepage loads in browser
- [ ] Products fetch from backend (no CORS errors)
- [ ] No crash loops

---

## 📖 Related Documentation

- [RAILWAY-DEPLOYMENT-CHECKLIST.md](./RAILWAY-DEPLOYMENT-CHECKLIST.md) - Complete deployment guide
- [CORS-CONFIGURATION.md](./CORS-CONFIGURATION.md) - CORS setup and troubleshooting
- [railway-frontend-production.env](./railway-frontend-production.env) - Frontend env template
- [ocean-backend/railway-backend-ready.env](./ocean-backend/railway-backend-ready.env) - Backend env template
- [Railway Config as Code Docs](https://docs.railway.com/guides/config-as-code) - Official documentation

---

**Last Updated:** 2025-01-07  
**Railway Platform:** v2  
**Config Schema:** https://railway.com/railway.schema.json  
**Node Version:** 20.19.5  
**Medusa Version:** 2.10.1  
**Next.js Version:** 15.5.3