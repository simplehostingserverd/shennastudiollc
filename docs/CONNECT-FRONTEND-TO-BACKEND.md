# Connect Frontend to Railway Backend

This guide explains how to connect your Next.js frontend to the existing production Medusa backend on Railway.

## Backend Environment Variables (Current Setup)

Your backend has these key variables:
```bash
RAILWAY_PUBLIC_DOMAIN_VALUE="https://${{RAILWAY_PUBLIC_DOMAIN}}"
STORE_CORS="${{Storefront.NEXT_PUBLIC_BASE_URL}}"
MEILISEARCH_HOST="https://${{MeiliSearch.MEILI_PUBLIC_URL}}"
```

## Frontend Environment Variables Needed

Set these in your **Frontend** Railway service:

### Required Variables

```bash
# Backend Connection (CRITICAL)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}

# Or if using a custom domain:
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com

# App Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000

# For backend CORS (your frontend URL)
NEXT_PUBLIC_BASE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

### Optional Variables (if using Stripe, Algolia, etc.)

```bash
# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Meilisearch (if using search - connect to same instance as backend)
NEXT_PUBLIC_MEILISEARCH_HOST=${{MeiliSearch.MEILI_PUBLIC_URL}}
NEXT_PUBLIC_MEILISEARCH_API_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}

# Cloudinary (if using image optimization)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Backend CORS Configuration

Update your **Backend** service to allow frontend domain:

```bash
# In Backend service, update:
STORE_CORS=https://${{Storefront.RAILWAY_PUBLIC_DOMAIN}}

# If you want to allow multiple domains:
STORE_CORS=https://${{Storefront.RAILWAY_PUBLIC_DOMAIN}},https://www.yoursite.com,https://yoursite.com
```

## Step-by-Step Setup

### 1. Deploy Frontend Service

```bash
cd frontend
railway login
railway link  # Select your existing project
railway service create storefront  # Create new service for frontend
```

### 2. Set Frontend Environment Variables

Using Railway CLI:
```bash
# Essential - Backend connection
railway variables set NEXT_PUBLIC_MEDUSA_BACKEND_URL='${{Backend.RAILWAY_PUBLIC_DOMAIN}}'

# Essential - App config
railway variables set NODE_ENV=production
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set PORT=3000

# Essential - Frontend URL for backend CORS
railway variables set NEXT_PUBLIC_BASE_URL='${{RAILWAY_PUBLIC_DOMAIN}}'
```

Or use Railway Dashboard:
1. Go to your frontend service
2. Click "Variables" tab
3. Add each variable with value
4. Click "Deploy" to apply

### 3. Update Backend CORS

In your **Backend** service:

```bash
# Using Railway CLI (switch to backend service first)
railway service select backend
railway variables set STORE_CORS='${{Storefront.RAILWAY_PUBLIC_DOMAIN}}'

# Or in Railway Dashboard:
# Backend service → Variables → Update STORE_CORS
```

### 4. Deploy Frontend

```bash
# Make sure you're in frontend service context
railway service select storefront
railway up
```

## Using Service References

Railway's `${{ServiceName.VARIABLE}}` syntax allows services to reference each other:

### Frontend References Backend
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
# Becomes: https://backend-production-abc123.up.railway.app
```

### Backend References Frontend
```bash
STORE_CORS=${{Storefront.RAILWAY_PUBLIC_DOMAIN}}
# Becomes: https://storefront-production-xyz789.up.railway.app
```

### Benefits
- ✅ Automatic updates when domains change
- ✅ No hardcoded URLs
- ✅ Works across environments
- ✅ Type-safe service connections

## Verification Steps

### 1. Check Frontend Can Reach Backend

```bash
# Get frontend URL
railway domain

# Test backend connection
curl https://your-frontend.up.railway.app/api/test-backend
```

Expected response:
```json
{
  "message": "Backend is reachable",
  "backendUrl": "https://backend.up.railway.app",
  "timestamp": "..."
}
```

### 2. Check Products Load

Visit: `https://your-frontend.up.railway.app/products`

Should show products from backend.

### 3. Check Health

