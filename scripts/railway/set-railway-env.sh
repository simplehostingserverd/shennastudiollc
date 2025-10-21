#!/bin/bash

# Railway Environment Variables Setup Script
# This script sets all required environment variables in Railway

set -e

echo "🚂 Setting Railway Environment Variables"
echo "=========================================="
echo ""

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway"
    echo "Please run: railway login"
    exit 1
fi

echo "✅ Logged in as: $(railway whoami)"
echo ""

# Check if project is linked
if ! railway status &> /dev/null 2>&1; then
    echo "❌ No Railway project linked"
    echo "Please run: railway link"
    exit 1
fi

echo "📋 Current Railway project:"
railway status
echo ""

# Generate secure secrets
echo "🔐 Generating secure secrets..."
JWT_SECRET=$(openssl rand -base64 48)
COOKIE_SECRET=$(openssl rand -base64 48)
ADMIN_PASSWORD="ShennasOcean2024!Secure$(openssl rand -base64 12)"

echo ""
echo "⚠️  IMPORTANT: Before continuing, make sure you have:"
echo "  1. Added PostgreSQL service to your Railway project"
echo "  2. Added Redis service to your Railway project"
echo ""
read -p "Have you added PostgreSQL and Redis services? (y/n): " services_added

if [ "$services_added" != "y" ]; then
    echo ""
    echo "Please add these services first:"
    echo "  1. Go to Railway dashboard"
    echo "  2. Click '+ New Service'"
    echo "  3. Add 'PostgreSQL'"
    echo "  4. Add 'Redis'"
    echo "  5. Come back and run this script again"
    exit 1
fi

echo ""
echo "🔧 Setting environment variables..."
echo ""

# Production Configuration
railway variables set NODE_ENV=production
railway variables set RAILWAY_DEPLOYMENT=true

# Database - User will need to reference Railway PostgreSQL service
echo "⚠️  For DATABASE_URL, you need to reference your PostgreSQL service"
echo "In Railway dashboard, find the DATABASE_URL from your PostgreSQL service"
echo "It should look like: postgresql://postgres:password@hostname:5432/railway"
read -p "Enter your Railway PostgreSQL DATABASE_URL: " DATABASE_URL
railway variables set DATABASE_URL="$DATABASE_URL"
railway variables set DATABASE_SSL=true
railway variables set DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Redis - User will need to reference Railway Redis service
echo ""
echo "⚠️  For REDIS_URL, you need to reference your Redis service"
echo "In Railway dashboard, find the REDIS_URL from your Redis service"
echo "It should look like: redis://default:password@hostname:6379"
read -p "Enter your Railway Redis REDIS_URL: " REDIS_URL
railway variables set REDIS_URL="$REDIS_URL"

# Security Secrets
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set COOKIE_SECRET="$COOKIE_SECRET"

# Get user's domain for CORS
echo ""
echo "🌐 Domain Configuration"
read -p "Enter your production domain (e.g., shennastudio.com): " DOMAIN
read -p "Enter your admin subdomain (e.g., admin.shennastudio.com): " ADMIN_DOMAIN

# CORS Configuration
railway variables set STORE_CORS="https://$DOMAIN,https://www.$DOMAIN"
railway variables set ADMIN_CORS="https://$ADMIN_DOMAIN,https://api.$DOMAIN"
railway variables set AUTH_CORS="https://$DOMAIN,https://www.$DOMAIN"

# Admin Credentials
railway variables set ADMIN_EMAIL="admin@shennasstudio.com"
railway variables set ADMIN_PASSWORD="$ADMIN_PASSWORD"

# Auto-initialization
railway variables set AUTO_MIGRATE=true
railway variables set AUTO_SEED=false
railway variables set AUTO_CREATE_ADMIN=true

# Medusa Configuration
railway variables set MEDUSA_ADMIN_ONBOARDING_TYPE=default
railway variables set MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
railway variables set DISABLE_ADMIN=false

# Frontend Environment Variables
echo ""
echo "🔑 Payment & Services Configuration"
read -p "Enter your Stripe publishable key (pk_...): " STRIPE_PK
read -p "Enter your Stripe secret key (sk_...): " STRIPE_SK

railway variables set NEXT_PUBLIC_MEDUSA_BACKEND_URL="https://api.$DOMAIN"
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$STRIPE_PK"
railway variables set STRIPE_SECRET_KEY="$STRIPE_SK"

# Optional services
echo ""
read -p "Do you have Algolia? (y/n): " has_algolia
if [ "$has_algolia" == "y" ]; then
    read -p "Enter Algolia Application ID: " ALGOLIA_ID
    read -p "Enter Algolia Search API Key: " ALGOLIA_KEY
    railway variables set NEXT_PUBLIC_ALGOLIA_APPLICATION_ID="$ALGOLIA_ID"
    railway variables set NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY="$ALGOLIA_KEY"
fi

read -p "Do you have Cloudinary? (y/n): " has_cloudinary
if [ "$has_cloudinary" == "y" ]; then
    read -p "Enter Cloudinary Cloud Name: " CLOUDINARY_NAME
    read -p "Enter Cloudinary API Key: " CLOUDINARY_KEY
    read -p "Enter Cloudinary API Secret: " CLOUDINARY_SECRET
    railway variables set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="$CLOUDINARY_NAME"
    railway variables set CLOUDINARY_API_KEY="$CLOUDINARY_KEY"
    railway variables set CLOUDINARY_API_SECRET="$CLOUDINARY_SECRET"
fi

# Server Configuration
railway variables set PORT=3000
railway variables set BACKEND_PORT=9000
railway variables set HOSTNAME=0.0.0.0
railway variables set NEXT_TELEMETRY_DISABLED=1

echo ""
echo "✅ All environment variables have been set!"
echo ""
echo "📋 IMPORTANT CREDENTIALS (Save these securely!):"
echo "=========================================="
echo "Admin Email: admin@shennasstudio.com"
echo "Admin Password: $ADMIN_PASSWORD"
echo "JWT Secret: $JWT_SECRET"
echo "Cookie Secret: $COOKIE_SECRET"
echo "=========================================="
echo ""
echo "⚠️  Save these credentials in a secure location (e.g., password manager)"
echo ""
echo "🚀 Next Steps:"
echo "  1. Verify variables: railway variables"
echo "  2. Deploy: railway up"
echo "  3. View logs: railway logs"
echo ""
echo "Your app will be available at:"
echo "  Frontend: https://$DOMAIN"
echo "  Backend API: https://api.$DOMAIN"
echo "  Admin Panel: https://api.$DOMAIN/app"
