# Coolify Internal Database Setup Guide

This guide configures your Medusa backend to use Coolify's internal PostgreSQL and Redis databases.

## ✅ Your Internal Database URLs

```bash
# PostgreSQL (Internal Coolify)
postgres://postgres:5nMC5VaPTPVdyOPKdPYJhPvq00MS8UoR2KAEAJp0IGkVJOd1l3D7Q1PLHiPWz5bi@fc880wcg88k88wcwco4gowoo:5432/postgres

# Redis (Internal Coolify)
redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0
```

## 🔧 Step-by-Step Coolify Configuration

### 1. General Settings
- **Name**: `simplehostingserverd/shennastudiollc:medusa`
- **Build Pack**: `Nixpacks`
- **Base Directory**: `/ocean-backend` ⚠️ CRITICAL!

### 2. Environment Variables

Click on **Environment Variables** tab and add:

```bash
# Database URLs (Internal Coolify)
DATABASE_URL=postgres://postgres:5nMC5VaPTPVdyOPKdPYJhPvq00MS8UoR2KAEAJp0IGkVJOd1l3D7Q1PLHiPWz5bi@fc880wcg88k88wcwco4gowoo:5432/postgres
REDIS_URL=redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0

# Security - GENERATE NEW SECRETS!
# Run: openssl rand -base64 32
JWT_SECRET=REPLACE_WITH_OPENSSL_GENERATED_SECRET_32_CHARS
COOKIE_SECRET=REPLACE_WITH_OPENSSL_GENERATED_SECRET_32_CHARS

# Node Environment
NODE_ENV=production

# CORS - Update with YOUR actual domains
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com

# Admin User
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YourSecurePassword123!

# Backend URL
MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Database SSL (false for internal Coolify DBs)
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Auto-initialization (IMPORTANT!)
AUTO_MIGRATE=true
AUTO_CREATE_ADMIN=true
AUTO_SEED=true

# Startup Mode
STARTUP_MODE=full
```

### 3. Build Configuration

**Install Command**: Leave empty (Nixpacks auto-detects)
**Build Command**: Leave empty (Nixpacks auto-detects)
**Start Command**: Leave empty (Nixpacks auto-detects)

Nixpacks will automatically use:
- Install: `npm install`
- Build: `npm run build`
- Start: `npm start`

### 4. Port Configuration

Go to **Advanced** → **Resource Operations** → **Port Mappings**

**Expose ONLY:**
- Container Port: `9000` → External Port: `9000`

**DO NOT expose port 7001** (doesn't exist in Medusa v2)

### 5. Resource Limits (For 12GB RAM Server)

Go to **Advanced** → **Resource Limits**

```
Memory Limit: 4096 MB (4GB)
Memory Reservation: 2048 MB (2GB)
CPU Limit: 2.0 cores
```

### 6. Health Check

Go to **Advanced** → **Healthcheck**

```
Path: /health
Port: 9000
Interval: 30s
Timeout: 10s
Start Period: 180s
```

### 7. Custom Docker Options

Go to **Advanced** → **Custom Docker Options**

```bash
--restart=unless-stopped
--health-cmd="curl -f http://localhost:9000/health || exit 1"
--health-interval=30s
--health-timeout=10s
--health-retries=5
--health-start-period=180s
```

## 🚀 Deployment Process

### First Deployment

When you click **Redeploy**, the container will:

1. ✅ Pull latest code from GitHub
2. ✅ Navigate to `/ocean-backend` directory
3. ✅ Install dependencies (`npm install`)
4. ✅ Wait for PostgreSQL connection
5. ✅ Run database migrations (`npx medusa db:migrate`) ← Creates all tables!
6. ✅ Create admin user
7. ✅ Seed sample products
8. ✅ Build application
9. ✅ Start Medusa server on port 9000

**Startup time**: ~3-5 minutes (watch the logs!)

### What Gets Created in PostgreSQL

The migrations will automatically create these tables:
- `store` - Your store configuration
- `product` - Products catalog
- `product_variant` - Product variations
- `region` - Sales regions
- `cart` - Shopping carts
- `order` - Customer orders
- `customer` - Customer accounts
- `user` - Admin users
- `payment` - Payment processing
- And 50+ more Medusa tables!

### Sample Data (AUTO_SEED=true)

The seeding will create:
- Sample products with images
- Default region (US)
- Shipping options
- Payment providers
- Sample categories

## 🎯 After Deployment

### Access Your Admin Panel

**URL**: `https://api.shennastudio.com/app`

**Login Credentials**:
- Email: `admin@shennastudio.com`
- Password: `YourSecurePassword123!` (whatever you set in ADMIN_PASSWORD)

### Verify It's Working

1. **Check Health**: Visit `https://api.shennastudio.com/health`
   - Should return: `{"message":"OK"}`

2. **Check Admin**: Visit `https://api.shennastudio.com/app`
   - Should show Medusa admin login screen

3. **Check Products API**: Visit `https://api.shennastudio.com/store/products`
   - Should return JSON with products

### Connect Frontend

In your **frontend** Coolify service, set:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
```

## 🐛 Troubleshooting

### "Cannot connect to database"

Check Coolify Terminal:
```bash
nc -zv fc880wcg88k88wcwco4gowoo 5432
```

Should return: `Connection succeeded`

### "Migrations failed"

In Coolify logs, if you see migration errors:

1. Set `STARTUP_MODE=simple` (skips auto-migration)
2. Redeploy
3. Once running, access Terminal and run:
   ```bash
   npx medusa db:migrate
   npm run create-admin
   ```

### "Port 9000 not accessible"

1. Check **Port Mappings** - must expose 9000
2. Check **Domains** - must point to port 9000
3. Check firewall allows port 9000

### "Admin panel shows 404"

This means backend is running but admin build failed.

Check logs for:
```
Frontend build completed successfully
```

If missing, set `STARTUP_MODE=emergency` and redeploy, then manually run:
```bash
npm run build
```

## 📊 Database Management

### Manual Migrations

If AUTO_MIGRATE is disabled, run manually via Terminal:

```bash
npx medusa db:migrate
```

### Create Admin Manually

```bash
npm run create-admin
```

### Seed Database Manually

```bash
npm run seed
```

### Check Database Tables

Access PostgreSQL via Coolify Terminal:

```bash
psql $DATABASE_URL -c "\dt"
```

### Backup Database

In Coolify, go to **Persistent Storage** → **Backups**

Or manually:
```bash
pg_dump $DATABASE_URL > backup.sql
```

## ✅ Success Checklist

- [ ] Environment variables configured
- [ ] Base directory set to `/ocean-backend`
- [ ] Port 9000 exposed (NOT 7001)
- [ ] Resource limits set (4GB memory)
- [ ] Health check configured
- [ ] AUTO_MIGRATE=true
- [ ] AUTO_CREATE_ADMIN=true
- [ ] Deployment successful (check logs)
- [ ] Admin accessible at /app
- [ ] Products API returns data
- [ ] Frontend can connect

## 🎉 You're Done!

Your Medusa backend is now running with internal Coolify databases!

- **Admin Panel**: https://api.shennastudio.com/app
- **API Endpoint**: https://api.shennastudio.com
- **Store**: https://www.shennastudio.com

All database tables, migrations, and sample data have been automatically configured!