```bash
curl https://your-frontend.up.railway.app/api/health
```

Expected:
```json
{
  "status": "healthy",
  "service": "shenna-studio-frontend",
  "uptime": 123.45,
  "environment": "production"
}
```

### 4. Check Browser Console

Open browser console on your frontend:
- No CORS errors
- API calls to backend succeed
- Products load correctly

## Troubleshooting

### CORS Errors

**Symptom**: Browser shows "CORS policy blocked" errors

**Solution**:
1. Verify backend `STORE_CORS` includes frontend domain
2. Check both services are using HTTPS
3. Restart backend after CORS changes

```bash
# Backend service
railway variables get STORE_CORS  # Should include frontend URL
railway restart  # Apply CORS changes
```

### Products Not Loading

**Symptom**: Frontend shows "No products found"

**Solution**:
1. Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` is set correctly
2. Verify backend is healthy: `curl https://backend-url/health`
3. Test products endpoint: `curl https://backend-url/store/products`
4. Check frontend logs: `railway logs`

### 502 Bad Gateway

**Symptom**: Frontend shows 502 error

**Solution**:
1. Check health endpoint: `railway logs --filter health`
2. Verify standalone build: Check deployment logs for "server.js found"
3. Restart frontend: `railway restart`

### Environment Variables Not Loading

**Symptom**: Variables show as `undefined` in browser console

**Solution**:
- Client-side variables MUST have `NEXT_PUBLIC_` prefix
- Redeploy after adding variables: `railway up`
- Check build logs for variable values

## Complete Environment Variable Reference

### Frontend Service

```bash
# Backend Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# App Config
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0

# Stripe (optional)
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Meilisearch (optional - same instance as backend)
NEXT_PUBLIC_MEILISEARCH_HOST=${{MeiliSearch.MEILI_PUBLIC_URL}}
NEXT_PUBLIC_MEILISEARCH_API_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend Service (Update)

```bash
# Add frontend to CORS
STORE_CORS=${{Storefront.RAILWAY_PUBLIC_DOMAIN}}
AUTH_CORS=${{Storefront.RAILWAY_PUBLIC_DOMAIN}}

# Keep existing variables
ADMIN_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}}
DATABASE_URL=${{Postgres.DATABASE_PRIVATE_URL}}
REDIS_URL=${{Redis.REDIS_PRIVATE_URL}}?family=0
MEILISEARCH_HOST=https://${{MeiliSearch.MEILI_PUBLIC_URL}}
# ... rest of your backend vars
```

## Architecture Diagram

```
┌─────────────────┐
│   Storefront    │
│   (Frontend)    │
│  Next.js 15.5   │
│  Port: 3000     │
└────────┬────────┘
         │
         │ NEXT_PUBLIC_MEDUSA_BACKEND_URL
         │
         ▼
┌─────────────────┐
│    Backend      │
│  (Medusa API)   │
│   Medusa 2.10   │
│  Port: 9000     │
└────┬───┬───┬────┘
     │   │   │
     │   │   └──▶ Meilisearch (Search)
     │   └──────▶ Redis (Cache)
     └──────────▶ Postgres (Database)
```

## Success Checklist

- [ ] Frontend deployed to Railway
- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL` set with backend service reference
- [ ] Backend `STORE_CORS` includes frontend domain
- [ ] Health check passes: `/api/health` returns 200
- [ ] Products page loads: `/products` shows products
- [ ] No CORS errors in browser console
- [ ] Cart functionality works
- [ ] Checkout flow completes (if Stripe configured)

## Next Steps

After successful connection:
1. **Custom Domain**: Add custom domain in Railway settings
2. **SSL/TLS**: Automatic with Railway domains
3. **Monitoring**: Set up uptime monitoring
4. **Analytics**: Add analytics tracking
5. **SEO**: Configure meta tags and sitemap

## Support

- Railway Docs: https://docs.railway.app
- Medusa Docs: https://docs.medusajs.com
- Health Check Guide: `docs/HEALTH-CHECK.md`
- Railway Deployment Guide: `docs/RAILWAY-FRONTEND-DEPLOYMENT.md`
