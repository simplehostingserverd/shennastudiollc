# Coolify Production Deployment Guide for shennastudio.com

This guide explains how to deploy Shenna's Studio to production using Coolify with the combined frontend + backend Docker setup.

## 🚀 Quick Deployment

### 1. Coolify Project Setup

1. Create a new project in Coolify
2. Add a new service from Git repository
3. Set the repository: `https://github.com/simplehostingserverd/shennastudiollc.git`
4. Set the branch: `main`
5. Use **Docker Compose** deployment method
6. Set the compose file: `docker-compose.coolify.yml`

### 2. Required Environment Variables

Set these environment variables in Coolify:

#### Database & Redis
```
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port (optional)
```

#### Security (Generate strong secrets)
```
JWT_SECRET=your-32-character-jwt-secret-here
COOKIE_SECRET=your-32-character-cookie-secret-here
```

#### Admin Setup
```
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YourSecurePassword123!
```

#### Stripe Payment
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

#### Domain Configuration
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://shennastudio.com
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://shennastudio.com,https://www.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com
```

#### Auto-Initialization
```
AUTO_MIGRATE=true
AUTO_CREATE_ADMIN=true
AUTO_SEED=false
```

#### Optional Services
```
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 3. Domain Configuration

1. Set your domain to `shennastudio.com` in Coolify
2. Enable SSL/TLS (Let's Encrypt)
3. Configure DNS to point to your Coolify server

### 4. Port Configuration

The application exposes:
- **Port 3000**: Frontend (Next.js storefront)
- **Port 9000**: Backend API + Admin Panel

Configure Coolify to:
- Use port 3000 as the main application port
- Forward traffic appropriately

## 🏗️ Architecture

This deployment runs both frontend and backend in a single container:

```
┌─────────────────────────────────────┐
│           Docker Container          │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │  Next.js    │  │   Medusa    │   │
│  │  Frontend   │  │   Backend   │   │
│  │  Port 3000  │  │  Port 9000  │   │
│  └─────────────┘  └─────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## 🔧 Access Points

After deployment:

- **Storefront**: https://shennastudio.com
- **Admin Panel**: https://shennastudio.com:9000/app
- **API**: https://shennastudio.com:9000

## 🔒 Security Features

- ✅ Non-root user execution
- ✅ Production-only dependencies
- ✅ Proper CORS configuration
- ✅ Secure cookie settings
- ✅ Health checks
- ✅ Memory optimizations

## 🚦 Health Monitoring

The container includes health checks for:
- Frontend availability (port 3000)
- Backend API health (port 9000)

## 📊 Auto-Initialization

On first deployment, the container will automatically:
1. Run database migrations
2. Create the admin user
3. Set up the system for immediate use

## 🔄 Updates

To update the deployment:
1. Push changes to the GitHub repository
2. Trigger a rebuild in Coolify
3. The container will automatically rebuild and redeploy

## 🆘 Troubleshooting

### Common Issues:

1. **Admin login not working**: Check that `AUTO_CREATE_ADMIN=true` and the admin credentials are set
2. **CORS errors**: Verify the domain configuration matches your actual domain
3. **Database connection**: Ensure `DATABASE_URL` is correctly formatted
4. **Frontend can't reach backend**: Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` setting

### Logs:
Check Coolify logs for detailed startup information and error messages.

## 🎯 Production Ready Features

- ✅ Combined frontend + backend deployment
- ✅ Auto-migration and setup
- ✅ Production optimizations
- ✅ Health monitoring
- ✅ SSL/TLS ready
- ✅ Persistent data volumes
- ✅ Memory optimization
- ✅ Security hardening