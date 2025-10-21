# CORS Troubleshooting Guide

## Current Issue
Frontend at `https://www.shennastudio.com` cannot connect to backend API at `https://api.shennastudio.com` due to CORS errors.

## Required Backend Environment Variables

The backend **MUST** have these exact environment variables in Coolify:

```bash
STORE_CORS=https://www.shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://www.shennastudio.com
```

**Critical Requirements:**
- ✅ No spaces in the values
- ✅ Must include `https://` protocol
- ✅ Must exactly match your frontend domain
- ✅ Backend must be **restarted** after setting these

## Checklist

### 1. Backend Deployment Status
- [ ] Backend is successfully deployed and running
- [ ] No errors in backend deployment logs
- [ ] Backend build completed successfully (admin panel built)
- [ ] Can access: `https://api.shennastudio.com/health`

### 2. Environment Variables (Backend)
- [ ] `STORE_CORS=https://www.shennastudio.com` is set
- [ ] `AUTH_CORS=https://www.shennastudio.com` is set
- [ ] `ADMIN_CORS=https://admin.shennastudio.com` is set
- [ ] `DATABASE_URL` is configured correctly
- [ ] `REDIS_URL` is configured (not using fake redis)
- [ ] `JWT_SECRET` is set (32+ characters)
- [ ] `COOKIE_SECRET` is set (32+ characters)
- [ ] `PORT=9000` is set
- [ ] `ADMIN_PORT=7001` is set
- [ ] Backend restarted after setting variables

### 3. Environment Variables (Frontend)
- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com` is set
- [ ] `PORT=3000` is set
- [ ] `HOSTNAME=0.0.0.0` is set
- [ ] Frontend restarted after setting variables

### 4. DNS Configuration (Cloudflare)
- [ ] `api.shennastudio.com` A record points to server IP
- [ ] `www.shennastudio.com` A record points to server IP
- [ ] `admin.shennastudio.com` A record points to server IP
- [ ] DNS records are Proxied (orange cloud enabled)
- [ ] SSL/TLS mode set to "Full" or "Full (strict)"

### 5. Cloudflare Redirect Rule
- [ ] Redirect rule created: `shennastudio.com/*` → `https://www.shennastudio.com/$1`
- [ ] Status code: 301 (Permanent)
- [ ] Rule is active

### 6. Port Mappings (Coolify)

**Backend:**
- [ ] Port Exposes: `9000`
- [ ] Port Mappings: `9000:9000,7001:7001`
- [ ] Domains: `api.shennastudio.com` and `admin.shennastudio.com`

**Frontend:**
- [ ] Port Exposes: `3000`
- [ ] Port Mappings: `3000:3000`
- [ ] Domains: `www.shennastudio.com` and `shennastudio.com`

## Testing CORS

### Test 1: Check Backend Health Endpoint
```bash
curl -I https://api.shennastudio.com/health
```

Expected: Should return `200 OK`

### Test 2: Check CORS Headers
```bash
curl -I -X OPTIONS https://api.shennastudio.com/store/products \
  -H "Origin: https://www.shennastudio.com" \
  -H "Access-Control-Request-Method: GET"
```

Expected headers in response:
```
Access-Control-Allow-Origin: https://www.shennastudio.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### Test 3: Frontend Browser Console
Open browser console on `https://www.shennastudio.com` and run:
```javascript
fetch('https://api.shennastudio.com/store/products?limit=10', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.error('Error:', e))
```

Expected: Should see products data, not CORS error

## Common Issues & Solutions

### Issue 1: "No 'Access-Control-Allow-Origin' header is present"
**Cause**: Backend CORS not configured or backend not running

**Solutions**:
1. Verify backend is running: `curl https://api.shennastudio.com/health`
2. Check backend logs for startup errors
3. Verify `STORE_CORS` environment variable is set correctly
4. Restart backend deployment

### Issue 2: "Origin 'https://www.shennastudio.com' is not allowed"
**Cause**: CORS configured but doesn't match frontend domain

**Solutions**:
1. Ensure `STORE_CORS=https://www.shennastudio.com` (exact match)
2. No trailing slashes
3. Include `https://` protocol
4. Restart backend after changing

### Issue 3: Backend logs show "redisUrl not found"
**Cause**: Redis not configured (using fake in-memory redis)

**Solutions**:
1. Set up Redis instance (Upstash, Railway, etc.)
2. Add `REDIS_URL` to backend environment variables
3. Restart backend

### Issue 4: CORS works but still getting 500 errors
**Cause**: Backend internal errors (database, migrations, etc.)

**Solutions**:
1. Check backend logs for specific errors
2. Verify database connection is working
3. Ensure migrations have run successfully
4. Check if admin panel was built correctly

### Issue 5: Frontend shows "Failed to fetch"
**Cause**: Network connectivity or backend not accessible

**Solutions**:
1. Check if backend URL is correct in frontend env vars
2. Verify backend is actually listening on port 9000
3. Check Coolify port mappings are correct
4. Test backend health endpoint directly

## Backend Medusa Config

The CORS configuration is set in `/ocean-backend/medusa-config.js`:

```javascript
http: {
  storeCors: process.env.STORE_CORS || 'https://www.shennastudio.com',
  adminCors: process.env.ADMIN_CORS || 'https://admin.shennastudio.com',
  authCors: process.env.AUTH_CORS || 'https://www.shennastudio.com',
  // ... other config
}
```

This reads from environment variables, so ensure Coolify has these set.

## Frontend Medusa SDK Config

The SDK configuration is in `/src/lib/medusa.ts`:

```typescript
new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.shennastudio.com',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: 'session',
  },
  fetchOptions: {
    credentials: 'include', // Required for CORS with credentials
  },
})
```

## Next Steps

1. **Verify Backend is Running**:
   - Go to Coolify → Backend deployment
   - Check deployment status is "Running"
   - Review logs for any errors

2. **Verify Environment Variables**:
   - Go to Coolify → Backend → Environment Variables
   - Ensure all required variables are set exactly as shown above
   - Click "Redeploy" after any changes

3. **Test CORS**:
   - Use curl commands above to verify CORS headers
   - Check browser console for CORS errors
   - Verify API returns data

4. **If Still Failing**:
   - Share backend deployment logs
   - Share browser console errors
   - Verify Redis is configured
   - Check database connection is working

## Contact & Support

If CORS issues persist after following this guide:
1. Check backend logs in Coolify
2. Verify all environment variables match exactly
3. Test backend health endpoint
4. Review browser network tab for actual error responses

---

*Last Updated: 2025-09-30*