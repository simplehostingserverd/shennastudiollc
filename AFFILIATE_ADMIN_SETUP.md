# Affiliate Link System & Admin Panel - Production Guide

## 🚀 Production Features Implemented

### 1. **Admin Authentication System**
- Secure JWT-based authentication
- Production-ready 128-character secret key
- HttpOnly cookies for security
- 7-day session duration

### 2. **Admin Panel (Material-UI)**
- Modern, professional interface using MUI components
- Real-time dashboard with key metrics
- Full CRUD operations for affiliate links
- Click tracking analytics
- Responsive design for mobile and desktop

### 3. **Affiliate Link Management**
- Multiple placement options (sidebar, footer, product-page, homepage)
- Active/inactive status toggle
- Click tracking with analytics
- URL validation
- SEO-friendly with rel="sponsored" attribute

### 4. **SEO Optimizations**
- Dynamic sitemap.xml generation
- robots.txt configuration
- Product-level structured data (Schema.org)
- Enhanced meta tags for all product pages
- Open Graph tags for social sharing
- Canonical URLs
- Product schema with pricing and ratings

## 📋 Setup Instructions

### Step 1: Environment Variables

Add these to your production `.env` file:

```bash
# Admin Authentication - PRODUCTION SECRET (CHANGE THIS!)
JWT_SECRET=74a617d6607fe83d3b712b5cc34596b712b9c307a39830a193127f4937774711fabb95375b4367856f96c7a1ee664bb7f59e9ac16ec0b28acf01bbda8d17a62c

# Database URL (Required)
DATABASE_URL="postgresql://username:password@host:5432/database"

# Site URL
NEXT_PUBLIC_SITE_URL=https://shennastudio.com
```

### Step 2: Database Migration

Run Prisma migration to create all required tables:

```bash
cd frontend
npx prisma db push
```

This creates:
- `AffiliateLink` - Stores affiliate links and click tracking
- `AdPlacement` - For future ad management
- `ProductComment` - Customer feedback on products
- `User` (updated) - Added `role` field for admin access

### Step 3: Create Admin User

You need to create an admin user manually in your database:

```bash
# Connect to your PostgreSQL database
psql $DATABASE_URL

# Then run this SQL (replace with your email and hashed password):
```

```sql
-- First, generate a bcrypt hash for your password
-- Use: https://bcrypt-generator.com/ or run in Node.js:
-- const bcrypt = require('bcryptjs');
-- console.log(bcrypt.hashSync('YourSecurePassword123!', 10));

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@shennastudio.com',
  'Shenna Admin',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',  -- Replace with actual bcrypt hash
  'admin',
  NOW(),
  NOW()
);
```

**Generate password hash:**
```javascript
// Run this in Node.js
const bcrypt = require('bcryptjs');
const password = 'YourSecurePassword123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

### Step 4: Access Admin Panel

1. Navigate to: `https://yoursite.com/admin/login`
2. Login with your admin credentials
3. You'll be redirected to the dashboard

## 🎯 How to Use the Admin Panel

### Adding Affiliate Links

1. Go to `/admin/dashboard`
2. Click "Add New Link"
3. Fill in:
   - **Title**: Display name (e.g., "Amazon Jewelry Supplies")
   - **Affiliate URL**: Your affiliate link with tracking
   - **Description**: Optional description
   - **Placement**: Where it appears (sidebar, footer, product-page, homepage)
   - **Active**: Toggle to show/hide

4. Click "Create"

### Managing Links

- **Edit**: Click pencil icon to modify
- **Delete**: Click trash icon to remove
- **Toggle Active**: Edit link and change status
- **View Clicks**: See total clicks in the dashboard table

### Placement Options

- **sidebar**: Shows in sidebar sections (use AffiliateLinks component)
- **footer**: Display in footer area
- **product-page**: Show on individual product pages
- **homepage**: Feature on homepage

## 📊 Adding Affiliate Links to Pages

Use the `AffiliateLinks` component anywhere in your site:

```tsx
import AffiliateLinks from '@/app/components/AffiliateLinks'

// In your component:
<AffiliateLinks placement="sidebar" />
<AffiliateLinks placement="product-page" />
<AffiliateLinks placement="footer" />
```

The component:
- Fetches only active links for the specified placement
- Automatically tracks clicks
- Uses rel="sponsored" for SEO compliance
- Opens links in new tab
- Has built-in hover effects

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **HttpOnly Cookies**: Prevents XSS attacks
3. **Password Hashing**: bcrypt with 10 rounds
4. **Role-Based Access**: Only `role: 'admin'` can access
5. **API Route Protection**: All admin routes require authentication
6. **CSRF Protection**: SameSite cookie policy

## 📈 SEO Improvements

### Implemented:

