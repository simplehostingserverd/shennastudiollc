# Coolify Deployment Guide for Shenna Studio

This comprehensive guide covers deploying your Shenna Studio e-commerce platform (Next.js frontend + Medusa backend) on Coolify.

## 🏗️ Architecture Overview

Your application consists of:
- **Frontend**: Next.js 15.5.3 application (standalone mode)
- **Backend**: Medusa.js 2.10.1 e-commerce API
- **Database**: PostgreSQL (already configured with Supabase)
- **Cache**: Redis (will be configured in Coolify)

## 🌐 Domain Configuration

### Recommended Domain Structure

| Service | Domain Example | Purpose |
|---------|----------------|---------|
| **Frontend** | `shennastudio.com` | Main storefront |
| **Backend API** | `api.shennastudio.com` | Medusa API endpoints |
| **Admin Panel** | `admin.shennastudio.com` | Medusa admin dashboard |

### Alternative Single Domain Structure
| Service | Domain Example | Purpose |
|---------|----------------|---------|
| **Frontend** | `shennastudio.com` | Main storefront |
| **Backend API** | `shennastudio.com/api` | API with path routing |
| **Admin Panel** | `shennastudio.com/admin` | Admin with path routing |

## 📋 Prerequisites

1. **Coolify Instance**: Running and accessible
2. **Domain Names**: Purchased and DNS configured
3. **GitHub Repository**: Your code pushed to GitHub
4. **Database**: PostgreSQL database (Supabase already configured)
5. **SSL Certificates**: Coolify will handle automatically

## 🚀 Step-by-Step Deployment

### Step 1: Create Redis Service

1. **Navigate to Services** in Coolify
2. **Create New Service** → **Redis**
3. **Configuration**:
   - **Service Name**: `shenna-redis`
   - **Version**: `7-alpine`
   - **Port**: `6379`
   - **Memory Limit**: `512MB`
4. **Deploy Redis**
5. **Note the internal URL**: `redis://shenna-redis:6379`

### Step 2: Deploy Medusa Backend

1. **Create New Application**
   - **Name**: `shenna-backend`
   - **Repository**: `https://github.com/simplehostingserverd/shennastudiollc`
   - **Branch**: `main`
   - **Build Pack**: `dockerfile`

2. **Dockerfile Configuration**
   - **Dockerfile Path**: `ocean-backend/Dockerfile`
   - **Build Context**: `ocean-backend/`

3. **Environment Variables** (Backend)

#### Required Variables:
```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:OCD1hg3mTa1170ND@db.ncmpqawcsdlnnhpsgjvz.supabase.co:5432/postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Redis Configuration (use your Coolify Redis internal URL)
REDIS_URL=redis://shenna-redis:6379

# JWT & Cookie Secrets (GENERATE NEW 32+ CHARACTER SECRETS!)
JWT_SECRET=GENERATE_STRONG_32_CHAR_SECRET_HERE_FOR_PRODUCTION
COOKIE_SECRET=GENERATE_DIFFERENT_32_CHAR_SECRET_HERE_FOR_PRODUCTION

# Port Configuration  
PORT=9000
ADMIN_PORT=7001

# Production Environment
NODE_ENV=production

# CORS Configuration (UPDATE WITH YOUR ACTUAL DOMAINS)
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://admin.shennastudio.com

# Admin User Configuration
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=GENERATE_STRONG_ADMIN_PASSWORD_HERE

# Auto-initialization (for first deployment)
AUTO_MIGRATE=true
AUTO_SEED=true  
AUTO_CREATE_ADMIN=true

# Printful Drop Shipping (Get from https://www.printful.com/dashboard/integrations)
PRINTFUL_API_KEY=your_printful_api_key_from_dashboard
PRINTFUL_WEBHOOK_SECRET=your_printful_webhook_secret
PRINTFUL_ENABLE_WEBHOOK=true
PRINTFUL_SYNC_VARIANTS=true

# Medusa Configuration
MEDUSA_BACKEND_URL=https://api.shennastudio.com
MEDUSA_ADMIN_URL=https://admin.shennastudio.com
```

