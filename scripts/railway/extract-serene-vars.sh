#!/bin/bash

# Quick script to extract Railway variables from serene-presence
# This script guides you through the process

echo "=================================================="
echo "Railway Serene-Presence Variable Extractor"
echo "=================================================="
echo ""
echo "This script will help you extract the environment"
echo "variables from your working Railway deployment."
echo ""
echo "INSTRUCTIONS:"
echo ""
echo "1. This script will create a temp directory"
echo "2. You'll link it to serene-presence/Storefront"
echo "3. We'll extract the variables to JSON"
echo "4. Then copy them to your project"
echo ""
read -p "Press Enter to continue..."

# Create temp directory
TEMP_DIR="/tmp/railway-serene-extract"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo ""
echo "Current directory: $TEMP_DIR"
echo ""
echo "Step 1: Linking to Railway serene-presence..."
echo ""
echo "When prompted, select:"
echo "  Workspace: Simple Hosting Server's Projects"
echo "  Project: serene-presence"
echo "  Environment: production"
echo "  Service: Storefront"
echo ""
read -p "Press Enter to start railway link..."

railway link

echo ""
echo "Step 2: Extracting Storefront environment variables..."
railway variables --json > storefront-vars.json

if [ -f "storefront-vars.json" ]; then
    echo "✓ Storefront variables extracted successfully!"

    # Copy to project directory
    cp storefront-vars.json /Users/softwareprosorg/Documents/NewShenna/shennastudiollc/serene-storefront-vars.json
    echo "✓ Saved to: serene-storefront-vars.json"
else
    echo "✗ Failed to extract storefront variables"
fi

echo ""
echo "Step 3: Switching to Backend service..."
railway service

echo ""
echo "Step 4: Extracting Backend environment variables..."
railway variables --json > backend-vars.json

if [ -f "backend-vars.json" ]; then
    echo "✓ Backend variables extracted successfully!"

    # Copy to project directory
    cp backend-vars.json /Users/softwareprosorg/Documents/NewShenna/shennastudiollc/serene-backend-vars.json
    echo "✓ Saved to: serene-backend-vars.json"
else
    echo "✗ Failed to extract backend variables"
fi

echo ""
echo "=================================================="
echo "Extraction Complete!"
echo "=================================================="
echo ""
echo "Files created in your project directory:"
echo "  - serene-storefront-vars.json"
echo "  - serene-backend-vars.json"
echo ""
echo "You can now use these to update your .env files"
echo ""
