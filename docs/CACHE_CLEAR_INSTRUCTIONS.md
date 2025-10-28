# Clear Browser Cache - Complete Guide

## 🚨 Problem: You're Viewing Old Cached Files

The error shows JavaScript file names like `page-7a4f1434714bdb78.js` which are from the OLD build. Even though Railway has deployed the new code, your browser is serving cached files.

## ✅ Solution: Aggressive Cache Clearing

### Method 1: Hard Refresh (Try First)

**Chrome/Edge (Mac):**
```
Cmd + Shift + R
```

**Chrome/Edge (Windows/Linux):**
```
Ctrl + Shift + R
```

**Safari (Mac):**
```
Cmd + Option + E (clears cache)
Then: Cmd + R (reloads page)
```

**Firefox:**
```
Ctrl + Shift + R (Mac: Cmd + Shift + R)
```

### Method 2: Clear Browsing Data (Recommended)

**Chrome/Edge:**
1. Press `Cmd + Shift + Delete` (Mac) or `Ctrl + Shift + Delete` (Windows)
2. Select "Cached images and files"
3. Time range: "Last hour" or "All time"
4. Click "Clear data"
5. Reload: https://www.shennastudio.com/products

**Safari:**
1. Go to Safari → Settings → Privacy
2. Click "Manage Website Data"
3. Search for "shennastudio.com"
4. Click "Remove" then "Done"
5. Reload the page

**Firefox:**
1. Press `Cmd + Shift + Delete` (Mac) or `Ctrl + Shift + Delete` (Windows)
2. Select "Cache"
3. Click "Clear Now"
4. Reload the page

### Method 3: Disable Cache in DevTools (Best for Testing)

**All Browsers:**
1. Open DevTools (F12 or Right-click → Inspect)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open
5. Reload: https://www.shennastudio.com/products

### Method 4: Private/Incognito Window (Guaranteed Fresh)

**Chrome/Edge:**
```
Cmd + Shift + N (Mac)
Ctrl + Shift + N (Windows)
```

**Safari:**
```
Cmd + Shift + N
```

**Firefox:**
```
Cmd + Shift + P (Mac)
Ctrl + Shift + P (Windows)
```

Then visit: https://www.shennastudio.com/products

This **guarantees** you get the latest version with no cache.

## 🔍 How to Verify You Have the New Build

### Check 1: JavaScript File Names Should Change

**Old build:**
```
page-7a4f1434714bdb78.js
page-01463d873434819e.js
```

**New build:** Different hash (e.g., `page-abc123def456.js`)

### Check 2: Check Network Tab

1. Open DevTools → Network tab
2. **Enable "Disable cache"**
3. Reload page
4. Filter by "products"
5. Click on the request to `/store/products`
6. Look at **Request Headers**

**Should include:**
```
x-publishable-api-key: pk_0d09b1d40eac8fdcc445d4438066b292df69c5c48ee41b8b5bd74f926778a0e3
```

**If missing:** You're still on old build - clear cache again

### Check 3: Build Time

Visit: https://www.shennastudio.com/api/env-check

Current build should show time AFTER: `2025-10-09T08:09:47.799Z`

Latest commit was pushed at approximately: `08:10 UTC`

## 🎯 Expected Behavior After Cache Clear

### Before (Old Build - Cached):
- ❌ Error: "Publishable API key required"
- ❌ Products don't load
- ❌ Network tab: NO `x-publishable-api-key` header

### After (New Build - Fresh):
- ✅ No publishable key errors
- ✅ Products load successfully
- ✅ Network tab: HAS `x-publishable-api-key` header

## 🐛 Still Not Working?

### Step 1: Force Railway to Serve New Build

The buildTime shows the deployment from 08:09, but we need the one from 08:10+.

Check if a newer deployment exists:
```bash
railway logs --service Storefront --lines 20
```

Look for "Starting Next.js server" with a recent timestamp.

### Step 2: Verify Request in Browser

1. Open DevTools → Network tab
2. **Check "Disable cache"** ← CRITICAL
3. Reload page
4. Click on `/store/products` request
5. Check Headers tab → Request Headers
6. Should show: `x-publishable-api-key: pk_0d09b1d40...`

### Step 3: Test Direct API Call

Open browser console and paste:

```javascript
fetch('https://backend-production-38d0a.up.railway.app/store/products?limit=1', {
  headers: {
    'x-publishable-api-key': 'pk_0d09b1d40eac8fdcc445d4438066b292df69c5c48ee41b8b5bd74f926778a0e3'
  }
})
.then(r => r.json())
.then(d => console.log('Products:', d))
```

This should return products. If this works but the page doesn't, it's definitely a cache issue.

## 📱 Alternative: Test on Different Device

If available, try on:
- Your phone (different device, no cache)
- Different browser (Firefox, Safari, Edge)
- Ask someone else to visit the site

This confirms if the issue is local cache or actual deployment.

## ⚡ Nuclear Option: Clear Everything

If nothing else works:

**Chrome/Edge:**
1. Go to: `chrome://settings/clearBrowserData` (or `edge://settings/clearBrowserData`)
2. Select "All time"
3. Check ALL boxes
4. Click "Clear data"
5. Close and reopen browser
6. Visit site in **incognito mode**

## 🎯 Success Checklist

When cache is properly cleared:

- [ ] JavaScript file names are different (not `page-7a4f1434714bdb78.js`)
- [ ] `/api/env-check` shows buildTime AFTER 08:09:47
- [ ] Network tab shows `x-publishable-api-key` in request headers
- [ ] No "Publishable API key required" errors in console
- [ ] Products page loads successfully

## ⏰ Current Status

- ✅ Code fix committed and pushed (08:10 UTC)
- ✅ Railway deployed (08:09 build visible)
- ✅ `/api/env-check` confirms publishable key is loaded
- ⏳ Waiting for Railway to deploy latest commit
- ⏳ Browser needs aggressive cache clear

## 🚀 What to Do RIGHT NOW

1. **Open an Incognito/Private window** ← Do this first
2. Visit: https://www.shennastudio.com/products
3. Open DevTools → Network tab
4. Check if `x-publishable-api-key` header is present

If it works in incognito but not in regular browser = cache issue
If it doesn't work in incognito = Railway hasn't deployed latest yet (wait 2 more minutes)
