#!/bin/bash

# Script to extract environment variables from Railway's serene-presence project
# This will help transfer the working frontend configuration

echo "========================================="
echo "Railway Serene-Presence Variable Extractor"
echo "========================================="
echo ""

# Save current project state
CURRENT_DIR=$(pwd)
TEMP_DIR="/tmp/railway-serene-presence"

# Create temp directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "Step 1: Linking to serene-presence project..."
echo "You'll need to select:"
echo "  - Workspace: Simple Hosting Server's Projects"
echo "  - Project: serene-presence"
echo "  - Environment: production"
echo "  - Service: Storefront"
echo ""

# Link to the project (this will be interactive)
railway link

echo ""
echo "Step 2: Extracting Storefront environment variables..."
railway variables --json > serene-storefront-vars.json

echo ""
echo "Step 3: Extracting Backend environment variables for reference..."
railway service Backend
railway variables --json > serene-backend-vars.json

echo ""
echo "========================================="
echo "Variables saved to:"
echo "  - $TEMP_DIR/serene-storefront-vars.json"
echo "  - $TEMP_DIR/serene-backend-vars.json"
echo "========================================="
echo ""

# Return to original directory
cd "$CURRENT_DIR"

# Also link back to the original project
echo "Relinking to poetic-mindfulness project..."
railway link

echo ""
echo "Done! Check the JSON files in $TEMP_DIR"
echo ""
