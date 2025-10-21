# Quick Start: Deploy Frontend to Railway

This is the fastest way to get your Next.js frontend deployed to Railway and connected to your existing Medusa v2 backend.

## Prerequisites

✅ Railway account with existing Medusa v2 backend
✅ Railway CLI installed
✅ Backend service running and healthy

## 5-Minute Deployment

### 1. Install Railway CLI (if needed)

```bash
npm i -g @railway/cli
```

### 2. Run the Deployment Script

```bash
cd /path/to/shennastudiollc
bash scripts/railway/deploy-frontend.sh
```

The script will:
- Login to Railway
- Link to your project
- Create frontend service
- Configure environment variables
- Deploy the frontend

### 3. Set Backend CORS

In your Railway dashboard:
1. Go to your **backend service**
2. Variables tab
3. Update `STORE_CORS` to include your frontend domain:
   ```
   STORE_CORS=https://your-frontend-domain.up.railway.app,https://yourdomain.com
   ```
4. Redeploy backend

### 4. Verify

```bash
# Check frontend is live
curl https://your-frontend-domain.up.railway.app

# Check logs
railway logs
```

## Manual Deployment (Alternative)

If you prefer manual setup:

### 1. Link Project

```bash
cd frontend
railway login
railway link
```

### 2. Create Service

```bash
railway service create storefront
```

### 3. Set Variables

```bash
railway variables set NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.up.railway.app
railway variables set STRIPE_SECRET_KEY=sk_live_xxxxx
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
railway variables set NODE_ENV=production
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set PORT=3000
```

### 4. Deploy

```bash
railway up
```

## Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Your backend API URL | `https://api.shennastudio.com` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_xxxxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_xxxxx` |

## Optional Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ALGOLIA_APPLICATION_ID` | Algolia search app ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | Algolia search key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary (client-side) |

## Using Service References

Instead of hardcoding URLs, use Railway service references:

```bash
# Reference your backend service dynamically
railway variables set NEXT_PUBLIC_MEDUSA_BACKEND_URL='${{medusa-backend.RAILWAY_PUBLIC_DOMAIN}}'
```

Replace `medusa-backend` with your actual backend service name.

## Post-Deployment Checklist

- [ ] Frontend deploys successfully
- [ ] Backend CORS updated with frontend domain
- [ ] Products load on homepage
- [ ] Cart functionality works
- [ ] Checkout flow completes
- [ ] Custom domain configured (optional)

## Troubleshooting

### CORS Errors

**Problem**: Frontend can't fetch from backend
**Solution**: Update backend `STORE_CORS` to include frontend domain

### Build Fails

**Problem**: npm install or build errors
**Solution**: Check Node version (20+), review logs: `railway logs`

### Environment Variables Missing

**Problem**: Frontend doesn't see env vars
**Solution**: Use `NEXT_PUBLIC_` prefix for client-side vars

## Useful Commands

```bash
railway status          # Check deployment status
railway logs           # View logs
railway variables      # List all variables
railway domain         # Generate domain
railway restart        # Restart service
```

## Next Steps

1. **Monitor**: Check Railway logs and metrics
2. **Domain**: Add custom domain in Railway settings
3. **Scale**: Adjust resources if needed
4. **Optimize**: Set up CDN for static assets

## Support

- Full guide: `docs/RAILWAY-FRONTEND-DEPLOYMENT.md`
- Railway docs: https://docs.railway.app
- Medusa docs: https://docs.medusajs.com

---

**Deployment time**: ~5 minutes
**First build time**: ~3-5 minutes
**Subsequent builds**: ~2-3 minutes
