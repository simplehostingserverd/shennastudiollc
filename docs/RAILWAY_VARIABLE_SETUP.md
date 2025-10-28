# Railway Variable Setup for Shenna Studio

## Overview
You have 3 services that need to talk to each other:
1. **PostgreSQL** (Database) - Already configured ✅
2. **Backend** (Medusa API) - Needs to connect to PostgreSQL
3. **Storefront** (Next.js Frontend) - Needs to connect to Backend

## 1. PostgreSQL Service - DON'T CHANGE THESE ✅

Your PostgreSQL variables are correct. Leave them as is:
```bash
DATABASE_PRIVATE_URL="postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:5432/${{PGDATABASE}}"
DATABASE_URL="postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}/${{PGDATABASE}}"
POSTGRES_DB="railway"
POSTGRES_PASSWORD="ssLTcZXdHiNEUDfDoDQhKOAZASjSbrCA"
POSTGRES_USER="postgres"
```

## 2. Backend Service (Medusa) - CRITICAL VARIABLES

Your Backend service needs these variables to connect to PostgreSQL and work properly:

### Database Connection (REQUIRED)
```bash
# Use the PRIVATE URL for best performance (internal Railway network)
DATABASE_URL=${{Postgres.DATABASE_PRIVATE_URL}}

# Alternative if private doesn't work:
# DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Medusa Core Configuration (REQUIRED)
```bash
# JWT Secret (must be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-here

# Cookie Secret (must be at least 32 characters)
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars-here

# Backend URL
MEDUSA_BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
RAILWAY_PUBLIC_DOMAIN_VALUE=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

### CORS Configuration (REQUIRED)
```bash
# Allow frontend to access the backend
STORE_CORS=${{Storefront.RAILWAY_PUBLIC_DOMAIN}}
AUTH_CORS=${{Storefront.RAILWAY_PUBLIC_DOMAIN}}
ADMIN_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

### Redis (if you have it)
```bash
REDIS_URL=${{Redis.REDIS_PRIVATE_URL}}?family=0
```

### Meilisearch (if you have it)
```bash
MEILISEARCH_HOST=https://${{MeiliSearch.MEILI_PUBLIC_URL}}
MEILISEARCH_API_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}
```

### Admin User (REQUIRED for first setup)
```bash
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### Other Important Variables
```bash
NODE_ENV=production
PORT=9000
LOG_LEVEL=info
```

## 3. Storefront Service (Next.js Frontend) - REQUIRED VARIABLES

Your frontend needs these to connect to the backend:

### Backend Connection (REQUIRED)
```bash
# Connect to your Medusa backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}

# Or if you have a custom domain:
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Frontend's own URL (for backend CORS)
NEXT_PUBLIC_BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### App Configuration (REQUIRED)
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
```

### Optional - Stripe (if using payments)
```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### Optional - Meilisearch (if using search)
```bash
NEXT_PUBLIC_MEILISEARCH_HOST=${{MeiliSearch.MEILI_PUBLIC_URL}}
NEXT_PUBLIC_MEILISEARCH_API_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}
```

## 4. How to Set These Variables

### Option 1: Railway CLI (Recommended)

```bash
# Link to your project
railway link

# Set Backend variables
railway variables --service Backend \
  --set "DATABASE_URL=\${{Postgres.DATABASE_PRIVATE_URL}}" \
  --set "JWT_SECRET=your-super-secret-jwt-key-min-32-chars-here" \
  --set "COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars-here" \
  --set "MEDUSA_BACKEND_URL=https://\${{RAILWAY_PUBLIC_DOMAIN}}" \
  --set "STORE_CORS=\${{Storefront.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "AUTH_CORS=\${{Storefront.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "ADMIN_CORS=https://\${{RAILWAY_PUBLIC_DOMAIN}}" \
  --set "ADMIN_EMAIL=admin@shennastudio.com" \
  --set "ADMIN_PASSWORD=YourSecurePassword123!" \
  --set "NODE_ENV=production" \
  --set "PORT=9000"

# Set Frontend variables
railway variables --service Storefront \
  --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=\${{Backend.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "NEXT_PUBLIC_BASE_URL=\${{RAILWAY_PUBLIC_DOMAIN}}" \
  --set "NODE_ENV=production" \
  --set "NEXT_TELEMETRY_DISABLED=1" \
  --set "PORT=3000" \
  --set "HOSTNAME=0.0.0.0"
```

### Option 2: Railway Dashboard

1. Go to your Railway project: https://railway.app/project/diplomatic-grace
2. Click on **Backend** service
3. Go to **Variables** tab
4. Add each variable listed in section 2 above
5. Click **Deploy** button
6. Repeat for **Storefront** service with variables from section 3

## 5. Common Service Name Variations

Your services might be named differently. Common names:
- PostgreSQL: `Postgres`, `PostgreSQL`, `Database`
- Backend: `Backend`, `Medusa`, `API`, `medusa-backend`
- Frontend: `Storefront`, `Frontend`, `storefront`, `next-frontend`
- Redis: `Redis`, `redis`
- Meilisearch: `MeiliSearch`, `Meilisearch`, `meili`

Check your actual service names in Railway dashboard and use those in the `${{ServiceName.VARIABLE}}` references.

## 6. Verification Steps

After setting variables:

### Test Backend
```bash
# Get backend URL
railway domain --service Backend

# Test health (replace with your domain)
curl https://your-backend.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Test Admin Panel
Visit: `https://your-backend-url.up.railway.app/app`
Login with your ADMIN_EMAIL and ADMIN_PASSWORD

### Test Frontend
```bash
# Get frontend URL
railway domain --service Storefront

# Visit in browser
```
Should show your storefront with products loading from backend.

## 7. Troubleshooting

### Backend won't start
- Check `DATABASE_URL` is set correctly
- Verify `JWT_SECRET` and `COOKIE_SECRET` are at least 32 characters
- Check logs: `railway logs --service Backend`

### Frontend shows CORS errors
- Verify backend `STORE_CORS` includes frontend domain
- Check backend `AUTH_CORS` includes frontend domain
- Restart backend after CORS changes

### Products not loading
- Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in frontend
- Test backend URL directly: `curl https://backend-url/store/products`
- Check browser console for errors

### Admin panel won't load
- Admin panel is at `/app` path on backend URL (not separate port)
- Visit: `https://your-backend-url.up.railway.app/app`
- Check `ADMIN_CORS` includes backend's own domain

## 8. Security Notes

⚠️ **IMPORTANT**: Change these default values:
- `JWT_SECRET` - Generate a random 32+ character string
- `COOKIE_SECRET` - Generate a random 32+ character string
- `ADMIN_PASSWORD` - Use a strong password

Generate secure secrets:
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate COOKIE_SECRET
openssl rand -base64 32
```

## 9. Quick Reference

**PostgreSQL** → Leave as is ✅
**Backend** → Needs DATABASE_URL, JWT_SECRET, COOKIE_SECRET, CORS settings
**Storefront** → Needs NEXT_PUBLIC_MEDUSA_BACKEND_URL

**Critical Connection**:
- Backend connects to Postgres via: `${{Postgres.DATABASE_PRIVATE_URL}}`
- Frontend connects to Backend via: `${{Backend.RAILWAY_PUBLIC_DOMAIN}}`
- Backend allows Frontend via: `STORE_CORS=${{Storefront.RAILWAY_PUBLIC_DOMAIN}}`
