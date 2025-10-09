# Complete Railway Setup Guide - Shenna's Studio

## Current Status

✅ Railway CLI installed and logged in
✅ Project "serene-presence" created and linked
✅ Node.js 20.19.5 installed
✅ Application configured for Railway
❗ Need to create service and set environment variables

## Step-by-Step Setup (Via Railway Dashboard - Recommended)

### Step 1: Go to Railway Dashboard

Open: https://railway.app/project/serene-presence

Or run:
```bash
railway open
```

### Step 2: Create Application Service

1. Click **"+ New Service"**
2. Select **"GitHub Repo"** (if connected) or **"Empty Service"**
3. Name it: `shennastudio-app`

### Step 3: Add PostgreSQL Database

1. Click **"+ New Service"**
2. Select **"Database" → "PostgreSQL"**
3. Railway will automatically create the database
4. Note: The `DATABASE_URL` variable will be available as `${{Postgres.DATABASE_URL}}`

### Step 4: Add Redis Cache

1. Click **"+ New Service"**
2. Select **"Database" → "Redis"**
3. Railway will automatically create Redis
4. Note: The `REDIS_URL` variable will be available as `${{Redis.REDIS_URL}}`

### Step 5: Set Environment Variables

Click on your `shennastudio-app` service, go to **"Variables"** tab, and add:

#### Core Configuration
```bash
NODE_ENV=production
RAILWAY_DEPLOYMENT=true
```

#### Database (Reference PostgreSQL service)
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

#### Redis (Reference Redis service)
```bash
REDIS_URL=${{Redis.REDIS_URL}}
```

#### Security Secrets (GENERATE THESE!)

Run these commands to generate secure secrets:
```bash
openssl rand -base64 48  # For JWT_SECRET
openssl rand -base64 48  # For COOKIE_SECRET
```

Then set:
```bash
JWT_SECRET=<paste-generated-jwt-secret>
COOKIE_SECRET=<paste-generated-cookie-secret>
```

#### CORS Configuration (Update with your domains)
```bash
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com,https://shop.shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com,https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com
```

#### Admin Credentials
```bash
ADMIN_EMAIL=admin@shennasstudio.com
ADMIN_PASSWORD=<create-a-strong-password>
```

#### Auto-Initialization
```bash
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true
```

#### Medusa Configuration
```bash
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
DISABLE_ADMIN=false
```

#### Frontend Configuration
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://<your-app-domain>.railway.app
```

#### Payment - Stripe
```bash
STRIPE_SECRET_KEY=sk_live_your_production_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
```

#### Server Configuration
```bash
PORT=3000
BACKEND_PORT=9000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
```

#### Optional: Cloudinary
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Optional: Algolia
```bash
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
```

### Step 6: Deploy from GitHub (Recommended)

1. In your service settings, go to **"Settings" → "Source"**
2. Connect your GitHub repository
3. Select the branch (e.g., `main`)
4. Railway will automatically deploy on every push

### Step 7: Configure Domains

1. Go to service **"Settings" → "Networking"**
2. Click **"Generate Domain"** for a free Railway domain
3. Or add **"Custom Domain"** and point your DNS:
   - Frontend: `shennastudio.com` → Railway provided address
   - API: `api.shennastudio.com` → Railway provided address
   - Admin: `admin.shennastudio.com` → Railway provided address

### Step 8: Monitor Deployment

1. Go to **"Deployments"** tab
2. Watch the build logs
3. First deployment will:
   - Install dependencies
   - Build frontend and backend
   - Run database migrations
   - Create admin user
   - Start services

### Step 9: Access Your Application

After deployment completes:

- **Frontend**: https://shennastudio-production.up.railway.app (or your custom domain)
- **Backend API**: https://shennastudio-production.up.railway.app:9000
- **Admin Panel**: https://shennastudio-production.up.railway.app:9000/app

## Alternative: Set Variables via CLI

If you prefer using the CLI, run this after creating the service:

```bash
# Link to your service first
railway service

