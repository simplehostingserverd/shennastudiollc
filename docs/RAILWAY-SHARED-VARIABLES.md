# Railway Shared Variables Guide

## 🎯 Using Service References for Backend-Frontend Connection

Railway allows you to **reference variables from other services** using the syntax: `${{ServiceName.VARIABLE_NAME}}`

This is the **best practice** for connecting frontend to backend because:
- ✅ No hardcoding URLs
- ✅ Automatic updates when backend changes
- ✅ Works across environments
- ✅ Type-safe references

---

## 🚀 How to Use Service References

### Step 1: Find Your Backend Service Name

**In Railway Dashboard:**

1. Go to your **Backend Service**
2. Look at the **service name** (top of page or in sidebar)
3. Common names:
   - `Medusa Backend`
   - `medusa-backend`
   - `backend`
   - Whatever you named it during creation

**Important:** The service name in Railway might have spaces - Railway will automatically handle this.

### Step 2: Get Backend's Public URL Variable

Railway automatically creates a `RAILWAY_PUBLIC_DOMAIN` variable for each service with a public domain.

**Backend automatically has:**
```
RAILWAY_PUBLIC_DOMAIN=medusa-backend-production.up.railway.app
```

### Step 3: Add Service Reference to Frontend

**In Frontend Service → Variables:**

Instead of hardcoding:
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa-backend-production.up.railway.app
```

Use a **service reference**:
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{Medusa Backend.RAILWAY_PUBLIC_DOMAIN}}
```

OR if your service name is `medusa-backend`:
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{medusa-backend.RAILWAY_PUBLIC_DOMAIN}}
```

---

## 📋 Complete Frontend Variables Using Service References

### In Railway Frontend Service → Variables Tab:

```bash
# Backend Connection (Using Service Reference)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{Medusa Backend.RAILWAY_PUBLIC_DOMAIN}}

# OR if backend service is named "backend":
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}

# OR if backend service is named "medusa-backend":
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{medusa-backend.RAILWAY_PUBLIC_DOMAIN}}


# Publishable Key (still need to get from admin panel)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01JQXXXXXXXXXXXXXXXXXXX


# NextAuth Configuration
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}


# Stripe Keys
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMqYouB5PBrSK8udOL1PcTXM6J4rGqIKnA75jTTBOGqkMGKIDRnqOSxIK4BakHFUFXK9Bd0TTGB00VoS4YZTX


# Server Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
HOSTNAME=0.0.0.0
PORT=3000
```

---

## 🎨 Visual Guide: Adding Service Reference

### In Railway Dashboard:

```
┌─────────────────────────────────────────────────────┐
│ Frontend Service → Variables                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Variable Name:                                      │
│ NEXT_PUBLIC_MEDUSA_BACKEND_URL                     │
│                                                     │
│ Variable Value:                                     │
│ https://${{Medusa Backend.RAILWAY_PUBLIC_DOMAIN}}  │
│                                                     │
│ [Add]                                               │
│                                                     │
│ ✅ This creates a reference to the backend service │
│    Railway will automatically resolve it to:       │
│    https://medusa-backend-production.up.railway.app│
└─────────────────────────────────────────────────────┘
```

---

## 🔍 How to Find Your Service Name

### Method 1: Check Service List

1. Go to Railway Project
2. Look at the list of services in the left sidebar
3. The **exact name** you see is what you use in `${{ServiceName.VARIABLE}}`

### Method 2: Check Service Settings

1. Click on Backend Service
2. Click **Settings** tab
3. At the top, you'll see "Service Name"
4. Use that exact name (Railway handles spaces automatically)

### Method 3: Check Deployment Variables

1. Go to Backend Service
2. Click **Variables** tab
3. You'll see a list of available variables
4. Look for `RAILWAY_PUBLIC_DOMAIN` - this is what you'll reference

---

## 📖 Service Reference Syntax

### Basic Format:
```bash
${{ServiceName.VARIABLE_NAME}}
```

### Examples:

**If backend service is named "Medusa Backend":**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{Medusa Backend.RAILWAY_PUBLIC_DOMAIN}}
```

**If backend service is named "backend":**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

**If backend service is named "medusa-backend":**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{medusa-backend.RAILWAY_PUBLIC_DOMAIN}}
```

**Using custom domain (if backend has BACKEND_URL variable):**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Medusa Backend.BACKEND_URL}}
```

---

## 🔗 Common Service Reference Patterns

### Backend → Database:
```bash
# In Backend Service Variables:
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

### Frontend → Backend:
```bash
# In Frontend Service Variables:
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{Medusa Backend.RAILWAY_PUBLIC_DOMAIN}}
```

### Using Your Own Domain Variable:
```bash
# In Backend Service Variables, you can set:
BACKEND_URL=https://api.shennastudio.com

