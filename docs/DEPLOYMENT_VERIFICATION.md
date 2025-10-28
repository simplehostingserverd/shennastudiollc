# Deployment Verification Guide

## 🔍 Problem: Products Still Not Loading

The error message indicates the publishable key is not being sent with requests. This is because:
1. Railway is still deploying the new build, OR
2. Your browser is caching the old build

## ✅ How to Verify Deployment Status

### Step 1: Check Railway Deployment Progress

```bash
railway logs --service Storefront --follow
```

**Look for:**
- ✅ "Build successful"
- ✅ "Starting Next.js server on 0.0.0.0:3000"
- ✅ No error messages

OR check Railway dashboard:
https://railway.app/project/577d2457-301e-4c33-a951-bf90a33f0c9c

### Step 2: Check Environment Variables Are in Build

Once deployment completes, test this endpoint:

```
https://www.shennastudio.com/api/env-check
```

**Expected Response:**
```json
{
  "hasBackendUrl": true,
  "backendUrl": "https://backend-production-38d0a.up.railway.app",
  "hasPublishableKey": true,
  "publishableKeyPrefix": "pk_0d09b1d40ea",
  "nodeEnv": "production",
  "buildTime": "2025-10-09T..."
}
```

**If you see:**
- ❌ `"hasPublishableKey": false` → Environment variable not loaded in build
- ❌ `"publishableKeyPrefix": "NOT SET"` → Variable missing
- ✅ `"publishableKeyPrefix": "pk_0d09b1d40ea"` → Variable is correct!

### Step 3: Hard Refresh Your Browser

**CRITICAL:** Clear all cached content:

**On Mac:**
- Chrome/Edge: `Cmd + Shift + R` or `Cmd + Shift + Delete`
- Safari: `Cmd + Option + E` (empty cache), then `Cmd + R`

**On Windows/Linux:**
- Chrome/Edge: `Ctrl + Shift + R` or `Ctrl + Shift + Delete`
- Firefox: `Ctrl + Shift + Delete`

**Or use Incognito/Private mode:**
- This bypasses all cache
- Open new incognito window
- Go to https://www.shennastudio.com/products

## 🚀 What I Just Pushed

### Commit 1: Improved Medusa Client Configuration
- Extracted environment variables into constants
- Added debug logging for development
- Ensures publishable key is properly passed to Medusa SDK

### Commit 2: Environment Check Endpoint
- Created `/api/env-check` route
- Returns status of environment variables
- Helps verify variables are in the build

### Commit 3: Previous Fixes
- Updated publishable key to latest value
- Fixed hardcoded backend URL
- All environment variables configured

## 🧪 Testing After Deployment

### Test 1: Environment Variables
```bash
curl https://www.shennastudio.com/api/env-check
```

Should show `hasPublishableKey: true` and correct prefix.

### Test 2: Products Page
Visit: https://www.shennastudio.com/products

Should load products without errors.

### Test 3: Browser Console
Open DevTools → Console tab

Should be clean with no errors about publishable key.

### Test 4: Network Tab
Open DevTools → Network tab → Filter by "products"

Check the request headers - should include:
```
x-publishable-api-key: pk_0d09b1d40eac8fdcc445d4438066b292df69c5c48ee41b8b5bd74f926778a0e3
```

## ⏰ Timeline

Railway deployments typically take **2-5 minutes**. Current status:

- ✅ Environment variables set in Railway
- ✅ Code updated to properly use variables
- ✅ Git pushed (3 new commits)
- ⏳ Railway deploying now
- ⏳ Waiting for deployment to complete

## 🐛 If Still Not Working After Deployment

### Check 1: Variables in Deployment
```bash
railway logs --service Storefront | grep "NEXT_PUBLIC_MEDUSA"
```

### Check 2: Test Backend Directly
```bash
curl -H "x-publishable-api-key: pk_0d09b1d40eac8fdcc445d4438066b292df69c5c48ee41b8b5bd74f926778a0e3" \
  "https://backend-production-38d0a.up.railway.app/store/products?limit=1"
```

Should return products JSON.

### Check 3: Verify Build Completed
```bash
railway status --service Storefront
```

Should show "Active" or "Running".

### Check 4: Force Redeploy (Last Resort)

In Railway dashboard:
1. Go to Storefront service
2. Deployments tab
3. Click "⋮" on latest deployment
4. Click "Redeploy"

## 📋 What's Different Now

### Before (Not Working):
- ❌ Environment variable set but not being used correctly
- ❌ Old build cached in browser
- ❌ No way to verify variables loaded

### After (Should Work):
- ✅ Environment variable properly extracted and used
- ✅ `/api/env-check` endpoint to verify variables
- ✅ Debug logging added
- ✅ Clear instructions to clear cache

## 🎯 Success Criteria

When everything is working:

1. ✅ `/api/env-check` shows publishable key is loaded
2. ✅ Browser console has no publishable key errors
3. ✅ Products page loads with products
4. ✅ Network tab shows `x-publishable-api-key` header in requests
5. ✅ No SSL certificate errors
6. ✅ No CORS errors

## 📞 Next Steps

1. **Wait** for Railway deployment to complete (~2-5 min)
2. **Check** `/api/env-check` endpoint
3. **Hard refresh** browser (Cmd+Shift+R or Ctrl+Shift+R)
4. **Test** products page in incognito mode
5. **Verify** browser console is clean

If after all this it still doesn't work, the issue might be with how Medusa SDK handles the publishable key, and we may need to manually add it to request headers.
