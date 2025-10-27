# Google Analytics 4 Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for Shenna's Studio to track website traffic, user behavior, and blog post performance.

## Quick Start (5 minutes)

### 1. Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (gear icon bottom left)
3. In the "Property" column, click "Create Property"
4. Enter property details:
   - Property name: "Shenna's Studio"
   - Time zone: Your timezone
   - Currency: USD
5. Click "Next" and complete business information
6. Accept terms and create property

### 2. Get Your Measurement ID

1. In your new property, go to "Admin" > "Data Streams"
2. Click "Add stream" > "Web"
3. Enter your website URL: `https://shennastudio.com`
4. Click "Create stream"
5. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

### 3. Add to Environment Variables

Add to your `.env.local` or `.env.production` file:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Replace with your actual ID
```

**That's it!** GA4 tracking is now active on your site.

---

## Advanced Setup (Optional)

For full analytics dashboard integration, you'll need the Google Analytics Data API.

### Step 1: Enable Google Analytics Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Analytics Data API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Analytics Data API"
   - Click "Enable"

### Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in details:
   - Name: "GA4 Data API"
   - ID: `ga4-data-api`
4. Click "Create and Continue"
5. Grant role: "Viewer"
6. Click "Done"

### Step 3: Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON key file
6. **Keep this file secure!** Never commit it to git

### Step 4: Grant Service Account Access to GA4

1. Go back to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" > "Property Access Management"
3. Click "+" to add users
4. Enter the service account email (from the JSON file)
5. Select role: "Viewer"
6. Click "Add"

### Step 5: Configure Environment Variables

Add to your `.env.local` or `.env.production`:

```bash
# Get Property ID from GA4 Admin > Property Settings
GA4_PROPERTY_ID=properties/123456789

# Path to the service account JSON file (server-side only)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

**Important:** On production servers (Railway, Vercel, etc.):
- Upload the JSON file securely
- Set the path in environment variables
- Or paste the JSON content as an environment variable (some platforms support this)

---

## What Gets Tracked

### Client-Side Tracking (Automatic)

Once you add `NEXT_PUBLIC_GA_MEASUREMENT_ID`, the following is tracked automatically:

- **Page Views**: Every page visit
- **User Sessions**: Time spent on site
- **Bounce Rate**: Users who leave after one page
- **Device Info**: Desktop, mobile, tablet
- **Location**: Country, city
- **Traffic Source**: Where visitors came from

### Custom Events

The following custom events are tracked:

#### Blog Posts
```javascript
// Automatically tracked when viewing blog posts
trackBlogView(postSlug, postTitle)
```

#### Product Views
```javascript
// Track when users view product details
trackProductView(productId, productName)
```

#### Add to Cart
```javascript
// Track when users add items to cart
trackAddToCart(productId, productName, price)
```

#### Purchases
```javascript
// Track completed purchases
trackPurchase(transactionId, value, items)
```

### Server-Side Analytics

With the Data API configured, you get:

- **Blog Post Performance**: Views, time on page, bounce rate per post
- **Traffic Trends**: Monthly traffic over time
- **Organic Traffic**: Search engine traffic analysis
- **User Behavior**: Detailed session analysis

---

## Viewing Your Analytics

### Real-Time Reports

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to "Reports" > "Real-time"
4. See live visitor data

### Standard Reports

- **Acquisition**: Where traffic comes from
- **Engagement**: What pages users visit
- **Monetization**: E-commerce performance
- **Retention**: Returning visitors

### Custom Reports

Create custom reports for:
- Blog post performance
- Product category performance
- Conversion funnels
- User demographics

---

## Dashboard Integration

The SEO Dashboard at `/admin/seo` displays analytics when configured:

### Current Features

Without GA4 API:
- Views from database
- Estimated metrics

With GA4 API:
- Real Google Analytics data
- Accurate session metrics
- Bounce rate and time on page
- Traffic sources
- User demographics

### Accessing the Dashboard

