# 🚂 Railway Deployment Quick Start

## Overview

Your Shenna's Studio application is now fully configured for Railway deployment!

## ✅ Completed Setup

- ✓ Node.js downgraded to v20.19.5 LTS (required for production)
- ✓ `.nvmrc` file created to lock Node.js version
- ✓ `railway.json` configured for Railway deployment
- ✓ `nixpacks.toml` configured for build process
- ✓ `Procfile` created as fallback
- ✓ `ecosystem.config.js` updated for PM2 process management
- ✓ Redis eviction policy fixed (all Docker Compose files)
- ✓ All linting errors resolved
- ✓ Application tested and running on Node.js 20

## 🚀 Deploy Now (3 Steps)

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
# or
brew install railway
```

### 2. Login & Initialize

```bash
railway login
railway init
```

### 3. Add Services & Deploy

1. **Add PostgreSQL**: In Railway dashboard → "+ New Service" → "PostgreSQL"
2. **Add Redis**: In Railway dashboard → "+ New Service" → "Redis"
3. **Set Environment Variables**: Copy from `.env.railway.template`
4. **Deploy**:
   ```bash
   railway up
   ```

## 📋 Required Environment Variables

Critical variables to set in Railway (see `.env.railway.template` for full list):

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<generate-with-openssl-rand-base64-48>
COOKIE_SECRET=<generate-with-openssl-rand-base64-48>
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<strong-password>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-key>
STRIPE_SECRET_KEY=<your-key>
```

## 🔧 Helper Script

Use the deployment helper script:

```bash
./railway-deploy.sh
```

This interactive script will:
- Check Railway CLI installation
- Verify login status
- Link/create project
- Guide you through deployment

## 📚 Full Documentation

For detailed instructions, see: **`RAILWAY_DEPLOYMENT.md`**

## 🌐 After Deployment

Your app will be available at:
- Frontend: `https://your-app.railway.app`
- Backend API: `https://your-app.railway.app:9000`
- Admin Panel: `https://your-app.railway.app:9000/app`

## 💰 Cost Estimate

Railway pricing (pay-as-you-go):
- **Hobby plan**: $5/month in credits (good for testing)
- **Production**: ~$20-50/month for typical workloads
- Includes: PostgreSQL, Redis, Compute, Network, Storage

## 🛠️ Useful Commands

```bash
railway logs              # View real-time logs
railway open              # Open dashboard
railway run <command>     # Run command in Railway env
railway variables         # Manage env variables
```

## 🆘 Troubleshooting

**Build fails?**
- Check `railway logs` for errors
- Verify Node.js version in `.nvmrc`

**Database connection issues?**
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running

**Redis warnings?**
- Ensure Redis service is added
- Verify `REDIS_URL` is configured

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Medusa Docs: https://docs.medusajs.com

---

**Ready to deploy?** Run `./railway-deploy.sh` or see `RAILWAY_DEPLOYMENT.md` for step-by-step guide!
