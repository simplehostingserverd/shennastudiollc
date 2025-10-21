# Railway Environment Variables Setup (CRITICAL)

## Problem

The `.env.railway` files in your codebase are **ONLY used during build time** by Nixpacks. They are **NOT automatically loaded at runtime** by Railway.

This means even though you have environment files in your repo, Railway services might not have the required environment variables set, which could be causing:
- ❌ 404 errors for static assets
- ❌ Frontend unable to connect to backend
- ❌ Missing API keys
- ❌ Build failures

## Solution: Set Environment Variables in Railway Dashboard

You MUST set these environment variables **directly in Railway Dashboard** for each service.

---

## Frontend Service Environment Variables

**Go to:** Railway Dashboard → Your Project → Frontend Service → Variables tab

**Click "+ New Variable"** and add each of these:

### Required Variables

```bash
# Backend Connection (CRITICAL)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-38d0a.up.railway.app

# Medusa API Key
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_a7f375f10252e8f6e87bc2b92ee863f5a7f5950e89256e86723b8d43131cd3c9

# Frontend Base URL
NEXT_PUBLIC_BASE_URL=https://www.shennastudio.com

# Node Environment
NODE_ENV=production

# Stripe (REQUIRED for checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### Optional Variables (if using these features)

```bash
# Email Service
RESEND_API_KEY=re_YOUR_RESEND_API_KEY
RESEND_FROM_EMAIL=Shenna's Studio <noreply@shennastudio.com>
ADMIN_EMAIL=shenna@shennastudio.com

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY
RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY

# Algolia Search
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=YOUR_APP_ID
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=YOUR_SEARCH_KEY

# Cloudinary
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET

# Database (if using Prisma)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT for admin auth
JWT_SECRET=YOUR_LONG_RANDOM_SECRET_HERE
```

---

## Backend Service Environment Variables

**Go to:** Railway Dashboard → Your Project → Backend Service → Variables tab

**Click "+ New Variable"** and add each of these:

### Required Variables

```bash
# Backend URLs
BACKEND_URL=https://backend-production-38d0a.up.railway.app
MEDUSA_BACKEND_URL=https://backend-production-38d0a.up.railway.app

# CORS Configuration
ADMIN_CORS=https://backend-production-38d0a.up.railway.app
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://backend-production-38d0a.up.railway.app

# Node Environment
NODE_ENV=production

# Database (from Railway PostgreSQL plugin)
DATABASE_URL=${DATABASE_URL}  # This should auto-populate if you added PostgreSQL plugin

# Redis (from Railway Redis plugin)
REDIS_URL=${REDIS_URL}  # This should auto-populate if you added Redis plugin

# Secrets (CHANGE THESE!)
JWT_SECRET=REPLACE_WITH_SECURE_64_CHAR_STRING
COOKIE_SECRET=REPLACE_WITH_SECURE_64_CHAR_STRING

# Stripe
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Admin User (for auto-creation)
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YOUR_SECURE_PASSWORD_HERE
```

### Optional Variables

```bash
# Database SSL (if needed)
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Worker Mode
WORKER_MODE=shared

# Disable admin panel
DISABLE_ADMIN=false

# Database logging
DATABASE_LOGGING=false
```

---

## How to Set Variables in Railway Dashboard

### Method 1: One at a Time (Recommended for first-time setup)

1. **Open Railway Dashboard**
   - Go to: https://railway.app/dashboard
   - Select your project: `shennastudiollc`

2. **Select Service**
   - Click on **Frontend** or **Backend** service

3. **Open Variables Tab**
   - Click on **"Variables"** tab at the top

4. **Add Each Variable**
   - Click **"+ New Variable"** button
   - Enter variable name (e.g., `NEXT_PUBLIC_MEDUSA_BACKEND_URL`)
   - Enter value (e.g., `https://backend-production-38d0a.up.railway.app`)
   - Click **"Add"**
   - Repeat for all variables

5. **Deploy**
   - After adding all variables, Railway will automatically redeploy

### Method 2: RAW Editor (Faster for bulk upload)

1. **Open Variables Tab**
   - Click on **"Variables"** tab

2. **Click "RAW Editor"**
   - Button in top right of Variables section

