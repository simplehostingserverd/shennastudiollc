# Railway Environment Variables - Quick Reference Card

## 🚀 Copy-Paste Ready Configuration

### Service 1: PostgreSQL Database
```bash
# ✅ AUTO-CONFIGURED BY RAILWAY - No action needed
```

### Service 2: Redis Cache
```bash
# ✅ AUTO-CONFIGURED BY RAILWAY - No action needed
```

---

## Service 3: Backend (Medusa API)

### 📋 Copy these variables to your Backend service in Railway:

```bash
# Database & Cache (Reference Railway services)
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
REDIS_URL=${{Redis.REDIS_URL}}

# Security Secrets (GENERATE THESE! See commands below)
JWT_SECRET=REPLACE_WITH_64_CHAR_HEX
COOKIE_SECRET=REPLACE_WITH_64_CHAR_HEX

# CORS (Update with your actual domains)
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com

# Admin User (First-time setup)
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=REPLACE_WITH_STRONG_PASSWORD

# Auto-initialization (Set to true for first deployment)
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true

# Medusa Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
BACKEND_URL=https://api.shennastudio.com
MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Server Settings
NODE_ENV=production
PORT=9000
WORKER_MODE=shared

# Stripe Payment (REQUIRED - Get from Stripe Dashboard)
STRIPE_API_KEY=sk_live_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY
STRIPE_SECRET_KEY=sk_live_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY

# Database Logging (Optional)
DATABASE_LOGGING=false
```

---

## Service 4: Frontend (Next.js)

### 📋 Copy these variables to your Frontend service in Railway:

```bash
# Backend Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Medusa Publishable Key (Get from Admin Panel AFTER backend is deployed)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_REPLACE_AFTER_BACKEND_DEPLOYED

# Stripe Payment (REQUIRED)
STRIPE_SECRET_KEY=sk_live_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY

# NextAuth (GENERATE THIS! See commands below)
NEXTAUTH_SECRET=REPLACE_WITH_44_CHAR_BASE64
NEXTAUTH_URL=https://shennastudio.com

# Server Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
HOSTNAME=0.0.0.0
PORT=3000
```

---

## 🔐 Generate Secrets Commands

Run these in your terminal to generate secure secrets:

```bash
# For JWT_SECRET and COOKIE_SECRET (64 characters)
openssl rand -hex 32

# For NEXTAUTH_SECRET (44 characters)
openssl rand -base64 32

# For ADMIN_PASSWORD
openssl rand -base64 24
```

---

## 📝 Deployment Checklist

### Before Deploying:

- [ ] Create Railway project
- [ ] Add PostgreSQL service (auto-configures)
- [ ] Add Redis service (auto-configures)
- [ ] Generate JWT_SECRET, COOKIE_SECRET, NEXTAUTH_SECRET
- [ ] Get Stripe keys from https://dashboard.stripe.com/apikeys
- [ ] Create strong ADMIN_PASSWORD

### Deploy Backend First:

- [ ] Create Backend service in Railway
- [ ] Set root directory: `ocean-backend`
- [ ] Copy all Backend environment variables above
- [ ] Replace all `REPLACE_WITH_*` placeholders
- [ ] Deploy and wait for success

### Get Publishable Key:

- [ ] Visit https://api.shennastudio.com/app
- [ ] Login with ADMIN_EMAIL and ADMIN_PASSWORD
- [ ] Go to Settings → Publishable API Keys
- [ ] Copy the key (starts with `pk_`)

### Deploy Frontend:

- [ ] Create Frontend service in Railway
- [ ] Leave root directory empty (or set to `/`)
- [ ] Copy all Frontend environment variables above
- [ ] Add the Medusa Publishable Key from previous step
- [ ] Replace all `REPLACE_WITH_*` placeholders
- [ ] Deploy and wait for success

### Configure Domains:

- [ ] Backend: api.shennastudio.com
- [ ] Frontend: shennastudio.com
- [ ] Frontend: www.shennastudio.com

### Post-Deployment:

- [ ] Login to admin panel and change password
- [ ] Verify storefront loads
- [ ] Test checkout flow
- [ ] Set AUTO_MIGRATE=false, AUTO_CREATE_ADMIN=false

---

## ⚡ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check DATABASE_URL and REDIS_URL are referencing services correctly |
| Frontend can't connect | Verify NEXT_PUBLIC_MEDUSA_BACKEND_URL matches backend domain |
| Admin panel 404 | Admin is at `/app` path: https://api.shennastudio.com/app |
| CORS errors | Add your frontend domain to STORE_CORS in backend |
| Payment fails | Verify using live keys (sk_live_, pk_live_) not test keys |
| "Publishable key required" | Deploy backend first, get key from admin panel, add to frontend |

---

## 🎯 Railway Service Reference Syntax

Use this syntax to reference other Railway services:

```bash
# Reference PostgreSQL database URL
${{PostgreSQL.DATABASE_URL}}

# Reference Redis URL
${{Redis.REDIS_URL}}

# Reference Backend public domain (for frontend)
${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

---

## 🔒 Security Reminders

✅ **DO:**
- Use `openssl` to generate all secrets
- Use production Stripe keys (sk_live_, pk_live_)
- Set NODE_ENV=production
- Use specific domains in CORS (no wildcards)
- Enable DATABASE_SSL=true

❌ **DON'T:**
- Commit secrets to git
- Use test Stripe keys in production
- Use `*` or `localhost` in CORS
- Share JWT_SECRET or COOKIE_SECRET
- Use weak passwords

---

## 📊 Environment Variable Count

| Service | Required | Optional | Total |
|---------|----------|----------|-------|
| PostgreSQL | 0 (auto) | 0 | 0 |
| Redis | 0 (auto) | 0 | 0 |
| Backend | 18 | 5 | 23 |
| Frontend | 8 | 8 | 16 |
| **TOTAL** | **26** | **13** | **39** |

---

## 🆘 Need Help?

1. Check Railway logs: Railway Dashboard → Service → Deployments → Logs
2. Verify all REPLACE_WITH_* are replaced with actual values
3. Confirm PostgreSQL and Redis services are running
4. Test backend health: `curl https://api.shennastudio.com/health`
5. Review full documentation: `RAILWAY-PRODUCTION-ENV.md`

---

**Last Updated:** January 2025  
**Railway Version:** Latest  
**Medusa Version:** 2.10.1  
**Next.js Version:** 15.5.3