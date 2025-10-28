# Frontend Redeploy Instructions

## ✅ Variables Updated Successfully!

The frontend environment variable has been updated:
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-38d0a.up.railway.app
```

## 🚀 How to Redeploy

You need to redeploy the frontend for the changes to take effect. Choose one of these methods:

### Method 1: Railway Dashboard (Easiest)

1. Go to: https://railway.app/project/577d2457-301e-4c33-a951-bf90a33f0c9c
2. Click on the **Storefront** service
3. Go to the **Deployments** tab
4. Click the **⋮** (three dots) menu on the latest deployment
5. Click **Redeploy**

### Method 2: Trigger via Git Push (Recommended)

```bash
# Make a small change to trigger rebuild
cd frontend
git commit --allow-empty -m "chore: redeploy frontend with updated backend URL"
git push origin main
```

Railway will automatically detect the push and redeploy.

### Method 3: Railway CLI Upload

```bash
cd frontend
railway up --service Storefront
```

Note: This might take a while as it uploads all files.

## 🧪 After Redeployment

Once the deployment completes (usually 2-5 minutes):

1. Visit: https://www.shennastudio.com/products
2. Products should now load from: `https://backend-production-38d0a.up.railway.app`
3. Check browser console - SSL errors should be gone

## 🔍 Verify Backend is Working

Test the backend endpoint directly:
```bash
curl https://backend-production-38d0a.up.railway.app/store/products?limit=5
```

Should return JSON with products.

## ✅ What Was Fixed

- ❌ **Before**: `NEXT_PUBLIC_MEDUSA_BACKEND_URL` pointed to `api.shennastudio.com` (SSL certificate invalid)
- ✅ **After**: `NEXT_PUBLIC_MEDUSA_BACKEND_URL` points to `backend-production-38d0a.up.railway.app` (valid SSL)

## 🛟 Troubleshooting

If products still don't load after redeployment:

1. **Check deployment logs**:
   ```bash
   railway logs --service Storefront
   ```

2. **Verify the variable is in the build**:
   - Look for `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in deployment logs
   - Next.js embeds these at build time

3. **Hard refresh your browser**:
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`

4. **Check backend is responding**:
   ```bash
   curl https://backend-production-38d0a.up.railway.app/health
   ```

## 📝 Next Steps After Products Load

Once products are loading correctly, consider:

1. **Set up custom domain with valid SSL** for backend (optional)
2. **Add products** via admin panel at: https://backend-production-38d0a.up.railway.app/app
3. **Test checkout flow** end-to-end
4. **Configure Stripe** for payments (if not already done)