3. **Paste All Variables**
   - Copy all variables for that service (see sections above)
   - Paste into RAW editor
   - Format: `KEY=value` (one per line)

4. **Save**
   - Railway will validate and deploy changes

---

## Important Notes

### About `NEXT_PUBLIC_` Variables

Variables starting with `NEXT_PUBLIC_` are **exposed to the browser**. These are required for:
- Frontend to know backend URL
- Stripe checkout to work
- Algolia search to work
- Any client-side features

**DO NOT** prefix secret keys with `NEXT_PUBLIC_` (they will be exposed to users!)

### About Railway Service References

If your backend and frontend are in the same Railway project, you can use service references:

```bash
# Instead of hardcoding the backend URL, you can reference it:
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

But this requires the backend service to be named exactly `backend` in Railway.

### About Database and Redis

If you added PostgreSQL and Redis as Railway plugins, their URLs are automatically injected:
- `$DATABASE_URL` - PostgreSQL connection string
- `$REDIS_URL` - Redis connection string

You don't need to manually set these.

### Secret Generation

For `JWT_SECRET` and `COOKIE_SECRET`, generate secure random strings:

```bash
# Run this in your terminal to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your secret.

---

## Verification Steps

After setting all environment variables:

### 1. Check Frontend Service

1. Go to Frontend service in Railway
2. Click "Deployments"
3. Wait for new deployment to start and complete
4. Check build logs for:
   ```
   Medusa Client Initializing: {
     baseUrl: 'https://backend-production-38d0a.up.railway.app',
     hasPublishableKey: true,
     ...
   }
   ```

### 2. Check Backend Service

1. Go to Backend service in Railway
2. Check logs for successful startup
3. No errors about missing environment variables

### 3. Test the Website

1. Visit: https://www.shennastudio.com
2. Open browser console (F12)
3. Check for:
   - ✅ No 404 errors
   - ✅ No CORS errors
   - ✅ Products load
   - ✅ Can add to cart

---

## Troubleshooting

### Frontend Still Shows 404 Errors

**Check:**
1. Did you set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in Frontend service?
2. Did Railway redeploy after setting variables?
3. Did the build complete successfully?

**Fix:**
- Trigger manual redeploy: Frontend service → Deployments → Deploy

### Backend Returns CORS Errors

**Check:**
1. Is `STORE_CORS` set to include `https://shennastudio.com` and `https://www.shennastudio.com`?
2. Is frontend URL in the CORS list?

**Fix:**
- Update `STORE_CORS` and `AUTH_CORS` to include all frontend domains

### Stripe Checkout Not Working

**Check:**
1. Is `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set in Frontend?
2. Is `STRIPE_SECRET_KEY` set in Backend?
3. Are you using live keys (pk_live_... / sk_live_...) or test keys?

**Fix:**
- Set correct Stripe keys
- Make sure publishable key starts with `NEXT_PUBLIC_`

---

## Current Configuration Status

Based on code analysis:

✅ **Correctly Configured:**
- Frontend `.env.railway` has Railway backend URL
- Backend fallback URLs updated to Railway URL
- CORS settings include all necessary domains

⚠️ **Needs Verification:**
- Are these variables set in Railway Dashboard?
- Are you using correct Stripe keys?
- Is DATABASE_URL and REDIS_URL properly connected?

❌ **Known Issues:**
- Custom domain `api.shennastudio.com` has SSL certificate error
- Environment variables may not be set in Railway Dashboard

---

## Next Steps

**IMMEDIATELY:**

1. ✅ **Set environment variables in Railway Dashboard** (see instructions above)
2. ✅ **Wait for automatic redeployment** (~5-10 minutes)
3. ✅ **Test website** - 404 errors should be resolved
4. ✅ **Test checkout** - Make sure Stripe integration works

**LATER** (Optional):

1. Set up custom domain `api.shennastudio.com` properly in Railway:
   - Add domain to Backend service in Railway
   - Update DNS records to point to Railway
   - Wait for SSL certificate to provision
   - Update all URLs to use custom domain

---

**Need Help?**

If you need assistance setting up the environment variables:
1. Take screenshots of your Railway Dashboard
2. Check Railway docs: https://docs.railway.app/develop/variables
3. Ask me any questions!
