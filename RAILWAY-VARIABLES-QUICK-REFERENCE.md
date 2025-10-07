# Railway Variables Quick Reference Card

## 🚀 Backend Service Variables

### Required (Critical)
```bash
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<run: openssl rand -base64 32>
COOKIE_SECRET=<run: openssl rand -base64 32>
NODE_ENV=production
```

### Admin Setup
```bash
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<your-secure-password>
```

### CORS Configuration
```bash
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com,https://frontend.railway.app
ADMIN_CORS=https://api.shennastudio.com,https://backend.railway.app
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com
```

### Optional
```bash
DATABASE_LOGGING=false
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
WORKER_MODE=shared
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true
BACKEND_URL=https://api.shennastudio.com
MEDUSA_BACKEND_URL=https://api.shennastudio.com
PORT=9000
```

---

## 🎨 Frontend Service Variables

### Required (Critical)
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01JQX...
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://frontend.railway.app
NODE_ENV=production
```

### Stripe Payment
```bash
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMqYouB5PBrSK8udOL1PcTXM6J4rGqIKnA75jTTBOGqkMGKIDRnqOSxIK4BakHFUFXK9Bd0TTGB00VoS4YZTX
```

### Server Configuration
```bash
NEXT_TELEMETRY_DISABLED=1
HOSTNAME=0.0.0.0
PORT=3000
```

---

## 📝 Step-by-Step Setup

### 1️⃣ Generate Secrets
```bash
# JWT Secret (Backend)
openssl rand -base64 32

# Cookie Secret (Backend)
openssl rand -base64 32

# NextAuth Secret (Frontend)
openssl rand -base64 32
```

### 2️⃣ Get Backend URL
1. Railway Dashboard → Backend Service
2. Copy domain (e.g., `medusa-backend-production.up.railway.app`)
3. Use as: `https://medusa-backend-production.up.railway.app`

### 3️⃣ Get Publishable Key
1. Visit: `https://your-backend-url.railway.app/app`
2. Login with ADMIN_EMAIL and ADMIN_PASSWORD
3. Settings → Publishable API Keys
4. Copy key (starts with `pk_`)

### 4️⃣ Add to Railway
1. Go to Service → Variables tab
2. Click "+ New Variable"
3. Paste name and value
4. Repeat for all variables
5. Deploy

---

## 🔗 Connection Flow

```
1. Backend Deploys
   └── Gets DATABASE_URL from PostgreSQL addon
   └── Gets REDIS_URL from Redis addon
   └── Creates admin user with ADMIN_EMAIL/PASSWORD
   └── Runs on: https://backend.railway.app

2. Get Publishable Key
   └── Login to: https://backend.railway.app/app
   └── Copy key from admin panel

3. Frontend Deploys
   └── Uses NEXT_PUBLIC_MEDUSA_BACKEND_URL to connect
   └── Uses NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY to authenticate
   └── Runs on: https://frontend.railway.app

4. Frontend Calls Backend
   └── Browser makes request to backend
   └── Backend checks STORE_CORS
   └── If frontend domain in STORE_CORS ✅
   └── Backend responds with data
```

---

## ✅ Verification Commands

```bash
# Test Backend Health
curl https://your-backend.railway.app/health
# Expected: {"status":"ok"}

# Test Backend API
curl https://your-backend.railway.app/store/products
# Expected: JSON with products

# Test Frontend
curl https://your-frontend.railway.app/
# Expected: HTML response

# Test CORS
curl -H "Origin: https://your-frontend.railway.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-backend.railway.app/store/products
# Expected: 200 or 204 with CORS headers
```

---

## 🚨 Common Mistakes

### ❌ Wrong Variable Names
```bash
# WRONG
NEXT_PUBLIC_BACKEND_URL=...
PUBLISHABLE_KEY=...

# CORRECT
NEXT_PUBLIC_MEDUSA_BACKEND_URL=...
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=...
```

### ❌ Missing https://
```bash
# WRONG
NEXT_PUBLIC_MEDUSA_BACKEND_URL=backend.railway.app

# CORRECT
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend.railway.app
```

### ❌ Wrong CORS Configuration
```bash
# WRONG - Doesn't include frontend domain
STORE_CORS=https://localhost:3000

# CORRECT - Includes actual frontend domain
STORE_CORS=https://frontend.railway.app,https://shennastudio.com
```

### ❌ Using Backend Key Instead of Publishable Key
```bash
# WRONG - This is a secret key
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=sk_...

# CORRECT - Publishable keys start with pk_
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

---

## 🎯 Priority Order

### Deploy in this order:
1. **Backend First**
   - Add all backend variables
   - Add PostgreSQL addon
   - Add Redis addon
   - Deploy and verify health check
   - Get publishable key

2. **Frontend Second**
   - Add backend URL (from step 1)
   - Add publishable key (from step 1)
   - Add all other frontend variables
   - Deploy and verify homepage loads

---

## 📋 Checklist

### Backend Variables
- [ ] DATABASE_URL (from addon)
- [ ] REDIS_URL (from addon)
- [ ] JWT_SECRET (generated)
- [ ] COOKIE_SECRET (generated)
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD
- [ ] STORE_CORS (include frontend domains)
- [ ] NODE_ENV=production

### Frontend Variables
- [ ] NEXT_PUBLIC_MEDUSA_BACKEND_URL (from backend deployment)
- [ ] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY (from admin panel)
- [ ] NEXTAUTH_SECRET (generated)
- [ ] NEXTAUTH_URL (frontend domain)
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] NODE_ENV=production
- [ ] HOSTNAME=0.0.0.0
- [ ] PORT=3000

### Deployment Status
- [ ] Backend health check passing
- [ ] Backend admin panel accessible
- [ ] Frontend homepage loading
- [ ] Frontend can fetch products from backend
- [ ] No CORS errors in browser console

---

## 🔄 If You Need to Change Variables

1. Go to Railway → Service → Variables
2. Click on the variable to edit
3. Change the value
4. Click "Update"
5. Service will auto-redeploy with new values

**Note:** Changes to variables automatically trigger a redeploy!

---

**Quick Access:**
- Backend Admin: `https://your-backend.railway.app/app`
- Backend Health: `https://your-backend.railway.app/health`
- Frontend: `https://your-frontend.railway.app`

**Last Updated:** 2025-01-07