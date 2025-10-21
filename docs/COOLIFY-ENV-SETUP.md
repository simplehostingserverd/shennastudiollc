# Coolify Environment Variables Setup Guide

## How to Fix Duplicate Variables

Coolify allows you to set environment variables at different levels:
1. **Application level** - Shared across all services
2. **Service level** - Specific to each service (frontend/backend/postgres/redis)

The duplicates you're seeing are because variables are set at multiple levels.

## Solution: Delete ALL service-level environment variables

In Coolify:
1. Go to your application
2. For each service (frontend, backend, postgres, redis):
   - Click on the service
   - Go to "Environment Variables" tab
   - **DELETE ALL variables from each service**
3. Then set variables ONLY at the application level (see below)

---

## Application-Level Environment Variables (Set Once)

Copy these into the **Application-level** environment variables section:

```bash
# Domain Configuration
SERVICE_FQDN_APP=api.shennastudio.com
SERVICE_FQDN_BACKEND=api.shennastudio.com
SERVICE_FQDN_FRONTEND=www.shennastudio.com
SERVICE_URL_APP=https://api.shennastudio.com
SERVICE_URL_BACKEND=https://api.shennastudio.com
SERVICE_URL_FRONTEND=https://www.shennastudio.com

# Admin Configuration
ADMIN_CORS=https://api.shennastudio.com
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=NikitaShenna1987!

# Algolia Search
ALGOLIA_ADMIN_API_KEY=307bdad52d454f71699a996607f0433d
ALGOLIA_APPLICATION_ID=XN8AAM6C2P
ALGOLIA_SEARCH_API_KEY=fdcc16689654068118b960cd3486503d
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=XN8AAM6C2P
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=307bdad52d454f71699a996607f0433d

# CORS Configuration
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com

# Auto-initialization
AUTO_CREATE_ADMIN=true
AUTO_MIGRATE=true
AUTO_SEED=true

# Cloudinary
CLOUDINARY_API_KEY=629228798352575
CLOUDINARY_API_SECRET=8xvuYnJlAaDZVGHkoen4ORlNi4E
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_UPLOAD_PRESET=ml_default
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo

# Security Secrets
COOKIE_SECRET=c5ef1ed588a19514cf64fc1c02aea5ceb023c4f1a53dfec3ac7e0c1e3493510a
JWT_SECRET=ef4cd5fd10a4e9c7b30e53633b273a84de38c6d2d2d827967f6e753b519c21dc

# Database Configuration
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false
DATABASE_URL=postgres://postgres:5nMC5VaPTPVdyOPKdPYJhPvq00MS8UoR2KAEAJp0IGkVJOd1l3D7Q1PLHiPWz5bi@fc880wcg88k88wcwco4gowoo:5432/postgres
POSTGRES_DB=medusa_db
POSTGRES_PASSWORD=5nMC5VaPTPVdyOPKdPYJhPvq00MS8UoR2KAEAJp0IGkVJOd1l3D7Q1PLHiPWz5bi
POSTGRES_USER=medusa_user

# Redis Configuration
REDIS_URL=redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0

# Medusa Configuration
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STARTUP_MODE=full

# Next.js Configuration
NEXT_PUBLIC_BUILDER_API_KEY=5816e8c9df5d4640b4dcb2ae0ed22782
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c98766c1f4cd3eae138e5a337134ebf9a88f073220ec26d55dfab65f1b0d25c1
NEXT_TELEMETRY_DISABLED=1

# Node.js Configuration
NODE_ENV=production
PORT=9000

# Stripe (use your actual publishable key)
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
```

---

## Alternative: Use Coolify CLI or Docker Compose Override

If the UI won't let you delete variables, you have two options:

### Option 1: Stop all services and clear via CLI
```bash
# SSH into your Coolify server
ssh user@your-coolify-server

# Stop the application
docker compose -p ycg88gwckco0c4cs80kwsok8 down

# Edit the generated .env file
nano /data/coolify/applications/YOUR_APP_ID/.env

# Delete all duplicate lines, keep only one of each variable
# Save and exit (Ctrl+X, Y, Enter)

# Restart the application via Coolify UI
```

### Option 2: Recreate the application
1. Export your docker-compose.coolify.prod.yml
2. Delete the current application in Coolify
3. Create a new application
4. Import the docker-compose file
5. Set environment variables (no duplicates this time)

---

## After Cleaning Up

Once you have only ONE copy of each variable at the application level:

1. **Save** the environment variables
2. **Redeploy** the application
3. Check the logs for both frontend and backend services
4. Visit https://www.shennastudio.com and https://api.shennastudio.com/app

---

## Verification

After redeployment, check:
- Frontend logs should show: `Ready on http://0.0.0.0:3000`
- Backend logs should show: `Server is ready on port: 9000`
- Database migrations should run successfully
- Admin user should be created

If you see errors about missing environment variables, the variable wasn't properly set at the application level.
