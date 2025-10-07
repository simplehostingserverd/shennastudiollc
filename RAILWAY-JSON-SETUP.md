# 🚂 Railway JSON Configuration Files - Ready to Use

## 📋 Quick Start

I've generated **complete, ready-to-use JSON files** with all secrets pre-generated for your Railway deployment.

---

## 📂 Generated Files

### ✅ Backend Configuration
- **JSON File**: `ocean-backend/railway-backend-ready.env.json`
- **Variables**: 24 environment variables
- **Status**: ✅ Ready to copy & paste into Railway

### ✅ Frontend Configuration  
- **JSON File**: `railway-frontend-ready.env.json`
- **Variables**: 10 environment variables
- **Status**: ⚠️ Needs publishable key after backend is deployed

---

## 🔑 Important Credentials

**Save these immediately!**

### Admin Login Credentials
```
Email: admin@shennastudio.com
Password: YStlOdmsi1LMm6OiqbhHh9c5IOMFkUeu
```

### Backend Secrets (Already in JSON)
```
JWT_SECRET: 994af417a1fc4625a5a340ab5562f4b3e697d3d3bbc541ca5d100403f0f55e88
COOKIE_SECRET: 361bd53e4fc9513a25d5b51466e9087859740d3d3661c693cbde4f6693833d77
```

### Frontend Secret (Already in JSON)
```
NEXTAUTH_SECRET: L05T/EKL9v4K2w+mvQKZcrQCJ7UuRqCUmeN+N3PyjD0=
```

---

## 📋 Step-by-Step Deployment

### STEP 1: Create Railway Infrastructure

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service (click "Add Service" → "Database" → "PostgreSQL")
4. Add Redis service (click "Add Service" → "Database" → "Redis")
5. Wait for both services to be ready

### STEP 2: Deploy Backend

1. In Railway, click "New Service" → "GitHub Repo"
2. Connect your repository
3. **Important**: Set root directory to `ocean-backend`
4. Go to the "Variables" tab
5. Click "RAW EDITOR" button at the top
6. Open the file: `ocean-backend/railway-backend-ready.env.json`
7. Copy **all** the content
8. Paste into Railway's Raw Editor
9. Click "Update Variables"
10. Railway will automatically deploy

**Wait for deployment to complete** (check logs for success)

### STEP 3: Get Medusa Publishable Key

1. Once backend is deployed, find your backend URL in Railway (e.g., `https://ocean-backend-production-xxxx.up.railway.app`)
2. Open: `https://[your-backend-url]/app`
3. Login with:
   - Email: `admin@shennastudio.com`
   - Password: `YStlOdmsi1LMm6OiqbhHh9c5IOMFkUeu`
4. Navigate to: **Settings → Publishable API Keys**
5. Copy the key (it starts with `pk_`)

### STEP 4: Update Frontend JSON

1. Open the file: `railway-frontend-ready.env.json`
2. Find the line: `"NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY": "GET_THIS_FROM_ADMIN_PANEL_AFTER_BACKEND_DEPLOYED"`
3. Replace `GET_THIS_FROM_ADMIN_PANEL_AFTER_BACKEND_DEPLOYED` with your actual publishable key
4. Save the file

Example:
```json
"NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY": "pk_01JKM7N8P9Q0R1S2T3U4V5W6X7"
```

### STEP 5: Deploy Frontend

1. In Railway, click "New Service" → "GitHub Repo"
2. Connect your repository (same repo)
3. **Important**: Leave root directory **empty** or set to `/`
4. Go to the "Variables" tab
5. Click "RAW EDITOR" button at the top
6. Open the file: `railway-frontend-ready.env.json` (the one you just updated)
7. Copy **all** the content
8. Paste into Railway's Raw Editor
9. Click "Update Variables"
10. Railway will automatically deploy

**Wait for deployment to complete**

### STEP 6: Configure Custom Domains

#### Backend Domain
1. Go to Backend service in Railway
2. Click "Settings" tab
3. Scroll to "Domains" section
4. Click "Custom Domain"
5. Enter: `api.shennastudio.com`
6. Follow DNS instructions to add CNAME record

#### Frontend Domains
1. Go to Frontend service in Railway
2. Click "Settings" tab
3. Scroll to "Domains" section
4. Click "Custom Domain"
5. Enter: `shennastudio.com`
6. Click "Add Domain" again
7. Enter: `www.shennastudio.com`
8. Follow DNS instructions to add CNAME records

### STEP 7: Update URLs (After Custom Domains are Active)

Once your custom domains are working, you need to update the environment variables:

#### Update Backend CORS
1. Go to Backend service → Variables
2. Update these variables to use your custom domain:
   - `BACKEND_URL` → `https://api.shennastudio.com`
   - `MEDUSA_BACKEND_URL` → `https://api.shennastudio.com`
   - Verify `STORE_CORS` includes `https://shennastudio.com`
   - Verify `ADMIN_CORS` includes `https://api.shennastudio.com`

