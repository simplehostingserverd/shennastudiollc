# Corrected Production Environment Variables for Coolify

## Frontend (.env) - These are the environment variables that should be set in Coolify:

```bash
# Backend API Configuration (Production)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c98766c1f4cd3eae138e5a337134ebf9a88f073220ec26d55dfab65f1b0d25c1

# Backend Configuration
DATABASE_URL=postgresql://postgres.ncmpqawcsdlnnhpsgjvz:Q5XWV7Ghap9Ue0Mc@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
JWT_SECRET=ef4cd5fd10a4e9c7b30e53633b273a84de38c6d2d2d827967f6e753b519c21dc
COOKIE_SECRET=c5ef1ed588a19514cf64fc1c02aea5ceb023c4f1a53dfec3ac7e0c1e3493510a

# Port Configuration
PORT=3000
ADMIN_PORT=7001

# CORS Configuration (CORRECTED)
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com

# Admin User Configuration (CORRECTED EMAIL)
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YourSecurePassword123!

# Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Auto-initialization
AUTO_CREATE_ADMIN=true
AUTO_MIGRATE=true
AUTO_SEED=false

# Redis Configuration
REDIS_URL=redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0

# Stripe Configuration
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMq...

# Optional Services (if configured)
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=XN8AAM6C2P
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=fdcc16689654068118b960cd3486503d
ALGOLIA_ADMIN_API_KEY=307bdad52d454f71699a996607f0433d

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=629228798352575
CLOUDINARY_API_SECRET=8xvuYnJlAaDZVGHkoen4ORlNi4E
CLOUDINARY_UPLOAD_PRESET=ml_default

# Supabase (if using directly)
NEXT_PUBLIC_SUPABASE_URL=https://ncmpqawcsdlnnhpsgjvz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_wWEUEF2FwRIGXPVvOlwEng_zBMgm5jR

# Builder.io (if using)
NEXT_PUBLIC_BUILDER_API_KEY=5816e8c9df5d4640b4dcb2ae0ed22782

# Medusa Admin Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
```

## Key Changes Made:

1. **Fixed ADMIN_EMAIL**: Changed from `admin@shennasstudio.com` to `admin@shennastudio.com` (removed extra 's')
2. **Fixed ADMIN_CORS**: Changed from `https://admin.shennastudio.com,https://shennastudio.com/admin` to `https://api.shennastudio.com`
3. **Removed ADMIN_URL**: This is not a standard Medusa environment variable
4. **Updated PORT**: Set to 3000 for frontend, backend uses 9000 internally
5. **Corrected CORS domains**: All point to actual domains that exist

## URLs for Production:

- **Frontend**: https://shennastudio.com (main site)
- **Backend API**: https://api.shennastudio.com (Medusa API)
- **Admin Panel**: https://api.shennastudio.com/app (Medusa admin)

## Critical Issues to Fix:

1. The frontend is still calling `localhost:9000` - this suggests the `NEXT_PUBLIC_MEDUSA_BACKEND_URL` environment variable is not being read correctly in production
2. Make sure Coolify is using the correct environment variables from this list
3. Verify that the backend is actually running and accessible at `https://api.shennastudio.com`