# Then in Frontend Service Variables:
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Medusa Backend.BACKEND_URL}}
```

---

## ✅ Benefits of Service References

### 1. **No Hardcoding**
- URLs are dynamic and update automatically
- Works in all environments (staging, production)

### 2. **Easy Environment Management**
- Change backend domain → Frontend automatically updates
- No need to update multiple places

### 3. **Type Safety**
- Railway validates that the service and variable exist
- Errors if you reference non-existent service/variable

### 4. **Preview Deployments**
- Railway automatically creates correct references for PR previews
- Each preview gets its own isolated environment

---

## 🚨 Troubleshooting

### Issue: "Variable not found" or reference doesn't resolve

**Possible Causes:**
1. Service name is incorrect (check exact spelling and case)
2. Referenced variable doesn't exist in target service
3. Services are in different projects (references only work within same project)

**How to Fix:**
1. **Verify Service Name:**
   - Go to Railway Project
   - Check exact service name in sidebar
   - Use that exact name (including spaces if any)

2. **Verify Variable Exists:**
   - Go to Backend Service → Variables
   - Confirm `RAILWAY_PUBLIC_DOMAIN` exists
   - Or check if you're referencing the correct variable name

3. **Check Service Reference Format:**
   ```bash
   # WRONG (missing dollar sign and braces)
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=Medusa Backend.RAILWAY_PUBLIC_DOMAIN
   
   # CORRECT
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{Medusa Backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

### Issue: Reference resolves but URL is wrong

**Check:**
1. Does backend have a public domain? (Check Settings → Networking)
2. Is `RAILWAY_PUBLIC_DOMAIN` set? (Check Variables tab)
3. Are you adding `https://` prefix correctly?

### Issue: CORS errors after using service reference

**This is expected!** Now you need to update backend CORS:

**In Backend Service → Variables:**
```bash
# Add your frontend's Railway domain
STORE_CORS=https://${{Frontend.RAILWAY_PUBLIC_DOMAIN}},https://shennastudio.com,https://www.shennastudio.com
```

OR if you know the frontend domain:
```bash
STORE_CORS=https://frontend-production.up.railway.app,https://shennastudio.com,https://www.shennastudio.com
```

---

## 🎯 Recommended Variable Setup

### Backend Service Variables:
```bash
# Database (auto-set by addons)
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}

# Secrets (generate with openssl rand -base64 32)
JWT_SECRET=<generated-secret>
COOKIE_SECRET=<generated-secret>

# Admin
ADMIN_EMAIL=admin@shennastudio.com
ADMIN_PASSWORD=<secure-password>

# CORS - Include frontend Railway domain
STORE_CORS=https://frontend-production.up.railway.app,https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://frontend-production.up.railway.app,https://shennastudio.com,https://www.shennastudio.com

# Server
NODE_ENV=production
PORT=9000
```

### Frontend Service Variables:
```bash
# Backend Connection (SERVICE REFERENCE)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${{Medusa Backend.RAILWAY_PUBLIC_DOMAIN}}

# Publishable Key (from admin panel)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01JQXXXXXXXXXXXXXXXXXXX

# NextAuth
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Stripe
STRIPE_SECRET_KEY=sk_live_51RdPwMP4GPds5FMq...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMq...

# Server
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
HOSTNAME=0.0.0.0
PORT=3000
```

---

## 📝 Step-by-Step: Setting Up Service References

### 1. Backend Service Setup (Do This First)
1. Deploy backend with all required variables
2. Verify backend is healthy: `curl https://backend.railway.app/health`
3. Note the backend service name in Railway sidebar

### 2. Frontend Service Setup (Do This Second)
1. Go to Frontend Service → Variables tab
2. Click "+ New Variable"
3. **Name:** `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
4. **Value:** `https://${{YOUR-BACKEND-SERVICE-NAME.RAILWAY_PUBLIC_DOMAIN}}`
   - Replace `YOUR-BACKEND-SERVICE-NAME` with actual backend service name
   - Keep the `${{` and `}}` exactly as shown
5. Add other required variables
6. Deploy frontend
7. Verify connection works

### 3. Update Backend CORS (Do This Third)
1. Get frontend's Railway domain
2. Go to Backend Service → Variables
3. Update `STORE_CORS` to include frontend domain:
   ```bash
   STORE_CORS=https://frontend-production.up.railway.app,https://shennastudio.com
   ```
4. Redeploy backend
5. Test frontend can fetch from backend (no CORS errors)

---

## 🎉 Success Checklist

- [ ] Backend service deployed and healthy
- [ ] Backend service name identified
- [ ] Frontend variable `NEXT_PUBLIC_MEDUSA_BACKEND_URL` uses service reference
- [ ] Service reference syntax is correct: `${{ServiceName.VARIABLE}}`
- [ ] Frontend deploys successfully
- [ ] Frontend can fetch data from backend
- [ ] No CORS errors in browser console
- [ ] Backend STORE_CORS includes frontend domain

---

## 📚 Related Documentation

- [RAILWAY-CONNECT-FRONTEND-BACKEND.md](./RAILWAY-CONNECT-FRONTEND-BACKEND.md) - Full connection guide
- [RAILWAY-VARIABLES-QUICK-REFERENCE.md](./RAILWAY-VARIABLES-QUICK-REFERENCE.md) - Variable reference
- [Railway Service Variables Docs](https://docs.railway.com/guides/variables#referencing-another-services-variable) - Official docs

---

**Last Updated:** 2025-01-07  
**Railway Platform:** v2  
**Service Reference Format:** `${{ServiceName.VARIABLE_NAME}}`
