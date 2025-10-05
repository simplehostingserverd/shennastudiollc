# Coolify Environment Variables - Quick Reference

## How to Use This Guide

1. Copy all variables from the **Required Variables** section
2. Paste into Coolify **Environment Variables** tab
3. Replace placeholder values (marked with `<>`) with actual values
4. Add optional variables as needed
5. Click **Save** then **Deploy**

---

## Required Variables (Copy/Paste Ready)

```bash
# ============================================
# DATABASE CREDENTIALS
# ============================================
POSTGRES_DB=medusa_db
POSTGRES_USER=medusa_user
POSTGRES_PASSWORD=REPLACE_WITH_SECURE_PASSWORD

# ============================================
# SECURITY SECRETS (Generate with: openssl rand -hex 32)
# ============================================
JWT_SECRET=REPLACE_WITH_64_CHAR_SECRET
COOKIE_SECRET=REPLACE_WITH_64_CHAR_SECRET

# ============================================
# CORS CONFIGURATION
# ============================================
STORE_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://shop.shennastudio.com,https://www.shennastudio.com,https://shennastudio.com

# ============================================
# BACKEND URLS
# ============================================
BACKEND_URL=https://admin.shennastudio.com
MEDUSA_BACKEND_URL=https://admin.shennastudio.com
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://admin.shennastudio.com

# ============================================
# ADMIN USER
# ============================================
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=REPLACE_WITH_STRONG_PASSWORD

# ============================================
# AUTO-INITIALIZATION
# ============================================
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true

# ============================================
# STRIPE PAYMENT
# ============================================
STRIPE_SECRET_KEY=REPLACE_WITH_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=REPLACE_WITH_STRIPE_PUBLISHABLE_KEY

# ============================================
# MEDUSA PUBLISHABLE KEY (Get from admin panel AFTER first deployment)
# ============================================
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=REPLACE_AFTER_FIRST_DEPLOYMENT

# ============================================
# DOMAIN LABELS (For Coolify routing)
# ============================================
BACKEND_DOMAIN=admin.shennastudio.com
FRONTEND_DOMAINS=www.shennastudio.com,shennastudio.com,shop.shennastudio.com
```

---

## Variable Details & Generation Commands

| Variable | Description | How to Generate | Example |
|----------|-------------|-----------------|---------|
| `POSTGRES_PASSWORD` | Database password | `openssl rand -hex 32` | `a1b2c3d4e5f6...` (64 chars) |
| `JWT_SECRET` | JWT token secret | `openssl rand -hex 32` | `f6e5d4c3b2a1...` (64 chars) |
| `COOKIE_SECRET` | Cookie signing secret | `openssl rand -hex 32` | `1a2b3c4d5e6f...` (64 chars) |
| `ADMIN_PASSWORD` | Admin user password | `openssl rand -base64 24` | `Xk9mPqRs...` (32 chars) |
| `STRIPE_SECRET_KEY` | Stripe secret key | From Stripe dashboard | `sk_live_xxxxx` or `sk_test_xxxxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | From Stripe dashboard | `pk_live_xxxxx` or `pk_test_xxxxx` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Medusa API key | From admin panel after deployment | `pk_xxxxx` |

---

## Optional Variables

### Algolia Search (Optional)

```bash
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
ALGOLIA_ADMIN_API_KEY=your_admin_key
```

### Cloudinary Images (Optional)

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database SSL (For external databases)

```bash
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Advanced Configuration

```bash
# Worker mode (shared = API + workers together)
BACKEND_WORKER_MODE=shared

# Disable admin on worker container
DISABLE_ADMIN=false

# Database logging (for debugging)
DATABASE_LOGGING=false
```

---

## Step-by-Step Setup Checklist

### Before Deployment

- [ ] Generate `POSTGRES_PASSWORD` using `openssl rand -hex 32`
- [ ] Generate `JWT_SECRET` using `openssl rand -hex 32`
- [ ] Generate `COOKIE_SECRET` using `openssl rand -hex 32`
- [ ] Generate `ADMIN_PASSWORD` using `openssl rand -base64 24`
- [ ] Save all secrets in password manager
- [ ] Get Stripe keys from https://dashboard.stripe.com/apikeys
- [ ] Copy all required variables to Coolify

### After First Deployment

- [ ] Login to admin panel: `https://admin.shennastudio.com/app`
- [ ] Go to **Settings** → **Publishable API Keys**
- [ ] Copy the publishable key
- [ ] Add `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` to Coolify
- [ ] Redeploy to apply the key

