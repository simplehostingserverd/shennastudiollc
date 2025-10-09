#!/bin/bash

# Complete Railway Setup Script for All 3 Services
# This sets up PostgreSQL, Backend (Medusa), and Storefront (Next.js)

set -e

echo "🚀 Shenna Studio - Complete Railway Setup"
echo "==========================================="
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

# Service names
echo "📋 Let's identify your Railway services..."
echo ""

read -p "PostgreSQL service name [Postgres]: " POSTGRES_NAME
POSTGRES_NAME=${POSTGRES_NAME:-Postgres}

read -p "Backend/Medusa service name [Backend]: " BACKEND_NAME
BACKEND_NAME=${BACKEND_NAME:-Backend}

read -p "Frontend/Storefront service name [Storefront]: " STOREFRONT_NAME
STOREFRONT_NAME=${STOREFRONT_NAME:-Storefront}

echo ""
echo "Using service names:"
echo "  📦 PostgreSQL: $POSTGRES_NAME"
echo "  🔧 Backend: $BACKEND_NAME"
echo "  🌐 Frontend: $STOREFRONT_NAME"
echo ""

# Generate secrets
echo "🔐 Generating secure secrets..."
JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
COOKIE_SECRET=$(openssl rand -base64 32 | tr -d '\n')
echo "✅ Secrets generated"
echo ""

# Get admin credentials
echo "👤 Admin User Setup"
read -p "Admin email [admin@shennastudio.com]: " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@shennastudio.com}

read -sp "Admin password [ChangeThisPassword123!]: " ADMIN_PASSWORD
ADMIN_PASSWORD=${ADMIN_PASSWORD:-ChangeThisPassword123!}
echo ""
echo ""

# Optional services
read -p "Do you have Redis? (y/n): " HAS_REDIS
read -p "Do you have Meilisearch? (y/n): " HAS_MEILI
echo ""

# Setup Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Setting up Backend ($BACKEND_NAME)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BACKEND_VARS=(
  "DATABASE_URL=\${{$POSTGRES_NAME.DATABASE_PRIVATE_URL}}"
  "JWT_SECRET=$JWT_SECRET"
  "COOKIE_SECRET=$COOKIE_SECRET"
  "MEDUSA_BACKEND_URL=https://\${{RAILWAY_PUBLIC_DOMAIN}}"
  "RAILWAY_PUBLIC_DOMAIN_VALUE=https://\${{RAILWAY_PUBLIC_DOMAIN}}"
  "STORE_CORS=\${{$STOREFRONT_NAME.RAILWAY_PUBLIC_DOMAIN}}"
  "AUTH_CORS=\${{$STOREFRONT_NAME.RAILWAY_PUBLIC_DOMAIN}}"
  "ADMIN_CORS=https://\${{RAILWAY_PUBLIC_DOMAIN}}"
  "ADMIN_EMAIL=$ADMIN_EMAIL"
  "ADMIN_PASSWORD=$ADMIN_PASSWORD"
  "NODE_ENV=production"
  "PORT=9000"
  "LOG_LEVEL=info"
)

# Add Redis if available
if [[ "$HAS_REDIS" =~ ^[Yy]$ ]]; then
  read -p "Redis service name [Redis]: " REDIS_NAME
  REDIS_NAME=${REDIS_NAME:-Redis}
  BACKEND_VARS+=("REDIS_URL=\${{$REDIS_NAME.REDIS_PRIVATE_URL}}?family=0")
fi

# Add Meilisearch if available
if [[ "$HAS_MEILI" =~ ^[Yy]$ ]]; then
  read -p "Meilisearch service name [MeiliSearch]: " MEILI_NAME
  MEILI_NAME=${MEILI_NAME:-MeiliSearch}
  BACKEND_VARS+=("MEILISEARCH_HOST=https://\${{$MEILI_NAME.MEILI_PUBLIC_URL}}")
  BACKEND_VARS+=("MEILISEARCH_API_KEY=\${{$MEILI_NAME.MEILI_MASTER_KEY}}")
