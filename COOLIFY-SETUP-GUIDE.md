# Coolify Deployment Guide for Shenna's Studio

This guide provides complete instructions for deploying both the frontend and backend of Shenna's Studio on Coolify.

## Prerequisites

- Coolify instance running and accessible
- GitHub repository connected to Coolify
- PostgreSQL database (Supabase recommended)
- Redis instance
- Stripe account with API keys
- Domain configured with DNS (Cloudflare recommended)

## Architecture Overview

This is a monorepo with two separate deployments:

1. **Frontend**: Next.js 15 application (root directory)
2. **Backend**: Medusa 2.10.1 e-commerce backend (`/ocean-backend` directory)

## Part 1: Backend Deployment (Medusa API + Admin)

### Step 1: Create Backend Service

1. In Coolify, click **+ New Resource** → **Application**
2. Select your GitHub repository: `simplehostingserverd/shennastudiollc`
3. Configure the service:
   - **Name**: `shennastudio-backend`
   - **Build Pack**: Nixpacks
   - **Base Directory**: `/ocean-backend`
   - **Branch**: `main`

### Step 2: Configure Backend Domains

Add the following domains in the **Domains** section:

```
https://api.shennastudio.com
https://admin.shennastudio.com
```

### Step 3: Configure Backend Ports

In the **Network** section, set:

- **Ports Exposes**: `9000`
- **Ports Mappings**: `9000:9000,7001:7001`

### Step 4: Backend Environment Variables

Go to **Environment Variables** and add the following:

#### Core Configuration
```bash
NODE_ENV=production
PORT=9000
ADMIN_PORT=7001
```

#### Database Configuration
```bash
DATABASE_URL=postgresql://[username]:[password]@[host]:6543/postgres?pgbouncer=true
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

**Note**: Replace with your actual Supabase connection string. Use the **Transaction** pooling mode connection string.

#### Redis Configuration
```bash
REDIS_URL=redis://default:[password]@[host]:6379/0
```

**Note**: Replace with your actual Redis connection string.

#### Security Secrets
```bash
JWT_SECRET=ef4cd5fd10a4e9c7b30e53633b273a84de38c6d2d2d827967f6e753b519c21dc
COOKIE_SECRET=c5ef1ed588a19514cf64fc1c02aea5ceb023c4f1a53dfec3ac7e0c1e3493510a
```

**Important**: Generate your own secrets using:
```bash
openssl rand -hex 32
```

#### CORS Configuration
```bash
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com
```

#### Auto-Initialization
```bash
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true
```

**Note**: Set `AUTO_SEED=false` in production to avoid overwriting real data.

#### Admin User Configuration
```bash
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YourSecurePassword123!
```

**Important**: Change the default password immediately after first login.

#### Medusa Configuration
```bash
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
```

#### Optional: Algolia Search (if using)
```bash
ALGOLIA_APPLICATION_ID=your_application_id
ALGOLIA_ADMIN_API_KEY=your_admin_api_key
```

### Step 5: Build Configuration

The backend uses the `nixpacks.toml` file in `/ocean-backend/` which configures:
- Node.js 20
- npm install
- Build command: `npm run build`
- Start command: `npm start`

### Step 6: Deploy Backend

1. Click **Deploy** button
2. Monitor build logs for any errors
3. Wait for deployment to complete (usually 5-10 minutes)
4. Verify backend is running by visiting `https://api.shennastudio.com/health`

---

## Part 2: Frontend Deployment (Next.js Storefront)

### Step 1: Create Frontend Service

1. In Coolify, click **+ New Resource** → **Application**
2. Select your GitHub repository: `simplehostingserverd/shennastudiollc`
3. Configure the service:
   - **Name**: `shennastudio-frontend`
   - **Build Pack**: Nixpacks
   - **Base Directory**: `/`
   - **Branch**: `main`

### Step 2: Configure Frontend Domains

Add the following domains in the **Domains** section:

```
https://www.shennastudio.com
https://shennastudio.com
```