### Verify Deployment

- [ ] Backend health: `curl https://admin.shennastudio.com/health`
- [ ] Admin panel: `https://admin.shennastudio.com/app`
- [ ] Frontend: `https://www.shennastudio.com`
- [ ] Login to admin with `ADMIN_EMAIL` and `ADMIN_PASSWORD`

---

## Security Notes

⚠️ **Important Security Practices**:

1. **Never commit secrets to Git** - Use Coolify's environment variables only
2. **Use strong passwords** - Minimum 32 characters for database/secrets
3. **Store secrets safely** - Use a password manager (1Password, Bitwarden, etc.)
4. **Use production Stripe keys** - Never use test keys in production
5. **Enable HTTPS** - Coolify handles SSL certificates automatically
6. **Restrict CORS** - Never use `*` wildcard in production

---

## Common Issues

### Issue: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not defined"

**Solution**: This is expected on first deployment. Deploy once, get the key from admin panel, add it, then redeploy.

### Issue: Backend can't connect to database

**Solution**: Check that `POSTGRES_PASSWORD` matches in both database and backend services. In Docker Compose deployment, these are automatically synchronized.

### Issue: Admin login fails

**Solution**:
1. Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly
2. Check `AUTO_CREATE_ADMIN=true` is set
3. Check backend logs for admin creation messages

### Issue: CORS errors in browser

**Solution**:
1. Ensure `STORE_CORS` includes your frontend domain
2. Ensure `ADMIN_CORS` includes your admin domain
3. Check domains are HTTPS in production

---

## Domain Configuration

### Backend Domain

- **Service**: `backend`
- **Port**: `9000`
- **Domain**: `admin.shennastudio.com`
- **Purpose**: API + Admin Panel
- **Admin Path**: `/app` (https://admin.shennastudio.com/app)

### Frontend Domains

- **Service**: `frontend`
- **Port**: `3000`
- **Primary**: `www.shennastudio.com`
- **Aliases**: `shennastudio.com`, `shop.shennastudio.com`
- **Purpose**: Customer-facing storefront

### Internal Services (No external access)

- **PostgreSQL**: `postgres:5432` (internal only)
- **Redis**: `redis:6379` (internal only)
- **Worker**: No exposed port (internal background jobs)

---

## Quick Command Reference

```bash
# Generate secrets (run locally)
openssl rand -hex 32     # For JWT_SECRET, COOKIE_SECRET, POSTGRES_PASSWORD
openssl rand -base64 24  # For ADMIN_PASSWORD

# Check service health (in Coolify terminal)
curl http://backend:9000/health
curl http://frontend:3000

# Check database (in Coolify terminal)
docker exec -it <postgres-container> psql -U medusa_user -d medusa_db

# Check Redis (in Coolify terminal)
docker exec -it <redis-container> redis-cli ping

# View backend logs
docker logs <backend-container> -f

# Run migrations manually (if needed)
docker exec -it <backend-container> npx medusa db:migrate

# Create admin manually (if needed)
docker exec -it <backend-container> npm run create-admin
```

---

## Environment Variables by Service

### PostgreSQL Service
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### Redis Service
- No environment variables needed (uses defaults)

### Backend Service
- `DATABASE_URL` (auto-generated from PostgreSQL vars)
- `REDIS_URL` (auto-generated)
- `JWT_SECRET`
- `COOKIE_SECRET`
- `STORE_CORS`
- `ADMIN_CORS`
- `AUTH_CORS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `BACKEND_URL`
- `MEDUSA_BACKEND_URL`
- `AUTO_MIGRATE`
- `AUTO_SEED`
- `AUTO_CREATE_ADMIN`
- `BACKEND_WORKER_MODE`

### Frontend Service
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ALGOLIA_APPLICATION_ID` (optional)
- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` (optional)
- `CLOUDINARY_CLOUD_NAME` (optional)
- `CLOUDINARY_API_KEY` (optional)
- `CLOUDINARY_API_SECRET` (optional)

### Worker Service
- `DATABASE_URL` (auto-generated)
- `REDIS_URL` (auto-generated)
- `JWT_SECRET` (same as backend)
- `COOKIE_SECRET` (same as backend)
- `STORE_CORS` (same as backend)
- `ADMIN_CORS` (same as backend)
- `AUTH_CORS` (same as backend)
- `BACKEND_URL`
- `MEDUSA_BACKEND_URL`

---

**Last Updated**: 2025-10-05
**For**: Docker Compose deployment on Coolify VPS
