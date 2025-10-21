#!/bin/bash

# Script to create admin user in serene-presence Railway deployment

echo "========================================="
echo "Create Admin User for Serene-Presence"
echo "========================================="
echo ""

# Admin credentials
ADMIN_EMAIL="admin@shennastudio.com"
ADMIN_PASSWORD="ShennaStudio2024!Admin"

echo "New admin credentials:"
echo "  Email: $ADMIN_EMAIL"
echo "  Password: $ADMIN_PASSWORD"
echo ""
echo "========================================="
echo ""

# Method 1: Using Railway run command
echo "Method 1: Create user via Railway CLI"
echo "--------------------------------------"
echo ""
echo "Step 1: Link to serene-presence project"
echo "Run: railway link"
echo "  Select: serene-presence > production > Backend"
echo ""
echo "Step 2: Create admin user"
echo "Run: railway run npx medusa user -e $ADMIN_EMAIL -p $ADMIN_PASSWORD"
echo ""
echo "========================================="
echo ""

# Method 2: Using environment variables (AUTO_CREATE_ADMIN)
echo "Method 2: Update environment variables"
echo "--------------------------------------"
echo ""
echo "If AUTO_CREATE_ADMIN is enabled, update these variables:"
echo ""
echo "railway service Backend"
echo "railway variables --set 'MEDUSA_ADMIN_EMAIL=$ADMIN_EMAIL'"
echo "railway variables --set 'MEDUSA_ADMIN_PASSWORD=$ADMIN_PASSWORD'"
echo "railway variables --set 'AUTO_CREATE_ADMIN=true'"
echo ""
echo "Then redeploy the Backend service:"
echo "railway up"
echo ""
echo "========================================="
echo ""

# Method 3: Manual via Railway Console
echo "Method 3: Via Railway Console (Web)"
echo "--------------------------------------"
echo ""
echo "1. Go to Railway Dashboard"
echo "2. Select: serene-presence > production > Backend"
echo "3. Click 'Console' tab"
echo "4. Run: npx medusa user -e $ADMIN_EMAIL -p $ADMIN_PASSWORD"
echo ""
echo "========================================="
echo ""

echo "After creating the admin user:"
echo ""
echo "Login at: https://[your-backend-domain]/app"
echo "Email: $ADMIN_EMAIL"
echo "Password: $ADMIN_PASSWORD"
echo ""
