#!/bin/bash

# Script to apply serene-presence pattern variables to your Railway project
# This uses YOUR actual values with the working service reference pattern

set -e

echo "========================================="
echo "Railway Variable Deployment Script"
echo "Serene-Presence Pattern + Your Values"
echo "========================================="
echo ""
echo "This script will:"
echo "1. Apply backend variables to Backend service"
echo "2. Apply frontend variables to Storefront service"
echo "3. Use Railway service references for auto-wiring"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Get the project directory
PROJECT_DIR="/Users/softwareprosorg/Documents/NewShenna/shennastudiollc"
cd "$PROJECT_DIR"

echo ""
echo "Step 1: Linking to Railway project..."
echo ""
railway link

echo ""
echo "========================================="
echo "Step 2: Applying Backend Variables"
echo "========================================="
echo ""

# Switch to Backend service
railway service Backend

# Read backend JSON and apply variables
BACKEND_JSON="$PROJECT_DIR/ocean-backend/railway-backend-serene-pattern.env.json"

if [ ! -f "$BACKEND_JSON" ]; then
    echo "❌ Error: Backend config file not found: $BACKEND_JSON"
    exit 1
fi

echo "Reading backend config from: railway-backend-serene-pattern.env.json"
echo ""

# Extract and set each variable (escaping special chars)
cat "$BACKEND_JSON" | jq -r 'to_entries[] | select(.key != "comment" and .key != "comment2") | "\(.key)=\(.value)"' | while IFS= read -r line; do
    if [ -n "$line" ]; then
        echo "Setting: ${line%%=*}"
        railway variables --set "$line" --skip-deploys
    fi
done

echo ""
echo "✓ Backend variables applied!"

echo ""
echo "========================================="
echo "Step 3: Applying Frontend Variables"
echo "========================================="
echo ""

# Switch to Storefront service
railway service Storefront

# Read frontend JSON and apply variables
FRONTEND_JSON="$PROJECT_DIR/railway-frontend-serene-pattern.env.json"

if [ ! -f "$FRONTEND_JSON" ]; then
    echo "❌ Error: Frontend config file not found: $FRONTEND_JSON"
    exit 1
fi

echo "Reading frontend config from: railway-frontend-serene-pattern.env.json"
echo ""

# Extract and set each variable
cat "$FRONTEND_JSON" | jq -r 'to_entries[] | select(.key != "comment" and .key != "comment2") | "\(.key)=\(.value)"' | while IFS= read -r line; do
    if [ -n "$line" ]; then
        echo "Setting: ${line%%=*}"
        railway variables --set "$line" --skip-deploys
    fi
done

echo ""
echo "✓ Frontend variables applied!"

echo ""
echo "========================================="
echo "Step 4: Triggering Deployments"
echo "========================================="
echo ""

read -p "Deploy Backend service now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    railway service Backend
    railway up
    echo "✓ Backend deployment triggered"
fi

echo ""
read -p "Deploy Storefront service now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    railway service Storefront
    railway up
    echo "✓ Storefront deployment triggered"
fi

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Monitor deployments in Railway dashboard"
echo "2. Check Backend health: https://api.shennastudio.com/health"
echo "3. Check Frontend: https://shennastudio.com"
echo ""
echo "Variables applied using serene-presence pattern:"
echo "  ✓ Service references for auto-wiring"
echo "  ✓ Your actual Stripe keys preserved"
echo "  ✓ Your actual secrets preserved"
echo "  ✓ Your custom domains preserved"
echo ""