1. Go to `https://shennastudio.com/admin/seo`
2. View blog post analytics
3. Monitor traffic trends
4. Track keyword performance

---

## Testing Your Setup

### 1. Verify Tracking is Active

1. Visit your website
2. Open browser DevTools (F12)
3. Go to "Network" tab
4. Filter for "google-analytics" or "gtag"
5. You should see requests to `www.google-analytics.com`

### 2. Check Real-Time Reports

1. Visit your website
2. Go to GA4 Real-time reports
3. You should see your visit appear within seconds

### 3. Test Custom Events

1. View a blog post
2. Add a product to cart
3. Check GA4 Real-time "Events" report
4. Look for `view_blog_post`, `add_to_cart` events

---

## Privacy & Compliance

### GDPR Compliance

Google Analytics is GDPR compliant by default with these features:

- **IP Anonymization**: Enabled automatically in GA4
- **Data Deletion**: Users can request data deletion
- **Consent Mode**: Can integrate with cookie consent tools

### Cookie Consent

If you need a cookie consent banner:

1. Install a consent management tool (e.g., CookieYes, OneTrust)
2. Configure GA4 to respect consent choices
3. Update the `GoogleAnalytics` component to wait for consent

Example with consent:
```typescript
// Only load GA4 if user has consented
{hasConsent && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
```

---

## Troubleshooting

### Analytics Not Showing Data

**Problem**: No data in GA4 reports

**Solutions**:
1. Check measurement ID is correct
2. Verify environment variable is set: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
3. Rebuild and redeploy your application
4. Wait 24-48 hours for data to populate reports
5. Check browser console for errors

### Service Account Errors

**Problem**: "403 Forbidden" or "Permission Denied" errors

**Solutions**:
1. Verify service account has "Viewer" role in GA4
2. Check property ID is correct format: `properties/123456789`
3. Ensure JSON key file path is correct
4. Verify service account email was added to GA4 property

### Data API Not Working

**Problem**: Dashboard shows estimated data instead of GA4 data

**Solutions**:
1. Verify `GA4_PROPERTY_ID` environment variable is set
2. Check `GOOGLE_APPLICATION_CREDENTIALS` path is correct
3. Install `@google-analytics/data` package if needed
4. Review server logs for API errors
5. Confirm service account has proper permissions

---

## Production Deployment

### Railway

1. Add environment variables in Railway dashboard:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   GA4_PROPERTY_ID=properties/123456789
   ```

2. For service account JSON:
   - Option A: Upload JSON file to Railway
   - Option B: Set JSON content as env var and create file in startup script

### Vercel

1. Add in Project Settings > Environment Variables:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   GA4_PROPERTY_ID=properties/123456789
   ```

2. For service account:
   - Use Vercel Secrets for JSON content
   - Or use environment variable with base64-encoded JSON

---

## Best Practices

### 1. Use Separate Properties for Dev/Production

Create different GA4 properties:
- **Development**: `shennastudio-dev`
- **Production**: `shennastudio-production`

Use different measurement IDs in `.env.local` vs `.env.production`

### 2. Set Up Goals

Define conversion goals in GA4:
- Newsletter signups
- Product purchases
- Contact form submissions
- Blog post engagement

### 3. Regular Monitoring

Check analytics weekly for:
- Traffic trends
- Popular blog posts
- User behavior patterns
- Conversion performance

### 4. Privacy First

- Be transparent about analytics in privacy policy
- Respect user privacy preferences
- Minimize data collection to necessary metrics
- Regularly review data retention settings

---

## Additional Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GA4 Migration Guide](https://support.google.com/analytics/answer/9744165)

---

## Support

Having issues? Check:

1. **Environment Variables**: Ensure all required vars are set
2. **Rebuild**: Rebuild and redeploy after configuration changes
3. **Logs**: Check server logs for error messages
4. **Documentation**: Review this guide and Google's docs
5. **Community**: Search GA4 community forums

Need help? Contact the development team or file an issue in the project repository.