4. **Port Configuration**
   - **Application Port**: `9000` (API)
   - **Additional Port**: `7001` (Admin)

5. **Domain Configuration**
   - **API Domain**: `api.shennastudio.com` → Port `9000`
   - **Admin Domain**: `admin.shennastudio.com` → Port `7001`

6. **Health Check**
   - **Path**: `/health`
   - **Port**: `9000`
   - **Timeout**: `30s`

### Step 3: Deploy Next.js Frontend

1. **Create New Application**
   - **Name**: `shenna-frontend`  
   - **Repository**: `https://github.com/simplehostingserverd/shennastudiollc`
   - **Branch**: `main`
   - **Build Pack**: `dockerfile`

2. **Dockerfile Configuration**
   - **Dockerfile Path**: `Dockerfile`
   - **Build Context**: `.` (root)

3. **Environment Variables** (Frontend)

```bash
# Medusa Backend Configuration (UPDATE WITH YOUR ACTUAL BACKEND DOMAIN)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c98766c1f4cd3eae138e5a337134ebf9a88f073220ec26d55dfab65f1b0d25c1

# Stripe Configuration (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY_HERE

# Optional: Algolia Search (if you want search functionality)
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_key
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key

# Optional: Cloudinary (if you want cloud image optimization)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Production Environment
NODE_ENV=production
```

4. **Port Configuration**
   - **Application Port**: `3000`

5. **Domain Configuration**
   - **Main Domain**: `shennastudio.com` → Port `3000`
   - **WWW Domain**: `www.shennastudio.com` → Port `3000`

6. **Health Check**
   - **Path**: `/api/health` (or `/` if no health endpoint)
   - **Port**: `3000`

## 🔐 Security Configurations

### 1. Generate Strong Secrets

Use a password generator to create:
```bash
# Generate 32+ character secrets
JWT_SECRET=k8n3j5h2f9d7s4a1p6v9m8x2c5w7t4r9
COOKIE_SECRET=m5v8h3f9j2n6k1d4s7a9p2x5c8w1t4r7
ADMIN_PASSWORD=AdminSecure2024!@#$
```

### 2. SSL/TLS Configuration

Coolify automatically handles SSL certificates via Let's Encrypt. Ensure:
- All domains are properly pointed to your Coolify server
- DNS records are configured correctly
- HTTP to HTTPS redirects are enabled

### 3. CORS Configuration

Update CORS settings to match your actual domains:
```bash
# Backend CORS
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://admin.shennastudio.com  
AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com,https://admin.shennastudio.com
```

## 🔄 Deployment Order

**Deploy in this order:**

1. **Redis Service** (if not using external Redis)
2. **Medusa Backend** (wait for successful deployment)
3. **Next.js Frontend** (after backend is running)

## 📡 DNS Configuration

Configure these DNS records with your domain provider:

```
# Main domains
shennastudio.com          A     YOUR_COOLIFY_SERVER_IP
www.shennastudio.com      A     YOUR_COOLIFY_SERVER_IP

# API subdomain  
api.shennastudio.com      A     YOUR_COOLIFY_SERVER_IP

# Admin subdomain
admin.shennastudio.com    A     YOUR_COOLIFY_SERVER_IP
```

## 🧪 Testing Your Deployment

### 1. Backend Health Checks

```bash
# API Health Check
curl https://api.shennastudio.com/health

# Admin Panel Access
curl https://admin.shennastudio.com/health
```

### 2. Admin Panel Login

1. **Navigate to**: `https://admin.shennastudio.com`
2. **Login Credentials**:
   - **Email**: `admin@shennastudio.com` (or your configured email)
   - **Password**: Your configured `ADMIN_PASSWORD`

### 3. Frontend Testing

1. **Visit**: `https://shennastudio.com`
2. **Check**:
   - Products load correctly
   - Background images display
   - Collections work
   - Cart functionality
   - Stripe checkout (test mode first)

## 🛠️ Accessing Medusa Admin

### Admin Panel Features:

1. **Products Management**
   - Add/edit products
   - Manage inventory
   - Configure variants and options

