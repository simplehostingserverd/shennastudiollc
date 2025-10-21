#!/bin/bash

# Set Railway Environment Variables
# Run this after creating the Web Service in Railway

echo "🚂 Setting Railway Environment Variables..."
echo ""

# Check if service is linked
if ! railway service 2>&1 | grep -q "shennastudio"; then
  echo "⚠️  No service linked!"
  echo "Please run: railway service"
  echo "And select your web service"
  exit 1
fi

# Set each variable from railway-env-variables.json
echo "Setting environment variables..."

railway variables set NODE_ENV=production
railway variables set RAILWAY_DEPLOYMENT=true
railway variables set DATABASE_SSL=true
railway variables set DATABASE_SSL_REJECT_UNAUTHORIZED=false
railway variables set JWT_SECRET="ULmb5s66BaKhO5FK24kgKXkjsUzy+zdQyJUd+qDrm1AUHqaWuq/SKIMDY54Olm5i"
railway variables set COOKIE_SECRET="DoceiIZnEvO9CzVw5N5TP8rurPIVXRuUSUvqxeHSeJSy0aAP6A7mxi+S3ggrVGoi"
railway variables set STORE_CORS="https://shennastudio.com,https://www.shennastudio.com,https://shop.shennastudio.com"
railway variables set ADMIN_CORS="https://admin.shennastudio.com,https://api.shennastudio.com"
railway variables set AUTH_CORS="https://shennastudio.com,https://www.shennastudio.com,https://shop.shennastudio.com"
railway variables set ADMIN_EMAIL="admin@shennasstudio.com"
railway variables set ADMIN_PASSWORD="ShennasOcean2024SecureEcKbcXb4+RrzcvXl"
railway variables set AUTO_MIGRATE=true
railway variables set AUTO_SEED=false
railway variables set AUTO_CREATE_ADMIN=true
railway variables set MEDUSA_ADMIN_ONBOARDING_TYPE=default
railway variables set MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
railway variables set DISABLE_ADMIN=false
railway variables set STRIPE_SECRET_KEY="sk_test_replace_with_your_production_key"
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_replace_with_your_production_key"
railway variables set PORT=3000
railway variables set BACKEND_PORT=9000
railway variables set HOSTNAME="0.0.0.0"
railway variables set NEXT_TELEMETRY_DISABLED=1

echo ""
echo "✅ Environment variables set!"
echo ""
echo "⚠️  IMPORTANT: Set these manually in Railway dashboard:"
echo "  DATABASE_URL = \${{Postgres.DATABASE_URL}}"
echo "  REDIS_URL = \${{Redis.REDIS_URL}}"
echo "  NEXT_PUBLIC_MEDUSA_BACKEND_URL = \${{RAILWAY_PUBLIC_DOMAIN}}"
echo ""
echo "Then trigger a deployment!"
