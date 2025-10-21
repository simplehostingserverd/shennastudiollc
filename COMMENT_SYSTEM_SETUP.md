# Comment System & Rybbit Analytics Setup Guide

This guide explains the newly integrated comment system and Rybbit analytics for your website.

## What Was Added

### 1. Product Comment System
- **Database Schema**: Added `ProductComment` model to Prisma schema
- **API Routes**: Created `/api/comments` endpoint for creating and fetching comments
- **UI Component**: Built `ProductComments` component for product pages
- **Features**:
  - Customers can leave comments on bracelet products
  - Star rating system (1-5 stars)
  - Customer name and email collection
  - Comments display in chronological order (newest first)
  - Responsive design matching your ocean theme

### 2. Rybbit Analytics
- **Integration**: Added Rybbit analytics script to the main layout
- **Site ID**: `a56da861ea4f`
- **Tracking**: Automatically tracks all page views and user interactions
- **Dashboard**: Access your analytics at https://app.rybbit.io

## Setup Instructions

### Step 1: Database Migration

You need to apply the Prisma schema changes to create the comments table:

```bash
cd frontend
npx prisma db push
```

Or if you prefer to use migrations:

```bash
cd frontend
npx prisma migrate dev --name add_product_comments
```

### Step 2: Restart Your Application

After the database migration, restart your frontend:

```bash
# If using Docker
docker-compose restart frontend

# If running locally
cd frontend
npm run dev
```

### Step 3: Verify Rybbit Analytics

1. Visit your website at any page
2. Log in to your Rybbit dashboard at https://app.rybbit.io
3. Use API key: `rb_cd37cb1e8b503fc5843129f107dcced1`
4. You should see traffic data appearing within a few minutes

## How to Use the Comment System

### For Customers

1. Navigate to any product detail page (e.g., `/products/blue-bracelet`)
2. Scroll down to "Customer Comments & Feedback" section
3. Click "Leave a Comment" button
4. Fill in:
   - Name
   - Email
   - Rating (1-5 stars)
   - Comment about which bracelets they like or want you to make
5. Submit the comment
6. Comment appears immediately on the page

### For You (Admin)

**Viewing Comments:**
- All comments are visible on the product pages
- Comments are stored in your PostgreSQL database in the `ProductComment` table

**Database Access:**
You can query comments directly from the database:

```sql
-- View all comments
SELECT * FROM "ProductComment" ORDER BY "createdAt" DESC;

-- View comments for a specific product
SELECT * FROM "ProductComment" 
WHERE "productId" = 'your-product-id' 
ORDER BY "createdAt" DESC;

-- Get comment statistics
SELECT "productId", COUNT(*), AVG(rating) as avg_rating 
FROM "ProductComment" 
GROUP BY "productId";
```

**Managing Comments:**
Currently, all comments are displayed publicly. If you need moderation features, you can:
1. Add an "approved" field to the schema
2. Create an admin panel to approve/reject comments
3. Filter comments by approval status before displaying

## Comment Database Schema

```prisma
model ProductComment {
  id           String   @id @default(cuid())
  productId    String
  customerName String
  email        String
  comment      String
  rating       Int      @default(5)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## API Endpoints

### GET /api/comments?productId={id}
Fetches all comments for a specific product.

**Response:**
```json
{
  "comments": [
    {
      "id": "clx...",
      "productId": "prod_123",
      "customerName": "Sarah",
      "email": "sarah@example.com",
      "comment": "I love the blue bracelet! Could you make one in purple?",
      "rating": 5,
      "createdAt": "2025-10-18T12:00:00Z",
      "updatedAt": "2025-10-18T12:00:00Z"
    }
  ]
}
```

### POST /api/comments
Creates a new comment.

**Request:**
```json
{
  "productId": "prod_123",
  "customerName": "Sarah",
  "email": "sarah@example.com",
  "comment": "I love the blue bracelet! Could you make one in purple?",
  "rating": 5
}
```

**Response:**
```json
{
  "comment": { ... },
  "message": "Comment added successfully!"
}
```

## Rybbit Analytics Features

With Rybbit analytics, you can track:

- **Page Views**: Which products are most popular
- **User Sessions**: How long visitors stay on your site
- **Traffic Sources**: Where your visitors come from
- **Device Types**: Mobile vs desktop usage
- **Geographic Data**: Where your customers are located

Access your dashboard at: https://app.rybbit.io

## Troubleshooting

### Comments Not Saving
1. Check that database migration was applied: `npx prisma db push`
2. Verify PostgreSQL is running
3. Check browser console for errors
4. Verify API route is accessible at `/api/comments`

### Rybbit Analytics Not Tracking
1. Check browser console for script loading errors
2. Verify site ID is correct: `a56da861ea4f`
3. Check that script is loaded in page source (View → Developer → View Source)
4. Wait a few minutes for data to appear in dashboard
5. Ensure you're logged in to the correct Rybbit account

### Database Connection Issues
Make sure your `frontend/.env` has the correct `DATABASE_URL`:
```
DATABASE_URL="postgresql://user:password@localhost:5433/dbname"
```

## Future Enhancements

Potential features you could add:

1. **Comment Moderation**: Add approval workflow before publishing
2. **Reply System**: Let you reply to customer comments
3. **Email Notifications**: Get notified when new comments arrive
4. **Photo Uploads**: Let customers share photos with their comments
5. **Helpful Votes**: Allow other customers to mark comments as helpful
6. **Admin Dashboard**: Build a dedicated interface to manage all comments

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the terminal/logs for server errors
3. Verify all environment variables are set correctly
4. Ensure database migrations are applied
