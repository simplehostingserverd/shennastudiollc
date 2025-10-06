# Railway Deployment Guide for Shenna's Studio

This guide walks you through deploying Shenna's Studio on Railway.

## Prerequisites

1. Railway account (https://railway.app)
2. Railway CLI installed: `npm install -g @railway/cli` or `brew install railway`
3. GitHub repository connected to Railway (or deploy from local)

## Architecture on Railway

Railway will provision:
- **PostgreSQL Database** (Railway managed)
- **Redis** (Railway managed)
- **Application Service** (Frontend + Backend in monorepo)

## Step 1: Create a New Railway Project

```bash
railway login
railway init
```

Or create via Railway dashboard: https://railway.app/new

## Step 2: Add Services

### Add PostgreSQL Database

1. In Railway dashboard, click "+ New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Copy the `DATABASE_URL` from the service variables

### Add Redis

1. Click "+ New Service"
2. Select "Database" → "Redis"
3. Railway will automatically create a Redis instance
4. Copy the `REDIS_URL` from the service variables

## Step 3: Configure Environment Variables

In your Railway project, go to your application service and add these environment variables:

### Required Variables

```bash
# Node.js Configuration
NODE_ENV=production
RAILWAY_DEPLOYMENT=true

# Database (from Railway PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Redis (from Railway Redis service)
REDIS_URL=${{Redis.REDIS_URL}}

# Security Secrets (generate strong secrets)
JWT_SECRET=<generate-a-secure-random-string-min-32-chars>
COOKIE_SECRET=<generate-a-secure-random-string-min-32-chars>

# CORS Configuration
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com
ADMIN_CORS=https://yourdomain.com,https://admin.yourdomain.com
AUTH_CORS=https://yourdomain.com,https://www.yourdomain.com

# Admin Credentials
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<create-a-strong-password>

# Auto-initialization
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true

# Medusa Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true

# Frontend Environment Variables
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Railway.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=<optional-algolia-app-id>
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=<optional-algolia-search-key>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<optional-cloudinary-name>

# Payment Gateway
STRIPE_SECRET_KEY=<your-stripe-secret-key>

# Cloudinary (optional)
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# Server Configuration
PORT=3000
BACKEND_PORT=9000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
```

### Generate Secrets

Use these commands to generate secure secrets:

```bash
# Generate JWT_SECRET
openssl rand -base64 48

# Generate COOKIE_SECRET
openssl rand -base64 48
```

## Step 4: Deploy

### Option A: Deploy via GitHub

1. Connect your GitHub repository to Railway
2. Railway will automatically detect changes and deploy
3. Every push to main branch triggers a new deployment

### Option B: Deploy via Railway CLI

```bash
railway link
railway up
```

## Step 5: Configure Custom Domain (Optional)

1. In Railway dashboard, go to your service settings
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Railway
5. Update `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and CORS variables with your domain

## Step 6: Database Migrations

Railway will automatically run migrations on first deployment due to `AUTO_MIGRATE=true`.

To manually run migrations:

```bash
railway run npx medusa db:migrate
```

## Step 7: Create Admin User

If `AUTO_CREATE_ADMIN=true`, an admin user will be created automatically.

To manually create admin:

```bash
railway run npm --prefix ocean-backend run create-admin
```

## Access Your Application

- **Frontend**: https://your-app-name.railway.app or https://yourdomain.com
- **Backend API**: https://your-app-name.railway.app:9000 or https://api.yourdomain.com
- **Admin Panel**: https://your-app-name.railway.app:9000/app or https://api.yourdomain.com/app

## Monitoring

View logs in real-time:

```bash
railway logs
```

Or view in Railway dashboard under "Deployments" → "Logs"

## Scaling

Railway allows vertical scaling:
- Go to service settings
- Adjust CPU and Memory allocations
- Railway charges based on usage

## Important Notes

1. **Separate Services**: For production, consider deploying frontend and backend as separate Railway services
2. **Database Backups**: Railway provides automatic daily backups for PostgreSQL
3. **Environment Variables**: Never commit `.env` files. Use Railway's environment variable management
4. **Redis Policy**: Ensure Redis is configured with `noeviction` policy (check `docker-compose*.yml` files)
5. **Health Checks**: Railway automatically monitors your application health
6. **Static Files**: Next.js static files are included in the standalone build
7. **File Uploads**: For production, use Cloudinary or S3 instead of local file storage

## Troubleshooting

### Build Fails

- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version matches `.nvmrc` (20.19.5)

### Database Connection Issues

- Verify `DATABASE_URL` is correctly set
- Check SSL settings (`DATABASE_SSL=true`)
- Ensure database service is running

### Admin Panel Not Loading

- Verify Medusa backend is running on correct port (9000)
- Check `ADMIN_CORS` includes your domain
- Ensure `.medusa/client` directory exists in build

### Redis Errors

- Check `REDIS_URL` is correctly configured
- Verify Redis eviction policy is set to `noeviction`
- Check Redis service is running

## Cost Optimization

Railway offers:
- **Free tier**: $5/month in credits (good for testing)
- **Pro plan**: Pay for what you use
- **Estimated costs**: ~$20-50/month for small production workloads

### Tips to Reduce Costs:
1. Use Railway's managed PostgreSQL and Redis (included in usage)
2. Optimize Docker images (use multi-stage builds)
3. Use Cloudinary for image hosting (reduce storage costs)
4. Enable caching to reduce compute time

## Support

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Medusa Discord: https://discord.gg/medusajs
