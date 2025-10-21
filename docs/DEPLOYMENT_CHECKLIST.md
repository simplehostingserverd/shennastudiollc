# 🚀 Coolify Deployment Checklist for Shenna's Studio

Use this checklist to ensure a successful deployment to your Coolify VPS.

## ✅ Pre-Deployment Checklist

### 1. Repository Setup

- [ ] Code pushed to GitHub repository
- [ ] Remove duplicate `ocean-backend` folder (✅ Done)
- [ ] All Docker configurations updated and tested
- [ ] Health check endpoints created (✅ Done)
- [ ] Environment variable template created (✅ Done)

### 2. Coolify Server Setup

- [ ] Coolify VPS server is running and accessible
- [ ] Domain names configured and pointing to server IP
- [ ] SSL certificates will be handled automatically by Coolify
- [ ] Docker and Docker Compose available on the server

### 3. Database Services in Coolify

- [ ] PostgreSQL service created:
  - Name: `shenna-postgres` (or your preferred name)
  - Version: `15-alpine`
  - Database: `ocean_store`
  - Username: `medusa_user`
  - Password: Strong 32+ character password
- [ ] Redis service created:
  - Name: `shenna-redis` (or your preferred name)
  - Version: `7-alpine`
  - Password: Strong password (optional but recommended)

## 🔧 Deployment Configuration

### 4. Docker Compose Files Available

- [ ] `docker-compose.yml` - Local development with databases
- [ ] `docker-compose.coolify.yml` - Coolify production (uses external databases)
- [ ] Individual Dockerfiles working:
  - [ ] `ocean-backend/Dockerfile` - Medusa backend with auto-initialization
  - [ ] `ocean-store/Dockerfile` - Next.js frontend with health checks

### 5. Environment Variables Configuration

Copy from `.env.coolify.example` and set in Coolify:

#### Required Database Variables

- [ ] `DATABASE_URL` - PostgreSQL connection from Coolify service
- [ ] `REDIS_URL` - Redis connection from Coolify service

#### Required Security Variables (Generate strong random strings)

- [ ] `JWT_SECRET` - Minimum 32 characters
- [ ] `COOKIE_SECRET` - Minimum 32 characters
- [ ] `ADMIN_PASSWORD` - Strong password for admin user

#### Required CORS Variables (Update with your domains)

- [ ] `STORE_CORS` - Frontend domains
- [ ] `ADMIN_CORS` - Admin panel domains
- [ ] `AUTH_CORS` - Auth domains

#### Required Payment Variables (Stripe)

- [ ] `STRIPE_SECRET_KEY` - Production Stripe secret key
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Production Stripe publishable key

#### Optional but Recommended

- [ ] `ADMIN_EMAIL` - Admin user email
- [ ] `ALGOLIA_APPLICATION_ID` - Search functionality
- [ ] `ALGOLIA_SEARCH_API_KEY` - Search API key
- [ ] `CLOUDINARY_CLOUD_NAME` - Image optimization
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary secret

## 🚀 Deployment Steps

### 6. Deploy to Coolify

Choose one of these deployment methods:

#### Option A: Docker Compose (Recommended)

- [ ] Create new "Docker Compose" application in Coolify
- [ ] Use `docker-compose.coolify.yml` from repository
- [ ] Configure domains:
  - [ ] Frontend: `shennasstudio.com` (port 3000)
  - [ ] Admin: `admin.shennasstudio.com` (port 7001)
  - [ ] API: `api.shennasstudio.com` (port 9000)

#### Option B: Separate Applications

- [ ] Backend application (Dockerfile: `ocean-backend/Dockerfile`)
  - [ ] Port 9000 → `api.shennasstudio.com`
  - [ ] Port 7001 → `admin.shennasstudio.com`
- [ ] Frontend application (Dockerfile: `ocean-store/Dockerfile`)
  - [ ] Port 3000 → `shennasstudio.com`
  - [ ] Add: `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennasstudio.com`

### 7. Verify Deployment

- [ ] All services started successfully
- [ ] Database migrations completed automatically
- [ ] Admin user created automatically
- [ ] Sample data seeded (if enabled)
- [ ] Health check endpoints responding:
  - [ ] `https://shennasstudio.com/api/health`
  - [ ] `https://api.shennasstudio.com/health`

### 8. Post-Deployment Setup

- [ ] Admin panel accessible: `https://admin.shennasstudio.com`
- [ ] Login with configured admin credentials
- [ ] Change default admin password (if using default)
- [ ] Configure Stripe webhooks: `https://api.shennasstudio.com/webhooks/stripe`
- [ ] Test payment flow end-to-end
- [ ] Set up backup strategy for databases and uploads

## 🔍 Testing Checklist

### 9. Functional Testing

- [ ] Frontend loads: `https://shennasstudio.com`
- [ ] Admin panel loads: `https://admin.shennasstudio.com`
- [ ] API responds: `https://api.shennasstudio.com/health`
- [ ] Product catalog displays correctly
- [ ] Shopping cart functionality works
- [ ] Checkout process completes
- [ ] Payment processing works (use test mode first)
- [ ] Admin can manage products, orders, customers

### 10. Performance Testing

- [ ] Site loads quickly (< 3 seconds)
- [ ] Images optimize properly (if Cloudinary configured)
- [ ] Search works (if Algolia configured)
- [ ] Mobile responsiveness verified
- [ ] SSL certificates valid (A+ rating on SSL Labs)

## 🚨 Troubleshooting

### Common Issues and Solutions

**Container won't start:**

- Check Coolify logs for specific error messages
- Verify all required environment variables are set
- Ensure database services are running and accessible

**Database connection errors:**

- Verify `DATABASE_URL` format is correct
- Check PostgreSQL service is running
- Test network connectivity between services

**CORS errors:**

- Update CORS environment variables with exact domains
- Include both `http://` and `https://` if needed
- Check domain spellings match exactly

**Admin panel inaccessible:**

- Verify `ADMIN_CORS` includes the admin domain
- Check admin user was created successfully
- Review backend logs for authentication errors

**Payment processing issues:**

- Verify Stripe keys are production keys
- Configure Stripe webhook endpoint
- Test with Stripe test mode first

## 📚 Key Files Reference

- **Main Config**: `docker-compose.coolify.yml`
- **Environment Template**: `.env.coolify.example`
- **Deployment Guide**: `COOLIFY_DEPLOYMENT.md`
- **Backend Dockerfile**: `ocean-backend/Dockerfile`
- **Frontend Dockerfile**: `ocean-store/Dockerfile`
- **Health Endpoints**:
  - Frontend: `ocean-store/app/api/health/route.ts`
  - Backend: Built into Medusa

## ✅ Success Criteria

Deployment is successful when:

- [ ] All health check endpoints return 200 OK
- [ ] Frontend displays product catalog
- [ ] Admin panel is accessible and functional
- [ ] Payment processing works end-to-end
- [ ] SSL certificates are valid
- [ ] No errors in application logs

---

**Ready to deploy!** 🎉

Your Shenna's Studio Ocean Store is now ready for production deployment on Coolify VPS. The configuration includes automatic database initialization, health monitoring, and all necessary optimizations for a production environment.
