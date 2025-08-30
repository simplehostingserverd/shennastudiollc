# 🌊 Shenna's Studio - Production Setup Guide

## 🚀 Deployment Overview

This guide will help you deploy Shenna's Studio (Ocean Store) to production with all necessary components.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Environment variables configured

## 🔧 Environment Setup

### 1. Copy Environment Files

```bash
# Copy the example environment file
cp .env.example .env

# Also copy for backend
cp ocean-backend/.env.template ocean-backend/.env
```

### 2. Configure Environment Variables

Edit `.env` and `ocean-backend/.env` with your production values:

**Frontend (.env):**
```env
NODE_ENV=production
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-domain.com:9000
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_key
```

**Backend (ocean-backend/.env):**
```env
DATABASE_URL=postgresql://medusa_user:STRONG_PASSWORD_HERE@postgres:5432/ocean_store
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-strong-jwt-secret-minimum-32-characters
COOKIE_SECRET=your-super-strong-cookie-secret-minimum-32-characters
STORE_CORS=https://your-domain.com,https://www.your-domain.com
ADMIN_CORS=https://your-domain.com:7001,https://admin.your-domain.com
AUTH_CORS=https://your-domain.com,https://www.your-domain.com
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=StrongAdminPassword123!
```

## 🏗️ Deployment Steps

### 1. Build and Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps
```

### 2. Initialize Database

```bash
# Run database migrations
docker-compose exec medusa-backend npx medusa db:migrate

# Create admin user
docker-compose exec medusa-backend npm run create-admin

# Seed sample data (optional)
docker-compose exec medusa-backend npm run seed
```

### 3. Access Points

| Service | Local Development | Production |
|---------|------------------|------------|
| **Frontend** | http://localhost:3000 | https://your-domain.com |
| **Medusa Admin** | http://localhost:7001 | https://admin.your-domain.com:7001 |
| **Medusa API** | http://localhost:9000 | https://api.your-domain.com:9000 |
| **Database** | localhost:5433 | Internal only |
| **Redis** | localhost:6379 | Internal only |

## 🔐 Admin Panel Access

### Default Credentials (CHANGE IMMEDIATELY!)
- **Email:** admin@shennasstudio.com
- **Password:** AdminPassword123!

### Admin Panel URLs
- **Development:** http://localhost:7001
- **Production:** https://admin.your-domain.com:7001

### First Login Steps:
1. Navigate to the admin panel
2. Login with default credentials
3. **IMMEDIATELY** change password
4. Update admin email to your preferred email
5. Configure store settings
6. Add products, categories, etc.

## 🌐 Reverse Proxy Configuration (Nginx)

```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Admin Panel
server {
    listen 7001 ssl;
    server_name admin.your-domain.com;
    
    location / {
        proxy_pass http://localhost:7001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# API
server {
    listen 9000 ssl;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT and Cookie secrets (minimum 32 characters)
- [ ] Configure proper CORS settings
- [ ] Use HTTPS with valid SSL certificates
- [ ] Secure database with strong passwords
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Enable database backups

## 🔄 Maintenance Commands

### Backup Database
```bash
docker-compose exec postgres pg_dump -U medusa_user ocean_store > backup_$(date +%Y%m%d_%H%M%S).sql
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f medusa-backend
```

### Update Services
```bash
# Pull latest images and rebuild
docker-compose pull
docker-compose up -d --build
```

## 🛠️ Troubleshooting

### Common Issues

1. **Admin panel not accessible:**
   - Check if port 7001 is open
   - Verify CORS settings in backend .env
   - Check container logs: `docker-compose logs medusa-backend`

2. **Database connection errors:**
   - Verify DATABASE_URL format
   - Check if PostgreSQL container is running
   - Check database credentials

3. **Build failures:**
   - Check environment variables
   - Verify all required files are present
   - Review container logs for specific errors

### Health Checks
```bash
# Check service health
curl http://localhost:3000/health
curl http://localhost:9000/health
curl http://localhost:7001
```

## 🎯 Production Optimization

1. **Performance:**
   - Enable Redis caching
   - Configure CDN for static assets
   - Optimize images and assets

2. **Monitoring:**
   - Set up application monitoring
   - Configure log aggregation
   - Set up health check endpoints

3. **Scaling:**
   - Use Docker Swarm or Kubernetes for scaling
   - Implement load balancing
   - Database clustering if needed

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Review environment variables
3. Ensure all required services are running
4. Check network connectivity and firewall rules

Happy selling! 🌊✨