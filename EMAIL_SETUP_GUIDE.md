# Email Notifications Setup Guide

## Overview

Your Shenna's Studio e-commerce platform now has fully integrated email notifications powered by Resend. Customers receive beautiful order confirmations, and you get instant sales notifications.

## ✅ What's Already Configured

### 1. Email Service Integration
- **File**: `frontend/src/lib/resend.ts`
- **Features**:
  - Customer receipt emails with ocean-themed HTML templates
  - Admin notification emails for new orders
  - Professional formatting with itemized order details
  - Shipping address, totals, and order tracking

### 2. Stripe Webhook Handler
- **File**: `frontend/app/api/webhooks/stripe/route.ts`
- **Functionality**:
  - Listens for `checkout.session.completed` events from Stripe
  - Automatically sends emails when orders are placed
  - Secure webhook signature verification
  - Error handling that doesn't affect payment processing

### 3. Environment Variables
- **File**: `frontend/.env.local`
- **Configured**:
  ```
  RESEND_API_KEY=re_HREyM8WN_HWYL3CyoTZzGyCTGzKMf6BgR
  RESEND_FROM_EMAIL=Shenna's Studio <noreply@shennastudio.com>
  RESEND_REPLY_TO_EMAIL=support@shennastudio.com
  ADMIN_EMAIL=admin@shennastudio.com
  ```

## 🚀 Next Steps to Complete Setup

### Step 1: Verify Your Domain in Resend

1. Log in to [Resend Dashboard](https://resend.com/dashboard)
2. Go to **Domains** section
3. Add your domain: `shennastudio.com`
4. Follow the DNS verification instructions:
   - Add the provided DNS records to your domain registrar
   - Wait for verification (usually a few minutes)

**Note**: Until domain is verified, you can test using Resend's development mode, but emails will only go to the registered account email.

### Step 2: Update Admin Email

Change the `ADMIN_EMAIL` in `frontend/.env.local` to your actual email address:

```bash
ADMIN_EMAIL=your-actual-email@example.com
```

### Step 3: Set Up Stripe Webhook

#### For Local Development (Testing):

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...your_secret...
   ```

#### For Production:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL:
   ```
   https://www.shennastudio.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `checkout.session.completed`
5. Copy the **Signing secret** and add it to your production environment variables in Railway

### Step 4: Add Stripe Keys

Add your Stripe API keys to `frontend/.env.local`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...your_test_key...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...your_test_key...
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret...
```

**For production**, add the live keys:
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 📧 Email Templates

### Customer Receipt Email Includes:
- Ocean-themed header with Shenna's Studio branding
- Order number and date
- Itemized product list with quantities and prices
- Subtotal, shipping, tax, and total
- Shipping address
- Ocean conservation message (10% donation reminder)
- Contact information

### Admin Notification Email Includes:
- New order alert
- Customer name and email
- Order number and total amount
- Complete item list
- Shipping address for fulfillment

## 🧪 Testing the Email System

### Test Customer Receipt:

1. Start the frontend server (already running):
   ```bash
   npm run dev
   ```

2. Complete a test purchase:
   - Go to http://localhost:3000/products
   - Add items to cart
   - Proceed to checkout
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete the purchase

3. Check your email inbox for the receipt

4. Check the admin email for the notification

### Test with Stripe CLI (Local):

```bash
# Trigger a test webhook event
stripe trigger checkout.session.completed
```

## 🔧 Troubleshooting

### Emails Not Sending:

1. **Check Resend API Key**:
   - Verify `RESEND_API_KEY` in `.env.local` is correct
   - Check Resend dashboard for API key status

2. **Check Console Logs**:
   - Look for "Customer receipt sent successfully" or error messages
   - Check for Resend-specific errors

3. **Verify Webhook**:
   - Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
   - Check Stripe dashboard for webhook delivery status
   - Look for signature verification errors

4. **Domain Verification**:
   - Verify your domain in Resend dashboard
   - Until verified, emails only go to account owner

### Common Issues:

**"Email service not configured"**:
- Missing `RESEND_API_KEY` in environment variables
- Restart the server after adding keys

**"Invalid signature"**:
- `STRIPE_WEBHOOK_SECRET` is incorrect or missing
- Webhook secret doesn't match the endpoint

**"Failed to send email"**:
- Domain not verified in Resend
- API key is invalid or expired
- Rate limit reached (check Resend dashboard)

## 📊 Monitoring

### Resend Dashboard:
- View sent emails
- Check delivery status
- Monitor usage and limits
- View bounce/complaint rates

### Stripe Dashboard:
- Monitor webhook events
- Check delivery attempts
- View error logs
- Test webhook endpoints

## 🌊 Email Design Features

The email templates are fully responsive and include:
- Mobile-friendly design
- Ocean color scheme (blues, teals, coral)
- Professional typography
- Clear call-to-actions
- Accessible HTML structure
- Optimized for all major email clients

## 🚀 Production Deployment

When deploying to production:

1. **Update Environment Variables in Railway**:
   - Add all Resend variables
   - Add Stripe production keys
   - Add production webhook secret

2. **Update Webhook URL**:
   - Change Stripe webhook to production URL
   - Test webhook delivery

3. **Verify Domain**:
   - Complete Resend domain verification
   - Set up proper SPF/DKIM records

4. **Test Everything**:
   - Place a test order in production
   - Verify both customer and admin emails are received
   - Check email rendering in different clients

## 📝 Customization

### To Customize Email Templates:

Edit `frontend/src/lib/resend.ts`:
- Modify HTML in `generateCustomerReceiptHTML()`
- Modify HTML in `generateAdminNotificationHTML()`
- Update colors, fonts, and layout as needed

### To Change Email Addresses:

Update `.env.local`:
```bash
RESEND_FROM_EMAIL=Your Store <custom@yourdomain.com>
RESEND_REPLY_TO_EMAIL=support@yourdomain.com
ADMIN_EMAIL=orders@yourdomain.com
```

## 🎉 You're All Set!

Once you complete the steps above, your customers will automatically receive:
- Beautiful order confirmation emails
- Professional receipts with all order details
- Ocean conservation messaging

And you'll receive:
- Instant notifications for every sale
- Complete order details for fulfillment
- Customer contact information

**Happy selling! 🌊🐢**
