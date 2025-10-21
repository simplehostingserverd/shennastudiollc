#!/bin/bash

# Quick Connect Frontend to Backend - Railway Commands
# Copy and paste these commands into your terminal after logging into Railway

echo "🚀 Railway Frontend Setup Commands"
echo "===================================="
echo ""
echo "Copy and run these commands in your terminal:"
echo ""

cat << 'EOF'
# Step 1: Login to Railway (if not already logged in)
railway login

# Step 2: Link to your project
railway link

# Step 3: Create or select the storefront service
railway service

# If storefront doesn't exist, create it:
# railway service create storefront

# Step 4: Select the storefront service
railway service select storefront

# Step 5: Set essential frontend environment variables
railway variables set \
  NEXT_PUBLIC_MEDUSA_BACKEND_URL='${{Backend.RAILWAY_PUBLIC_DOMAIN}}' \
  NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  PORT=3000 \
  HOSTNAME=0.0.0.0 \
  NEXT_PUBLIC_BASE_URL='${{RAILWAY_PUBLIC_DOMAIN}}'

# Step 6: Switch to backend service and update CORS
railway service select backend

# Step 7: Update backend CORS to allow frontend
railway variables set \
  STORE_CORS='${{Storefront.RAILWAY_PUBLIC_DOMAIN}}' \
  AUTH_CORS='${{Storefront.RAILWAY_PUBLIC_DOMAIN}}'

# Step 8: Switch back to storefront and deploy
railway service select storefront
railway up

# Step 9: Get your frontend URL
railway domain

echo ""
echo "✅ Setup complete! Your frontend should now be connected to your backend."
echo "Visit the domain shown above to test your storefront."
EOF
