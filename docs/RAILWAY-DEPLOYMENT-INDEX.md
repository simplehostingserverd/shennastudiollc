# 🚂 Railway Deployment Guide - Index

Welcome to the complete Railway deployment documentation for Shenna's Studio!

## 📚 Documentation Overview

This directory contains everything you need to deploy Shenna's Studio to Railway.app. Start here and follow the guides in order.

---

## 🎯 Quick Start (5 Minutes)

**New to Railway? Start here:**

1. Read: [`RAILWAY-ENV-QUICK-REFERENCE.md`](./RAILWAY-ENV-QUICK-REFERENCE.md)
2. Copy-paste the environment variables
3. Deploy!

---

## 📖 Complete Documentation

### 1. Architecture & Planning
**File:** [`RAILWAY-ARCHITECTURE.md`](./RAILWAY-ARCHITECTURE.md)

**What's Inside:**
- 🏗️ Complete architecture diagrams with Mermaid
- 🔄 Data flow visualizations
- 🔗 Service connection maps
- 📊 Environment variable flow charts
- 🛠️ Troubleshooting decision trees

**Read this if:**
- You want to understand how everything connects
- You need to visualize the system architecture
- You're troubleshooting connection issues
- You want to see the complete data flow

---

### 2. Environment Variables (Detailed)
**File:** [`RAILWAY-PRODUCTION-ENV.md`](./RAILWAY-PRODUCTION-ENV.md)

**What's Inside:**
- ✅ Complete list of all required variables
- 📝 Detailed explanations for each variable
- 🔐 Security best practices
- 🎯 Service-by-service breakdown
- 📋 Post-deployment checklist
- 🆘 Comprehensive troubleshooting guide

**Read this if:**
- This is your first deployment
- You want detailed explanations
- You need to understand what each variable does
- You're having configuration issues

---

### 3. Quick Reference (Copy-Paste Ready)
**File:** [`RAILWAY-ENV-QUICK-REFERENCE.md`](./RAILWAY-ENV-QUICK-REFERENCE.md)

**What's Inside:**
- ⚡ Copy-paste ready configurations
- 🚀 Minimal setup steps
- 📋 Simple checklist
- 🔧 Command-line tools for generating secrets
- 📊 Quick troubleshooting table

**Read this if:**
- You've deployed before
- You just need the variables quickly
- You want a fast deployment
- You're migrating from another platform

---

### 4. Local Development Setup
**File:** [`RAILWAY-LOCAL-SETUP.md`](./RAILWAY-LOCAL-SETUP.md)

**What's Inside:**
- 💻 Local development with Railway services
- 🔌 Connecting to Railway PostgreSQL & Redis locally
- 🧪 Running tests with Railway databases
- 📝 Admin user creation
- 🌱 Database seeding

**Read this if:**
- You want to develop locally using Railway databases
- You need to test with production-like data
- You're debugging database issues
- You want to run integration tests

---

## 🎬 Deployment Steps (In Order)

### Phase 1: Preparation (10 minutes)
1. ☐ Create Railway account at https://railway.app
2. ☐ Generate secrets using commands in Quick Reference
3. ☐ Get Stripe API keys from https://dashboard.stripe.com
4. ☐ (Optional) Get Algolia keys
5. ☐ (Optional) Get Cloudinary keys

### Phase 2: Infrastructure (5 minutes)
6. ☐ Create new Railway project
7. ☐ Add PostgreSQL service (auto-configured)
8. ☐ Add Redis service (auto-configured)

### Phase 3: Backend Deployment (10 minutes)
9. ☐ Create Backend service
10. ☐ Set root directory: `ocean-backend`
11. ☐ Copy environment variables from Quick Reference
12. ☐ Replace all `REPLACE_WITH_*` placeholders
13. ☐ Deploy and wait for success

### Phase 4: Admin Setup (5 minutes)
14. ☐ Access admin panel: `https://[backend-url].railway.app/app`
15. ☐ Login with ADMIN_EMAIL and ADMIN_PASSWORD
16. ☐ Go to Settings → Publishable API Keys
17. ☐ Copy the publishable key (starts with `pk_`)

