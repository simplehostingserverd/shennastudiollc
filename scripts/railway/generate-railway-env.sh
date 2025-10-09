#!/bin/bash
set -e

echo "🚂 Railway Environment Variables Generator"
echo "=========================================="
echo "Generating complete Railway configuration for Shenna's Studio"
echo ""

# Generate secrets
echo "🔐 Generating cryptographic secrets..."
JWT_SECRET=$(openssl rand -hex 32)
COOKIE_SECRET=$(openssl rand -hex 32)
ADMIN_PASSWORD=$(openssl rand -base64 24)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

echo "✅ All secrets generated successfully!"
echo ""

# Create Backend JSON
echo "📝 Creating Backend JSON file..."
cat > ocean-backend/railway-backend-ready.env.json << EOF
{
  "DATABASE_URL": "\${{PostgreSQL.DATABASE_URL}}",
  "DATABASE_SSL": "true",
  "DATABASE_SSL_REJECT_UNAUTHORIZED": "false",
  "REDIS_URL": "\${{Redis.REDIS_URL}}",
  "JWT_SECRET": "${JWT_SECRET}",
  "COOKIE_SECRET": "${COOKIE_SECRET}",
  "STORE_CORS": "https://shennastudio.com,https://www.shennastudio.com",
  "ADMIN_CORS": "https://api.shennastudio.com",
  "AUTH_CORS": "https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com",
  "ADMIN_EMAIL": "admin@shennastudio.com",
  "ADMIN_PASSWORD": "${ADMIN_PASSWORD}",
  "AUTO_MIGRATE": "true",
  "AUTO_SEED": "false",
  "AUTO_CREATE_ADMIN": "true",
  "MEDUSA_ADMIN_ONBOARDING_TYPE": "default",
  "MEDUSA_ADMIN_ONBOARDING_NEXTJS": "true",
  "BACKEND_URL": "https://api.shennastudio.com",
  "MEDUSA_BACKEND_URL": "https://api.shennastudio.com",
  "NODE_ENV": "production",
  "PORT": "9000",
  "WORKER_MODE": "shared",
  "DATABASE_LOGGING": "false",
  "STRIPE_API_KEY": "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",
  "STRIPE_SECRET_KEY": "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"
}
EOF

echo "✅ Backend JSON created: ocean-backend/railway-backend-ready.env.json"

# Create Frontend JSON
echo "📝 Creating Frontend JSON file..."
cat > railway-frontend-ready.env.json << EOF
{
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL": "https://api.shennastudio.com",
  "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY": "GET_THIS_FROM_ADMIN_PANEL_AFTER_BACKEND_DEPLOYED",
  "STRIPE_SECRET_KEY": "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",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "pk_live_51RdPwMP4GPds5FMqYouB5PBrSK8udOL1PcTXM6J4rGqIKnA75jTTBOGqkMGKIDRnqOSxIK4BakHFUFXK9Bd0TTGB00VoS4YZTX",
  "NEXTAUTH_SECRET": "${NEXTAUTH_SECRET}",
  "NEXTAUTH_URL": "https://shennastudio.com",
  "NODE_ENV": "production",
  "NEXT_TELEMETRY_DISABLED": "1",
  "HOSTNAME": "0.0.0.0",
  "PORT": "3000"
}
EOF

echo "✅ Frontend JSON created: railway-frontend-ready.env.json"
echo ""

# Create Backend .env file for reference
cat > ocean-backend/railway-backend-ready.env << EOF
# Railway Backend Environment Variables
# Generated: $(date)
# ================================================

# Database Connection (Reference Railway PostgreSQL service)
DATABASE_URL=\${{PostgreSQL.DATABASE_URL}}
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Redis Connection (Reference Railway Redis service)
REDIS_URL=\${{Redis.REDIS_URL}}

# Security Secrets (GENERATED - DO NOT SHARE)
JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}

# CORS Configuration (Production Domains)
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://api.shennastudio.com

# Admin User Credentials
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# Auto-initialization Flags
AUTO_MIGRATE=true
AUTO_SEED=false
AUTO_CREATE_ADMIN=true

# Medusa Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS=true
BACKEND_URL=https://api.shennastudio.com
MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Server Configuration
NODE_ENV=production
PORT=9000
WORKER_MODE=shared
DATABASE_LOGGING=false

