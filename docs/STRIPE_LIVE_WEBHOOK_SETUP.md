# Stripe Live Mode Webhook Setup Guide

## ✅ What's Already Configured

Your Shenna's Studio e-commerce platform is now configured with **Stripe Live Mode** keys in Railway:

- ✅ **Live Secret Key**: `sk_live_51RdPwMP4GPds5FMq...` (set in Railway)
- ✅ **Live Publishable Key**: `pk_live_51RdPwMP4GPds5FMq...` (set in Railway)
- ✅ **Resend Email Integration**: Configured for order notifications
- ✅ **Admin Email**: `shenna@shennastudio.com`

## 🎯 Next Step: Create Live Webhook in Stripe

To enable automatic email notifications when customers complete purchases, you need to create a webhook in your Stripe account.

### Step-by-Step Instructions:

#### 1. Access Stripe Dashboard

1. Go to [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Make sure you're in **LIVE MODE** (check the toggle in the top-right corner)
3. Click **"Add endpoint"** button

#### 2. Configure the Webhook Endpoint

Enter the following details:

**Endpoint URL:**
```
https://www.shennastudio.com/api/webhooks/stripe
```

**Description** (optional):
```
Order confirmation emails for Shenna's Studio
```

**Events to send:**
- Click "Select events"
- Search for and select: `checkout.session.completed`
- Click "Add events"

#### 3. Save and Get Webhook Secret

1. Click **"Add endpoint"** to save
2. On the webhook details page, click **"Reveal"** next to "Signing secret"
3. Copy the webhook signing secret (starts with `whsec_`)

#### 4. Add Webhook Secret to Railway

Run this command in your terminal (replace `whsec_...` with your actual secret):

```bash
railway variables --set "STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here"
```

**Example:**
```bash
railway variables --set "STRIPE_WEBHOOK_SECRET=whsec_abc123xyz789..."
```

This will automatically trigger a new deployment with the webhook secret.

## 🧪 Testing the Webhook

### Before Going Live

Test the webhook to ensure it's working:

1. **Make a Test Purchase:**
   - Go to https://www.shennastudio.com/products
   - Add a product to cart
   - Proceed to checkout
   - Use a **real card** (this is live mode - you'll be charged!)
   - OR use Stripe's test mode first (see section below)

2. **Verify Webhook Delivery:**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook endpoint
   - Check the "Attempts" tab to see if events were delivered successfully
   - Look for `checkout.session.completed` events with status "Succeeded"

3. **Verify Emails:**
   - Customer should receive order confirmation at their email
   - `shenna@shennastudio.com` should receive sales notification

### Test Mode Alternative (Recommended First)

If you want to test without real charges first:

1. Switch Stripe to **Test Mode** (toggle in dashboard)
2. Create a test webhook with URL: `https://www.shennastudio.com/api/webhooks/stripe`
3. Use test keys in Railway temporarily:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_test_...`
4. Use test card: `4242 4242 4242 4242` with any future expiry
5. Once verified, switch back to live mode keys

## 🔒 Security Notes

- **Never commit** webhook secrets to git
- The webhook secret validates that requests are from Stripe
- Railway environment variables are encrypted and secure
- Each webhook endpoint has a unique secret

## 📊 Monitoring Webhooks

### Stripe Dashboard

Monitor webhook health at: [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)

Check for:
- ✅ Successful deliveries (200 status code)
- ❌ Failed deliveries (will show errors)
- ⚠️ Disabled endpoints (check endpoint status)

### Common Issues

**Webhook fails with 401/403:**
- Webhook secret is incorrect or missing
- Check Railway environment variables

**Webhook fails with 500:**
- Check Railway logs for errors
- Verify Resend API key is valid
- Ensure email configuration is correct

**Webhook timeout:**
- Email sending took too long
- Check Resend dashboard for delivery issues

## 📧 Email Flow

Once webhook is configured, here's what happens:

1. Customer completes checkout on Stripe
2. Stripe sends `checkout.session.completed` event to your webhook
3. Your webhook handler:
   - Retrieves full order details from Stripe
   - Sends beautiful receipt email to customer
   - Sends sales notification to `shenna@shennastudio.com`
4. Both emails include:
   - Order number and date
   - Itemized product list with prices
   - Shipping address
   - Total amount paid
   - Ocean conservation message

## 🚀 Current Production Setup

**Domain:** https://www.shennastudio.com

**Environment Variables in Railway:**
```
STRIPE_SECRET_KEY=sk_live_51RdPwMP4GPds5FMq... ✅
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RdPwMP4GPds5FMq... ✅
RESEND_API_KEY=re_HREyM8WN_HWYL3CyoTZzGyCTGzKMf6BgR ✅
RESEND_FROM_EMAIL=Shenna's Studio <noreply@shennastudio.com> ✅
RESEND_REPLY_TO_EMAIL=shenna@shennastudio.com ✅
ADMIN_EMAIL=shenna@shennastudio.com ✅
STRIPE_WEBHOOK_SECRET=whsec_... ⏳ (You need to add this)
```

## ✅ Checklist

- [x] Stripe live keys added to Railway
- [x] Resend email integration configured
- [x] Email templates created
- [x] Webhook endpoint code deployed
- [ ] Create webhook in Stripe dashboard (LIVE MODE)
- [ ] Add webhook secret to Railway
- [ ] Test with real purchase
- [ ] Verify emails are received
- [ ] Monitor webhook health

## 🆘 Need Help?

If you encounter issues:

1. **Check Railway Logs:**
   ```bash
   railway logs
   ```

2. **Check Stripe Webhook Logs:**
   - Dashboard → Webhooks → Your endpoint → Attempts tab

3. **Verify Environment Variables:**
   ```bash
   railway variables --kv | grep -E "STRIPE|RESEND"
   ```

4. **Test Resend:**
   - Go to [resend.com/emails](https://resend.com/emails)
   - Check sent emails and delivery status

## 🎉 You're Almost There!

Once you add the webhook secret, your complete e-commerce flow will be:

1. 🛒 Customer browses products with correct prices
2. 💳 Customer checks out with Stripe (live mode)
3. ✅ Payment processed successfully
4. 📧 Customer receives beautiful order confirmation
5. 📬 You receive sales notification
6. 🌊 10% goes to ocean conservation!

---

**Last Updated:** 2025-10-10
**Platform:** Railway + Next.js + Medusa + Stripe + Resend