1. **Dynamic Sitemap** (`/sitemap.xml`)
   - Auto-updates with new products
   - Includes all static pages
   - Proper change frequency and priority

2. **Robots.txt** (`/robots.txt`)
   - Blocks admin, API, checkout from crawlers
   - Points to sitemap

3. **Product Structured Data**
   - Schema.org Product markup
   - Price, availability, ratings
   - Brand information
   - Image data

4. **Meta Tags**
   - Unique title/description per product
   - Keywords optimization
   - Open Graph for social sharing
   - Canonical URLs

5. **Performance**
   - Rybbit analytics properly integrated
   - Next.js Script component for optimal loading

### SEO Best Practices for Jewelry Sites:

#### Keywords to Target:
- Ocean-inspired jewelry
- Handcrafted bracelets
- Marine conservation jewelry
- Beach-themed accessories
- Eco-friendly jewelry
- Coastal jewelry
- Nautical bracelets
- Sea turtle jewelry
- Ocean bracelet
- Sustainable handmade jewelry

#### Content Strategy:
1. Add blog posts about ocean conservation
2. Create jewelry care guides
3. Share customer stories
4. Behind-the-scenes crafting videos
5. Seasonal collections announcements

#### Link Building:
1. List on jewelry directories
2. Submit to "Made in USA" directories
3. Partner with ocean conservation organizations
4. Guest post on eco-friendly lifestyle blogs
5. Collaborate with ocean/beach influencers

## 🎨 Recommended Affiliate Programs for Jewelry Niche

1. **Amazon Associates**
   - Jewelry-making supplies
   - Packaging materials
   - Display stands

2. **ShareASale**
   - Jewelry brands
   - Craft supplies
   - Eco-friendly products

3. **CJ Affiliate**
   - Fashion accessories
   - Sustainable brands

4. **Etsy Affiliates**
   - Related handmade items
   - Craft supplies

5. **Impact**
   - Various jewelry brands

## 📱 Mobile Optimization

The admin panel is fully responsive:
- Works on phones, tablets, desktops
- Touch-friendly buttons
- Readable text sizes
- Optimized layouts

## 🚦 Production Checklist

- [x] Secure JWT secret generated
- [x] MUI components installed
- [x] Admin authentication implemented
- [x] Database schema updated
- [x] Affiliate link tracking working
- [x] SEO meta tags added
- [x] Sitemap.xml generated
- [x] Robots.txt configured
- [x] Product structured data
- [x] Rybbit analytics fixed
- [ ] Database migrated (YOU NEED TO DO THIS)
- [ ] Admin user created (YOU NEED TO DO THIS)
- [ ] Production environment variables set
- [ ] SSL certificate configured
- [ ] Domain DNS configured

## 🔧 Troubleshooting

### "Unauthorized" Error
- Check JWT_SECRET is set in .env
- Verify admin user has role='admin'
- Clear browser cookies and re-login

### Affiliate Links Not Showing
- Verify link is set to `isActive: true`
- Check placement matches component usage
- Ensure database migration ran successfully

### SEO Not Working
- Verify NEXT_PUBLIC_SITE_URL is correct
- Check sitemap.xml is accessible
- Submit sitemap to Google Search Console
- Wait 24-48 hours for Google to index

### Analytics Not Tracking
- Verify Rybbit script loads (check Network tab)
- Clear browser cache
- Check ad blockers aren't interfering
- Wait a few minutes for data to appear

## 📞 Support & Maintenance

**Important URLs:**
- Admin Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`

**Database Backups:**
Always backup your database before migrations:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## 🎯 Next Steps for Sales Growth

1. **Submit to Google**
   - Google Search Console
   - Google My Business
   - Google Shopping

2. **Social Media**
   - Instagram with product tags
   - Pinterest rich pins
   - Facebook Shop

3. **Email Marketing**
   - Collect emails via newsletter
   - Send new product announcements
   - Share ocean conservation updates

4. **Paid Advertising**
   - Google Shopping ads
   - Instagram/Facebook ads
   - Pinterest promoted pins

5. **Content Marketing**
   - Blog about ocean conservation
   - Jewelry care guides
   - Customer testimonials
   - Behind-the-scenes stories

6. **Partnerships**
   - Ocean conservation orgs
   - Beach lifestyle influencers
   - Eco-conscious bloggers

## 📊 Analytics to Monitor

1. **Google Analytics**
   - Traffic sources
   - Conversion rates
   - Popular products

2. **Rybbit Analytics**
   - Page views
   - Session duration
   - Geographic data

3. **Affiliate Dashboard**
   - Click-through rates
   - Most popular links
   - Placement performance

4. **Sales Metrics**
   - Daily/weekly sales
   - Average order value
   - Customer lifetime value
