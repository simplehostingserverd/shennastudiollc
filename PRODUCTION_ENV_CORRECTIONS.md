# Production Environment Variables Corrections

## ❌ Issues Found:

1. **STARTUP_MODE=full** → Should be `simple` for production
2. **REDIS_URL=redis://redis:6379** → Should use actual Redis host
3. **Duplicate Stripe keys** → Remove test keys, keep only live
4. **Test Stripe secret** → Should use live secret key
5. **ALGOLIA_ADMIN_API_KEY** → Should be different from search key
6. **Cloudinary demo account** → Should use your actual account

## ✅ Corrected Values:

```env
# Startup Configuration
STARTUP_MODE=simple

# Redis - Fix the URL to use your actual Redis host
REDIS_URL=redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@your-redis-host:6379/0

# Stripe - Production Keys Only (Remove test keys)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMqPOODYc0A70LG7z1fmGJdQGkEcIuSPgoNK4J8qA7kc3bNDp4ImKU3TcvwTANGc8AkIelO01e300i2w3NYQl

# Algolia - Use proper admin vs search keys
ALGOLIA_ADMIN_API_KEY=YOUR_ADMIN_API_KEY_HERE
ALGOLIA_SEARCH_API_KEY=307bdad52d454f71699a996607f0433d

# Cloudinary - Use your actual account (not demo)
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret

# Domain corrections
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com,http://localhost:3000
ADMIN_CORS=https://admin.shennastudio.com,http://localhost:7001
```

## 🚨 **Most Critical Fix:**
Set `STARTUP_MODE=simple` immediately to fix the hanging deployment issue.