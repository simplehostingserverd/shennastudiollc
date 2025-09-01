# 🌊 Coolify VPS Deployment Guide for Shenna Studio

## 🎯 Overview
This guide explains how to deploy Shenna's Studio Ocean Store to a Coolify VPS with **automatic database initialization**. The deployment includes auto-migration, auto-seeding, and auto-admin creation - no manual setup required!

## ✅ Prerequisites
- Coolify VPS with managed PostgreSQL and Redis databases (for production)
- Docker and Docker Compose available on the VPS
- Domain `shennastudio.com` configured with SSL
- GitHub repository access

## Configuration Files

### Development Mode (with local databases)
For local development with containerized databases:
```bash
docker-compose -f docker-compose.coolify.yml up -d
```

### Production Mode (with external Coolify databases)
For production deployment with external managed databases:
```bash
docker-compose -f docker-compose.coolify.prod.yml up -d
```

### 🗄️ Database Configuration

#### Development (Local containers):
- **PostgreSQL**: `postgresql://medusa_user:medusa_secure_password_2024@postgres:5432/ocean_store`
- **Redis**: `redis://redis:6379`

#### Production (Coolify managed):
- **PostgreSQL**: Use Coolify's managed PostgreSQL service
- **Redis**: Use Coolify's managed Redis service
- **Environment Variables**: Configure via `.env` file (see `.env.production.example`)

### 🚀 Key Features
- ✅ **Auto-Migration**: Database schema automatically updated on startup
- ✅ **Auto-Seeding**: Sample products and data automatically created
- ✅ **Auto-Admin**: Admin user automatically created with your credentials
- ✅ **Health Checks**: Built-in monitoring for all services
- ✅ **Production Ready**: Optimized for Coolify deployment

## Deployment Steps

### 🛠️ Development Deployment (Local Testing)

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/shennastudiollc.git
   cd shennastudiollc
   ```

2. **Start Development Environment (All-in-One)**
   ```bash
   # Start all services with auto-initialization
   docker-compose -f docker-compose.coolify.yml up -d
   
   # Check logs to see auto-initialization progress
   docker-compose -f docker-compose.coolify.yml logs -f medusa-backend
   ```
   
   **That's it!** The system will:
   - Start PostgreSQL and Redis containers
   - Build and start the Medusa backend
   - Automatically run migrations
   - Create the admin user
   - Seed sample products
   - Start the Next.js frontend

3. **Verify Development Deployment**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:9000
   - **Admin Panel**: http://localhost:7001
   - **Default Admin**: admin@shennastudio.com / ChangeThisPassword123!

### 🚀 Production Deployment (Coolify VPS)

1. **Configure Environment Variables**
   ```bash
   # Copy and configure production environment
   cp .env.production.example .env
   # Edit .env with your actual Coolify database credentials and secrets
   ```

2. **Deploy to Coolify VPS (Automatic Setup)**
   ```bash
   # Production deployment with Coolify managed databases
   docker-compose -f docker-compose.coolify.prod.yml up -d
   ```
   
   **✨ No Manual Setup Required!** The system automatically:
   - Connects to your Coolify PostgreSQL and Redis
   - Runs database migrations
   - Creates your admin user
   - Seeds sample products
   - Starts all services with health checks

3. **Verify Production Deployment**
   - **Store**: https://shennastudio.com
   - **Admin**: https://admin.shennastudio.com  
   - **API**: https://api.shennastudio.com
   - **Admin Login**: Check your `.env` file for `ADMIN_EMAIL` and `ADMIN_PASSWORD`

## Service Configuration

### Frontend (Next.js)
- **Port**: 3000
- **Container**: shennas-frontend
- **Backend URL**: https://api.shennasstudio.com

### Backend (Medusa)
- **API Port**: 9000
- **Admin Port**: 7001
- **Container**: shennas-medusa-backend
- **External Databases**: PostgreSQL and Redis managed by Coolify

## 🌐 Production URLs
- **Store**: https://shennastudio.com
- **Admin**: https://admin.shennastudio.com  
- **API**: https://api.shennastudio.com

## 🔍 Monitoring & Health Checks
Built-in health monitoring:
```bash
# Check service health
curl -f https://shennastudio.com
curl -f https://api.shennastudio.com/health
curl -f https://admin.shennastudio.com

# View logs
docker-compose -f docker-compose.coolify.prod.yml logs -f
```

## 👤 Admin Access
- **Email**: From your `.env` file (`ADMIN_EMAIL`)
- **Password**: From your `.env` file (`ADMIN_PASSWORD`)
- **⚠️ Important**: Change the admin password immediately after first login!

## 🛡️ Security Features
- Auto-generated strong secrets (configure in `.env`)
- Production CORS configuration
- Secure database connections
- SSL/HTTPS ready
- Environment-based configuration

## 📝 Key Benefits
- **Zero Manual Setup**: Everything auto-initializes
- **Coolify Optimized**: Designed specifically for Coolify VPS
- **Production Ready**: Includes all security best practices
- **Easy Updates**: Simple docker-compose commands
- **Monitoring**: Built-in health checks and logging

## 🚨 Troubleshooting
If deployment fails:
1. Check Coolify database credentials in `.env`
2. Verify domain SSL certificates
3. Check logs: `docker-compose logs -f medusa-backend`
4. Ensure Coolify PostgreSQL and Redis are running

## 🔄 Updates & Maintenance
```bash
# Update to latest version
git pull origin main
docker-compose -f docker-compose.coolify.prod.yml up -d --build

# Backup database (if needed)
# Use Coolify's built-in backup features
```