2. **Collections Management**  
   - Create product collections
   - Organize products by category

3. **Orders Management**
   - View and process orders
   - Handle fulfillment
   - Track payments

4. **Customer Management**
   - View customer accounts
   - Manage customer data

5. **Settings**
   - Store configuration
   - Payment providers
   - Shipping options
   - Printful integration status

### Login Process:

1. Go to `https://admin.shennastudio.com`
2. Enter admin credentials
3. You'll see the Medusa admin dashboard
4. Navigate through different sections to manage your store

## 🚨 Troubleshooting

### Common Issues:

#### 1. Backend Won't Start
- **Check**: Database connection string
- **Verify**: Redis URL is correct
- **Ensure**: All required environment variables are set
- **Review**: Application logs in Coolify

#### 2. Frontend Can't Connect to Backend
- **Check**: `NEXT_PUBLIC_MEDUSA_BACKEND_URL` points to correct domain
- **Verify**: Backend CORS includes frontend domain
- **Test**: Backend health endpoint directly

#### 3. Admin Panel Login Issues
- **Verify**: Admin user was created during initialization
- **Check**: `AUTO_CREATE_ADMIN=true` was set during first deployment
- **Reset**: Admin password through backend logs

#### 4. CORS Errors
- **Update**: CORS environment variables with actual domains
- **Include**: All domains and subdomains in CORS lists
- **Restart**: Backend service after CORS changes

#### 5. Database Connection Issues
- **Verify**: DATABASE_URL is correct
- **Check**: SSL settings match your database provider
- **Test**: Database connectivity from backend container

#### 6. Module Configuration Errors
- **Error**: `Cannot read properties of undefined (reading 'service')`
- **Cause**: Invalid module configuration in medusa-config file
- **Fix**: Temporarily set `modules: []` to get backend running
- **Solution**: Add modules one by one with proper configuration
- **Example Fix**:
  ```javascript
  // Instead of broken module config, start with empty:
  modules: []
  
  // Then add modules properly:
  modules: [
    {
      resolve: "@medusajs/some-module",
      options: {
        // proper options here
      }
    }
  ]
  ```

### Debug Commands:

```bash
# Check backend logs
docker logs <backend-container-id>

# Check frontend logs  
docker logs <frontend-container-id>

# Test database connection
docker exec -it <backend-container> npm run db:status

# Create admin user manually
docker exec -it <backend-container> npm run create-admin
```

## 📈 Post-Deployment Tasks

1. **Configure Stripe** (if not done)
   - Add production keys
   - Configure webhooks
   - Test payment flow

2. **Set up Printful** (if not done)
   - Get API keys from Printful dashboard
   - Configure webhook endpoints
   - Test product sync

3. **Configure Monitoring**
   - Set up uptime monitoring
   - Configure error alerting
   - Monitor performance metrics

4. **Backup Strategy**
   - Database backups
   - File/upload backups
   - Configuration backups

5. **SSL Certificate Monitoring**
   - Verify auto-renewal works
   - Monitor certificate expiration

## 🔄 Updates and Maintenance

### Updating Your Application:

1. **Push changes** to your GitHub repository
2. **Trigger redeploy** in Coolify
3. **Monitor deployment** logs
4. **Test functionality** after deployment

### Database Migrations:

Medusa handles migrations automatically when `AUTO_MIGRATE=true` is set.

## 💡 Pro Tips

1. **Use Staging Environment**: Set up a staging version first to test changes
2. **Monitor Resource Usage**: Keep an eye on CPU/memory usage in Coolify
3. **Regular Backups**: Implement automated database backups
4. **Error Monitoring**: Consider adding Sentry or similar error tracking
5. **Performance Monitoring**: Use tools like New Relic or Datadog for production monitoring

## 📞 Support Resources

- **Medusa Documentation**: https://docs.medusajs.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **Coolify Documentation**: https://coolify.io/docs
- **Your Repository**: https://github.com/simplehostingserverd/shennastudiollc

---

This deployment guide should get your Shenna Studio e-commerce platform running smoothly on Coolify! 🌊✨