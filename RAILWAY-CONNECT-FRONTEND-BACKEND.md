# Railway: Connect Frontend to Backend Guide

## 🎯 Overview

Your **backend is running** ✅ - Now we need to connect the frontend to it using environment variables.

---

## 📋 Quick Checklist

### What You Need From Backend:

1. ✅ **Backend URL** - Get from Railway backend service
2. ✅ **Publishable API Key** - Get from Medusa admin panel
3. ✅ **Backend Health Check** - Verify backend is responding

### What Frontend Needs:

1. ⚠️ **Backend connection variables**
2. ⚠️ **Authentication secrets**
3. ⚠️ **Stripe keys** (you already have these)
4. ⚠️ **Server configuration**

---

## 🚀 Step-by-Step Connection Guide

### Step 1: Get Your Backend URL

**In Railway Dashboard:**

1. Go to your **Backend Service** (Medusa Backend)
2. Click on the **Deployments** tab
3. Look for the **Domain** section
4. You'll see something like:
   ```
   medusa-backend-production.up.railway.app
   ```
   OR if you configured a custom domain:
   ```
   api.shennastudio.com
   ```

5. **Copy the full URL with https://**:
   ```
   https://medusa-backend-production.up.railway.app
   ```
   OR
   ```
   https://api.shennastudio.com
   ```

### Step 2: Verify Backend is Working

Test the backend health endpoint:

```bash
# Replace with your actual backend URL
curl https://your-backend-url.railway.app/health

# Expected response:
{"status":"ok"}
```

If you get `{"status":"ok"}`, your backend is ready! ✅

### Step 3: Get Publishable API Key

**Login to Medusa Admin:**

1. Open your backend URL + `/app`:
   ```
   https://your-backend-url.railway.app/app
   ```

2. **Login** with your credentials:
   - Email: Your `ADMIN_EMAIL` (e.g., admin@shennastudio.com)
   - Password: Your `ADMIN_PASSWORD`

3. **Navigate to Settings:**
   - Click **Settings** in the left sidebar
   - Click **Publishable API Keys**

4. **Get or Create Key:**
   - If a key exists: **Copy it** (starts with `pk_`)
   - If no key exists:
     - Click **Create Publishable API Key**
     - Give it a name: "Production Storefront"
     - Click **Save**
     - **Copy the key** (starts with `pk_`)

5. **Save the key** - You'll need it for the frontend!

Example key format:
```
pk_01JQXXXXXXXXXXXXXXXXXXX
```

### Step 4: Generate Secrets

Generate a secure NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Copy the output - you'll use this as `NEXTAUTH_SECRET`.

---

## 🔧 Frontend Environment Variables Setup

### In Railway Dashboard:

1. Go to your **Frontend Service** (Next.js Frontend)
2. Click **Variables** tab
3. Click **+ New Variable**
4. Add each variable below:

### Required Variables (Add These):

```bash
# ========================================
# MEDUSA BACKEND CONNECTION (CRITICAL!)
# ========================================

NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-url.railway.app
# Replace with YOUR actual backend URL from Step 1
# Example: https://medusa-backend-production.up.railway.app
# OR: https://api.shennastudio.com

NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01JQXXXXXXXXXXXXXXXXXXX
# Replace with YOUR actual key from Step 3
# This is the key you copied from Medusa admin panel


# ========================================
# STRIPE PAYMENT (You already have these)
# ========================================

STRIPE_SECRET_KEY=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

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMqYouB5PBrSK8udOL1PcTXM6J4rGqIKnA75jTTBOGqkMGKIDRnqOSxIK4BakHFUFXK9Bd0TTGB00VoS4YZTX


# ========================================
# NEXTAUTH AUTHENTICATION
# ========================================

NEXTAUTH_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE
# Generate with: openssl rand -base64 32
# This MUST be set or authentication will fail

NEXTAUTH_URL=https://your-frontend-url.railway.app
# OR: https://shennastudio.com
# This is YOUR frontend domain


# ========================================
# SERVER CONFIGURATION
# ========================================

NODE_ENV=production

NEXT_TELEMETRY_DISABLED=1

HOSTNAME=0.0.0.0

PORT=3000
```

---

## 📸 Visual Guide: Adding Variables in Railway

### Step-by-Step:

1. **Click "Variables" tab** in your Frontend Service
2. **Click "+ New Variable"** button
3. **Enter Variable Name** (e.g., `NEXT_PUBLIC_MEDUSA_BACKEND_URL`)
4. **Enter Value** (e.g., `https://your-backend.railway.app`)
5. **Click "Add"**
6. **Repeat for all variables**
7. **Click "Deploy"** or wait for auto-redeploy

