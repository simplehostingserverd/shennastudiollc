#!/bin/bash

# Script to set up frontend environment variables for Railway
# This connects the frontend to your existing Medusa backend

set -e

echo "🔧 Setting up Frontend Environment Variables for Railway"
echo "========================================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it:"
    echo "   npm i -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    railway login
fi

echo "✅ Railway CLI ready"
echo ""

# Make sure we're in the frontend service
echo "📍 Selecting frontend service..."
railway service select storefront 2>/dev/null || {
    echo "⚠️  Frontend service 'storefront' not found."
    echo "   Creating it now..."
    railway service create storefront
}

echo ""
echo "⚙️  Setting up environment variables..."
echo ""

# Essential variables using service references
echo "1️⃣  Setting backend connection..."
railway variables set \
  NEXT_PUBLIC_MEDUSA_BACKEND_URL='${{Backend.RAILWAY_PUBLIC_DOMAIN}}'

echo "2️⃣  Setting app configuration..."
railway variables set \
  NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  PORT=3000 \
  HOSTNAME=0.0.0.0

echo "3️⃣  Setting frontend URL for backend CORS..."
railway variables set \
  NEXT_PUBLIC_BASE_URL='${{RAILWAY_PUBLIC_DOMAIN}}'

echo ""
echo "✅ Essential variables set!"
echo ""

# Optional: Ask about additional integrations
read -p "Do you want to configure Stripe? (y/n): " SETUP_STRIPE
if [[ "$SETUP_STRIPE" =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Stripe Secret Key: " STRIPE_SECRET
    read -p "Stripe Publishable Key: " STRIPE_PUBLIC

    railway variables set \
      STRIPE_SECRET_KEY="$STRIPE_SECRET" \
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLIC"

    echo "✅ Stripe configured"
fi

echo ""
read -p "Do you want to configure Meilisearch? (y/n): " SETUP_MEILI
if [[ "$SETUP_MEILI" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Using same Meilisearch instance as backend..."

    railway variables set \
      NEXT_PUBLIC_MEILISEARCH_HOST='${{MeiliSearch.MEILI_PUBLIC_URL}}' \
      NEXT_PUBLIC_MEILISEARCH_API_KEY='${{MeiliSearch.MEILI_MASTER_KEY}}'

    echo "✅ Meilisearch configured"
fi

echo ""
read -p "Do you want to configure Cloudinary? (y/n): " SETUP_CLOUDINARY
if [[ "$SETUP_CLOUDINARY" =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Cloudinary Cloud Name: " CLOUD_NAME
    read -p "Cloudinary API Key: " CLOUD_KEY
    read -p "Cloudinary API Secret: " CLOUD_SECRET

    railway variables set \
      CLOUDINARY_CLOUD_NAME="$CLOUD_NAME" \
      CLOUDINARY_API_KEY="$CLOUD_KEY" \
      CLOUDINARY_API_SECRET="$CLOUD_SECRET" \
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="$CLOUD_NAME"

    echo "✅ Cloudinary configured"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Frontend variables configured successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Variables Summary:"
railway variables
echo ""
echo "⚠️  IMPORTANT: Update Backend CORS"
echo ""
echo "Now you need to update your BACKEND service to allow frontend:"
echo ""
echo "1. Switch to backend service:"
echo "   railway service select backend"
echo ""
echo "2. Update STORE_CORS to include frontend:"
echo "   railway variables set STORE_CORS='\${{Storefront.RAILWAY_PUBLIC_DOMAIN}}'"
echo ""
echo "3. Deploy frontend:"
echo "   railway service select storefront"
echo "   railway up"
echo ""
echo "📚 Full guide: docs/CONNECT-FRONTEND-TO-BACKEND.md"
