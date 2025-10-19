# 🔐 Admin Panel Credentials - KEEP THIS SECURE!

## Admin Login Information

**Admin Panel URL:** `https://yourdomain.com/admin/login`

**Email:** `shenna@shennastudio.com`

**Password:** `Shenna2025!OceanConservation#Admin`

**Password Hash (for database):** `$2b$10$2HnC5skamI/SmYNkWhDD4eoHJ3CL5eL2Q2OmqZeFk1NXHxoO7or2K`

---

## ⚠️ IMPORTANT: Create Admin User in Database

You must run this SQL command to create your admin account:

```sql
-- Connect to your database first, then run:

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_shenna_2025',
  'shenna@shennastudio.com',
  'Shenna',
  '$2b$10$2HnC5skamI/SmYNkWhDD4eoHJ3CL5eL2Q2OmqZeFk1NXHxoO7or2K',
  'admin',
  NOW(),
  NOW()
);
```

---

## 📋 Setup Steps

### Step 1: Apply Database Migrations
```bash
cd frontend
npx prisma db push
```

### Step 2: Create Admin User

**Option A - Using psql:**
```bash
# Connect to your database
psql $DATABASE_URL

# Then paste the INSERT statement above
```

**Option B - Using Prisma Studio:**
```bash
cd frontend
npx prisma studio
```
Then manually create a User with:
- Email: shenna@shennastudio.com
- Password: $2b$10$2HnC5skamI/SmYNkWhDD4eoHJ3CL5eL2Q2OmqZeFk1NXHxoO7or2K
- Role: admin
- Name: Shenna

**Option C - Using Node Script:**

Create a file `create-admin.js` in the frontend folder:

```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.create({
    data: {
      id: 'admin_shenna_2025',
      email: 'shenna@shennastudio.com',
      name: 'Shenna',
      password: '$2b$10$2HnC5skamI/SmYNkWhDD4eoHJ3CL5eL2Q2OmqZeFk1NXHxoO7or2K',
      role: 'admin',
    },
  })
  console.log('✅ Admin user created:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Then run:
```bash
cd frontend
node create-admin.js
```

### Step 3: Login to Admin Panel

1. Navigate to: `https://yourdomain.com/admin/login` (or `http://localhost:3000/admin/login` for local)
2. Enter:
   - **Email:** shenna@shennastudio.com
   - **Password:** Shenna2025!OceanConservation#Admin
3. Click "Sign In"
4. You'll be redirected to the dashboard at `/admin/dashboard`

---

## 🎯 What You Can Do in Admin Panel

### Dashboard Features:
- ✅ View total affiliate links
- ✅ See active links count
- ✅ Track total clicks across all links
- ✅ Create new affiliate links
- ✅ Edit existing links
- ✅ Delete links
- ✅ Toggle links active/inactive
- ✅ View detailed analytics

### Managing Affiliate Links:

1. **Click "Add New Link"**
2. Fill in:
   - Title (e.g., "Amazon Jewelry Supplies")
   - Affiliate URL (your affiliate link)
   - Description (optional)
   - Placement (sidebar, footer, product-page, homepage)
   - Active toggle

3. Save and the link will appear on your site based on placement

---

## 🔒 Security Notes

### CRITICAL - DO THIS NOW:

1. **Delete this file after reading** - Contains sensitive credentials
2. **Change the password after first login** (we'll add password change feature)
3. **Never commit this file to GitHub**
4. **Store credentials in a password manager**

### Security Features Enabled:

- ✅ JWT authentication with 128-character secret
- ✅ HttpOnly cookies (prevents XSS)
- ✅ bcrypt password hashing (10 rounds)
- ✅ Role-based access control
- ✅ Secure session management (7-day expiry)
- ✅ CSRF protection via SameSite cookies

---

## 📱 Admin Panel Access

**Desktop:**
- Full dashboard with tables and analytics
- All CRUD operations
- Detailed click tracking

**Mobile:**
- Fully responsive design
- Touch-friendly buttons
- Optimized layout for small screens

---

## 🚨 Troubleshooting

### Can't Login?

1. **Check admin user exists:**
   ```sql
   SELECT * FROM "User" WHERE email = 'shenna@shennastudio.com';
   ```

2. **Verify role is 'admin':**
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'shenna@shennastudio.com';
   ```

3. **Clear browser cookies and try again**

4. **Check JWT_SECRET is set in .env**

### "Unauthorized" Error?

- Verify `.env` has `JWT_SECRET` set
- Check that you're using the correct email/password
- Try clearing cookies and logging in again

### Can't See Dashboard?

- Check console for JavaScript errors
- Verify you're being redirected to `/admin/dashboard`
- Check network tab for API errors

---

## 📞 Quick Reference

**Login URL:** `/admin/login`
**Dashboard URL:** `/admin/dashboard`
**Logout:** Click "Logout" button in dashboard

**Email:** shenna@shennastudio.com
**Password:** Shenna2025!OceanConservation#Admin

---

## 🔄 Next Steps After Login

1. Test creating an affiliate link
2. Add your first Amazon Associate link
3. Place affiliate component on product pages
4. Monitor clicks in dashboard
5. Expand to more affiliate programs

---

**REMINDER: DELETE THIS FILE AFTER SETTING UP YOUR ADMIN ACCOUNT!**
