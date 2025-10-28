# Critical: Production URL Mismatch Detected

## Problem Identified

There is a **mismatch between frontend and backend URLs** in your production configuration:

### Backend Configuration
**Location:** `backend/medusa-config.ts:87`
```typescript
backendUrl: process.env.BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  'https://api.shennastudio.com'
```

**CORS Settings:** `backend/medusa-config.ts:46-56`
```typescript
storeCors: 'https://shennastudio.com,https://www.shennastudio.com'
adminCors: 'https://api.shennastudio.com'
authCors: 'https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com'
```

### Frontend Configuration
**Location:** `frontend/.env.railway:4`
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-38d0a.up.railway.app
```

**Hardcoded Fallback:** `frontend/src/lib/medusa.ts:122`
```typescript
const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  (process.env.NODE_ENV === 'production' ?
    'https://backend-production-38d0a.up.railway.app' :
    'http://localhost:9000')
```

## Current Situation

You have **TWO different backend URLs**:

1. **Custom Domain (Configured in Backend)**
   - `https://api.shennastudio.com`
   - Configured in backend CORS and admin settings
   - Appears to be the intended production URL

2. **Railway Default URL (Used by Frontend)**
   - `https://backend-production-38d0a.up.railway.app`
   - Currently being used by frontend
   - Railway's auto-generated URL

## Which URL Should You Use?

### Option A: Use Custom Domain (Recommended)

**If `api.shennastudio.com` is set up in Railway:**

✅ **Advantages:**
- Professional custom domain
- Easier to remember
- Can migrate to other platforms without changing URLs
- Already configured in backend

❌ **Requirements:**
- Custom domain must be configured in Railway dashboard
- DNS must point to Railway
- SSL certificate must be active

### Option B: Use Railway URL

**If custom domain is NOT set up:**

✅ **Advantages:**
- Works immediately
- No DNS configuration needed
- Railway manages SSL automatically

❌ **Disadvantages:**
- Long, hard to remember URL
- Tied to Railway platform
- Backend configuration needs updating

## How to Check Which URL is Active

### Test 1: Check if Custom Domain is Working

```bash
curl https://api.shennastudio.com/health
```

**If it works:** You see a response → Custom domain IS set up
**If it fails:** Connection error → Custom domain NOT set up

### Test 2: Check Railway URL

```bash
curl https://backend-production-38d0a.up.railway.app/health
```

**Should always work** if backend is running on Railway.

### Test 3: Check Railway Dashboard

1. Go to https://railway.app/dashboard
2. Open your backend service
3. Click on "Settings" tab
4. Look under "Domains" section
5. Check if `api.shennastudio.com` is listed

## Solution Required

You MUST choose one URL and use it consistently:

### If Custom Domain EXISTS (Recommended)

Update frontend to use custom domain:

**File: `frontend/.env.railway`**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
```

**File: `frontend/src/lib/medusa.ts:122`**
```typescript
const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  (process.env.NODE_ENV === 'production' ?
    'https://api.shennastudio.com' :  // Changed
    'http://localhost:9000')
```

### If Custom Domain DOES NOT Exist

Update backend to use Railway URL:

**File: `backend/medusa-config.ts:87`**
```typescript
backendUrl: process.env.BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  'https://backend-production-38d0a.up.railway.app'  // Changed
```

**File: `backend/medusa-config.ts:51`**
```typescript
adminCors: process.env.ADMIN_CORS ||
  'https://backend-production-38d0a.up.railway.app'  // Changed
```

## Railway Environment Variables

**IMPORTANT:** The `.env.railway` files are for **build-time only**.

You MUST also set environment variables in Railway Dashboard for **runtime**:

### Frontend Service Variables (in Railway Dashboard)
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com (or Railway URL)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_a7f375f10252e8f6e87bc2b92ee863f5a7f5950e89256e86723b8d43131cd3c9
NEXT_PUBLIC_BASE_URL=https://www.shennastudio.com
NODE_ENV=production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=(your stripe key)
```

### Backend Service Variables (in Railway Dashboard)
```
BACKEND_URL=https://api.shennastudio.com (or Railway URL)
MEDUSA_BACKEND_URL=https://api.shennastudio.com (or Railway URL)
ADMIN_CORS=https://api.shennastudio.com (or Railway URL)
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com
DATABASE_URL=(from Railway PostgreSQL)
REDIS_URL=(from Railway Redis)
JWT_SECRET=(your secret)
COOKIE_SECRET=(your secret)
```

## Current Impact on Your 404 Errors

This URL mismatch could be contributing to your 404 errors if:

1. ❌ Environment variables are not set in Railway Dashboard
2. ❌ Frontend is calling wrong backend URL
3. ❌ Backend CORS is rejecting requests from frontend
4. ❌ Files are served from wrong domain

## Next Steps

**Please tell me:**

1. **Do you have a custom domain `api.shennastudio.com` set up in Railway?**
   - Go to Railway → Backend Service → Settings → Domains
   - Is `api.shennastudio.com` listed there?

2. **Which URL do you want to use for production?**
   - Option A: `https://api.shennastudio.com` (custom domain)
   - Option B: `https://backend-production-38d0a.up.railway.app` (Railway URL)

Once you confirm, I'll update ALL the configuration files to use the correct URL consistently across frontend and backend.