# Generate secrets
export JWT_SECRET=$(openssl rand -base64 48)
export COOKIE_SECRET=$(openssl rand -base64 48)
export ADMIN_PASSWORD="ShennasOcean2024!$(openssl rand -base64 12)"

# Set all variables at once
railway variables --set "NODE_ENV=production" \\
  --set "RAILWAY_DEPLOYMENT=true" \\
  --set "DATABASE_URL=\${{Postgres.DATABASE_URL}}" \\
  --set "DATABASE_SSL=true" \\
  --set "DATABASE_SSL_REJECT_UNAUTHORIZED=false" \\
  --set "REDIS_URL=\${{Redis.REDIS_URL}}" \\
  --set "JWT_SECRET=$JWT_SECRET" \\
  --set "COOKIE_SECRET=$COOKIE_SECRET" \\
  --set "STORE_CORS=https://shennastudio.com,https://www.shennastudio.com" \\
  --set "ADMIN_CORS=https://admin.shennastudio.com,https://api.shennastudio.com" \\
  --set "AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com" \\
  --set "ADMIN_EMAIL=admin@shennasstudio.com" \\
  --set "ADMIN_PASSWORD=$ADMIN_PASSWORD" \\
  --set "AUTO_MIGRATE=true" \\
  --set "AUTO_SEED=false" \\
  --set "AUTO_CREATE_ADMIN=true" \\
  --set "MEDUSA_ADMIN_ONBOARDING_TYPE=default" \\
  --set "MEDUSA_ADMIN_ONBOARDING_NEXTJS=true" \\
  --set "DISABLE_ADMIN=false" \\
  --set "PORT=3000" \\
  --set "BACKEND_PORT=9000" \\
  --set "HOSTNAME=0.0.0.0" \\
  --set "NEXT_TELEMETRY_DISABLED=1"

# Save your credentials!
echo "Admin Password: $ADMIN_PASSWORD"
echo "JWT Secret: $JWT_SECRET"
echo "Cookie Secret: $COOKIE_SECRET"
```

## Troubleshooting

### Build Fails

- Check build logs in Railway dashboard
- Verify `.nvmrc` has Node.js 20
- Ensure `package.json` has all dependencies

### Database Connection Issues

- Verify PostgreSQL service is running
- Check `DATABASE_URL` references `${{Postgres.DATABASE_URL}}`
- Ensure SSL settings are correct

### Admin Panel Not Loading

- Verify backend is running on port 9000
- Check admin panel at: `https://your-domain.railway.app:9000/app`
- Ensure `DISABLE_ADMIN=false`

### Redis Errors

- Verify Redis service is running
- Check `REDIS_URL` references `${{Redis.REDIS_URL}}`

## Useful Railway Commands

```bash
railway logs                    # View deployment logs
railway open                    # Open project in browser
railway status                  # Check project status
railway link                    # Link to different project
railway service                 # Select/link to service
railway variables               # View environment variables
railway run <command>           # Run command in Railway environment
```

## Cost Estimate

- **Hobby Plan**: $5/month credits (good for testing)
- **Pro Plan**: Pay-as-you-go
  - PostgreSQL: ~$5-10/month
  - Redis: ~$5-10/month
  - Compute: ~$10-30/month
  - **Total**: ~$20-50/month for small production workload

## Next Steps After Deployment

1. ✅ Verify all services are running
2. ✅ Test frontend at your domain
3. ✅ Login to admin panel
4. ✅ Add your products
5. ✅ Configure payment methods
6. ✅ Set up custom domains
7. ✅ Enable monitoring/alerts
8. ✅ Set up backups (automatic with Railway PostgreSQL)

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Medusa Docs**: https://docs.medusajs.com
- **Project Repo**: Your GitHub repository

---

**Ready to deploy?** Go to https://railway.app and follow the steps above!
