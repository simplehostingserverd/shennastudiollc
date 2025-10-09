# Products Loading Fix - Complete Summary

## 🎯 Problem
Products were not loading on https://www.shennastudio.com/products

**Error in Browser Console:**
```
The certificate for this server is invalid.
Fetch API cannot load https://api.shennastudio.com/store/products due to access control checks.
TypeError: Load failed
```

## 🔍 Root Causes Found

### Issue 1: Invalid SSL Certificate
- Frontend was trying to connect to: `api.shennastudio.com`
- That domain had an invalid SSL certificate (showing `*.up.railway.app` cert)
- Browsers blocked the requests due to certificate mismatch

### Issue 2: Missing Publishable API Key
- Backend required `x-publishable-api-key` header (Medusa v2 security feature)
- Frontend didn't have `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` configured
- Backend was rejecting all store API requests without this key

## ✅ Solutions Applied

### Fix 1: Update Backend URL to Use Railway Domain
Changed frontend environment variable:

**Before:**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL="${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}"  # Broken reference
```

**After:**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL="https://backend-production-38d0a.up.railway.app"  # Valid SSL
```

**Applied via:**
```bash
railway variables --service Storefront \
  --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-38d0a.up.railway.app"
```

### Fix 2: Add Publishable API Key
Added the store's publishable key to frontend:

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="pk_6a37c3b3ca97ea1789386e39845ff16d0290883e1db8214db471f3d10e05b9a8"
```

**Applied via:**
```bash
railway variables --service Storefront \
  --set "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_6a37c3b3ca97ea1789386e39845ff16d0290883e1db8214db471f3d10e05b9a8"
```

### Fix 3: Redeploy Frontend
Triggered two redeployments via git commits to apply the environment variable changes:

```bash
# First redeploy (backend URL fix)
git commit --allow-empty -m "chore: redeploy frontend with updated backend URL to fix SSL certificate issue"
git push origin main

# Second redeploy (publishable key)
git commit --allow-empty -m "chore: add publishable API key for Medusa store access"
git push origin main
```

## 🧪 Verification

### Backend API Test (Successful)
```bash
curl -H "x-publishable-api-key: pk_6a37c3b3ca97ea1789386e39845ff16d0290883e1db8214db471f3d10e05b9a8" \
  "https://backend-production-38d0a.up.railway.app/store/products?limit=3"
```

**Result:** ✅ Returns 3 products (Medusa T-Shirt, Sweatpants, Sweatshirt)

### Current Configuration

**Storefront Service Variables:**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-38d0a.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_6a37c3b3ca97ea1789386e39845ff16d0290883e1db8214db471f3d10e05b9a8
NEXT_PUBLIC_BASE_URL=https://www.shennastudio.com
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
```

**Backend Service CORS:**
```bash
STORE_CORS=https://www.shennastudio.com,'www.shennastudio.com'
AUTH_CORS=https://backend-production-38d0a.up.railway.app,https://backend.railway.internal
ADMIN_CORS=https://backend-production-38d0a.up.railway.app,https://backend.railway.internal
```

## 📊 Timeline

1. **Initial Issue**: Frontend stuck in infinite loading, SSL certificate errors
2. **Investigation**: Identified `api.shennastudio.com` SSL mismatch
3. **Fix 1**: Updated to Railway backend URL `backend-production-38d0a.up.railway.app`
4. **New Issue**: Backend requiring publishable API key
5. **Fix 2**: Created publishable key in admin panel and added to frontend
6. **Verification**: Backend API responding correctly with products
7. **Deployment**: Two redeployments triggered to apply changes

## 🚀 Expected Result

Once Railway completes the frontend deployment (typically 2-5 minutes):

1. ✅ Visit https://www.shennastudio.com/products
2. ✅ Products should load from backend
3. ✅ No SSL certificate errors
4. ✅ No CORS errors
5. ✅ Browser console clean

## 🔍 How to Monitor Deployment

### Check Railway Logs
```bash
railway logs --service Storefront
```

Look for:
- Build completion
- Server startup: "Starting Next.js server on 0.0.0.0:3000"
- No error messages

### Check Deployment Status
Visit: https://railway.app/project/577d2457-301e-4c33-a951-bf90a33f0c9c

Or via CLI:
```bash
railway status --service Storefront
```

### Test After Deployment
```bash
# Check if frontend is responding
curl -I https://www.shennastudio.com/products

# Should return 200 OK
```

## 🛟 Troubleshooting

### If products still don't load after deployment:

1. **Hard refresh browser** (clear cache):
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`

2. **Check browser console** for any remaining errors

3. **Verify environment variables made it into the build**:
   ```bash
   railway logs --service Storefront | grep NEXT_PUBLIC_MEDUSA
   ```

4. **Test backend directly**:
   ```bash
   curl "https://backend-production-38d0a.up.railway.app/health"
   ```

5. **Check Medusa SDK is sending the key**:
   - Open browser DevTools → Network tab
   - Look for requests to `/store/products`
   - Check request headers for `x-publishable-api-key`

## 📝 Key Learnings

1. **Service References Must Be Direct**: `${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}` doesn't work from frontend, use `${{Backend.RAILWAY_PUBLIC_DOMAIN}}` or direct URL
2. **Medusa v2 Requires Publishable Keys**: All storefront API requests need the publishable key header
3. **Environment Variables Need Rebuild**: Next.js embeds `NEXT_PUBLIC_*` vars at build time, requires redeploy
4. **Railway Domain SSL Always Works**: Using Railway's `.up.railway.app` domains avoids SSL certificate configuration issues

## 🎉 Success Criteria

- ✅ Backend URL changed from broken `api.shennastudio.com` to working Railway URL
- ✅ Publishable API key configured
- ✅ Backend API verified responding with products
- ✅ Frontend redeployed twice to pick up changes
- ✅ CORS configured correctly on backend
- ⏳ Waiting for Railway deployment to complete

## 📚 Related Documentation

- Backend connection guide: `docs/CONNECT-FRONTEND-TO-BACKEND.md`
- Publishable key setup: `PUBLISHABLE_KEY_SETUP.md`
- Redeploy instructions: `REDEPLOY_INSTRUCTIONS.md`
- Railway variable setup: `RAILWAY_VARIABLE_SETUP.md`

## 🔐 Security Note

The publishable API key (`pk_...`) is safe to expose in frontend code. It's designed to be public and only allows read access to store data. Backend operations still require proper authentication.
