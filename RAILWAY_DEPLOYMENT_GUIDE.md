# 🚂 Railway Deployment Guide - Auto-Migrations Enabled

## ✨ What's New

Your application now has **automatic database migrations** that run during Railway deployment! No more manual migration commands needed.

## 🎯 How Auto-Migration Works

### Pre-Build Phase
When you deploy to Railway, the `pre-build.sh` script automatically:

1. ✅ Checks if `DATABASE_URL` is set
2. ✅ Runs `npx prisma generate` to create the Prisma client
3. ✅ Runs `npx prisma migrate deploy` to apply all pending migrations
4. ✅ Continues with the build even if migrations fail (won't break deployment)

### Build Process Flow
```
Railway Deploy Triggered
    ↓
Install Dependencies (npm ci)
    ↓
Run pre-build.sh
    ├─ Check DATABASE_URL
    ├─ Generate Prisma Client
    ├─ Apply Database Migrations ← AUTOMATIC!
    └─ Clear build caches
    ↓
Build Next.js App (npm run build)
    ↓
Deploy!
```

## 📋 Railway Setup Checklist

### 1. Environment Variables (Required)

Set these in Railway Dashboard → Variables:

```env
# Database (CRITICAL - Migrations won't run without this)
DATABASE_URL=postgresql://user:password@host:port/database

# Cloudinary (For blog image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth
NEXTAUTH_SECRET=your-32-char-min-secret
NEXTAUTH_URL=https://your-app.railway.app

# Admin JWT
JWT_SECRET=your-32-char-min-secret

# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Email (Optional)
RESEND_API_KEY=re_...

# reCAPTCHA (Optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
```

### 2. Database Setup

**Option A: Railway PostgreSQL (Recommended)**
1. Go to Railway Dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway automatically sets `DATABASE_URL` variable

**Option B: External Database**
1. Get your PostgreSQL connection string
2. Set `DATABASE_URL` manually in Railway variables
3. Format: `postgresql://user:password@host:port/database?sslmode=require`

### 3. Deployment Steps

1. **Connect Repository**:
   ```bash
   railway link
   ```

2. **Deploy**:
   ```bash
   git push origin main
   ```
   Railway auto-deploys on push!

3. **Check Migration Logs**:
   - Go to Railway Dashboard
   - Click on your deployment
   - View build logs
   - Look for "🗄️ Running Database Migrations"

## 🔍 Verifying Auto-Migration

After deployment, check the build logs for:

```
================================================
🗄️  Running Database Migrations
================================================

✅ DATABASE_URL is set

📦 Generating Prisma Client...
✔ Generated Prisma Client

🔄 Running database migrations...
✔ Migration applied: 20241026_add_order_addresses

✅ Database migrations completed successfully!
```

## 🎨 New Feature: Thermal Printer Integration

### PL70e-BT Shipping Label Printer

Your app now supports **direct printing** to your PL70e-BT 4x6 thermal printer!

#### Features:
- ✅ Bluetooth connectivity (Web Bluetooth API)
- ✅ USB fallback printing (browser print dialog)
- ✅ Professional 4x6 shipping labels
- ✅ ESC/POS thermal printer commands
- ✅ Order information with addresses
- ✅ Company branding included

#### How to Use:

1. **Access Admin Orders**:
   - Login at: `https://your-app.railway.app/admin/login`
   - Navigate to: `/admin/orders`

2. **Print a Label**:
   - Click "Print Label" on any order
   - Choose "Print via Bluetooth (PL70e-BT)"
   - Allow Bluetooth access when prompted
   - Select "PL70e-BT" from the device list
   - Label prints automatically!

3. **Fallback Option**:
   - If Bluetooth doesn't work, use "Print via USB/Browser"
   - Opens standard browser print dialog
   - Select your printer (USB or network)

#### Label Format (4x6 inches):
```
================================
    SHENNA'S STUDIO
  Ocean-Themed Products
10% to Ocean Conservation
  www.shennastudio.com
================================

ORDER: CS_XXXXX

SHIP TO:
John Doe
123 Ocean Ave
Apt 4B
Miami, FL 33139
US
Tel: +1234567890

--------------------------------
ITEMS (2):
1. Qty: 1
2. Qty: 2

TOTAL: $49.99

Thank you for supporting
Ocean Conservation!
```

## 🛠️ Troubleshooting

### Migrations Not Running

**Problem**: Migrations don't apply during deployment

**Solutions**:
1. Check `DATABASE_URL` is set in Railway variables
2. View build logs for error messages
3. Try manual migration:
   ```bash
   railway run npx prisma migrate deploy
   ```

### Bluetooth Printer Not Connecting

**Problem**: Can't connect to PL70e-BT printer

**Solutions**:
1. ✅ Ensure app is served over HTTPS (Railway provides this)
2. ✅ Use Chrome, Edge, or Opera (Firefox doesn't support Web Bluetooth)
3. ✅ Enable Bluetooth in browser: chrome://flags/#enable-web-bluetooth
4. ✅ Make sure printer is in pairing mode
5. ✅ Try turning printer off and on
6. ✅ Use "USB/Browser" fallback option

### Missing Orders in Admin Panel

**Problem**: Orders page shows no orders

**Solutions**:
1. Check migration ran successfully (see logs)
2. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
3. Test with a new order to verify webhook works
4. Check Stripe Dashboard webhook logs

## 📊 Migration History

Your app includes these migrations:

1. **Initial Schema** - Users, Products, Orders, Blog, etc.
2. **add-order-addresses** - Shipping/billing address capture (NEW!)

View all migrations:
```bash
railway run npx prisma migrate status
```

## 🔄 Rolling Back Migrations (If Needed)

If something goes wrong:

1. **View migration history**:
   ```bash
   railway run npx prisma migrate status
   ```

2. **Reset database** (CAUTION - deletes all data):
   ```bash
   railway run npx prisma migrate reset
   ```

3. **Apply specific migration**:
   ```bash
   railway run npx prisma migrate resolve --applied "migration_name"
   ```

## 🚀 Post-Deployment Checklist

After deploying to Railway:

- [ ] Check build logs for "✅ Database migrations completed successfully!"
- [ ] Test login at `/admin/login`
- [ ] Create test blog post with image upload
- [ ] Place test order and verify address is saved
- [ ] Access `/admin/orders` and verify orders appear
- [ ] Try printing a test shipping label
- [ ] Configure Stripe production webhook
- [ ] Test complete checkout flow

## 📱 Admin Features Available

Once deployed, admins can:

1. **Blog Management** (`/admin/blog`):
   - Create posts with image uploads
   - Manage drafts and published posts
   - Add categories and tags
   - SEO optimization fields

2. **Order Management** (`/admin/orders`):
   - View all orders with full addresses
   - Filter by status (completed/pending)
   - Print 4x6 shipping labels
   - Bluetooth or USB printing

3. **Dashboard** (`/admin/dashboard`):
   - Overview of site statistics
   - Recent orders
   - Quick actions

## 💡 Best Practices

1. **Always set DATABASE_URL first** before deploying
2. **Test migrations locally** before deploying to Railway
3. **Keep Prisma schema in sync** with your database
4. **Monitor build logs** for migration errors
5. **Have printer ready** before trying to print labels
6. **Use HTTPS** for all features to work (Railway provides this)

## 🎓 Advanced: Manual Migration Commands

If you need to run migrations manually:

```bash
# Connect to Railway
railway link

# Generate Prisma Client
railway run npx prisma generate

# Apply migrations
railway run npx prisma migrate deploy

# View database
railway run npx prisma studio

# Create new migration (local dev)
npx prisma migrate dev --name description_of_change
```

## 📞 Need Help?

- Check build logs in Railway Dashboard
- Review `DEPLOYMENT_READY.md` for detailed setup
- Test printer locally first before production
- Verify all environment variables are set

---

**Your app is now production-ready with auto-migrations!** 🎉

Just push to GitHub, and Railway handles the rest - including database migrations!
