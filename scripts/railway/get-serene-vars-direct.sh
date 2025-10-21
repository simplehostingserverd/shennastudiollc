#!/bin/bash

# Direct extraction using Railway CLI with project/service IDs
# Based on the project structure we found

echo "========================================="
echo "Extracting serene-presence variables"
echo "========================================="
echo ""

# Project: serene-presence
# Environment: production (02b4bab6-3ce8-45cc-af17-0b02773e3156)
# Service: Storefront (c022d961-2a47-4397-a2e0-b073fb937642)

PROJECT_ID="46b0dc40-0105-4944-add1-9e6844c2996e"
ENV_ID="02b4bab6-3ce8-45cc-af17-0b02773e3156"
STOREFRONT_SERVICE_ID="c022d961-2a47-4397-a2e0-b073fb937642"
BACKEND_SERVICE_ID="decd79a0-b695-490f-a12f-e5092057c167"

echo "Project: serene-presence"
echo "Environment: production"
echo "Storefront Service ID: $STOREFRONT_SERVICE_ID"
echo "Backend Service ID: $BACKEND_SERVICE_ID"
echo ""

# Create temp directory
TEMP_DIR="/tmp/railway-vars-$(date +%s)"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "Working in: $TEMP_DIR"
echo ""

# Try using railway CLI with environment variables
export RAILWAY_PROJECT_ID="$PROJECT_ID"
export RAILWAY_ENVIRONMENT_ID="$ENV_ID"
export RAILWAY_SERVICE_ID="$STOREFRONT_SERVICE_ID"

echo "Step 1: Getting Storefront variables..."
railway variables --json > storefront-vars.json 2>&1

if [ -s "storefront-vars.json" ]; then
    echo "✓ Storefront variables extracted!"
    cat storefront-vars.json | head -20
    cp storefront-vars.json /Users/softwareprosorg/Documents/NewShenna/shennastudiollc/serene-storefront-vars.json
else
    echo "✗ Failed to extract storefront variables"
    cat storefront-vars.json
fi

echo ""
echo "Step 2: Getting Backend variables..."
export RAILWAY_SERVICE_ID="$BACKEND_SERVICE_ID"

railway variables --json > backend-vars.json 2>&1

if [ -s "backend-vars.json" ]; then
    echo "✓ Backend variables extracted!"
    cat backend-vars.json | head -20
    cp backend-vars.json /Users/softwareprosorg/Documents/NewShenna/shennastudiollc/serene-backend-vars.json
else
    echo "✗ Failed to extract backend variables"
    cat backend-vars.json
fi

echo ""
echo "========================================="
echo "Extraction complete!"
echo "Files saved to project directory"
echo "========================================="
