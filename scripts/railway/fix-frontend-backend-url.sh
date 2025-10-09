#!/bin/bash

# Fix Frontend Backend URL Variable
# This fixes the incorrect RAILWAY_PUBLIC_DOMAIN_VALUE reference

set -e

echo "🔧 Fixing Frontend Backend URL"
echo "==============================="
echo ""

# Check Railway CLI
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged into Railway. Run: railway login"
    exit 1
fi

# Get service name
read -p "Frontend/Storefront service name [Storefront]: " STOREFRONT_NAME
STOREFRONT_NAME=${STOREFRONT_NAME:-Storefront}

read -p "Backend service name [Backend]: " BACKEND_NAME
BACKEND_NAME=${BACKEND_NAME:-Backend}

read -p "Meilisearch service name [MeiliSearch]: " MEILI_NAME
MEILI_NAME=${MEILI_NAME:-MeiliSearch}

echo ""
echo "📝 Current (WRONG) value:"
echo "   NEXT_PUBLIC_MEDUSA_BACKEND_URL=\"\${{Backend.RAILWAY_PUBLIC_DOMAIN_VALUE}}\""
echo ""
echo "✅ New (CORRECT) value:"
echo "   NEXT_PUBLIC_MEDUSA_BACKEND_URL=\"https://\${{$BACKEND_NAME.RAILWAY_PUBLIC_DOMAIN}}\""
echo ""

read -p "Update this variable? (y/n): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Updating frontend variables..."

railway variables --service "$STOREFRONT_NAME" \
  --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://\${{$BACKEND_NAME.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "NEXT_PUBLIC_BASE_URL=https://\${{RAILWAY_PUBLIC_DOMAIN}}" \
  --set "NEXT_PUBLIC_SEARCH_ENDPOINT=https://\${{$MEILI_NAME.MEILI_PUBLIC_URL}}" \
  --set "NEXT_PUBLIC_MEILISEARCH_HOST=https://\${{$MEILI_NAME.MEILI_PUBLIC_URL}}" \
  --set "MEILISEARCH_API_KEY=\${{$MEILI_NAME.MEILI_MASTER_KEY}}" \
  --set "NEXT_PUBLIC_INDEX_NAME=products" \
  --set "NODE_ENV=production" \
  --set "PORT=3000" \
  --set "HOSTNAME=0.0.0.0" \
  --set "NEXT_TELEMETRY_DISABLED=1"

echo ""
echo "✅ Frontend variables updated!"
echo ""
echo "🚀 Next steps:"
echo "   1. Redeploy frontend: railway up --service $STOREFRONT_NAME"
echo "   2. Check frontend logs: railway logs --service $STOREFRONT_NAME"
echo "   3. Test product loading on your frontend URL"
echo ""
