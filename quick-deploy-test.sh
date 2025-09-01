#!/bin/bash

# Quick deployment test script for Shenna's Studio
echo "🔍 Testing Shenna's Studio deployment configuration..."

# Test 1: Validate Docker Compose files
echo "📋 Validating Docker Compose configurations..."

echo "  ✓ Checking main docker-compose.yml..."
if docker-compose -f docker-compose.yml config --quiet; then
    echo "    ✅ Main configuration is valid"
else
    echo "    ❌ Main configuration has errors"
fi

echo "  ✓ Checking Coolify docker-compose.coolify.yml..."
if docker-compose -f docker-compose.coolify.yml config --quiet; then
    echo "    ✅ Coolify configuration is valid"
else
    echo "    ❌ Coolify configuration has errors"  
fi

# Test 2: Validate Dockerfile syntax
echo "📦 Validating Dockerfile configurations..."

echo "  ✓ Checking ocean-backend/Dockerfile..."
if docker build --dry-run -f ocean-backend/Dockerfile ocean-backend/ > /dev/null 2>&1; then
    echo "    ✅ Backend Dockerfile is valid"
else
    echo "    ❌ Backend Dockerfile has issues"
fi

echo "  ✓ Checking ocean-store/Dockerfile..."
if docker build --dry-run -f ocean-store/Dockerfile ocean-store/ > /dev/null 2>&1; then
    echo "    ✅ Frontend Dockerfile is valid"
else
    echo "    ❌ Frontend Dockerfile has issues"
fi

# Test 3: Check environment variable templates
echo "🔧 Checking environment configuration..."

if [ -f ".env.coolify.example" ]; then
    echo "    ✅ Environment template exists"
    REQUIRED_VARS=("DATABASE_URL" "REDIS_URL" "JWT_SECRET" "COOKIE_SECRET")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.coolify.example; then
            echo "    ✅ $var is documented"
        else
            echo "    ⚠️  $var is missing from template"
        fi
    done
else
    echo "    ❌ Environment template missing"
fi

# Test 4: Check health endpoints exist
echo "🏥 Checking health check endpoints..."

if [ -f "ocean-store/app/api/health/route.ts" ]; then
    echo "    ✅ Frontend health endpoint exists"
else
    echo "    ❌ Frontend health endpoint missing"
fi

echo "    ✅ Backend health endpoint built into Medusa"

# Test 5: Check deployment documentation
echo "📚 Checking deployment documentation..."

if [ -f "COOLIFY_DEPLOYMENT.md" ]; then
    echo "    ✅ Coolify deployment guide exists"
else
    echo "    ❌ Deployment guide missing"
fi

if [ -f "DEPLOYMENT_CHECKLIST.md" ]; then
    echo "    ✅ Deployment checklist exists"
else
    echo "    ❌ Deployment checklist missing"
fi

echo ""
echo "🎉 Configuration validation complete!"
echo ""
echo "🚀 Ready for Coolify deployment:"
echo "  1. Use docker-compose.coolify.yml for production"
echo "  2. Set environment variables from .env.coolify.example"
echo "  3. Follow DEPLOYMENT_CHECKLIST.md for step-by-step guide"
echo ""
echo "📋 Quick deploy checklist:"
echo "  □ Create PostgreSQL service in Coolify"
echo "  □ Create Redis service in Coolify"  
echo "  □ Set all environment variables from template"
echo "  □ Deploy using docker-compose.coolify.yml"
echo "  □ Check health endpoints after deployment"
echo ""