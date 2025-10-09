# How to Upload Environment Variables to Railway

## Quick Steps

### 1. Go to Railway Dashboard

Open your project: https://railway.app/project/serene-presence

Or run:
```bash
railway open
```

### 2. Create Your Services First

Before uploading environment variables, create these services:

1. **Create Application Service**
   - Click "+ New Service"
   - Choose "Empty Service" or connect your GitHub repo
   - Name it: `shennastudio-app`

2. **Add PostgreSQL**
   - Click "+ New Service"
   - Select "Database" → "PostgreSQL"

3. **Add Redis**
   - Click "+ New Service"
   - Select "Database" → "Redis"

### 3. Upload Environment Variables JSON

1. Click on your `shennastudio-app` service
2. Go to the **"Variables"** tab
3. Look for the **"RAW Editor"** button or **"Import from JSON"** option
4. Click it
5. Copy the entire contents of `railway-env-variables.json`
6. Paste it into the editor
7. Click **"Save"** or **"Deploy"**

#### Alternative: Manual Upload

If Railway has a JSON import feature:
1. Click the **upload/import** icon
2. Select the `railway-env-variables.json` file
3. Confirm the import

### 4. Verify Variables Were Set

In the Variables tab, you should see all these variables:

✅ NODE_ENV
✅ RAILWAY_DEPLOYMENT
✅ DATABASE_URL (should show `${{Postgres.DATABASE_URL}}`)
✅ DATABASE_SSL
✅ REDIS_URL (should show `${{Redis.REDIS_URL}}`)
✅ JWT_SECRET
✅ COOKIE_SECRET
✅ STORE_CORS
✅ ADMIN_CORS
✅ AUTH_CORS
✅ ADMIN_EMAIL
✅ ADMIN_PASSWORD
✅ AUTO_MIGRATE
✅ AUTO_SEED
✅ AUTO_CREATE_ADMIN
✅ MEDUSA_ADMIN_ONBOARDING_TYPE
✅ MEDUSA_ADMIN_ONBOARDING_NEXTJS
✅ DISABLE_ADMIN
✅ NEXT_PUBLIC_MEDUSA_BACKEND_URL
✅ STRIPE_SECRET_KEY (update with production key!)
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (update with production key!)
✅ PORT
✅ BACKEND_PORT
✅ HOSTNAME
✅ NEXT_TELEMETRY_DISABLED

### 5. Update Production Values

Before deploying, update these values in Railway dashboard:

1. **NEXT_PUBLIC_MEDUSA_BACKEND_URL**
   - Change from `https://api.shennastudio.com` to your actual Railway domain
   - Example: `https://shennastudio-production.up.railway.app`

2. **Stripe Keys** (when ready for production)
   - Replace `sk_test_...` with `sk_live_...`
   - Replace `pk_test_...` with `pk_live_...`

3. **CORS Domains** (if needed)
   - Update with your actual production domains

### 6. Deploy Your Application

#### Option A: Deploy from Local

```bash
railway up
```

#### Option B: Deploy from GitHub (Recommended)

1. Go to service Settings → Source
2. Connect your GitHub repository
3. Select branch (e.g., `main`)
4. Click "Deploy"

### 7. Monitor Deployment

1. Go to "Deployments" tab
2. Click on the latest deployment
3. Watch the build logs
4. Wait for "Success" status

### 8. Access Your Application

Once deployed:

- **Frontend**: https://your-app.up.railway.app
- **Backend API**: https://your-app.up.railway.app:9000
- **Admin Panel**: https://your-app.up.railway.app:9000/app

## Troubleshooting

### Variables Not Showing

- Make sure you're in the correct service
- Try refreshing the page
- Use "RAW Editor" mode to paste JSON directly

### JSON Parse Error

- Validate JSON at: https://jsonlint.com
- Ensure no trailing commas
- Ensure all strings are properly quoted

### Database/Redis Variables Not Working

- Make sure PostgreSQL and Redis services are created first
- The `${{Postgres.DATABASE_URL}}` syntax is correct for Railway
- Railway will automatically replace with actual connection strings

### Deployment Fails

- Check build logs in Deployments tab
- Verify all required environment variables are set
- Ensure `.nvmrc` specifies Node.js 20

## Files Created

- ✅ `railway-env-variables.json` - Environment variables (upload this!)
- ✅ `CREDENTIALS.txt` - Your admin credentials (KEEP SECURE!)
- ✅ `RAILWAY_SETUP_COMPLETE.md` - Detailed setup guide
- ✅ `set-railway-vars.sh` - CLI alternative script

## Support

Need help? Check:
- Railway Docs: https://docs.railway.app/guides/variables
- Railway Discord: https://discord.gg/railway

---

**Ready?** Open Railway dashboard and upload `railway-env-variables.json`!
