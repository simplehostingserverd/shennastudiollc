#!/bin/bash

# Railway Frontend Deployment Script
# Deploys the Next.js frontend to Railway and connects it to existing Medusa backend

set -e

echo "🚀 Shenna's Studio - Railway Frontend Deployment"
echo "=================================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it:"
    echo "   npm i -g @railway/cli"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/../../frontend" || exit 1
echo "📁 Changed to frontend directory: $(pwd)"
echo ""

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    railway login
    echo ""
fi

echo "✅ Logged in to Railway"
echo ""

# Link to project (or select existing)
echo "🔗 Linking to Railway project..."
railway link || {
    echo "⚠️  Not linked to a project. Please select your project."
}
echo ""

# List available services
echo "📋 Available services in this project:"
railway service list
echo ""

# Prompt for backend service name
read -p "Enter your backend service name (e.g., medusa-backend): " BACKEND_SERVICE
echo ""

# Create or select frontend service
echo "🎯 Creating/selecting frontend service..."
railway service create frontend 2>/dev/null || railway service select frontend
echo ""

# Set environment variables
echo "⚙️  Setting environment variables..."
echo ""

read -p "Enter your backend public domain (without https://): " BACKEND_DOMAIN
railway variables set NEXT_PUBLIC_MEDUSA_BACKEND_URL="https://$BACKEND_DOMAIN"

read -p "Enter Stripe secret key: " STRIPE_SECRET
railway variables set STRIPE_SECRET_KEY="$STRIPE_SECRET"

read -p "Enter Stripe publishable key: " STRIPE_PUBLIC
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLIC"

# Set standard variables
railway variables set NODE_ENV=production
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set PORT=3000

echo ""
echo "✅ Environment variables set"
echo ""

# Optional: Algolia
read -p "Do you want to configure Algolia? (y/n): " CONFIGURE_ALGOLIA
if [[ "$CONFIGURE_ALGOLIA" =~ ^[Yy]$ ]]; then
    read -p "Algolia Application ID: " ALGOLIA_APP_ID
    read -p "Algolia Search API Key: " ALGOLIA_SEARCH_KEY
    read -p "Algolia Admin API Key: " ALGOLIA_ADMIN_KEY

    railway variables set NEXT_PUBLIC_ALGOLIA_APPLICATION_ID="$ALGOLIA_APP_ID"
    railway variables set NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY="$ALGOLIA_SEARCH_KEY"
    railway variables set ALGOLIA_ADMIN_API_KEY="$ALGOLIA_ADMIN_KEY"

    echo "✅ Algolia configured"
fi
echo ""

# Optional: Cloudinary
read -p "Do you want to configure Cloudinary? (y/n): " CONFIGURE_CLOUDINARY
if [[ "$CONFIGURE_CLOUDINARY" =~ ^[Yy]$ ]]; then
    read -p "Cloudinary Cloud Name: " CLOUDINARY_NAME
    read -p "Cloudinary API Key: " CLOUDINARY_KEY
    read -p "Cloudinary API Secret: " CLOUDINARY_SECRET

    railway variables set CLOUDINARY_CLOUD_NAME="$CLOUDINARY_NAME"
    railway variables set CLOUDINARY_API_KEY="$CLOUDINARY_KEY"
    railway variables set CLOUDINARY_API_SECRET="$CLOUDINARY_SECRET"
    railway variables set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="$CLOUDINARY_NAME"

    echo "✅ Cloudinary configured"
fi
echo ""

# Deploy
echo "🚀 Deploying frontend to Railway..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Check deployment status:"
echo "   railway status"
echo ""
echo "📝 View logs:"
echo "   railway logs"
echo ""
echo "🌐 Generate domain:"
echo "   railway domain"
echo ""
echo "⚠️  IMPORTANT: Update backend CORS to include frontend domain!"
echo "   In your backend service, add the frontend domain to STORE_CORS"
echo ""
echo "✨ Deployment complete!"
