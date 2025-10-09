#!/bin/bash

# Quick Railway Frontend Setup
# This script will help you connect your frontend to the backend

set -e

echo "🚀 Shenna Studio - Railway Frontend Setup"
echo "=========================================="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm i -g @railway/cli
fi

# Check login
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    railway login
fi

echo "✅ Railway CLI ready"
echo ""

# Link to project
echo "📍 Linking to your Railway project..."
echo "   Please select your project from the list:"
railway link

echo ""
echo "⚙️  Setting up frontend service..."
echo ""

# Ask for service name
echo "What is your storefront service called in Railway?"
echo "(If you don't have one yet, we'll help you create it)"
read -p "Service name [storefront]: " SERVICE_NAME
SERVICE_NAME=${SERVICE_NAME:-storefront}

echo ""
echo "What is your backend service called in Railway?"
read -p "Backend service name [Backend]: " BACKEND_NAME
BACKEND_NAME=${BACKEND_NAME:-Backend}

echo ""
echo "🔧 Setting frontend environment variables for service: $SERVICE_NAME"
echo ""

railway variables \
  --service "$SERVICE_NAME" \
  --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=\${{$BACKEND_NAME.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "NODE_ENV=production" \
  --set "NEXT_TELEMETRY_DISABLED=1" \
  --set "PORT=3000" \
  --set "HOSTNAME=0.0.0.0" \
  --set "NEXT_PUBLIC_BASE_URL=\${{RAILWAY_PUBLIC_DOMAIN}}" \
  --skip-deploys

echo ""
echo "✅ Frontend variables set!"
echo ""

# Update backend CORS
echo "🔧 Updating backend CORS to allow frontend..."
echo ""

railway variables \
  --service "$BACKEND_NAME" \
  --set "STORE_CORS=\${{$SERVICE_NAME.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "AUTH_CORS=\${{$SERVICE_NAME.RAILWAY_PUBLIC_DOMAIN}}" \
  --skip-deploys

echo ""
echo "✅ Backend CORS updated!"
echo ""

# Deploy
echo "🚀 Ready to deploy frontend?"
echo "   This will trigger a deployment of your frontend service."
read -p "Deploy now? (y/n): " DEPLOY_NOW

if [[ "$DEPLOY_NOW" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Triggering deployment..."
    railway up --service "$SERVICE_NAME"

    echo ""
    echo "✅ Deployment started!"
    echo ""
    echo "View your deployment status:"
    echo "   https://railway.app/project/diplomatic-grace"
else
    echo ""
    echo "⏭️  Skipping deployment. To deploy later, run:"
    echo "   railway up --service $SERVICE_NAME"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your frontend is now configured to connect to your backend."
echo ""
echo "📋 What was configured:"
echo "   ✓ Frontend environment variables"
echo "   ✓ Backend CORS settings"
echo ""
echo "🌐 Next steps:"
echo "   1. Wait for deployment to complete"
echo "   2. Visit your frontend URL"
echo "   3. Test product loading"
echo ""
echo "📚 Troubleshooting guide: docs/CONNECT-FRONTEND-TO-BACKEND.md"
echo ""
