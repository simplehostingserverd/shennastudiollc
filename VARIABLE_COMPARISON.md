# Variable Comparison: Serene-Presence Pattern vs Old Config

## Frontend (Storefront) Variables

### ✅ What Changed (Service References)

| Old (Hardcoded) | New (Service References) |
|----------------|--------------------------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com` | `NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}` |
| *(not set)* | `NEXT_PUBLIC_BASE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| *(not set)* | `NEXT_PUBLIC_SEARCH_ENDPOINT=https://${{MeiliSearch.MEILI_PUBLIC_URL}}` |
| *(not set)* | `NEXT_PUBLIC_MINIO_ENDPOINT=${{Bucket.MINIO_PUBLIC_HOST}}` |
| *(not set)* | `MEILISEARCH_API_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}` |
| *(not set)* | `NEXT_PUBLIC_INDEX_NAME=products` |

### ✅ What Stayed the Same (Your Values)

```bash
# These are YOUR actual production values - unchanged
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c98766c1f4cd3eae138e5a337134ebf9a88f073220ec26d55dfab65f1b0d25c1
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMqYouB5PBrSK8udOL1PcTXM6J4rGqIKnA75jTTBOGqkMGKIDRnqOSxIK4BakHFUFXK9Bd0TTGB00VoS4YZTX
NEXTAUTH_SECRET=L05T/EKL9v4K2w+mvQKZcrQCJ7UuRqCUmeN+N3PyjD0=
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
```

## Backend Variables

### ✅ What Changed (Service References)

| Old (Hardcoded) | New (Service References) |
|----------------|--------------------------|
| `DATABASE_URL=${{PostgreSQL.DATABASE_URL}}` | `DATABASE_URL=${{Postgres.DATABASE_PRIVATE_URL}}` |
| `REDIS_URL=${{Redis.REDIS_URL}}` | `REDIS_URL=${{Redis.REDIS_PRIVATE_URL}}?family=0` |
| `STORE_CORS=https://shennastudio.com,https://www.shennastudio.com` | `STORE_CORS=${{Storefront.NEXT_PUBLIC_BASE_URL}}` |
| `ADMIN_CORS=https://api.shennastudio.com` | `ADMIN_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}},https://${{RAILWAY_PRIVATE_DOMAIN}}` |
| `AUTH_CORS=https://shennastudio.com,...` | `AUTH_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}},https://${{RAILWAY_PRIVATE_DOMAIN}}` |
| `BACKEND_URL=https://api.shennastudio.com` | `BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `MEDUSA_BACKEND_URL=https://api.shennastudio.com` | `MEDUSA_BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| *(not set)* | `RAILWAY_PUBLIC_DOMAIN_VALUE=https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| *(not set)* | `MEILISEARCH_HOST=https://${{MeiliSearch.MEILI_PUBLIC_URL}}` |
| *(not set)* | `MEILISEARCH_MASTER_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}` |
| *(not set)* | `MINIO_ENDPOINT=${{Bucket.MINIO_PUBLIC_HOST}}` |
| *(not set)* | `MINIO_ACCESS_KEY=${{Bucket.MINIO_ROOT_USER}}` |
| *(not set)* | `MINIO_SECRET_KEY=${{Bucket.MINIO_ROOT_PASSWORD}}` |

### ✅ What Stayed the Same (Your Values)

```bash
# These are YOUR actual production values - unchanged
JWT_SECRET=yu9wpn74lomn116sb76m27cz5atofwq7
COOKIE_SECRET=zapgxlrinbmnb5w42djbur3qz2g58vle
MEDUSA_ADMIN_EMAIL=admin@shennasstudio.com
MEDUSA_ADMIN_PASSWORD=ztwry4ctxurryzcoqpdkf0qv8u13rocf
STRIPE_API_KEY=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
STRIPE_SECRET_KEY=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
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true
NODE_ENV=production
PORT=9000
WORKER_MODE=shared
DATABASE_LOGGING=false
```

### ✅ New Variables Added

```bash
# From serene-presence pattern for better Railway integration
RAILWAY_HEALTHCHECK_TIMEOUT_SEC=720
RESEND_API_KEY=
RESEND_FROM=
STRIPE_WEBHOOK_SECRET=
```

## Key Benefits of Service References

### 1. **Automatic Service Discovery**
Railway automatically resolves `${{ServiceName.VARIABLE}}` to the correct internal/external URLs.

### 2. **No Hardcoded URLs**
If services change domains or IPs, Railway updates references automatically.

### 3. **Environment Isolation**
Service references work across different Railway environments (staging, production).

### 4. **Private Network Optimization**
Using `DATABASE_PRIVATE_URL` and `REDIS_PRIVATE_URL` keeps traffic on Railway's private network (faster, free).

### 5. **Cross-Service Communication**
`${{Storefront.NEXT_PUBLIC_BASE_URL}}` lets Backend know where Frontend is deployed.

## What Gets Resolved by Railway

When you use `${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}`, Railway resolves it to:
- Custom domain if set: `https://api.shennastudio.com`
- Or Railway domain: `https://backend-production-xxxx.up.railway.app`

This means your frontend will ALWAYS connect to the correct backend URL!

## Files to Use for Deployment

1. **Frontend**: `railway-frontend-serene-pattern.env.json`
2. **Backend**: `ocean-backend/railway-backend-serene-pattern.env.json`
3. **Deployment Script**: `apply-railway-serene-vars.sh`
4. **Guide**: `RAILWAY_SERENE_PATTERN_SETUP.md`