### Screenshot Reference:
```
┌─────────────────────────────────────────┐
│ Variables                               │
├─────────────────────────────────────────┤
│ + New Variable                          │
│                                         │
│ NEXT_PUBLIC_MEDUSA_BACKEND_URL         │
│ https://backend.railway.app        [×] │
│                                         │
│ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY     │
│ pk_01JQX...                        [×] │
│                                         │
│ NEXTAUTH_SECRET                        │
│ ••••••••••••••••••••••••           [×] │
│                                         │
│ [Add Variable]                          │
└─────────────────────────────────────────┘
```

---

## ✅ Complete Variable List

Copy this checklist and check off as you add each variable:

### Critical (Frontend won't work without these):
- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Backend URL
- [ ] `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - From admin panel
- [ ] `NEXTAUTH_SECRET` - Generated secret
- [ ] `NEXTAUTH_URL` - Your frontend domain

### Stripe (You already have these):
- [ ] `STRIPE_SECRET_KEY` - Server-side Stripe key
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side Stripe key

### Server Config:
- [ ] `NODE_ENV=production`
- [ ] `NEXT_TELEMETRY_DISABLED=1`
- [ ] `HOSTNAME=0.0.0.0`
- [ ] `PORT=3000`

---

## 🔍 Verify Connection

### After Adding Variables and Redeploying:

1. **Check Build Logs:**
   ```
   ✅ Should see: "Compiled successfully"
   ❌ If error: Check for missing variables in error message
   ```

2. **Check Deploy Logs:**
   ```
   ✅ Should see: "Ready in X.Xs"
   ❌ If crash: Missing NEXTAUTH_SECRET or backend connection issue
   ```

3. **Test in Browser:**
   - Visit: `https://your-frontend.railway.app`
   - Homepage should load ✅
   - Open **Browser Console** (F12)
   - Look for errors:
     - ❌ `NEXT_PUBLIC_MEDUSA_BACKEND_URL is not defined` → Variable not set
     - ❌ `CORS error` → Backend STORE_CORS not configured
     - ✅ No errors → Connection working!

4. **Test Products Page:**
   - Visit: `https://your-frontend.railway.app/products`
   - Should fetch products from backend
   - Check Network tab (F12) for API calls:
     ```
     GET https://your-backend.railway.app/store/products
     Status: 200 ✅
     ```

---

## 🚨 Troubleshooting

### Issue 1: "Cannot read property of undefined (NEXT_PUBLIC_MEDUSA_BACKEND_URL)"

**Cause:** Variable not set or incorrectly named

**Fix:**
1. Go to Railway → Frontend Service → Variables
2. Verify variable name is **EXACTLY**: `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
3. Verify value starts with `https://`
4. Click "Deploy" to redeploy with new variables

### Issue 2: Frontend builds but crashes on start

**Cause:** Missing `NEXTAUTH_SECRET`

**Fix:**
1. Generate secret: `openssl rand -base64 32`
2. Add to Railway Variables: `NEXTAUTH_SECRET=<paste-generated-value>`
3. Redeploy

### Issue 3: CORS error when fetching products

**Error in browser console:**
```
Access to fetch at 'https://backend.railway.app/store/products' 
from origin 'https://frontend.railway.app' has been blocked by CORS policy
```

**Fix:**
1. Go to Railway → **Backend Service** → Variables
2. Add or update:
   ```
   STORE_CORS=https://your-frontend.railway.app
   ```
   If you have multiple domains:
   ```
   STORE_CORS=https://frontend.railway.app,https://shennastudio.com,https://www.shennastudio.com
   ```
3. Redeploy **backend**
4. Test again

### Issue 4: "Invalid publishable key"

**Cause:** Wrong key or key not from your backend

**Fix:**
1. Login to backend admin: `https://your-backend.railway.app/app`
2. Go to Settings → Publishable API Keys
3. Copy the CORRECT key (starts with `pk_`)
4. Update `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in frontend variables
5. Redeploy frontend

### Issue 5: Frontend still failing after adding all variables

**Check Deploy Logs for specific errors:**

```bash
# In Railway:
# Frontend Service → Deployments → Click latest deployment → Deploy Logs
```

Common errors:
- `Error: getaddrinfo ENOTFOUND` → Backend URL is wrong
- `Error: connect ECONNREFUSED` → Backend is not running
- `Module not found` → Build issue, not variable issue
- `Invalid URL` → NEXT_PUBLIC_MEDUSA_BACKEND_URL format is wrong

---

## 🎯 Quick Test Script

Save this and run it to verify your setup:

```bash
#!/bin/bash