### Step 3: Configure Frontend Ports

In the **Network** section, set:

- **Ports Exposes**: `3000`
- **Ports Mappings**: `3000:3000`

### Step 4: Frontend Environment Variables

Go to **Environment Variables** and add the following:

#### Core Configuration
```bash
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

#### Backend API Configuration
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c98766c1f4cd3eae138e5a337134ebf9a88f073220ec26d55dfab65f1b0d25c1
```

**Important**: Get the publishable key from your Medusa admin panel after backend deployment.

#### Stripe Configuration
```bash
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your_publishable_key]
```

**Note**: Replace with your actual Stripe keys. Use test keys for staging environments.

#### Database Configuration (Prisma)
```bash
DATABASE_URL=postgresql://[username]:[password]@[host]:6543/postgres?pgbouncer=true
```

**Note**: This can be the same database as backend, or a separate one for frontend-specific data.

#### Optional: Cloudinary Configuration
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=ml_default
```

#### Optional: Algolia Search Configuration
```bash
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=XN8AAM6C2P
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=fdcc16689654068118b960cd3486503d
```

**Important**: Use a **search-only** API key for the public key, NOT the admin key.

#### Optional: Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
```

#### Optional: Builder.io Configuration
```bash
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_api_key
```

### Step 5: Build Configuration

The frontend uses the `nixpacks.toml` file in the root directory which configures:
- Node.js 20
- npm install
- Build command: `npm run build`
- Start command: `npm start`

### Step 6: Deploy Frontend

1. Click **Deploy** button
2. Monitor build logs for any errors
3. Wait for deployment to complete (usually 5-10 minutes)
4. Verify frontend is running by visiting `https://www.shennastudio.com`

---

## Part 3: DNS Configuration (Cloudflare)

### Required DNS Records

In your Cloudflare DNS settings, add the following A records:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | @ | 31.97.8.240 | Proxied |
| A | www | 31.97.8.240 | Proxied |
| A | api | 31.97.8.240 | Proxied |
| A | admin | 31.97.8.240 | Proxied |

**Note**: Replace `31.97.8.240` with your actual server IP address.

### SSL/TLS Configuration

1. Go to **SSL/TLS** in Cloudflare
2. Set SSL/TLS encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

---

## Part 4: Post-Deployment Setup

### 1. Access Medusa Admin Panel

1. Visit `https://admin.shennastudio.com`
2. Login with credentials:
   - Email: `admin@shennastudio.com`
   - Password: `[your configured password]`
3. **Important**: Change your password immediately

### 2. Generate Publishable Key

1. In Medusa Admin, go to **Settings** → **Publishable API Keys**
2. Click **Create Publishable Key**
3. Name it "Storefront"
4. Copy the key (starts with `pk_`)
5. Update frontend environment variable `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
6. Redeploy frontend

### 3. Configure Stripe in Medusa

1. In Medusa Admin, go to **Settings** → **Payments**
2. Add Stripe payment provider
3. Enter your Stripe secret key
4. Configure webhook URL: `https://api.shennastudio.com/webhooks/stripe`

### 4. Add Products

1. In Medusa Admin, go to **Products**
2. Click **Add Product**
3. Fill in product details, images, variants, and pricing
4. Publish products

### 5. Configure Regions and Shipping

1. Go to **Settings** → **Regions**
2. Configure your selling regions (US, etc.)
3. Add shipping options and rates
4. Configure tax settings

---

## Part 5: Troubleshooting

### Backend Issues

#### "Cannot connect to database"
- Verify `DATABASE_URL` is correct
- Check Supabase connection string uses Transaction pooling (port 6543)
- Ensure `DATABASE_SSL=true` is set

#### "Redis connection failed"
- Verify `REDIS_URL` is correct
- Check Redis instance is running and accessible

#### "Admin panel returns 404"
- Verify `ADMIN_PORT=7001` is set
- Check port mapping includes `7001:7001`
- Verify domain `admin.shennastudio.com` points to backend service

