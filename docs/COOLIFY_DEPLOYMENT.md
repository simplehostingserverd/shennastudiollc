# Coolify Deployment Guide - Shenna's Studio

## Quick Deployment Overview

This setup provides **fully automated deployment** with database creation, migration, admin setup, and seeding.

## Architecture

- **Backend**: Medusa.js e-commerce API + Admin Panel
- **Frontend**: Next.js application
- **Database**: PostgreSQL with automatic setup
- **Cache**: Redis for sessions and caching

---

## 🚀 Backend Deployment (Medusa API + Admin)

### 1. Create New Service in Coolify

- **Service Type**: Docker
- **Source**: Git Repository
- **Dockerfile**: `Dockerfile.coolify`

### 2. Required Environment Variables

```bash
# Database (Coolify will provide)
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port

# Security (CHANGE THESE!)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-2024
COOKIE_SECRET=your-super-secure-cookie-secret-minimum-32-characters-2024

# CORS (Update with your domains)
STORE_CORS=https://your-frontend-domain.com
ADMIN_CORS=https://your-backend-domain.com
AUTH_CORS=https://your-frontend-domain.com

# Admin Account (CHANGE THESE!)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# Auto-initialization (Leave these as true)
AUTO_MIGRATE=true
AUTO_CREATE_ADMIN=true
AUTO_SEED=true

# Medusa Config
NODE_ENV=production
MEDUSA_ADMIN_ONBOARDING_TYPE=default
```

### 3. Port Configuration

- **Internal Port**: 9000 (API)
- **Admin Port**: 7001 (Admin Panel)
- **Health Check**: `/health`

### 4. What Happens Automatically

1. ✅ **Database Connection**: Waits for DB to be ready (up to 60 seconds)
2. ✅ **Database Creation**: Creates database if it doesn't exist
3. ✅ **Migrations**: Runs all database migrations
4. ✅ **Admin User**: Creates admin account automatically
5. ✅ **Sample Data**: Seeds database with products and data
6. ✅ **Health Checks**: Verifies all services before starting

---

## 🎨 Frontend Deployment (Next.js)

### 1. Create New Service in Coolify

- **Service Type**: Docker
- **Source**: Same Git Repository
- **Dockerfile**: `Dockerfile.coolify.frontend`

### 2. Required Environment Variables

```bash
# Backend Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-domain.com

# Payment Processing (Optional)
STRIPE_SECRET_KEY=sk_test_or_live_your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_your_stripe_key

# Search (Optional)
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_key

# Image Optimization (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# App Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 3. Port Configuration

- **Internal Port**: 3000
- **Health Check**: `/api/health`

---

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] **Database Service**: Create PostgreSQL service in Coolify
- [ ] **Redis Service**: Create Redis service in Coolify
- [ ] **Domain Names**: Set up domains for frontend and backend
- [ ] **Environment Variables**: Update all the template values above

### Post-Deployment

- [ ] **Backend Health**: Check `https://your-backend-domain.com/health`
- [ ] **Admin Panel**: Access `https://your-backend-domain.com:7001`
- [ ] **Frontend**: Check `https://your-frontend-domain.com`
- [ ] **Admin Login**: Test with your ADMIN_EMAIL and ADMIN_PASSWORD
- [ ] **API Connection**: Verify frontend can connect to backend

---

## 🔧 Environment Configuration

### Production Secrets (Update These!)

```bash
# Generate secure secrets (32+ characters each)
JWT_SECRET="$(openssl rand -base64 32)"
COOKIE_SECRET="$(openssl rand -base64 32)"

# Strong admin password
ADMIN_PASSWORD="YourVerySecurePassword2024!"
```

### Database URLs Format

```bash
# PostgreSQL
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Redis
REDIS_URL=redis://host:6379
```

---

## 🚨 Troubleshooting

### Backend Issues

- **Logs**: Check Coolify logs for startup sequence
- **Database**: Verify DATABASE_URL is accessible
- **Migrations**: Look for "🔄 Running database migrations..." message
- **Admin**: Check "👤 Creating admin user..." message

### Frontend Issues

- **Build**: Check for Next.js build errors
- **API Connection**: Verify NEXT_PUBLIC_MEDUSA_BACKEND_URL
- **CORS**: Ensure backend STORE_CORS includes frontend domain

### Common Solutions

1. **Database Connection Failed**: Check DATABASE_URL and network access
2. **Admin Creation Failed**: Verify ADMIN_EMAIL format and password strength
3. **CORS Errors**: Update CORS environment variables with correct domains
4. **Build Timeout**: Increase Coolify build timeout for large applications

---

## 🎯 Access Points After Deployment

- **🛒 Store**: https://your-frontend-domain.com
- **👤 Admin Panel**: https://your-backend-domain.com:7001
- **🔌 API**: https://your-backend-domain.com/store/products
- **💚 Health Check**: https://your-backend-domain.com/health

---

## 🔄 Updates and Maintenance

### Code Updates

1. **Push to Git**: Changes automatically deploy via Coolify
2. **Database**: Migrations run automatically on each deployment
3. **Zero Downtime**: Health checks ensure smooth deployments

### Database Maintenance

- **Migrations**: Automatic on every deployment
- **Backups**: Configure in Coolify database service
- **Scaling**: Use Coolify's horizontal scaling features

This setup provides a **production-ready, fully automated deployment** with all database operations handled automatically! 🚀
