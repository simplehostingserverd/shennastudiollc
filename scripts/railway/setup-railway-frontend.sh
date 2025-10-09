#!/bin/bash

# Railway Frontend Setup Script
# This script sets up the Railway configuration files for the frontend service
# Run this script from the repository root: bash setup-railway-frontend.sh

set -e  # Exit on error

echo "🚀 Setting up Railway Frontend Configuration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the repository root.${NC}"
    exit 1
fi

if [ ! -d "ocean-backend" ]; then
    echo -e "${RED}❌ Error: ocean-backend directory not found. Are you in the right repository?${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Current configuration files:${NC}"
ls -la railway*.json nixpacks*.toml 2>/dev/null || echo "  No Railway config files found yet"
echo ""

# Backup existing files if they exist
if [ -f "railway.json" ]; then
    echo -e "${YELLOW}⚠️  railway.json already exists. Creating backup...${NC}"
    mv railway.json railway.json.backup
    echo -e "${GREEN}✅ Backed up to railway.json.backup${NC}"
fi

if [ -f "nixpacks.toml" ]; then
    echo -e "${YELLOW}⚠️  nixpacks.toml already exists. Creating backup...${NC}"
    mv nixpacks.toml nixpacks.toml.backup
    echo -e "${GREEN}✅ Backed up to nixpacks.toml.backup${NC}"
fi

# Copy frontend config files to standard names
echo ""
echo -e "${YELLOW}📦 Setting up Railway config files...${NC}"

if [ -f "railway-frontend.json" ]; then
    cp railway-frontend.json railway.json
    echo -e "${GREEN}✅ Created railway.json from railway-frontend.json${NC}"
else
    echo -e "${RED}❌ Error: railway-frontend.json not found${NC}"
    exit 1
fi

if [ -f "nixpacks-frontend.toml" ]; then
    cp nixpacks-frontend.toml nixpacks.toml
    echo -e "${GREEN}✅ Created nixpacks.toml from nixpacks-frontend.toml${NC}"
else
    echo -e "${RED}❌ Error: nixpacks-frontend.toml not found${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✨ Frontend Railway configuration setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Review the generated files:"
echo "   - railway.json (Railway service config)"
echo "   - nixpacks.toml (Build config)"
echo ""
echo "2. Commit and push to GitHub:"
echo "   git add railway.json nixpacks.toml"
echo "   git commit -m 'chore: Add Railway frontend configuration'"
echo "   git push origin main"
echo ""
echo "3. In Railway Dashboard:"
echo "   a. Create new service from GitHub repo"
echo "   b. Set Root Directory: . (or leave empty for root)"
echo "   c. Railway will auto-detect railway.json and nixpacks.toml"
echo "   d. Add environment variables (see railway-frontend-production.env)"
echo "   e. Deploy!"
echo ""
echo -e "${YELLOW}📚 For more details, see:${NC}"
echo "   - RAILWAY-AUTO-CONFIG.md (comprehensive setup guide)"
echo "   - RAILWAY-DEPLOYMENT-CHECKLIST.md (step-by-step checklist)"
echo "   - railway-frontend-production.env (environment variables template)"
echo ""
echo -e "${GREEN}🎉 Ready to deploy to Railway!${NC}"
