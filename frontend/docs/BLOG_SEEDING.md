# Blog Post Seeding Guide

This guide explains how to seed your blog with 6 SEO-optimized posts on Railway.

## Automatic Seeding (Recommended)

Blog posts are **automatically seeded on every Railway deployment** via the `railway-start.sh` script.

### How it Works

1. Railway builds your application
2. `railway-start.sh` runs before starting the server
3. Prisma migrations are applied
4. Blog posts are seeded (skips existing posts)
5. Server starts

**No manual action needed!** Just deploy and the blog posts will be there.

## Manual Seeding (If Needed)

If you need to manually seed blog posts on Railway:

### Option 1: Using Railway CLI

```bash
# Connect to your Railway project
railway link

# Run the seed script
railway run bash railway-seed.sh
```

### Option 2: Using Railway Dashboard

1. Go to your Railway project dashboard
2. Click on your frontend service
3. Go to "Settings" > "Deploy"
4. Add a new "Start Command":
   ```bash
   bash railway-seed.sh && bash railway-start.sh
   ```
5. Redeploy

### Option 3: SSH into Railway

```bash
# Connect to running container
railway connect

# Run seed command
npx tsx scripts/seed-blog-posts.ts

# Exit
exit
```

## What Gets Seeded

The seed script creates **6 comprehensive, SEO-optimized blog posts**:

1. **Ultimate Guide to Ocean-Inspired Jewelry** (12 min read)
   - Jewelry styles, care tips, sustainability
   - Keywords: ocean jewelry, sustainable jewelry, jewelry care

2. **Marine Conservation: How Your Purchases Save Oceans** (10 min read)
   - Ocean conservation impact, plastic pollution, eco-shopping
   - Keywords: ocean conservation, marine conservation, sustainable shopping

3. **Top 10 Ocean-Themed Gifts for Marine Life Lovers** (8 min read)
   - Gift guide, product recommendations, eco-friendly gifts
   - Keywords: ocean gifts, marine gifts, eco-friendly gifts

4. **The Ultimate Guide to Beach Wedding Decorations** (15 min read)
   - Wedding planning, nautical decor, centerpieces
   - Keywords: beach wedding, nautical wedding, ocean wedding

5. **How to Start an Ocean Conservation Charity** (12 min read)
   - Nonprofit setup, fundraising, partnerships
   - Keywords: ocean charity, marine conservation nonprofit

6. **Sea Turtle Conservation: Complete Guide to Protecting Marine Life** (14 min read)
   - Sea turtle protection, nesting beaches, conservation efforts
   - Keywords: sea turtle conservation, marine turtle protection

## Verification

Check if blog posts were seeded:

### Via Railway Logs

```bash
railway logs
```

Look for:
```
🌱 Seeding blog posts...
✅ Created: Ultimate Guide to Ocean-Inspired Jewelry...
✅ Created: Marine Conservation...
```

### Via Your Website

Visit: `https://www.shennastudio.com/blog`

You should see 6 published blog posts.

### Via Database Query

```bash
railway connect
npx prisma studio
```

Navigate to `BlogPost` table and verify 6 posts exist.

## Troubleshooting

### Blog Posts Not Showing

**Problem**: Blog page is empty or shows "No posts found"

**Solutions**:

1. Check Railway logs for seeding errors:
   ```bash
   railway logs | grep "seed"
   ```

2. Verify DATABASE_URL is set:
   ```bash
   railway variables
   ```

3. Manually run seed script:
   ```bash
   railway run bash railway-seed.sh
   ```

4. Check Prisma client is generated:
   ```bash
   railway run npx prisma generate
   ```

### Duplicate Posts

**Problem**: Seed script creates duplicate posts

**Solution**: The script is idempotent - it checks for existing posts by `slug` and skips them. If you see duplicates, check for posts with different slugs but same titles.

To remove duplicates:
```bash
railway connect
npx prisma studio
# Delete duplicate posts manually
```

### Migration Errors

**Problem**: `Migration failed` errors in logs

**Solutions**:

1. Check if migrations need to be deployed:
   ```bash
   railway run npx prisma migrate deploy
   ```

2. Reset database (WARNING: deletes all data):
   ```bash
   railway run npx prisma migrate reset
   ```

3. Generate Prisma client:
   ```bash
   railway run npx prisma generate
   ```

### Permission Errors

**Problem**: `Permission denied` when running seed script

**Solution**:
```bash
# Make script executable
chmod +x railway-seed.sh
git add railway-seed.sh
git commit -m "fix: Make railway-seed.sh executable"
git push
```

## Seed Script Details

### Location
- Script: `scripts/seed-blog-posts.ts`
- Start script: `railway-start.sh`
- Manual script: `railway-seed.sh`

### Features
- ✅ Idempotent (won't create duplicates)
- ✅ Creates admin user if needed
- ✅ Checks for existing posts by slug
- ✅ Skips posts that already exist
- ✅ Detailed console logging
- ✅ Error handling with fallbacks

### Environment Variables Required

```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
```

## Adding More Blog Posts

### Manually via Admin Panel

1. Go to `/admin/blog`
2. Click "New Post"
3. Fill in the form
4. Click "Publish"

### Programmatically

Edit `scripts/seed-blog-posts.ts` and add more posts to the `blogPosts` array:

```typescript
{
  title: 'Your New Post Title',
  slug: 'your-new-post-slug',
  excerpt: 'Brief description...',
  category: 'Conservation',
  tags: ['tag1', 'tag2'],
  keywords: 'keyword1, keyword2',
  metaDescription: 'SEO description...',
  readTime: '8 min read',
  content: `
# Your Post Content Here

Write your post in Markdown...
  `
}
```

Then redeploy or run the seed script.

## Best Practices

1. **Always check logs** after deployment to verify seeding succeeded
2. **Keep slugs unique** to prevent conflicts
3. **Use SEO-friendly titles** under 60 characters
4. **Include meta descriptions** of 150-160 characters
5. **Add relevant keywords** for search optimization
6. **Set realistic read times** based on word count

## Related Documentation

- [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)
- [Google Analytics Setup](./GOOGLE_ANALYTICS_SETUP.md)
- [SEO Dashboard Usage](../app/admin/seo/README.md)
- [Prisma Schema](../prisma/schema.prisma)

## Support

Having issues with blog seeding?

1. Check Railway logs: `railway logs`
2. Verify environment variables: `railway variables`
3. Test database connection: `railway run npx prisma db push`
4. Review Prisma migrations: `railway run npx prisma migrate status`

For more help, check the project repository or contact the development team.
