#!/bin/bash

# Simple script to generate Railway CLI commands for variable application
# Since interactive prompts fail, this shows you the exact commands to run

set -e

PROJECT_DIR="/Users/softwareprosorg/Documents/NewShenna/shennastudiollc"

echo "========================================="
echo "Railway Variable Application Commands"
echo "========================================="
echo ""
echo "Copy and run these commands in your terminal:"
echo ""
echo "# Step 1: Link to your project"
echo "cd $PROJECT_DIR"
echo "railway link  # Select your project > production"
echo ""
echo "# Step 2: Apply Backend Variables"
echo "railway service Backend"
echo ""

# Read backend JSON and generate commands
BACKEND_JSON="$PROJECT_DIR/ocean-backend/railway-backend-serene-pattern.env.json"

if [ -f "$BACKEND_JSON" ]; then
    cat "$BACKEND_JSON" | jq -r 'to_entries[] | select(.key != "comment" and .key != "comment2") | "railway variables --set \"\(.key)=\(.value)\" --skip-deploys"'
fi

echo ""
echo "# Step 3: Apply Frontend Variables"
echo "railway service Storefront"
echo ""

# Read frontend JSON and generate commands
FRONTEND_JSON="$PROJECT_DIR/railway-frontend-serene-pattern.env.json"

if [ -f "$FRONTEND_JSON" ]; then
    cat "$FRONTEND_JSON" | jq -r 'to_entries[] | select(.key != "comment" and .key != "comment2") | "railway variables --set \"\(.key)=\(.value)\" --skip-deploys"'
fi

echo ""
echo "# Step 4: Deploy Services"
echo "railway service Backend"
echo "railway up"
echo ""
echo "railway service Storefront"
echo "railway up"
echo ""