# Stripe Payment (Your existing production keys)
STRIPE_API_KEY=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
STRIPE_SECRET_KEY=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
EOF

# Create Frontend .env file for reference
cat > railway-frontend-ready.env << EOF
# Railway Frontend Environment Variables
# Generated: $(date)
# ================================================

# Backend API Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com

# Medusa Publishable Key (Get from Admin Panel after backend is deployed)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=GET_THIS_FROM_ADMIN_PANEL_AFTER_BACKEND_DEPLOYED

# Stripe Payment (Your existing production keys)
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMqYouB5PBrSK8udOL1PcTXM6J4rGqIKnA75jTTBOGqkMGKIDRnqOSxIK4BakHFUFXK9Bd0TTGB00VoS4YZTX

# NextAuth Configuration (GENERATED - DO NOT SHARE)
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://shennastudio.com

# Server Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
HOSTNAME=0.0.0.0
PORT=3000
EOF

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🔑 Generated Credentials (SAVE THESE SECURELY!)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Backend Secrets:"
echo "───────────────"
echo "JWT_SECRET (64 chars):"
echo "${JWT_SECRET}"
echo ""
echo "COOKIE_SECRET (64 chars):"
echo "${COOKIE_SECRET}"
echo ""
echo "ADMIN_EMAIL:"
echo "admin@shennastudio.com"
echo ""
echo "ADMIN_PASSWORD (32 chars):"
echo "${ADMIN_PASSWORD}"
echo ""
echo "Frontend Secrets:"
echo "────────────────"
echo "NEXTAUTH_SECRET (44 chars):"
echo "${NEXTAUTH_SECRET}"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ All files created successfully!"
echo ""
echo "📂 Files Generated:"
echo "  1. ocean-backend/railway-backend-ready.env.json   (Backend JSON)"
echo "  2. railway-frontend-ready.env.json                (Frontend JSON)"
echo "  3. ocean-backend/railway-backend-ready.env        (Backend .env)"
echo "  4. railway-frontend-ready.env                     (Frontend .env)"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📋 DEPLOYMENT STEPS:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "STEP 1: Deploy Backend"
echo "─────────────────────"
echo "1. Go to Railway → Your Project → New Service"
echo "2. Connect your GitHub repository"
echo "3. Set root directory: ocean-backend"
echo "4. Go to Variables tab → Raw Editor"
echo "5. Copy content from: ocean-backend/railway-backend-ready.env.json"
echo "6. Paste into Railway Raw Editor"
echo "7. Click 'Update Variables'"
echo "8. Deploy and wait for completion"
echo ""
echo "STEP 2: Get Publishable Key"
echo "───────────────────────────"
echo "1. Access admin panel: https://[backend-url].railway.app/app"
echo "2. Login with:"
echo "   Email: admin@shennastudio.com"
echo "   Password: ${ADMIN_PASSWORD}"
echo "3. Go to Settings → Publishable API Keys"
echo "4. Copy the key (starts with 'pk_')"
echo ""
echo "STEP 3: Deploy Frontend"
echo "──────────────────────"
echo "1. Open file: railway-frontend-ready.env.json"
echo "2. Replace 'GET_THIS_FROM_ADMIN_PANEL_AFTER_BACKEND_DEPLOYED'"
echo "   with the publishable key from Step 2"
echo "3. Go to Railway → Your Project → New Service"
echo "4. Connect your GitHub repository"
echo "5. Leave root directory empty (or set to /)"
echo "6. Go to Variables tab → Raw Editor"
echo "7. Copy content from: railway-frontend-ready.env.json"
echo "8. Paste into Railway Raw Editor"
echo "9. Click 'Update Variables'"
echo "10. Deploy and wait for completion"
echo ""
echo "STEP 4: Configure Custom Domains"
echo "────────────────────────────────"
echo "1. Backend service → Settings → Domain"
echo "   Add: api.shennastudio.com"
echo "2. Frontend service → Settings → Domain"
echo "   Add: shennastudio.com"
echo "   Add: www.shennastudio.com"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "⚠️  SECURITY REMINDERS:"
echo "  • Save the Admin Password above securely"
echo "  • Never commit these JSON files to git"
echo "  • After first login, change the admin password"
echo "  • After deployment, set AUTO_MIGRATE=false"
echo ""
echo "🎉 Ready to deploy to Railway!"
echo ""