### Frontend Issues

#### "Failed to fetch from backend"
- Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com`
- Check backend is running and accessible
- Verify CORS settings in backend include frontend domains

#### "Stripe payment not working"
- Verify both Stripe keys are set correctly
- Check webhook is configured in Stripe dashboard
- Ensure Stripe is enabled in Medusa admin

#### "Images not loading"
- If using Cloudinary, verify all Cloudinary env vars are set
- Check image optimization settings in `next.config.mjs`

---

## Part 6: Environment Variables Checklist

### Backend Required Variables ✅

- [ ] `NODE_ENV=production`
- [ ] `PORT=9000`
- [ ] `ADMIN_PORT=7001`
- [ ] `DATABASE_URL` (PostgreSQL connection string)
- [ ] `REDIS_URL` (Redis connection string)
- [ ] `JWT_SECRET` (32+ character secret)
- [ ] `COOKIE_SECRET` (32+ character secret)
- [ ] `STORE_CORS` (frontend domains)
- [ ] `ADMIN_CORS` (admin domain)
- [ ] `AUTH_CORS` (frontend domains)
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `AUTO_MIGRATE=true`
- [ ] `AUTO_CREATE_ADMIN=true`

### Frontend Required Variables ✅

- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (API domain)
- [ ] `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (from Medusa admin)
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `DATABASE_URL` (if using Prisma)

---

## Part 7: Security Best Practices

1. **Change Default Credentials**: Immediately change admin password after first login
2. **Rotate Secrets**: Regularly rotate `JWT_SECRET` and `COOKIE_SECRET`
3. **Use Strong Passwords**: Admin password should be 16+ characters with mixed case, numbers, and symbols
4. **Limit CORS**: Only add necessary domains to CORS configuration
5. **Use Environment Secrets**: Never commit secrets to git
6. **Enable 2FA**: If available, enable two-factor authentication for admin accounts
7. **Regular Backups**: Set up automated database backups
8. **Monitor Logs**: Regularly check application logs for suspicious activity
9. **Keep Updated**: Regularly update dependencies for security patches
10. **Use HTTPS Only**: Ensure all traffic is encrypted (configured via Cloudflare)

---

## Part 8: Monitoring and Maintenance

### Health Check Endpoints

- **Backend API**: `https://api.shennastudio.com/health`
- **Frontend**: `https://www.shennastudio.com`

### Logs

Access logs in Coolify:
1. Go to your application
2. Click **Logs** tab
3. Monitor for errors or warnings

### Database Backups

Set up automated backups in Supabase:
1. Go to Supabase project settings
2. Enable automated backups
3. Configure backup retention period

### Performance Monitoring

Consider adding:
- Sentry for error tracking
- Google Analytics for user analytics
- Uptime monitoring (UptimeRobot, Pingdom, etc.)

---

## Support and Resources

- **Medusa Documentation**: https://docs.medusajs.com
- **Next.js Documentation**: https://nextjs.org/docs
- **Coolify Documentation**: https://coolify.io/docs
- **Project Repository**: https://github.com/simplehostingserverd/shennastudiollc

---

## Quick Reference: Complete Environment Variables

### Backend (.env)
```bash
# Core
NODE_ENV=production
PORT=9000
ADMIN_PORT=7001

# Database
DATABASE_URL=postgresql://user:pass@host:6543/postgres?pgbouncer=true
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Redis
REDIS_URL=redis://default:pass@host:6379/0

# Security
JWT_SECRET=your_jwt_secret_here
COOKIE_SECRET=your_cookie_secret_here

# CORS
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com

# Admin
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YourSecurePassword123!
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true

# Medusa
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
```

### Frontend (.env)
```bash
# Core
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1

# Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# Database (if using Prisma)
DATABASE_URL=postgresql://user:pass@host:6543/postgres?pgbouncer=true

# Optional: Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Algolia
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
```

---

*Last Updated: 2025-09-30*