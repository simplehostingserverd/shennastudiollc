#!/bin/bash

# Manual method to get Railway variables
# This will use Railway CLI commands step by step

echo "========================================="
echo "Manual Railway Variable Extraction"
echo "========================================="
echo ""
echo "We'll extract variables manually using Railway CLI"
echo ""

# Method 1: Try with explicit environment flags
echo "Method 1: Using railway variables command..."
echo ""
echo "Attempting to get serene-presence Storefront variables..."
echo ""

# Store current railway.json if exists
if [ -f ".railway.json" ]; then
    mv .railway.json .railway.json.backup
    echo "Backed up existing .railway.json"
fi

# Create a railway config for serene-presence manually
# We'll need the project ID
echo "Getting Railway project info..."
railway list --json > railway-projects.json 2>&1

echo ""
echo "Railway projects saved to railway-projects.json"
echo ""
echo "Now let's try to get the variables using a workaround..."
echo ""

# Alternative: Use railway run with env export
cd /tmp/railway-serene-extract

echo "Attempting to export environment from serene-presence..."
echo ""

# Try to use railway whoami to check auth
railway whoami

echo ""
echo "========================================="
echo "ALTERNATIVE METHOD:"
echo "========================================="
echo ""
echo "Since automated extraction is failing, please:"
echo ""
echo "1. Go to https://railway.app/dashboard"
echo "2. Select project: serene-presence"
echo "3. Select environment: production"
echo "4. Click on service: Storefront"
echo "5. Go to Variables tab"
echo "6. Copy the variables and paste them here"
echo ""
echo "OR run these commands manually:"
echo ""
echo "  cd /tmp/railway-serene-extract"
echo "  railway link (select serene-presence > production > Storefront)"
echo "  railway variables"
echo ""