#### Update Frontend Backend URL
1. Go to Frontend service → Variables
2. Update:
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` → `https://api.shennastudio.com`
   - `NEXTAUTH_URL` → `https://shennastudio.com`

---

## ✅ Verification Checklist

After deployment, verify everything works:

### Backend Health Check
- [ ] Backend is running: `https://api.shennastudio.com/health`
- [ ] Admin panel loads: `https://api.shennastudio.com/app`
- [ ] Can login with admin credentials
- [ ] Publishable key is visible in admin panel

### Frontend Health Check
- [ ] Storefront loads: `https://shennastudio.com`
- [ ] Products display (if seeded)
- [ ] No console errors
- [ ] Cart functionality works
- [ ] Checkout flow initiates

---

## 🔄 Regenerate Secrets (If Needed)

If you need to regenerate all secrets and JSON files:

```bash
./generate-railway-env.sh
```

This will create new secrets and new JSON files.

---

## 📝 What's Included in Each JSON

### Backend JSON (24 Variables)
```
✓ DATABASE_URL (references Railway PostgreSQL)
✓ REDIS_URL (references Railway Redis)
✓ JWT_SECRET (64-char hex - auto-generated)
✓ COOKIE_SECRET (64-char hex - auto-generated)
✓ STORE_CORS (production domains)
✓ ADMIN_CORS (admin domain)
✓ AUTH_CORS (all domains)
✓ ADMIN_EMAIL (preset)
✓ ADMIN_PASSWORD (32-char base64 - auto-generated)
✓ AUTO_MIGRATE (true - for first deployment)
✓ AUTO_SEED (false - manual seeding)
✓ AUTO_CREATE_ADMIN (true - creates admin on first run)
✓ MEDUSA_ADMIN_ONBOARDING_TYPE (default)
✓ MEDUSA_ADMIN_ONBOARDING_NEXTJS (true)
✓ BACKEND_URL (production URL)
✓ MEDUSA_BACKEND_URL (production URL)
✓ NODE_ENV (production)
✓ PORT (9000)
✓ WORKER_MODE (shared)
✓ DATABASE_LOGGING (false)
✓ DATABASE_SSL (true)
✓ DATABASE_SSL_REJECT_UNAUTHORIZED (false)
✓ STRIPE_API_KEY (your production key)
✓ STRIPE_SECRET_KEY (your production key)
```

### Frontend JSON (10 Variables)
```
✓ NEXT_PUBLIC_MEDUSA_BACKEND_URL (api subdomain)
⚠ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY (needs manual update)
✓ STRIPE_SECRET_KEY (your production key)
✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (your production key)
✓ NEXTAUTH_SECRET (44-char base64 - auto-generated)
✓ NEXTAUTH_URL (main domain)
✓ NODE_ENV (production)
✓ NEXT_TELEMETRY_DISABLED (1)
✓ HOSTNAME (0.0.0.0)
✓ PORT (3000)
```

---

## 🚨 Security Notes

⚠️ **IMPORTANT**:

1. **DO NOT commit these JSON files to git**
   - They contain production secrets
   - Add to `.gitignore` if not already there

2. **Save the admin password securely**
   - You need it to login the first time
   - Change it immediately after first login

3. **After first successful deployment**:
   - Set `AUTO_MIGRATE=false` in backend
   - Set `AUTO_CREATE_ADMIN=false` in backend
   - This prevents re-running setup on every deploy

4. **Keep Stripe keys secure**:
   - Never expose secret keys in frontend code
   - Only publishable keys should be in `NEXT_PUBLIC_*` variables

---

## 🆘 Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify PostgreSQL and Redis services are running
- Ensure `DATABASE_URL` and `REDIS_URL` reference the correct services

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` is correct
- Check CORS settings in backend include frontend domain
- Ensure backend is deployed and healthy

### "Publishable key required" error
- You must deploy backend first
- Get key from admin panel: Settings → Publishable API Keys
- Update frontend JSON before deploying frontend

### Admin panel shows 404
- Admin panel is at `/app` path, not root
- Correct URL: `https://api.shennastudio.com/app`
- NOT: `https://api.shennastudio.com/admin`

### CORS errors in browser console
- Backend `STORE_CORS` must include frontend domain
- Backend `ADMIN_CORS` must include admin panel domain
- Redeploy backend after updating CORS

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Medusa Docs**: https://docs.medusajs.com
- **Stripe Docs**: https://stripe.com/docs

---

## 🎉 You're Ready!

All secrets are generated, all JSON files are ready. Just follow the steps above and you'll have a fully functional production deployment on Railway!

**Estimated Total Time**: 30-45 minutes (excluding DNS propagation)

---

**Last Updated**: January 2025  
**Compatible With**: Railway (Latest), Medusa 2.10.1, Next.js 15.5.3