#!/bin/bash

# Fix Backend URL to use Railway's generated domain instead of custom domain
# This bypasses SSL certificate issues with custom domains

set -e

echo "🔧 Fixing Backend URL Issue"
echo "============================"
echo ""

# Check Railway CLI
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged into Railway. Run: railway login"
    exit 1
fi

echo "📋 First, let's get your Backend service's Railway domain..."
echo ""

read -p "Backend service name [Backend]: " BACKEND_NAME
BACKEND_NAME=${BACKEND_NAME:-Backend}

read -p "Storefront service name [Storefront]: " STOREFRONT_NAME
STOREFRONT_NAME=${STOREFRONT_NAME:-Storefront}

echo ""
echo "Getting backend domain..."
BACKEND_DOMAIN=$(railway domain --service "$BACKEND_NAME" 2>/dev/null | head -n 1 | xargs)

if [ -z "$BACKEND_DOMAIN" ]; then
    echo "⚠️  Could not automatically detect backend domain."
    echo ""
    read -p "Please enter your backend Railway domain (e.g., backend-production-abc123.up.railway.app): " BACKEND_DOMAIN
fi

echo ""
echo "📋 Backend domain: $BACKEND_DOMAIN"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 OPTION 1: Use Railway's Auto-Generated Domain (RECOMMENDED)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will set:"
echo "  NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://\${{$BACKEND_NAME.RAILWAY_PUBLIC_DOMAIN}}"
echo ""
echo "✅ Pros:"
echo "  - Works immediately (no SSL issues)"
echo "  - Automatic updates if domain changes"
echo "  - No configuration needed"
echo ""
echo "❌ Cons:"
echo "  - Uses Railway's .up.railway.app domain"
echo ""
read -p "Use this option? (y/n): " USE_RAILWAY_DOMAIN

if [[ "$USE_RAILWAY_DOMAIN" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Setting frontend to use Railway domain..."

    railway variables --service "$STOREFRONT_NAME" \
      --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://\${{$BACKEND_NAME.RAILWAY_PUBLIC_DOMAIN}}" \
      --skip-deploys

    echo ""
    echo "✅ Frontend variable updated!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Redeploy frontend: railway up --service $STOREFRONT_NAME"
    echo "   2. Products should load from: https://$BACKEND_DOMAIN"
    echo ""
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 OPTION 2: Use Custom Domain (api.shennastudio.com)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This requires fixing SSL certificate for api.shennastudio.com"
echo ""
echo "✅ Pros:"
echo "  - Uses your custom domain"
echo "  - Professional looking URL"
echo ""
echo "❌ Cons:"
echo "  - Currently has SSL certificate issues"
echo "  - Needs DNS/Railway domain configuration"
echo ""
read -p "Use custom domain? (y/n): " USE_CUSTOM

if [[ "$USE_CUSTOM" =~ ^[Yy]$ ]]; then
    read -p "Enter your custom backend domain [api.shennastudio.com]: " CUSTOM_DOMAIN
    CUSTOM_DOMAIN=${CUSTOM_DOMAIN:-api.shennastudio.com}

    echo ""
    echo "Setting frontend to use custom domain..."

    railway variables --service "$STOREFRONT_NAME" \
      --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://$CUSTOM_DOMAIN" \
      --skip-deploys

    echo ""
    echo "✅ Frontend variable updated!"
    echo ""
    echo "⚠️  IMPORTANT: Fix SSL certificate issues"
    echo ""
    echo "In Railway Dashboard:"
    echo "   1. Go to Backend service"
    echo "   2. Click 'Settings' → 'Domains'"
    echo "   3. Add custom domain: $CUSTOM_DOMAIN"
    echo "   4. Update DNS records as shown by Railway"
    echo "   5. Wait for SSL certificate to provision"
    echo ""
    echo "Then:"
    echo "   6. Redeploy frontend: railway up --service $STOREFRONT_NAME"
    echo ""
    exit 0
fi

echo ""
echo "No option selected. Exiting."