fi

# Build railway command for backend
BACKEND_CMD="railway variables --service \"$BACKEND_NAME\""
for var in "${BACKEND_VARS[@]}"; do
  BACKEND_CMD="$BACKEND_CMD --set \"$var\""
done
BACKEND_CMD="$BACKEND_CMD --skip-deploys"

echo "Setting backend variables..."
eval $BACKEND_CMD

echo ""
echo "✅ Backend variables set!"
echo ""

# Setup Frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Setting up Frontend ($STOREFRONT_NAME)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

FRONTEND_VARS=(
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL=\${{$BACKEND_NAME.RAILWAY_PUBLIC_DOMAIN}}"
  "NEXT_PUBLIC_BASE_URL=\${{RAILWAY_PUBLIC_DOMAIN}}"
  "NODE_ENV=production"
  "NEXT_TELEMETRY_DISABLED=1"
  "PORT=3000"
  "HOSTNAME=0.0.0.0"
)

# Add Meilisearch to frontend if available
if [[ "$HAS_MEILI" =~ ^[Yy]$ ]]; then
  FRONTEND_VARS+=("NEXT_PUBLIC_MEILISEARCH_HOST=\${{$MEILI_NAME.MEILI_PUBLIC_URL}}")
  FRONTEND_VARS+=("NEXT_PUBLIC_MEILISEARCH_API_KEY=\${{$MEILI_NAME.MEILI_MASTER_KEY}}")
fi

# Build railway command for frontend
FRONTEND_CMD="railway variables --service \"$STOREFRONT_NAME\""
for var in "${FRONTEND_VARS[@]}"; do
  FRONTEND_CMD="$FRONTEND_CMD --set \"$var\""
done
FRONTEND_CMD="$FRONTEND_CMD --skip-deploys"

echo "Setting frontend variables..."
eval $FRONTEND_CMD

echo ""
echo "✅ Frontend variables set!"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 What was configured:"
echo ""
echo "✅ Backend ($BACKEND_NAME):"
echo "   • Database connection to $POSTGRES_NAME"
echo "   • JWT and Cookie secrets (secure)"
echo "   • CORS for frontend access"
echo "   • Admin user: $ADMIN_EMAIL"
if [[ "$HAS_REDIS" =~ ^[Yy]$ ]]; then
  echo "   • Redis connection"
fi
if [[ "$HAS_MEILI" =~ ^[Yy]$ ]]; then
  echo "   • Meilisearch integration"
fi
echo ""
echo "✅ Frontend ($STOREFRONT_NAME):"
echo "   • Backend connection to $BACKEND_NAME"
echo "   • Production configuration"
if [[ "$HAS_MEILI" =~ ^[Yy]$ ]]; then
  echo "   • Meilisearch integration"
fi
echo ""

# Next steps
echo "🚀 Next Steps:"
echo ""
echo "1. Deploy Backend:"
echo "   railway up --service $BACKEND_NAME"
echo ""
echo "2. Wait for backend to be healthy, then deploy Frontend:"
echo "   railway up --service $STOREFRONT_NAME"
echo ""
echo "3. Get your URLs:"
echo "   Backend:  railway domain --service $BACKEND_NAME"
echo "   Frontend: railway domain --service $STOREFRONT_NAME"
echo ""
echo "4. Access Admin Panel:"
echo "   https://your-backend-url/app"
echo "   Email: $ADMIN_EMAIL"
echo "   Password: [your password]"
echo ""
echo "5. Test Storefront:"
echo "   Visit your frontend URL to see products"
echo ""
echo "📚 Documentation:"
echo "   • Full setup guide: RAILWAY_VARIABLE_SETUP.md"
echo "   • Connection guide: docs/CONNECT-FRONTEND-TO-BACKEND.md"
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo "   JWT_SECRET: $JWT_SECRET"
echo "   COOKIE_SECRET: $COOKIE_SECRET"
echo ""
