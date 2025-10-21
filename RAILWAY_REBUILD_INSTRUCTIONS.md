# Railway Rebuild Instructions - Fix 404 Errors

## Problem
The website is showing 404 errors for all static assets because **Railway hasn't rebuilt the application** with the new code changes. The `.next` build directory is not committed to Git (it's in `.gitignore`), so Railway must rebuild on their servers.

## Solution: Trigger Railway Rebuild

### Method 1: Via Railway Dashboard (Easiest)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Log in to your account

2. **Find Your Frontend Service**
   - Navigate to your project: `shennastudiollc`
   - Click on the **Frontend** service

3. **Trigger Manual Deploy**
   - Click on the **"Deployments"** tab
   - Click **"Deploy"** button in top right
   - Or click on the latest deployment and select **"Redeploy"**

4. **Watch Build Logs**
   - Monitor the build process
   - Look for "npm run build" completing successfully
   - Wait for deployment to finish (~3-5 minutes)

### Method 2: Via Git Push (What We'll Do)

Railway auto-deploys when you push to the `main` branch. We've already pushed the fixes, but let's force a rebuild:

```bash
# Already done - these changes force Railway to rebuild:
git push origin main
```

The `.rebuild-trigger` file has been updated to force a fresh build.

### Method 3: Via Railway CLI (Advanced)

If you have Railway CLI installed:

```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Select the frontend service
railway service

# Trigger redeploy
railway up
```

## Verification Steps

After Railway finishes rebuilding (wait 3-5 minutes):

### 1. Check Build Logs

In Railway Dashboard:
- Go to your Frontend service
- Click "Deployments"
- Click the latest deployment
- Check logs for:
  ```
  ✓ Compiled successfully
  ✓ Generating static pages
  Route (app)                    Size     First Load JS
  ✓ Finalizing page optimization
  ```

### 2. Test the Website

Open your browser:

1. **Clear browser cache**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Visit**: https://shennastudio.com
3. **Open Developer Console**: F12 or Right-click → Inspect
4. **Check Network tab**:
   - Look for `_next/static/` files
   - All should return `200 OK` (not `404`)
   - Check Content-Type headers:
     - JS files: `application/javascript`
     - CSS files: `text/css`

### 3. Verify No Errors

In the browser console, you should NOT see:
- ❌ Failed to load resource: 404
- ❌ Refused to execute... MIME type errors

You SHOULD see:
- ✅ Page loads normally with all styles
- ✅ All JavaScript executes
- ✅ No console errors

## Troubleshooting

### If Railway Build Fails

Check the build logs for errors. Common issues:

**1. Environment Variables Missing**
```bash
# Make sure these are set in Railway:
NEXT_PUBLIC_MEDUSA_BACKEND_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# ... etc
```

**2. Node Version Issues**
Railway should use Node 20. Check `nixpacks.toml`:
```toml
nixPkgs = ["nodejs_20", "openssl"]
```

**3. Build Timeout**
If build times out, increase timeout in Railway settings:
- Go to service settings
- Increase "Build timeout" to 15-20 minutes

### If 404 Errors Persist After Rebuild

1. **Check Railway Logs**:
   ```
   railway logs
   ```
   Look for the startup message showing it found `server.js`

2. **Verify Build Output**:
   In build logs, confirm:
   ```
   Route (app)                              Size  First Load JS
   ┌ ○ /                                 21.4 kB         143 kB
   ...
   ```

3. **Check Static Files Path**:
   Railway should serve files from `.next/static/`. The start script will show:
   ```
   ✅ Found server.js in .next/standalone
   ```

4. **Clear CDN Cache** (if using Cloudflare):
   - Go to Cloudflare dashboard
   - Navigate to Caching
   - Click "Purge Everything"

### If Still Having Issues

**Check these in Railway Dashboard:**

1. **Build Command** (should be):
   ```
   node check-env.js && npm run build
   ```

2. **Start Command** (should be):
   ```
   bash railway-start.sh
   ```

3. **Root Directory** (should be):
   ```
   /frontend
   ```

4. **Environment** (check these variables exist):
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
   - All other `NEXT_PUBLIC_*` variables

## Current Deployment Status

✅ **Code Changes Pushed**: All fixes are in GitHub `main` branch
⏳ **Railway Rebuild**: Waiting for automatic rebuild to complete
⏳ **Deployment**: Will be live after Railway finishes building

**What's Been Fixed:**
1. ✅ MIME type configuration corrected
2. ✅ Static asset headers fixed
3. ✅ Bot protection middleware added
4. ✅ Security vulnerabilities patched
5. ✅ Next.js configuration optimized
6. ✅ Build trigger file updated

**What Railway Needs to Do:**
1. Detect the git push
2. Pull latest code from GitHub
3. Run `npm install`
4. Run `npm run build` (creates `.next` directory)
5. Start server with `railway-start.sh`
6. Serve the newly built static files

## Expected Timeline

- **Git Push**: ✅ Completed
- **Railway Detection**: ~1 minute
- **Build Process**: ~5-10 minutes
  - Install dependencies: ~2-3 minutes
  - Build application: ~2-3 minutes
  - Deploy: ~1-2 minutes
- **Total**: **~5-15 minutes from push**

## Monitoring

**Watch your Railway dashboard to see:**
1. New deployment starting
2. Build logs showing progress
3. Deployment status changing to "Success"
4. Service becoming "Active"

Once you see "Active" status, refresh your website and the 404 errors should be gone!

---

**Need More Help?**

If Railway doesn't auto-deploy after 15 minutes, use **Method 1** above to manually trigger a deployment from the Railway dashboard.
