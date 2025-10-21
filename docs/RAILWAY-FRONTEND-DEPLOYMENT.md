# Railway Frontend Deployment Guide

This guide explains how to deploy the Shenna's Studio frontend to Railway and connect it to your existing production Medusa v2 backend.

## Prerequisites

- Existing Railway project with:
  - Medusa v2 backend (running and healthy)
  - PostgreSQL database
  - Redis cache
  - Meilisearch (optional)
- Railway CLI installed: `npm i -g @railway/cli`
- GitHub repository with the restructured frontend code

## Architecture Overview

```
Railway Project
├── Backend Service (Medusa v2)
│   ├── PostgreSQL (plugin)
│   ├── Redis (plugin)
│   └── Meilisearch (optional plugin)
└── Frontend Service (Next.js) ← NEW
    └── Connected to Backend via NEXT_PUBLIC_MEDUSA_BACKEND_URL
```

## Deployment Steps

### 1. Create New Frontend Service

```bash
# Navigate to frontend directory
cd frontend

# Login to Railway (if not already)
railway login

# Link to your existing project
railway link

# Create new service for frontend
railway service create frontend
```

### 2. Configure Environment Variables

Set these environment variables in Railway dashboard or via CLI:

#### Required Variables

```bash
# Backend Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.up.railway.app

# Stripe (use your production keys)
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# App Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
```

#### Optional Variables (if using)

```bash
# Algolia Search
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
ALGOLIA_ADMIN_API_KEY=your_admin_key

# Cloudinary Images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Set Service References (Important!)

To connect frontend to backend within Railway's private network:

```bash
# Get backend service name
railway service list

# Set backend URL using service reference
railway variables set NEXT_PUBLIC_MEDUSA_BACKEND_URL=\${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

Or use the Railway dashboard:
1. Go to your frontend service
2. Variables tab
3. Add variable: `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
4. Value: `${{Backend.RAILWAY_PUBLIC_DOMAIN}}` (replace "Backend" with your actual backend service name)

### 4. Configure Build Settings

Railway should auto-detect the Next.js app. Verify:

- **Root Directory**: Leave empty if deploying from frontend folder, or set to `frontend` if deploying from root
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 5. Deploy

```bash
# Deploy from frontend directory
railway up

# Or push via GitHub
# Railway will auto-deploy on push to main branch
```

### 6. Configure Domain (Optional)

```bash
# Generate Railway domain
railway domain

# Or add custom domain in Railway dashboard
# Settings → Networking → Custom Domain
```

## Environment Variable Reference

### Service References Pattern

Railway allows services to reference each other using the `${{ServiceName.VARIABLE}}` syntax:

```bash
# Reference backend's public domain
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{medusa-backend.RAILWAY_PUBLIC_DOMAIN}}

# Reference backend's private URL (faster, within Railway network)
INTERNAL_BACKEND_URL=${{medusa-backend.RAILWAY_PRIVATE_DOMAIN}}
```

### Backend CORS Configuration

Ensure your backend allows requests from the frontend domain:

```bash
# In backend service, set STORE_CORS to include frontend domain
STORE_CORS=https://your-frontend.up.railway.app,https://yourdomain.com
```

## Verification

### 1. Check Frontend Health

```bash
# Check home page
curl https://your-frontend.up.railway.app

# Check health endpoint (used by Railway)
curl https://your-frontend.up.railway.app/api/health
```

Expected health check response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-09T...",
  "service": "shenna-studio-frontend",
  "version": "1.0.0",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Check Backend Connection

```bash
# The frontend should be able to fetch products
curl https://your-frontend.up.railway.app/api/test-backend
```

### 3. Check Logs

```bash
railway logs
```

## Troubleshooting

### Frontend Can't Connect to Backend

**Issue**: CORS errors or 502 errors

**Solution**:
1. Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` is set correctly
2. Check backend CORS settings include frontend domain
3. Ensure backend is healthy: `curl https://your-backend.up.railway.app/health`

### Build Failures

**Issue**: npm install fails or build errors

**Solution**:
1. Check Node version matches (should be 20+)
2. Verify all dependencies are in `package.json`
3. Check build logs: `railway logs --deployment`

### Environment Variables Not Working

**Issue**: Frontend doesn't see env vars

**Solution**:
1. Use `NEXT_PUBLIC_` prefix for client-side variables
2. Rebuild after changing env vars
3. Verify with: `railway variables`

## File Structure for Railway

```
frontend/
├── railway.json          # Railway configuration
├── nixpacks.toml        # Build configuration
├── package.json         # Dependencies
├── next.config.js       # Next.js config
├── app/                 # Next.js app directory
├── public/              # Static assets
└── src/                 # Source code
```

## Railway Configuration Files

### railway.json
- Defines build and deploy settings
- Sets healthcheck path to `/api/health`
- Configures healthcheck timeout (100s)
- Configures restart policy (ON_FAILURE, max 10 retries)

### nixpacks.toml
- Specifies Node.js 20
- Defines install and build commands
- Sets start command

## Production Checklist

- [ ] Environment variables configured
- [ ] Backend URL set with service reference
- [ ] CORS configured on backend
- [ ] Stripe keys are production keys
- [ ] Custom domain configured (if needed)
- [ ] SSL/TLS enabled (automatic on Railway)
- [ ] Health checks passing
- [ ] Logs reviewed for errors
- [ ] Test checkout flow
- [ ] Monitor performance

## Next Steps

1. **Monitor**: Set up Railway monitoring and alerts
2. **Scale**: Adjust resources if needed (Settings → Resources)
3. **CDN**: Consider adding Cloudflare for static assets
4. **Backups**: Ensure regular backups of backend database
5. **Updates**: Keep dependencies up to date

## Useful Commands

```bash
# Check service status
railway status

# View logs
railway logs

# View environment variables
railway variables

# Connect to shell
railway shell

# Restart service
railway restart

# Delete service
railway service delete frontend
```

## Support

- Railway Docs: https://docs.railway.app
- Medusa Docs: https://docs.medusajs.com
- Next.js Docs: https://nextjs.org/docs

## Notes

- Frontend is stateless and can scale horizontally
- Backend connection uses Railway's internal network for speed
- All traffic is encrypted with automatic SSL/TLS
- Railway provides automatic deployments on git push
- Environment variables are injected at runtime
