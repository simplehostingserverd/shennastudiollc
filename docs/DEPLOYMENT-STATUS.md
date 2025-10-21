# Deployment Status & Access Guide

## Current Status: Ready for Deployment

All configuration issues have been fixed. Follow the steps below to complete deployment.

---

## Access URLs

### Frontend (Storefront)
- **URL**: https://www.shennastudio.com
- **Port**: 3000

### Backend API
- **URL**: https://api.shennastudio.com
- **Port**: 9000

### Admin Panel
- **URL**: https://api.shennastudio.com/app
- **Alternative**: Set up Cloudflare redirect from `admin.shennastudio.com` → `api.shennastudio.com/app`

**Note**: In Medusa v2, the admin panel runs on the **same port as the API** (9000), just at a different path (`/app`).

---

## Required Actions in Coolify

### 1. Backend Deployment

**Environment Variables** (must be set):
```bash
# Core
NODE_ENV=production
PORT=9000

# Database (Supabase)
DATABASE_URL=postgresql://postgres.ncmpqawcsdlnnhpsgjvz:Q5XWV7Ghap9Ue0Mc@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Redis (Upstash) - CRITICAL
REDIS_URL=rediss://default:ATw7AAIncDJmYTNkOTljYzc3ZmY0MWQwYmY1NGFhMjFkNWMzYjk4ZXAyMTU0MTk@mighty-marlin-15419.upstash.io:6379

# Security
JWT_SECRET=ef4cd5fd10a4e9c7b30e53633b273a84de38c6d2d2d827967f6e753b519c21dc
COOKIE_SECRET=c5ef1ed588a19514cf64fc1c02aea5ceb023c4f1a53dfec3ac7e0c1e3493510a

# CORS - CRITICAL
STORE_CORS=https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://www.shennastudio.com

# Admin User
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=NikitaShenna1987!
AUTO_MIGRATE=true
AUTO_CREATE_ADMIN=true
AUTO_SEED=false
```

**Port Configuration**:
- Ports Exposes: `9000`
- Ports Mappings: `9000:9000`

**Domain**:
- `api.shennastudio.com`

### 2. Frontend Deployment

**Environment Variables** (must be set):
```bash
# Core
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1

# Backend Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=(get from Medusa admin after backend is running)

# Stripe
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=(your Stripe publishable key)

# Optional: Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Algolia
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=XN8AAM6C2P
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=fdcc16689654068118b960cd3486503d
```

**Port Configuration**:
- Ports Exposes: `3000`
- Ports Mappings: `3000:3000`

**Domains**:
- `www.shennastudio.com`
- `shennastudio.com` (will redirect to www via Cloudflare)

---

## Cloudflare Configuration

### DNS Records
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | [Your Server IP] | ✅ Proxied |
| A | www | [Your Server IP] | ✅ Proxied |
| A | api | [Your Server IP] | ✅ Proxied |

### Redirect Rules

**Rule 1: Non-www to www**
- If: `shennastudio.com/*`
- Then: Redirect to `https://www.shennastudio.com/$1`
- Status: 301 (Permanent)

**Rule 2: Admin shortcut (Optional)**
- If: `admin.shennastudio.com/*`
- Then: Redirect to `https://api.shennastudio.com/app`
- Status: 302 (Temporary)

### SSL/TLS Settings
- Mode: **Full (strict)** or **Full**
- Always Use HTTPS: ✅ Enabled
- Automatic HTTPS Rewrites: ✅ Enabled

---

## Deployment Steps

### Step 1: Deploy Backend
1. Go to Coolify → Backend deployment
2. Verify all environment variables are set correctly
3. Click **Redeploy**
4. Wait for build to complete (check logs)
5. Verify deployment is successful
6. Test: `curl https://api.shennastudio.com/health`

### Step 2: Access Admin Panel
1. Go to: https://api.shennastudio.com/app
2. Login with:
   - Email: `admin@shennastudio.com`
   - Password: `NikitaShenna1987!`
3. **Generate Publishable Key**:
   - Settings → Publishable API Keys
   - Create new key named "Storefront"
   - Copy the key (starts with `pk_`)

### Step 3: Update Frontend with Publishable Key
1. Go to Coolify → Frontend deployment
2. Add environment variable:
   - Name: `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
   - Value: `pk_...` (from Step 2)
3. Click **Redeploy**

### Step 4: Deploy Frontend
1. Wait for frontend build to complete
2. Check logs for errors
3. Visit: https://www.shennastudio.com
4. Verify products load correctly

---

## Verification Checklist

### Backend Health
- [ ] Backend deployed successfully
- [ ] Can access: `https://api.shennastudio.com/health`
- [ ] No Redis warnings in logs
- [ ] No database connection errors
- [ ] Admin panel accessible at `/app`

### Frontend Health
- [ ] Frontend deployed successfully
- [ ] Can access: `https://www.shennastudio.com`
- [ ] No 404 errors for static assets
- [ ] Products load from backend (no CORS errors)
- [ ] Images display correctly

### Admin Panel
- [ ] Can login at `https://api.shennastudio.com/app`
- [ ] Dashboard loads correctly
- [ ] Can view/create products
- [ ] Publishable key generated

---

## Troubleshooting

### Backend not accessible
```bash
# Test backend health
curl -I https://api.shennastudio.com/health

# Should return: 200 OK
```

### Admin panel 404
- Verify backend is deployed and running
- Check that `/app` path is not being blocked
- Admin is at: `https://api.shennastudio.com/app` (not a separate domain)

### Frontend 404 for static assets
- Redeploy frontend (standalone build fix applied)
- Check build logs for errors
- Verify `public` and `.next/static` folders are copied

### Products not loading / CORS errors
- Verify `STORE_CORS=https://www.shennastudio.com` on backend
- Verify `AUTH_CORS=https://www.shennastudio.com` on backend
- Check browser console for actual error
- Test: Browser console → `fetch('https://api.shennastudio.com/store/products?limit=10')`

---

## Security Notes

1. **Change default admin password** immediately after first login
2. **Regenerate Redis password** in Upstash (it was exposed in messages)
3. **Rotate JWT_SECRET and COOKIE_SECRET** regularly
4. **Enable 2FA** if available in admin panel
5. **Set up database backups** in Supabase

---

## Next Steps After Deployment

1. ✅ Change admin password
2. ✅ Add products via admin panel
3. ✅ Configure regions and shipping rates
4. ✅ Set up Stripe webhooks
5. ✅ Test checkout flow end-to-end
6. ✅ Set up monitoring/alerts
7. ✅ Configure automated backups

---

*Last Updated: 2025-09-30*
*All fixes have been pushed to GitHub - redeploy both services to apply*