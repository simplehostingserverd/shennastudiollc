# Railway Production Deployment - Shenna's Studio

## ✅ Configuration Complete

Your application is ready for Railway production deployment with custom domain `shennastudio.com`.

## 🚀 Deployment Steps

### Step 1: Upload Environment Variables

1. Open Railway Dashboard:
   ```bash
   railway open
   ```

2. Create your application service (if not exists)
3. Upload `railway-env-variables.json` in the Variables tab

### Step 2: Add Database Services

1. Click "+ New Service" → PostgreSQL
2. Click "+ New Service" → Redis

### Step 3: Configure Custom Domains

In Railway dashboard, configure these domains:

#### Main Application (Frontend + Backend Combined)
- **Service**: Your main application
- **Domain**: `shennastudio.com`
- **Also add**: `www.shennastudio.com`

Railway will provide DNS records to add to your domain registrar.

### Step 4: Update DNS Records

Add these records to your domain registrar (e.g., Cloudflare, GoDaddy):

```
Type: CNAME
Name: @ (or shennastudio.com)
Value: <railway-provided-value>

Type: CNAME
Name: www
Value: <railway-provided-value>
```

### Step 5: Update Environment Variables After Domain Setup

Once Railway assigns your custom domain, update:

```bash
railway variables --set "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://shennastudio.com"
railway variables --set "STORE_CORS=https://shennastudio.com,https://www.shennastudio.com"
railway variables --set "ADMIN_CORS=https://shennastudio.com,https://www.shennastudio.com"
railway variables --set "AUTH_CORS=https://shennastudio.com,https://www.shennastudio.com"
```

### Step 6: Deploy

```bash
railway up
```

Or connect your GitHub repository for automatic deployments.

## 🌐 Your Production URLs

After deployment:

- **Frontend**: https://shennastudio.com
- **Backend API**: https://shennastudio.com (same server, different routes)
- **Admin Panel**: https://shennastudio.com:9000/app

**Note**: Both frontend and backend run on the same Railway service. The backend API routes are accessible at the same domain.

## 🔧 Environment Variables Configured

Your `railway-env-variables.json` includes:

✅ Node.js 20 environment
✅ Database connection (PostgreSQL reference)
✅ Redis connection (Redis reference)
✅ Secure JWT and Cookie secrets
✅ CORS configuration for shennastudio.com
✅ Auto-migration enabled
✅ Auto-admin creation enabled
✅ Stripe integration (update keys before going live!)

## ⚠️ Before Going Live

### 1. Update Stripe Keys

Replace test keys with production:

```bash
railway variables --set "STRIPE_SECRET_KEY=sk_live_your_production_key"
railway variables --set "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key"
```

### 2. Verify SSL Certificate

Railway automatically provisions SSL certificates. Verify at: https://shennastudio.com

### 3. Test Payment Flow

- Test checkout process
- Verify Stripe webhooks
- Test order confirmation emails

### 4. Configure Stripe Webhooks

In Stripe Dashboard, add webhook:
- URL: `https://shennastudio.com/webhooks/stripe`
- Events: `payment_intent.succeeded`, `checkout.session.completed`

## 📊 Production Checklist

- [ ] PostgreSQL service added
- [ ] Redis service added
- [ ] Environment variables uploaded
- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] SSL certificate verified
- [ ] Stripe keys updated to production
- [ ] Stripe webhooks configured
- [ ] Test order placed successfully
- [ ] Admin panel accessible
- [ ] Payment processing verified

## 🔐 Access Your Admin Panel

URL: https://shennastudio.com:9000/app

Credentials (from CREDENTIALS.txt):
- Email: admin@shennasstudio.com
- Password: (see CREDENTIALS.txt)

## 📈 Monitoring

### View Logs
```bash
railway logs
```

### Check Service Status
```bash
railway status
```

### Monitor Performance
- Railway dashboard provides metrics
- Set up alerts for downtime
- Monitor database usage

## 💰 Cost Management

Expected monthly costs:
- PostgreSQL: ~$5-10
- Redis: ~$5-10
- Compute: ~$10-30
- **Total**: ~$20-50/month

## 🛠️ Maintenance

### Update Application
```bash
git push origin main  # If using GitHub auto-deploy
# or
railway up  # Manual deployment
```

### Database Migrations
Migrations run automatically on deployment (AUTO_MIGRATE=true).

Manual migration:
```bash
railway run npx medusa db:migrate
```

### Backup Database
Railway PostgreSQL includes automatic daily backups.

Manual backup:
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

## 🔄 Rollback Deployment

If issues occur:

1. Go to Railway dashboard → Deployments
2. Find previous successful deployment
3. Click "Redeploy"

## 🆘 Troubleshooting

### Frontend Not Loading
- Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` is correct
- Verify DNS propagation: `dig shennastudio.com`
- Check deployment logs: `railway logs`

### Backend API Errors
- Verify PostgreSQL service is running
- Check Redis connection
- Verify environment variables are set

### Admin Panel 404
- Confirm backend is running on port 9000
- Check `/app` path (NOT `/admin`)
- Verify `DISABLE_ADMIN=false`

### Stripe Integration Issues
- Verify webhook URL is correct
- Check Stripe keys are production keys
- Test in Stripe test mode first

## 📞 Support

- **Railway**: https://discord.gg/railway
- **Medusa**: https://discord.gg/medusajs
- **Docs**: See README.md files in project

## 🎯 Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Add products in admin panel
3. ✅ Configure shipping rates
4. ✅ Set up email templates
5. ✅ Enable Google Analytics (optional)
6. ✅ Configure Cloudinary for images (optional)
7. ✅ Set up Algolia search (optional)

---

**Your Shenna's Studio is ready for production!** 🌊

Deploy with: `railway up`
