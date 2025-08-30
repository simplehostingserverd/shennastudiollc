# Coolify VPS Deployment Guide

## Overview
This guide explains how to deploy Shenna's Studio Ocean Store to a Coolify VPS using the external managed PostgreSQL and Redis services.

## Prerequisites
- Coolify VPS with managed PostgreSQL and Redis databases
- Docker and Docker Compose available on the VPS
- GitHub repository access

## Configuration Files

### Docker Compose
Use the Coolify-specific configuration:
```bash
docker-compose -f docker-compose.coolify.yml up -d
```

### Environment Variables
The deployment uses external database URLs from Coolify:
- **PostgreSQL**: `postgres://postgres:Sd2ugVNqmj2NZ4IvRDRVJ60N66C8SkFF0HeXgCN8EehziYh27oBAvc4VO9IwZiuT@swcck000wc0o444cg808oo44:5432/postgres`
- **Redis**: `redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0`

## Deployment Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/shenandoah.git
   cd shenandoah
   ```

2. **Deploy with Coolify Docker Compose**
   ```bash
   docker-compose -f docker-compose.coolify.yml up -d
   ```

3. **Verify Deployment**
   - Frontend: `http://your-vps-ip:3000`
   - Backend API: `http://your-vps-ip:9000`
   - Admin Panel: `http://your-vps-ip:7001`

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