### Phase 5: Frontend Deployment (10 minutes)
18. ☐ Create Frontend service
19. ☐ Leave root directory empty
20. ☐ Copy environment variables from Quick Reference
21. ☐ Add the Medusa publishable key from step 17
22. ☐ Replace all `REPLACE_WITH_*` placeholders
23. ☐ Deploy and wait for success

### Phase 6: Custom Domains (15 minutes + DNS propagation)
24. ☐ Configure backend domain: `api.shennastudio.com`
25. ☐ Configure frontend domain: `shennastudio.com`
26. ☐ Configure frontend domain: `www.shennastudio.com`
27. ☐ Update CORS in backend with production domains
28. ☐ Update NEXT_PUBLIC_MEDUSA_BACKEND_URL in frontend

### Phase 7: Verification (10 minutes)
29. ☐ Test storefront loads: `https://shennastudio.com`
30. ☐ Test admin panel: `https://api.shennastudio.com/app`
31. ☐ Test product browsing
32. ☐ Test cart functionality
33. ☐ Test checkout flow (use Stripe test card)

---

## 🔑 Required Environment Variables Summary

### Backend (18 Required)
```
✓ DATABASE_URL
✓ REDIS_URL
✓ JWT_SECRET
✓ COOKIE_SECRET
✓ STORE_CORS
✓ ADMIN_CORS
✓ AUTH_CORS
✓ ADMIN_EMAIL
✓ ADMIN_PASSWORD
✓ STRIPE_API_KEY
✓ STRIPE_SECRET_KEY
✓ MEDUSA_BACKEND_URL
✓ NODE_ENV
✓ PORT
✓ AUTO_MIGRATE
✓ AUTO_CREATE_ADMIN
✓ WORKER_MODE
✓ MEDUSA_ADMIN_ONBOARDING_TYPE
```

### Frontend (8 Required)
```
✓ NEXT_PUBLIC_MEDUSA_BACKEND_URL
✓ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
✓ STRIPE_SECRET_KEY
✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✓ NEXTAUTH_SECRET
✓ NEXTAUTH_URL
✓ NODE_ENV
✓ PORT
```

---

## 🔐 Generate Secrets

Run these commands before deployment:

```bash
# For Backend JWT_SECRET and COOKIE_SECRET (64 characters)
openssl rand -hex 32

# For Frontend NEXTAUTH_SECRET (44 characters)
openssl rand -base64 32

# For ADMIN_PASSWORD
openssl rand -base64 24
```

---

## 🎨 Railway Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Project                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  PostgreSQL  │  │    Redis     │                    │
│  │ (Auto-Config)│  │ (Auto-Config)│                    │
│  └──────┬───────┘  └──────┬───────┘                    │
│         │                  │                             │
│         ├──────────────────┤                             │
│         │                  │                             │
│  ┌──────▼──────────────────▼───────┐                    │
│  │      Medusa Backend API         │                    │
│  │  Port: 9000                     │                    │
│  │  /app = Admin Panel             │                    │
│  │  18 env vars required           │                    │
│  └──────────────┬──────────────────┘                    │
│                 │                                        │
│                 │ Publishable Key                        │
│                 │                                        │
│  ┌──────────────▼──────────────────┐                    │
│  │     Next.js Frontend            │                    │
│  │  Port: 3000                     │                    │
│  │  Storefront                     │                    │
│  │  8 env vars required            │                    │
│  └─────────────────────────────────┘                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
              │                    │
              ▼                    ▼
      shennastudio.com    api.shennastudio.com
```

---

## 🚨 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Backend won't start | Check `DATABASE_URL` and `REDIS_URL` reference services correctly |
| Frontend can't connect | Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` matches backend domain |
| Admin panel 404 | Admin is at `/app` path: `https://api.shennastudio.com/app` |
| CORS errors | Add frontend domain to `STORE_CORS` in backend |
| Payment fails | Use live Stripe keys (`sk_live_`, `pk_live_`) not test keys |
| "Publishable key required" | Deploy backend first, get key from admin panel |
| Build fails | Check Railway build logs, verify `package.json` scripts |
| Database connection timeout | Enable `DATABASE_SSL=true` |

---

## 📞 Support Resources

### Railway Documentation
- Main Docs: https://docs.railway.app
- Environment Variables: https://docs.railway.app/deploy/variables
- Custom Domains: https://docs.railway.app/deploy/exposing-your-app

