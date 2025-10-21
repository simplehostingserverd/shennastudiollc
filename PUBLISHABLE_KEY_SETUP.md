# Medusa Publishable API Key Setup

## 🔑 Issue Found

Your backend is requiring a **publishable API key** for storefront requests:

```
"Publishable API key required in the request header: x-publishable-api-key"
```

This is a Medusa v2 security feature that ensures only authorized frontends can access the store API.

## 🎯 What You Need To Do

### Step 1: Create Publishable API Key in Medusa Admin

1. **Access the Admin Panel**:
   ```
   https://backend-production-38d0a.up.railway.app/app
   ```

2. **Login** with your admin credentials:
   - Email: (your ADMIN_EMAIL from backend variables)
   - Password: (your ADMIN_PASSWORD from backend variables)

3. **Navigate to Settings**:
   - Click on **Settings** in the left sidebar
   - Go to **Publishable API Keys**
   - Click **Create Key** or **Add Key**

4. **Create the Key**:
   - Name: `Shenna Studio Storefront` (or any descriptive name)
   - Click **Save** or **Create**

5. **Copy the Key**:
   - Copy the generated key (starts with `pk_`)
   - It will look like: `pk_01ABCDEFGHIJKLMNOPQRSTUVWXYZ`

### Step 2: Add Key to Frontend Environment Variables

```bash
railway variables --service Storefront \
  --set "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_YOUR_KEY_HERE"
```

Replace `pk_YOUR_KEY_HERE` with the actual key you copied.

### Step 3: Redeploy Frontend

After adding the key, trigger a redeploy:

```bash
git commit --allow-empty -m "chore: add publishable API key"
git push origin main
```

Or redeploy from Railway dashboard.

## 🔍 Alternative: Check if Key Already Exists

If you can't access the admin panel, you might need to check the database or logs for an existing key.

### Query the Database (if you have access):

```sql
-- Connect to your PostgreSQL database
SELECT * FROM publishable_api_key;
```

## ⚡ Quick Test After Setup

Once the key is added and frontend is redeployed, test:

```bash
curl -H "x-publishable-api-key: pk_YOUR_KEY_HERE" \
  https://backend-production-38d0a.up.railway.app/store/products
```

Should return products JSON.

## 🛟 Troubleshooting

### Can't Access Admin Panel

If you can't login to the admin panel:

1. **Check if admin user exists**:
   - Run backend migration: `railway run --service Backend npx medusa db:migrate`
   - Create admin: `railway run --service Backend npm run create-admin`

2. **Check backend logs**:
   ```bash
   railway logs --service Backend
   ```

3. **Verify backend is running**:
   ```bash
   curl https://backend-production-38d0a.up.railway.app/health
   ```

### Alternative: Disable Publishable Key Requirement (Not Recommended for Production)

If you need a temporary workaround, you can disable this in Medusa config, but it's not recommended:

In `backend/medusa-config.ts`, you might be able to configure this, but the better solution is to create the key properly.

## 📚 More Info

- [Medusa Publishable API Keys Docs](https://docs.medusajs.com/api/store)
- Publishable keys allow you to:
  - Restrict frontend access
  - Track API usage
  - Configure regions and sales channels
  - Manage multiple storefronts

## ✅ Expected Result

After setup:
1. ✅ Backend URL: `https://backend-production-38d0a.up.railway.app`
2. ✅ Valid SSL certificate (Railway domain)
3. ✅ Publishable API key configured
4. ✅ Products loading on `https://www.shennastudio.com/products`
