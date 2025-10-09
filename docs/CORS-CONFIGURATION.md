# CORS Configuration Guide for Shenna's Studio

## Overview

Cross-Origin Resource Sharing (CORS) is critical for allowing your frontend (shennastudio.com) to communicate with your backend API (api.shennastudio.com). This guide explains how CORS is configured for both services.

---

## 🎯 Quick Reference

### Production Domains

| Service | Domain | Port |
|---------|--------|------|
| Frontend | https://shennastudio.com | 3000 |
| Frontend (WWW) | https://www.shennastudio.com | 3000 |
| Backend API | https://api.shennastudio.com | 9000 |
| Admin Panel | https://api.shennastudio.com/app | 9000 |

### CORS Flow

```
Browser (shennastudio.com)
    ↓
    Makes request to: https://api.shennastudio.com/store/products
    ↓
Backend checks STORE_CORS whitelist
    ↓
    Is "shennastudio.com" in STORE_CORS? ✓ Yes
    ↓
Backend sends response with CORS headers:
    Access-Control-Allow-Origin: https://shennastudio.com
    Access-Control-Allow-Credentials: true
    ↓
Browser receives response ✓ Success
```

---

## Backend CORS Configuration

### Location: `ocean-backend/medusa-config.ts`

The backend uses Medusa's built-in CORS configuration:

```typescript
module.exports = defineConfig({
  projectConfig: {
    http: {
      // CORS - Store API (Production domains)
      storeCors:
        process.env.STORE_CORS ||
        'https://shennastudio.com,https://www.shennastudio.com',

      // CORS - Admin API (Production domains)
      adminCors: process.env.ADMIN_CORS || 'https://api.shennastudio.com',

      // CORS - Authentication (Production domains)
      authCors:
        process.env.AUTH_CORS ||
        'https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com',
    },
  },
})
```

### Backend Environment Variables

Set these in Railway Backend Service → Variables:

```bash
# Allow frontend to access store API
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com

# Allow admin panel access
ADMIN_CORS=https://api.shennastudio.com

# Allow authentication from frontend and admin
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com
```

### What Each Does

**STORE_CORS** - Allows these domains to access:
- `/store/*` endpoints (products, cart, checkout, etc.)
- Public storefront APIs

**ADMIN_CORS** - Allows these domains to access:
- `/admin/*` endpoints
- Admin panel APIs
- Admin dashboard at `/app`

**AUTH_CORS** - Allows these domains to access:
- `/auth/*` endpoints
- Customer login/register
- Admin authentication

---

## Frontend CORS Configuration

### Location: `next.config.js`

The frontend sets CORS headers for responses it serves:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: process.env.NODE_ENV === 'production'
            ? 'https://api.shennastudio.com'
            : '*',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'X-Requested-With, Content-Type, Authorization, X-Medusa-Access-Token',
        },
        {
          key: 'Access-Control-Allow-Credentials',
          value: 'true',
        },
      ],
    },
  ]
}
```

### Frontend Environment Variables

Set these in Railway Frontend Service → Variables:

```bash
# Backend API URL that frontend will call
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Node environment
NODE_ENV=production
```

### What This Does

- Allows the backend API to access frontend resources (if needed)
- Sets security headers for all frontend routes
- Enables credentials (cookies, authorization headers) to be sent

---

## CORS Headers Explained

### Request Flow

1. **Browser makes request** from `shennastudio.com` to `api.shennastudio.com`

2. **Preflight request** (for POST, PUT, DELETE):
   ```
   OPTIONS /store/cart
   Origin: https://shennastudio.com
   ```

3. **Backend responds** with CORS headers:
   ```
   Access-Control-Allow-Origin: https://shennastudio.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Authorization, Content-Type
   Access-Control-Allow-Credentials: true
   ```

4. **Actual request** proceeds:
   ```
   POST /store/cart
   Origin: https://shennastudio.com
   Authorization: Bearer <token>
   ```

5. **Backend responds** with data and CORS headers

### Key Headers

**Access-Control-Allow-Origin**
- Specifies which domains can access the resource
- Must be exact match (no wildcards in production with credentials)
- Backend sets this to allow frontend domain

**Access-Control-Allow-Credentials**
- Allows cookies and authorization headers to be sent
- Required for authenticated requests (cart, checkout, admin)
- Must be `true` for Medusa authentication to work

**Access-Control-Allow-Headers**
- Specifies which headers can be sent in requests
- Must include: `Authorization`, `Content-Type`, `X-Medusa-Access-Token`

**Access-Control-Allow-Methods**
- Specifies which HTTP methods are allowed
- Typically: `GET, POST, PUT, PATCH, DELETE, OPTIONS`

---

## Common CORS Issues

### Issue 1: "No 'Access-Control-Allow-Origin' header"

**Error:**
```
Access to fetch at 'https://api.shennastudio.com/store/products' from origin 
'https://shennastudio.com' has been blocked by CORS policy: No 
'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Cause:**
- Frontend domain not in backend's STORE_CORS

**Fix:**
```bash
# Add to backend environment variables
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
```

### Issue 2: "Credentials mode is 'include' but CORS header is '*'"

