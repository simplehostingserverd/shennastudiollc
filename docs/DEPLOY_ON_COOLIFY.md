# Deploy Shenna's Studio on Coolify

This guide covers deploying the Shenna's Studio e-commerce platform on Coolify using external managed databases.

## Prerequisites

- Coolify server setup with Docker
- PostgreSQL database (managed by Coolify)
- Redis instance (managed by Coolify)
- Domain names configured
- SSL certificates set up

## Required Environment Variables

### Database Configuration

```bash
# PostgreSQL Database (Coolify managed)
POSTGRES_HOST=your-postgres-host
POSTGRES_DB=shennas_studio_db
POSTGRES_PASSWORD=your-secure-postgres-password

# Redis Cache (Coolify managed)
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-secure-redis-password
```

### Security & Authentication

```bash
# JWT and Cookie secrets (minimum 32 characters each)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-change-in-production
COOKIE_SECRET=your-super-secure-cookie-secret-minimum-32-characters-change-in-production

# Admin credentials
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=YourSecureAdminPassword123!
```

### Payment Processing (Stripe)

```bash
# Production Stripe keys
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### Optional Services

#### Algolia Search

```bash
ALGOLIA_APPLICATION_ID=your_algolia_app_id
ALGOLIA_SEARCH_API_KEY=your_algolia_search_key
```

#### Cloudinary Images

```bash
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Deployment Steps

### 1. Prepare Coolify Environment

1. Create a new project in Coolify
2. Set up managed PostgreSQL database
3. Set up managed Redis instance
4. Configure domain names:
   - API: `api.shennastudio.com`
   - Admin: `admin.shennastudio.com`
   - Frontend: `shennastudio.com` / `www.shennastudio.com`

### 2. Configure Environment Variables

In Coolify, add all required environment variables listed above:

```bash
# Navigate to your project settings
# Add each environment variable in the "Environment Variables" section
# Mark sensitive variables (passwords, secrets) as "Secret"
```

### 3. Deploy Application

1. Connect your GitHub repository to Coolify
2. Select `docker-compose.coolify.prod.yml` as the deployment configuration
3. Set build context to repository root
4. Configure port mappings:
   - Backend API: 9000
   - Admin Panel: 7001
   - Frontend: 3000

### 4. Post-Deployment Verification

#### Health Checks

- Backend API: `https://api.shennastudio.com/health`
- Frontend: `https://shennastudio.com`
- Admin Panel: `https://admin.shennastudio.com`

#### Database Setup

The application automatically handles:

- Database migrations (`AUTO_MIGRATE=true`)
- Sample data seeding (`AUTO_SEED=true`)
- Admin user creation (`AUTO_CREATE_ADMIN=true`)

### 5. SSL/TLS Configuration

Coolify handles SSL certificates automatically. Ensure:

- Domain DNS points to Coolify server
- SSL certificates are valid
- HTTPS redirects are enabled

## Troubleshooting

### Common Issues

#### Database Connection Errors

- Verify `DATABASE_URL` format
- Check PostgreSQL host and credentials
- Ensure database exists

#### Redis Connection Issues

- Verify `REDIS_URL` format
- Check Redis host and password
- Test Redis connectivity

#### CORS Errors

- Verify domain names in CORS settings
- Check frontend-backend URL configuration
- Ensure HTTPS is properly configured

### Logs and Monitoring

```bash
# View application logs in Coolify dashboard
# Or via Docker commands:
docker logs shenna-medusa-backend-prod
docker logs shenna-frontend-prod
```

### Database Backup

Set up automated backups in Coolify:

- PostgreSQL daily backups
- Retain backups for 30 days
- Test restore procedures regularly

## Security Considerations

1. **Secrets Management**
   - Use strong, unique passwords (32+ characters)
   - Rotate secrets regularly
   - Mark sensitive variables as "Secret" in Coolify

2. **Network Security**
   - Use HTTPS everywhere
   - Configure proper CORS settings
   - Limit database access to application only

3. **Monitoring**
   - Enable application monitoring
   - Set up alerts for errors and downtime
   - Monitor database performance

## Scaling

### Horizontal Scaling

- Configure load balancer in Coolify
- Use multiple backend instances
- Scale based on CPU/memory usage

### Database Optimization

- Monitor query performance
- Set up read replicas if needed
- Configure connection pooling

## Production Checklist

- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups enabled
- [ ] Monitoring and alerts set up
- [ ] DNS records configured
- [ ] CORS settings verified
- [ ] Health checks passing
- [ ] Admin user created
- [ ] Sample data seeded (optional)
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] Performance tested under load

## Support

For deployment issues:

- Check Coolify logs and documentation
- Verify environment variable configuration
- Test database connectivity
- Review application health checks

## Environment Variables Summary

**Required (11 variables):**

- POSTGRES_HOST, POSTGRES_DB, POSTGRES_PASSWORD
- REDIS_HOST, REDIS_PASSWORD
- JWT_SECRET, COOKIE_SECRET
- ADMIN_EMAIL, ADMIN_PASSWORD
- STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

**Optional (6 variables):**

- ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_API_KEY
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
