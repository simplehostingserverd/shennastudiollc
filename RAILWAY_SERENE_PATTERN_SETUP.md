# Railway Deployment - Serene-Presence Pattern

This guide shows how to deploy your frontend using the **working serene-presence pattern** with **your actual Shenna's Studio values**.

## What Changed?

Instead of hardcoding URLs, we now use Railway's **service reference variables** that automatically connect services:

### Old Way (Hardcoded):
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
```

### New Way (Service References):
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}
```

This allows Railway to automatically wire up services!

## Files Created

1. **`railway-frontend-serene-pattern.env.json`** - Frontend variables with YOUR values
2. **`ocean-backend/railway-backend-serene-pattern.env.json`** - Backend variables with YOUR values

## Deployment Steps

### Option 1: Using the Helper Script (Recommended)

```bash
./apply-railway-serene-vars.sh
```

This script will:
1. Link to your Railway project
2. Apply frontend variables to Storefront service
3. Apply backend variables to Backend service
4. Trigger redeployments

### Option 2: Manual Setup via Railway Dashboard

#### Step 1: Update Backend Service Variables

1. Go to Railway Dashboard → Your Project → Production → **Backend** service
2. Go to **Variables** tab
3. Delete all existing variables
4. Copy variables from `ocean-backend/railway-backend-serene-pattern.env.json`
5. Paste them one by one (Railway will parse the `${{...}}` references)

**Key Backend Variables:**
- `DATABASE_URL=${{Postgres.DATABASE_PRIVATE_URL}}`
- `REDIS_URL=${{Redis.REDIS_PRIVATE_URL}}?family=0`
- `STORE_CORS=${{Storefront.NEXT_PUBLIC_BASE_URL}}`
- `MEILISEARCH_HOST=https://${{MeiliSearch.MEILI_PUBLIC_URL}}`
- `MINIO_ENDPOINT=${{Bucket.MINIO_PUBLIC_HOST}}`
- All your existing secrets (JWT, COOKIE, Stripe keys, etc.)

#### Step 2: Update Frontend (Storefront) Service Variables

1. Go to Railway Dashboard → Your Project → Production → **Storefront** service
2. Go to **Variables** tab
3. Delete all existing variables
4. Copy variables from `railway-frontend-serene-pattern.env.json`
5. Paste them one by one

**Key Frontend Variables:**
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}`
- `NEXT_PUBLIC_BASE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}`
- `NEXT_PUBLIC_SEARCH_ENDPOINT=https://${{MeiliSearch.MEILI_PUBLIC_URL}}`
- `NEXT_PUBLIC_MINIO_ENDPOINT=${{Bucket.MINIO_PUBLIC_HOST}}`
- Your Stripe keys
- Your NextAuth secret

#### Step 3: Set Custom Domains (If Not Already Set)

**Backend Service:**
- Add custom domain: `api.shennastudio.com`
- This becomes the `RAILWAY_PUBLIC_DOMAIN` for Backend

**Frontend Service:**
- Add custom domain: `shennastudio.com`
- This becomes the `RAILWAY_PUBLIC_DOMAIN` for Storefront

#### Step 4: Redeploy Services

1. Redeploy Backend service first (wait for it to be healthy)
2. Then redeploy Storefront service

### Option 3: Using Railway CLI

```bash
# Link to your project
cd /Users/softwareprosorg/Documents/NewShenna/shennastudiollc
railway link  # Select your project > production

# Apply Backend variables
cd ocean-backend
railway service Backend
railway variables --set "DATABASE_URL=\${{Postgres.DATABASE_PRIVATE_URL}}"
railway variables --set "REDIS_URL=\${{Redis.REDIS_PRIVATE_URL}}?family=0"
railway variables --set "STORE_CORS=\${{Storefront.NEXT_PUBLIC_BASE_URL}}"
# ... continue for all variables

# Apply Frontend variables
cd ..
railway service Storefront
railway variables --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=\${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}"
railway variables --set "NEXT_PUBLIC_BASE_URL=https://\${{RAILWAY_PUBLIC_DOMAIN}}"
# ... continue for all variables
```

## Service Dependencies in Your Project

Your Railway project should have these services:

1. **Postgres** - Database (provides `DATABASE_PRIVATE_URL`)
2. **Redis** - Cache (provides `REDIS_PRIVATE_URL`)
3. **Backend** - Medusa backend (provides `RAILWAY_PUBLIC_DOMAIN_VALUE`)
4. **Storefront** - Next.js frontend (provides `NEXT_PUBLIC_BASE_URL`)
5. **MeiliSearch** - Search engine (provides `MEILI_PUBLIC_URL`, `MEILI_MASTER_KEY`)
6. **Bucket** - MinIO storage (provides `MINIO_PUBLIC_HOST`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`)

## Railway Service Reference Syntax

Railway automatically replaces these at runtime:

- `${{ServiceName.VARIABLE_NAME}}` - Reference another service's variable
- `${{RAILWAY_PUBLIC_DOMAIN}}` - This service's public domain
- `${{RAILWAY_PRIVATE_DOMAIN}}` - This service's private domain (internal Railway network)

## Verification

After deployment, verify:

1. **Backend health**: `https://api.shennastudio.com/health`
2. **Frontend loads**: `https://shennastudio.com`
3. **Products display**: Check if products load from backend
4. **Search works**: If using MeiliSearch
5. **Images load**: If using MinIO/Bucket

## Your Actual Values Preserved

These remain YOUR values (not serene-presence):
- ✅ Stripe API keys (your live keys)
- ✅ JWT & Cookie secrets (your actual secrets)
- ✅ Admin credentials (admin@shennasstudio.com)
- ✅ Medusa publishable key (your actual key)
- ✅ NextAuth secret (your actual secret)
- ✅ Custom domains (shennastudio.com, api.shennastudio.com)

## What Gets Replaced by Railway

These use service references (auto-wired):
- 🔄 Backend URL → Points to your Backend service
- 🔄 Database URL → Points to your Postgres service  
- 🔄 Redis URL → Points to your Redis service
- 🔄 MeiliSearch URL → Points to your MeiliSearch service
- 🔄 MinIO/Bucket URL → Points to your Bucket service

## Troubleshooting

If services don't connect:

1. Check service names match exactly (Backend, Storefront, Postgres, Redis, etc.)
2. Verify all referenced services exist in your project
3. Check Railway logs for variable resolution errors
4. Ensure services are in the same environment (production)

## Next Steps

1. Apply these variables to your Railway project
2. Verify all services deploy successfully
3. Test the frontend at shennastudio.com
4. Check that backend API calls work properly