### Medusa Documentation
- Main Docs: https://docs.medusajs.com
- API Reference: https://docs.medusajs.com/api/store
- Admin Panel: https://docs.medusajs.com/admin

### Stripe Documentation
- API Keys: https://dashboard.stripe.com/apikeys
- Testing: https://stripe.com/docs/testing
- Webhooks: https://dashboard.stripe.com/webhooks

---

## ✅ Deployment Checklist

Print this and check off as you go:

```
PREPARATION
☐ Railway account created
☐ Secrets generated (JWT, COOKIE, NEXTAUTH)
☐ Stripe keys obtained
☐ Repository connected to Railway

INFRASTRUCTURE
☐ PostgreSQL service added
☐ Redis service added
☐ Both services healthy

BACKEND
☐ Backend service created
☐ Root directory set to ocean-backend
☐ All 18 environment variables added
☐ No REPLACE_WITH_ placeholders remain
☐ Deployed successfully
☐ Health check passing

ADMIN
☐ Admin panel accessible
☐ Login successful
☐ Publishable key copied

FRONTEND
☐ Frontend service created
☐ All 8 environment variables added
☐ Publishable key added
☐ No REPLACE_WITH_ placeholders remain
☐ Deployed successfully
☐ Home page loads

DOMAINS
☐ api.shennastudio.com → Backend
☐ shennastudio.com → Frontend
☐ www.shennastudio.com → Frontend
☐ SSL certificates active

VERIFICATION
☐ Storefront loads
☐ Products display
☐ Cart works
☐ Checkout completes (test mode)
☐ Admin panel functional
☐ No console errors

POST-DEPLOYMENT
☐ Admin password changed
☐ AUTO_MIGRATE set to false
☐ AUTO_CREATE_ADMIN set to false
☐ Monitoring configured
☐ Backups verified
```

---

## 🎓 Learning Path

### New to Railway?
1. Start with **Quick Reference** for fast deployment
2. Read **Architecture** to understand connections
3. Refer to **Production ENV** for detailed explanations

### Experienced with Railway?
1. Jump straight to **Quick Reference**
2. Copy environment variables
3. Deploy!

### Debugging Issues?
1. Check **Architecture** for connection diagrams
2. Review **Production ENV** troubleshooting section
3. Verify environment variables in Railway dashboard

---

## 📊 Deployment Timeline

**Estimated Total Time: 60-75 minutes**

- Preparation: 10 minutes
- Infrastructure setup: 5 minutes
- Backend deployment: 10 minutes
- Admin configuration: 5 minutes
- Frontend deployment: 10 minutes
- Domain configuration: 15 minutes
- DNS propagation: 5-60 minutes (varies)
- Testing: 10 minutes

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ All Railway services show "Active" status
✅ Backend health check returns 200 OK
✅ Frontend loads at your custom domain
✅ Admin panel is accessible and functional
✅ Products can be browsed on storefront
✅ Cart functionality works
✅ Checkout flow completes (test mode)
✅ No CORS errors in browser console
✅ SSL certificates are active (🔒 in browser)

---

## 🚀 Ready to Deploy?

1. **First Time?** → Start with [`RAILWAY-ENV-QUICK-REFERENCE.md`](./RAILWAY-ENV-QUICK-REFERENCE.md)
2. **Want Details?** → Read [`RAILWAY-PRODUCTION-ENV.md`](./RAILWAY-PRODUCTION-ENV.md)
3. **Need Visuals?** → Check [`RAILWAY-ARCHITECTURE.md`](./RAILWAY-ARCHITECTURE.md)
4. **Local Development?** → See [`RAILWAY-LOCAL-SETUP.md`](./RAILWAY-LOCAL-SETUP.md)

---

## 📝 Notes

- All environment variables are case-sensitive
- Railway reference syntax: `${{ServiceName.VARIABLE_NAME}}`
- Always use production Stripe keys (sk_live_, pk_live_)
- Enable SSL for database connections (DATABASE_SSL=true)
- CORS must include all production domains
- Publishable key can only be obtained after backend deployment

---

**Last Updated:** January 2025  
**Railway Version:** Latest  
**Medusa Version:** 2.10.1  
**Next.js Version:** 15.5.3  

**Repository:** https://github.com/your-repo/shenna-studio  
**Support:** admin@shennastudio.com