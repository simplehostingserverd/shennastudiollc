#!/bin/bash

# Railway Deployment Script for Shenna's Studio
# This script helps you deploy to Railway

set -e

echo "🚂 Railway Deployment Helper for Shenna's Studio"
echo "=================================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Install it with: npm install -g @railway/cli"
    echo "Or: brew install railway"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway:"
    railway login
fi

echo "✅ Logged in to Railway"
echo ""

# Check if project is linked
if ! railway status &> /dev/null 2>&1; then
    echo "🔗 This project is not linked to a Railway project."
    echo "Would you like to:"
    echo "  1) Create a new Railway project"
    echo "  2) Link to an existing project"
    read -p "Enter choice (1 or 2): " choice

    if [ "$choice" == "1" ]; then
        echo "Creating new Railway project..."
        railway init
    else
        echo "Linking to existing project..."
        railway link
    fi
fi

echo ""
echo "📦 Current Railway project:"
railway status
echo ""

echo "🔍 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "Current Node.js version: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v20\. ]]; then
    echo "⚠️  Warning: You're using $NODE_VERSION, but this project requires Node.js 20"
    echo "Make sure Railway uses Node.js 20 (check .nvmrc file)"
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "  ✓ .nvmrc file created (Node.js 20.19.5)"
echo "  ✓ nixpacks.toml configured"
echo "  ✓ railway.json configured"
echo "  ✓ Procfile created"
echo "  ✓ ecosystem.config.js updated for Railway"
echo ""

echo "⚡ What would you like to do?"
echo "  1) View environment variables template"
echo "  2) Deploy to Railway now"
echo "  3) View deployment guide"
echo "  4) Exit"
read -p "Enter choice (1-4): " action

case $action in
    1)
        echo ""
        cat .env.railway.template
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Railway..."
        echo "Make sure you've set all required environment variables in Railway dashboard!"
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" == "y" ]; then
            railway up
            echo ""
            echo "✅ Deployment initiated!"
            echo "View logs: railway logs"
            echo "Open in browser: railway open"
        fi
        ;;
    3)
        echo ""
        cat RAILWAY_DEPLOYMENT.md
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📚 Useful Railway Commands:"
echo "  railway logs          - View deployment logs"
echo "  railway open          - Open project in browser"
echo "  railway status        - Check project status"
echo "  railway run <cmd>     - Run command in Railway environment"
echo "  railway variables     - Manage environment variables"
echo ""
echo "For detailed guide, see: RAILWAY_DEPLOYMENT.md"
