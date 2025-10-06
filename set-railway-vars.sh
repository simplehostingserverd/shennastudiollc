#!/bin/bash

# Railway Environment Variables Setup for Shenna's Studio
# Configures all required environment variables in Railway

set -e

echo "🚂 Railway Environment Setup for Shenna's Studio"
echo "================================================"
echo ""

# Check Railway status
echo "📋 Railway Project Status:"
railway status
echo ""

# Generate secure production secrets
echo "🔐 Generating secure production secrets..."
JWT_SECRET=$(openssl rand -base64 48)
COOKIE_SECRET=$(openssl rand -base64 48)
ADMIN_PASSWORD="ShennasOcean2024Secure$(openssl rand -base64 12)"

echo ""
echo "📦 Setting environment variables..."
echo ""

# Set all variables using a batch approach
railway variables --set "NODE_ENV=production" \
  --set "RAILWAY_DEPLOYMENT=true" \
  --set "DATABASE_SSL=true" \
  --set "DATABASE_SSL_REJECT_UNAUTHORIZED=false" \
  --set "JWT_SECRET=$JWT_SECRET" \
  --set "COOKIE_SECRET=$COOKIE_SECRET" \
  --set "STORE_CORS=https://shennastudio.com,https://www.shennastudio.com,https://shop.shennastudio.com" \
  --set "ADMIN_CORS=https://admin.shennastudio.com,https://api.shennastudio.com" \
  --set "AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://shop.shennastudio.com" \
  --set "ADMIN_EMAIL=admin@shennasstudio.com" \
  --set "ADMIN_PASSWORD=$ADMIN_PASSWORD" \
  --set "AUTO_MIGRATE=true" \
  --set "AUTO_SEED=false" \
  --set "AUTO_CREATE_ADMIN=true" \
  --set "MEDUSA_ADMIN_ONBOARDING_TYPE=default" \
  --set "MEDUSA_ADMIN_ONBOARDING_NEXTJS=true" \
  --set "DISABLE_ADMIN=false" \
  --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com" \
  --set "STRIPE_SECRET_KEY=sk_test_replace_with_your_production_key" \
  --set "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_replace_with_your_production_key" \
  --set "PORT=3000" \
  --set "BACKEND_PORT=9000" \
  --set "HOSTNAME=0.0.0.0" \
  --set "NEXT_TELEMETRY_DISABLED=1"

echo ""
echo "✅ Environment variables have been set!"
echo ""
echo "📋 SAVE THESE CREDENTIALS SECURELY:"
echo "=========================================="
echo "Admin Email: admin@shennasstudio.com"
echo "Admin Password: $ADMIN_PASSWORD"
echo "JWT Secret: $JWT_SECRET"
echo "Cookie Secret: $COOKIE_SECRET"
echo "=========================================="
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo ""
echo "1. Add PostgreSQL Service in Railway Dashboard:"
echo "   - Go to: https://railway.app"
echo "   - Click '+ New Service' → 'PostgreSQL'"
echo "   - Then set: railway variables --set 'DATABASE_URL=\${{Postgres.DATABASE_URL}}'"
echo ""
echo "2. Add Redis Service in Railway Dashboard:"
echo "   - Click '+ New Service' → 'Redis'"
echo "   - Then set: railway variables --set 'REDIS_URL=\${{Redis.REDIS_URL}}'"
echo ""
echo "3. Update Stripe Keys (replace test keys with production):"
echo "   railway variables --set 'STRIPE_SECRET_KEY=sk_live_your_key'"
echo "   railway variables --set 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key'"
echo ""
echo "4. Verify all variables:"
echo "   railway variables"
echo ""
echo "5. Deploy:"
echo "   railway up"
echo ""
