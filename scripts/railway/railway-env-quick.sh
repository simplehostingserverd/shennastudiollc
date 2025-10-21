#!/bin/bash

# Quick Railway Environment Variables Setup
# Sets environment variables from your existing configuration

set -e

echo "🚂 Railway Environment Setup for Shenna's Studio"
echo "================================================"
echo ""
echo "Project: serene-presence"
echo "Environment: production"
echo ""

# Generate secure production secrets
echo "🔐 Generating secure production secrets..."
JWT_SECRET=$(openssl rand -base64 48)
COOKIE_SECRET=$(openssl rand -base64 48)
ADMIN_PASSWORD="ShennasOcean2024Secure$(openssl rand -base64 12)"

echo ""
echo "📦 Setting environment variables in Railway..."
echo ""

# Node Environment
echo "Setting Node.js configuration..."
railway variables --set "NODE_ENV=production" --skip-deploys
railway variables --set "RAILWAY_DEPLOYMENT=true" --skip-deploys

# Database Configuration (will use Railway PostgreSQL service reference)
echo "Setting database configuration..."
echo "⚠️  Note: You'll need to add PostgreSQL service and update DATABASE_URL"
railway variables --set "DATABASE_URL="\${{Postgres.DATABASE_URL}}"" --skip-deploys
railway variables --set "DATABASE_SSL=true" --skip-deploys
railway variables --set "DATABASE_SSL_REJECT_UNAUTHORIZED=false" --skip-deploys

# Redis Configuration (will use Railway Redis service reference)
echo "Setting Redis configuration..."
echo "⚠️  Note: You'll need to add Redis service and update REDIS_URL"
railway variables --set "REDIS_URL="\${{Redis.REDIS_URL}}"" --skip-deploys

# Security Secrets
echo "Setting security secrets..."
railway variables --set "JWT_SECRET="$JWT_SECRET"" --skip-deploys
railway variables --set "COOKIE_SECRET="$COOKIE_SECRET"" --skip-deploys

# CORS Configuration (update these with your production domains)
echo "Setting CORS configuration..."
railway variables --set "STORE_CORS="https://shennastudio.com,https://www.shennastudio.com,https://shop.shennastudio.com"" --skip-deploys
railway variables --set "ADMIN_CORS="https://admin.shennastudio.com,https://api.shennastudio.com"" --skip-deploys
railway variables --set "AUTH_CORS="https://shennastudio.com,https://www.shennastudio.com,https://shop.shennastudio.com"" --skip-deploys

# Admin Credentials
echo "Setting admin credentials..."
railway variables --set "ADMIN_EMAIL="admin@shennasstudio.com"" --skip-deploys
railway variables --set "ADMIN_PASSWORD="$ADMIN_PASSWORD"" --skip-deploys

# Auto-initialization
echo "Setting auto-initialization flags..."
railway variables --set "AUTO_MIGRATE=true" --skip-deploys
railway variables --set "AUTO_SEED=false" --skip-deploys
railway variables --set "AUTO_CREATE_ADMIN=true" --skip-deploys

# Medusa Configuration
echo "Setting Medusa configuration..."
railway variables --set "MEDUSA_ADMIN_ONBOARDING_TYPE=default" --skip-deploys
railway variables --set "MEDUSA_ADMIN_ONBOARDING_NEXTJS=true" --skip-deploys
railway variables --set "DISABLE_ADMIN=false" --skip-deploys

# Frontend Configuration
echo "Setting frontend configuration..."
railway variables --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL="https://api.shennastudio.com"" --skip-deploys

# Payment - Stripe (use your test keys for now)
echo "Setting payment configuration..."
railway variables --set "STRIPE_SECRET_KEY="sk_test_replace_with_your_production_key"" --skip-deploys
railway variables --set "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_replace_with_your_production_key"" --skip-deploys

# Server Configuration
echo "Setting server configuration..."
railway variables --set "PORT=3000" --skip-deploys
railway variables --set "BACKEND_PORT=9000" --skip-deploys
railway variables --set "HOSTNAME=0.0.0.0" --skip-deploys
railway variables --set "NEXT_TELEMETRY_DISABLED=1" --skip-deploys

echo ""
echo "✅ Base environment variables have been set!"
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
echo "1. Add PostgreSQL Service:"
echo "   - Go to Railway dashboard: https://railway.app"
echo "   - Click '+ New Service' → 'PostgreSQL'"
echo "   - The DATABASE_URL will auto-populate with \${{Postgres.DATABASE_URL}}"
echo ""
echo "2. Add Redis Service:"
echo "   - Click '+ New Service' → 'Redis'"
echo "   - The REDIS_URL will auto-populate with \${{Redis.REDIS_URL}}"
echo ""
echo "3. Update Stripe Keys:"
echo "   railway variables --set "STRIPE_SECRET_KEY='your_production_key'"" --skip-deploys
echo "   railway variables --set "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='your_production_key'"" --skip-deploys
echo ""
echo "4. (Optional) Add Cloudinary:"
echo "   railway variables --set "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME='your_cloud_name'"" --skip-deploys
echo "   railway variables --set "CLOUDINARY_API_KEY='your_api_key'"" --skip-deploys
echo "   railway variables --set "CLOUDINARY_API_SECRET='your_api_secret'"" --skip-deploys
echo ""
echo "5. (Optional) Add Algolia:"
echo "   railway variables --set "NEXT_PUBLIC_ALGOLIA_APPLICATION_ID='your_app_id'"" --skip-deploys
echo "   railway variables --set "NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY='your_search_key'"" --skip-deploys
echo ""
echo "6. Verify all variables:"
echo "   railway variables"
echo ""
echo "7. Deploy your application:"
echo "   railway up"
echo ""
echo "8. View deployment logs:"
echo "   railway logs"
echo ""
