# 🚀 Coolify Quick Start - Shenna Studio

## Copy-Paste Environment Variables

```bash
# === BACKEND SERVICE ===
# Service: simplehostingserverd/shennastudiollc:medusa
# Base Directory: /ocean-backend

# Database (Internal Coolify)
DATABASE_URL=postgres://postgres:5nMC5VaPTPVdyOPKdPYJhPvq00MS8UoR2KAEAJp0IGkVJOd1l3D7Q1PLHiPWz5bi@fc880wcg88k88wcwco4gowoo:5432/postgres
REDIS_URL=redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Security (GENERATE YOUR OWN!)
JWT_SECRET=REPLACE_ME_WITH_OPENSSL_RAND_BASE64_32
COOKIE_SECRET=REPLACE_ME_WITH_OPENSSL_RAND_BASE64_32

# Node
NODE_ENV=production

# CORS
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com

# Admin
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=ChangeThisPassword123!
MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Auto Setup
AUTO_MIGRATE=true
AUTO_CREATE_ADMIN=true
AUTO_SEED=true
STARTUP_MODE=full
```

```bash
# === FRONTEND SERVICE ===
# Service: simplehostingserverd/shennastudiollc (root)
# Base Directory: / (leave empty or root)

# Backend Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY

# Optional - Search
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_algolia_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_key

# Optional - Images
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# App Config
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
```

## Port Mappings

**Backend:**
- Expose: `9000` → `9000` ONLY (NO port 7001!)

**Frontend:**
- Expose: `3000` → `3000`

## Resource Limits (12GB Server)

**Backend:**
- Memory Limit: 4096 MB
- Memory Reservation: 2048 MB
- CPU: 2.0 cores

**Frontend:**
- Memory Limit: 2048 MB
- Memory Reservation: 1024 MB
- CPU: 1.0 cores

## Health Checks

**Backend:**
- Path: `/health`
- Port: `9000`
- Interval: 30s
- Start Period: 180s

**Frontend:**
- Path: `/`
- Port: `3000`
- Interval: 30s
- Start Period: 120s

## Critical Settings ⚠️

1. **Backend Base Directory**: `/ocean-backend` ← MUST SET!
2. **Frontend Base Directory**: `/` or empty
3. **NO port 7001** anywhere
4. **Admin URL**: `https://api.shennastudio.com/app` (NOT /admin)

## Access URLs

- **Store**: https://www.shennastudio.com
- **Admin**: https://api.shennastudio.com/app
- **API**: https://api.shennastudio.com

## First Deployment

1. Click **Redeploy** on backend
2. Wait ~5 minutes (watch logs)
3. Look for: `✅ Database migrations completed`
4. Look for: `✅ Admin user created`
5. Look for: `✅ Build completed successfully`
6. Look for: `🚀 Starting Medusa server...`
7. Access admin at: https://api.shennastudio.com/app

## Generate Secrets

Run on your local machine:
```bash
openssl rand -base64 32  # Use for JWT_SECRET
openssl rand -base64 32  # Use for COOKIE_SECRET
```

## Troubleshooting

**Backend won't start?**
- Check logs for database connection errors
- Verify DATABASE_URL and REDIS_URL are correct
- Check Base Directory is `/ocean-backend`

**Admin shows 404?**
- Build may have failed
- Check logs for "Frontend build completed successfully"
- Try: `STARTUP_MODE=simple` and manually build

**Products don't load?**
- Frontend can't reach backend
- Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com`
- Check CORS settings in backend

**Database empty?**
- Migrations didn't run
- Set `AUTO_MIGRATE=true`
- Or run manually: `npx medusa db:migrate`

## Success Indicators

✅ Backend logs show:
```
✅ Database connection established
✅ Database migrations completed successfully
✅ Admin user created successfully
✅ Build completed successfully
🚀 Starting Medusa server...
```

✅ Frontend can fetch:
- `https://api.shennastudio.com/health` → `{"message":"OK"}`
- `https://api.shennastudio.com/store/products` → JSON array

✅ Admin login works at:
- `https://api.shennastudio.com/app`