# Test Backend and Frontend Connection
# Replace these with your actual URLs

BACKEND_URL="https://your-backend.railway.app"
FRONTEND_URL="https://your-frontend.railway.app"

echo "🧪 Testing Backend and Frontend Connection..."
echo ""

# Test 1: Backend Health
echo "1️⃣ Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/health)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "   ✅ Backend is healthy"
else
    echo "   ❌ Backend health check failed (Status: $HEALTH_RESPONSE)"
fi
echo ""

# Test 2: Backend Store API
echo "2️⃣ Testing Backend Store API..."
STORE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/store/products)
if [ "$STORE_RESPONSE" = "200" ]; then
    echo "   ✅ Backend Store API is working"
else
    echo "   ❌ Backend Store API failed (Status: $STORE_RESPONSE)"
fi
echo ""

# Test 3: Frontend Homepage
echo "3️⃣ Testing Frontend Homepage..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL/)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "   ✅ Frontend is responding"
else
    echo "   ❌ Frontend failed (Status: $FRONTEND_RESPONSE)"
fi
echo ""

# Test 4: CORS (Frontend making request to Backend)
echo "4️⃣ Testing CORS (Frontend → Backend)..."
CORS_TEST=$(curl -s -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: GET" -X OPTIONS $BACKEND_URL/store/products -o /dev/null -w "%{http_code}")
if [ "$CORS_TEST" = "200" ] || [ "$CORS_TEST" = "204" ]; then
    echo "   ✅ CORS is properly configured"
else
    echo "   ⚠️  CORS might not be configured (Status: $CORS_TEST)"
fi
echo ""

echo "✨ Test Complete!"
```

---

## 📋 Final Deployment Checklist

### Before Deploying Frontend:
- [ ] Backend is deployed and healthy (`/health` returns 200)
- [ ] Backend admin panel is accessible (`/app` loads)
- [ ] You have the publishable key from admin panel
- [ ] You've generated NEXTAUTH_SECRET

### Frontend Variables Set:
- [ ] NEXT_PUBLIC_MEDUSA_BACKEND_URL (with https://)
- [ ] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY (starts with pk_)
- [ ] NEXTAUTH_SECRET (32+ character secret)
- [ ] NEXTAUTH_URL (your frontend domain)
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] NODE_ENV=production
- [ ] NEXT_TELEMETRY_DISABLED=1
- [ ] HOSTNAME=0.0.0.0
- [ ] PORT=3000

### Backend CORS Configured:
- [ ] STORE_CORS includes frontend domain
- [ ] Backend redeployed after adding STORE_CORS

### After Frontend Deploys:
- [ ] Build succeeds (check Build Logs)
- [ ] Deploy succeeds (check Deploy Logs)
- [ ] Homepage loads in browser
- [ ] No errors in browser console
- [ ] Products page loads and fetches data
- [ ] No CORS errors

---

## 🎉 Success!

When everything is working, you should see:

✅ **Backend**: Healthy at `/health`  
✅ **Frontend**: Homepage loads  
✅ **Connection**: Products fetch from backend  
✅ **No CORS errors** in browser console  
✅ **Cart works**: Can add products to cart  
✅ **Checkout loads**: Stripe integration working  

---

## 📞 Need Help?

If frontend still fails after following this guide:

1. **Check Deploy Logs** in Railway (Frontend Service → Deployments → Deploy Logs)
2. **Check Browser Console** (F12 → Console tab)
3. **Verify ALL variables** are set correctly (no typos!)
4. **Test backend** directly with curl to ensure it's responding
5. **Check CORS** - backend must allow frontend domain

---

## 📚 Related Documentation

- [RAILWAY-DEPLOYMENT-CHECKLIST.md](./RAILWAY-DEPLOYMENT-CHECKLIST.md)
- [CORS-CONFIGURATION.md](./CORS-CONFIGURATION.md)
- [RAILWAY-CONFIG-FILE-SETUP.md](./RAILWAY-CONFIG-FILE-SETUP.md)
- [railway-frontend-production.env](./railway-frontend-production.env)

---

**Last Updated:** 2025-01-07  
**Medusa Version:** 2.10.1  
**Next.js Version:** 15.5.3