**Error:**
```
Access to fetch has been blocked by CORS policy: The value of the 
'Access-Control-Allow-Origin' header in the response must not be the wildcard 
'*' when the request's credentials mode is 'include'.
```

**Cause:**
- Backend is using wildcard `*` instead of specific domain
- This happens when STORE_CORS is not set

**Fix:**
```bash
# Backend must specify exact domain
STORE_CORS=https://shennastudio.com
```

### Issue 3: "Preflight request failed"

**Error:**
```
Access to fetch has been blocked by CORS policy: Response to preflight 
request doesn't pass access control check
```

**Cause:**
- Backend not handling OPTIONS requests
- Missing CORS headers on preflight response

**Fix:**
- Medusa handles this automatically
- Verify STORE_CORS is set correctly
- Check that backend is running and healthy

### Issue 4: "Credentials include but not allowed"

**Error:**
```
Credentials flag is 'true', but the 'Access-Control-Allow-Credentials' 
header is not 'true'.
```

**Cause:**
- Backend not sending `Access-Control-Allow-Credentials: true`

**Fix:**
- Medusa sets this automatically
- Verify backend is using production configuration
- Check medusa-config.ts has correct CORS settings

---

## Testing CORS

### Test Backend CORS (from browser console)

Visit `https://shennastudio.com` and open browser console:

```javascript
// Test store API
fetch('https://api.shennastudio.com/store/products', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('✅ CORS working:', data))
  .catch(err => console.error('❌ CORS error:', err));

// Test with custom header
fetch('https://api.shennastudio.com/store/products', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'x-publishable-api-key': 'your-publishable-key'
  }
})
  .then(res => res.json())
  .then(data => console.log('✅ CORS with headers working:', data))
  .catch(err => console.error('❌ CORS error:', err));
```

### Test with cURL

```bash
# Test preflight request
curl -X OPTIONS https://api.shennastudio.com/store/products \
  -H "Origin: https://shennastudio.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Expected headers in response:
# Access-Control-Allow-Origin: https://shennastudio.com
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
# Access-Control-Allow-Credentials: true
```

### Test Actual Request

```bash
# Test actual store request
curl https://api.shennastudio.com/store/products \
  -H "Origin: https://shennastudio.com" \
  -H "Content-Type: application/json" \
  -v

# Expected headers in response:
# Access-Control-Allow-Origin: https://shennastudio.com
# Access-Control-Allow-Credentials: true
```

---

## Development vs Production

### Development CORS

**Backend (localhost:9000):**
```bash
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:3000,http://localhost:9000
```

**Frontend (localhost:3000):**
```javascript
// next.config.js
Access-Control-Allow-Origin: '*'  // Allow all in development
```

### Production CORS

**Backend (api.shennastudio.com):**
```bash
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com
```

**Frontend (shennastudio.com):**
```javascript
// next.config.js
Access-Control-Allow-Origin: 'https://api.shennastudio.com'  // Specific domain only
```

---

## Security Best Practices

### ✅ DO

- Use specific domains in production (no wildcards)
- Include both `shennastudio.com` and `www.shennastudio.com` if both are used
- Enable credentials only when needed
- Use HTTPS in production (required for credentials)
- Test CORS in browser console before deploying

### ❌ DON'T

- Use wildcard `*` in production with credentials
- Allow `Access-Control-Allow-Origin: *` in production
- Include unnecessary domains in CORS whitelist
- Expose admin endpoints to public frontend
- Use HTTP in production (CORS with credentials requires HTTPS)

---

## Troubleshooting Checklist

- [ ] Backend STORE_CORS includes frontend domain
- [ ] Frontend NEXT_PUBLIC_MEDUSA_BACKEND_URL points to backend
- [ ] Backend is running and healthy (check /health)
- [ ] Both services use HTTPS in production
- [ ] No trailing slashes in domain URLs
- [ ] Credentials are enabled on both sides
- [ ] Required headers are in Access-Control-Allow-Headers
- [ ] Browser console shows no CORS errors
- [ ] Preflight OPTIONS requests succeed
- [ ] Actual requests include CORS headers in response

---

## Quick Fix Commands

### Generate and Set CORS Variables

```bash
# Backend
cd ocean-backend
echo "STORE_CORS=https://shennastudio.com,https://www.shennastudio.com"
echo "ADMIN_CORS=https://api.shennastudio.com"
echo "AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com"

# Frontend
cd ..
echo "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com"
echo "NODE_ENV=production"
```

### Test CORS from Terminal

```bash
# Test backend CORS configuration
curl -I https://api.shennastudio.com/store/products \
  -H "Origin: https://shennastudio.com" | grep -i access-control

# Expected output:
# access-control-allow-origin: https://shennastudio.com
# access-control-allow-credentials: true
```

---

## References

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Medusa CORS Documentation](https://docs.medusajs.com/learn/fundamentals/api-routes#cors)
- [Next.js Headers Configuration](https://nextjs.org/docs/app/api-reference/next-config-js/headers)

---

**Last Updated:** 2025-01-07  
**Medusa Version:** 2.10.1  
**Next.js Version:** 15.5.3