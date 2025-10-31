# Railway Printful Setup Instructions

## Environment Variables to Add in Railway

Go to your Railway backend service and add these environment variables:

### Printful Configuration

```bash
# REQUIRED: Printful API Access Token
PRINTFUL_ACCESS_TOKEN=lX5Tgb5qpkASwuvjPLPnEHe53745q2R3zgZTwJ1L

# REQUIRED: Printful Store ID
# Find this in your Printful dashboard URL or at https://www.printful.com/dashboard/stores
PRINTFUL_STORE_ID=your_store_id_here

# OPTIONAL: Enable webhooks for automatic syncing
PRINTFUL_ENABLE_WEBHOOKS=true

# OPTIONAL: Your store logo for Printful packing slips
PRINTFUL_LOGO_URL=https://www.shennastudio.com/logo.png

# OPTIONAL: Auto-confirm orders (false = manual review, true = auto-fulfill)
PRINTFUL_CONFIRM_ORDER=false
```

## Steps to Configure

### 1. Get Your Printful Store ID

1. Log in to Printful: https://www.printful.com/dashboard
2. Go to **Stores** in the left sidebar
3. Click on your store
4. The Store ID is in the URL: `https://www.printful.com/dashboard/store/{STORE_ID}`
   - OR go to Settings → API and you'll see your Store ID there

### 2. Add Variables to Railway

**Method 1: Railway Dashboard (Recommended)**
1. Go to https://railway.app/dashboard
2. Select your project
3. Click on your **backend** service
4. Go to the **Variables** tab
5. Click **+ New Variable**
6. Add each variable from above

**Method 2: Railway CLI**
```bash
railway login
railway link  # Link to your project
railway variables set PRINTFUL_ACCESS_TOKEN=lX5Tgb5qpkASwuvjPLPnEHe53745q2R3zgZTwJ1L
railway variables set PRINTFUL_STORE_ID=YOUR_STORE_ID
railway variables set PRINTFUL_ENABLE_WEBHOOKS=true
railway variables set PRINTFUL_LOGO_URL=https://www.shennastudio.com/logo.png
railway variables set PRINTFUL_CONFIRM_ORDER=false
```

### 3. Trigger Redeploy

After adding variables:
1. Railway will automatically redeploy your service
2. OR manually trigger: **Deployments** → **Deploy** (select latest)
3. Wait for deployment to complete (~2-5 minutes)

### 4. Run Database Migrations

The Printful plugin needs database tables. SSH into Railway or run locally:

```bash
# In Railway terminal or via SSH
npm run build
npx medusa migrations run
```

### 5. Verify Installation

Check logs in Railway:
```
✓ Printful module initialized
✓ Printful fulfillment provider registered
```

## Syncing Products from Printful

### Option 1: Via Admin Dashboard
1. Go to https://backend-production-38d0a.up.railway.app/app
2. Navigate to **Products**
3. Look for Printful sync options (depends on plugin version)

### Option 2: Via API (Custom Script)
Create a script to fetch and sync Printful products with your categories.

## Testing

1. **Check Backend Health**:
   ```
   curl https://backend-production-38d0a.up.railway.app/health
   ```

2. **Test Product API** (should have reduced load with caching):
   ```
   curl https://backend-production-38d0a.up.railway.app/store/products
   ```

3. **Create Test Order** on your storefront and verify it creates in Printful

## Rate Limiting is Now Active

The new middleware limits requests to:
- **Standard endpoints**: 120 requests/minute
- **Strict endpoints** (expensive operations): 30 requests/minute
- **Auth endpoints**: 10 attempts/15 minutes

Response headers will show:
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 2025-01-30T12:34:56.789Z
```

## Caching is Now Active

Products are cached for **10 minutes** to reduce database load.

Response headers will show:
```
X-Cache: HIT (if from cache)
X-Cache: MISS (if fresh from database)
X-Cache-Expires: 2025-01-30T12:44:56.789Z
```

## Troubleshooting

### "Printful module not found"
- Ensure `@vymalo/medusa-printful` is in package.json dependencies
- Run `npm install` in backend directory
- Redeploy

### "Invalid Printful API key"
- Double-check `PRINTFUL_ACCESS_TOKEN` in Railway variables
- Verify it's the correct key from https://www.printful.com/dashboard/settings

### "No products syncing"
- Check if `PRINTFUL_STORE_ID` is correct
- Verify you have products in your Printful store
- Check Railway logs for errors

### Still getting 429 errors
- Clear browser cache and cookies
- Wait 1 minute for rate limits to reset
- Check if there are other services hitting your API
- Review Railway logs for suspicious activity

## Next Steps

1. ✅ Add environment variables
2. ✅ Redeploy Railway service
3. ✅ Run migrations
4. ✅ Verify in logs
5. ⏭️ Sync Printful products to your categories
6. ⏭️ Test ordering workflow

---

**Support**: If you encounter issues, check:
- Railway logs: `railway logs`
- Printful API status: https://status.printful.com/
- Plugin docs: https://www.npmjs.com/package/@vymalo/medusa-printful
