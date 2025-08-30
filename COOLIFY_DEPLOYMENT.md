# Coolify VPS Deployment Guide

## Overview
This guide explains how to deploy Shenna's Studio Ocean Store to a Coolify VPS with proper database and Redis configuration for both development and production.

## Prerequisites
- Coolify VPS with managed PostgreSQL and Redis databases (for production)
- Docker and Docker Compose available on the VPS
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

### Database Configuration

#### Development (Local containers):
- **PostgreSQL**: `postgresql://medusa_user:medusa_secure_password_2024@localhost:5433/ocean_store`
- **Redis**: `redis://localhost:6379`

#### Production (Coolify managed):
- **PostgreSQL**: `postgres://postgres:Sd2ugVNqmj2NZ4IvRDRVJ60N66C8SkFF0HeXgCN8EehziYh27oBAvc4VO9IwZiuT@swcck000wc0o444cg808oo44:5432/postgres`
- **Redis**: `redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0`

## Deployment Steps

### Development Deployment

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/shenandoah.git
   cd shenandoah/ocean-store
   ```

2. **Start Development Environment**
   ```bash
   # Start local databases and services
   docker-compose -f docker-compose.coolify.yml up -d postgres redis
   
   # Wait for databases to be ready
   sleep 30
   
   # Run database migrations and seed
   cd ocean-backend
   npm run build
   npx medusa migrations run
   npm run seed
   
   # Start all services
   cd ..
   docker-compose -f docker-compose.coolify.yml up -d
   ```

3. **Verify Development Deployment**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:9000`
   - Admin Panel: `http://localhost:7001`

### Production Deployment

1. **Deploy to Coolify VPS**
   ```bash
   # Production deployment with external databases
   docker-compose -f docker-compose.coolify.prod.yml up -d
   ```

2. **Initialize Database (first time only)**
   ```bash
   # Connect to production backend container
   docker exec -it shennas-medusa-backend-prod /bin/sh
   
   # Run migrations and seed data
   npm run build
   npx medusa migrations run
   npm run seed
   exit
   ```

3. **Verify Production Deployment**
   - Frontend: `https://shennasstudio.com`
   - Backend API: `https://api.shennasstudio.com`
   - Admin Panel: `https://admin.shennasstudio.com`

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

## Production URLs
- **Store**: https://shennasstudio.com
- **Admin**: https://admin.shennasstudio.com
- **API**: https://api.shennasstudio.com

## Health Checks
Both services include health checks:
- Frontend: `curl -f http://localhost:3000`
- Backend: `curl -f http://localhost:9000/health`

## Admin Access
- **Email**: admin@shennasstudio.com
- **Password**: ChangeThisPassword123! (Change in production)

## Notes
- External database containers are removed from this configuration
- Uses Coolify's managed PostgreSQL and Redis instances
- All secrets and environment variables are configured for production
- Volumes persist uploads and static files