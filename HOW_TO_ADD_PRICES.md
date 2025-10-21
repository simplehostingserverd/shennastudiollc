# How to Add Prices to Products in Medusa

## ⚠️ **Critical Issue Found**

Your products in the Medusa backend **DO NOT have any prices configured**. This is why:
- Products show $0.00 on the frontend
- Checkout fails with "Invalid price" error
- The API returns variants without `prices` or `calculated_price` fields

## ✅ **Solution: Add Prices in Medusa Admin**

### Step 1: Access Medusa Admin

**URL:** https://backend-production-38d0a.up.railway.app/app

**Login:**
- Email: `admin@shennasstudio.com`
- Password: `ChangeThisPassword123!` (or your configured password)

### Step 2: Navigate to Products

1. Click **"Products"** in the left sidebar
2. You'll see a list of all products

### Step 3: Edit a Product

1. Click on a product (e.g., "Medusa T-Shirt")
2. Scroll down to the **"Variants"** section
3. You'll see variants listed (e.g., "Black / S", "White / M", etc.)

### Step 4: Add Prices to Each Variant

For EACH variant:

1. Click on the variant or click the **"..."** menu → **"Edit"**
2. Look for the **"Pricing"** section
3. Click **"Add Price"** or **"Manage Prices"**
4. Select **Currency: USD**
5. Enter the price **in cents**:
   - For $29.99, enter: `2999`
   - For $15.00, enter: `1500`
   - For $99.95, enter: `9995`
6. Click **"Save"**

### Step 5: Repeat for All Products

You must add prices to **every variant** of **every product** you want to sell.

## 📋 **Price Entry Reference**

| Dollar Amount | Enter in Admin |
|---------------|----------------|
| $10.00        | 1000           |
| $25.99        | 2599           |
| $49.50        | 4950           |
| $100.00       | 10000          |

## ⚡ **Quick Checklist**

- [ ] Access Medusa admin at Railway URL
- [ ] Go to Products section
- [ ] For each product:
  - [ ] Click on product
  - [ ] Find "Variants" section
  - [ ] For each variant:
    - [ ] Edit variant
    - [ ] Add price for USD currency (in cents)
    - [ ] Save

## 🧪 **Testing After Adding Prices**

Once you've added prices:

1. **Refresh** https://www.shennastudio.com/products
2. Prices should now display correctly (not $0.00)
3. You can add products to cart
4. Checkout should work with Stripe

## 🔍 **Technical Details**

We verified the issue by querying the API directly:

```bash
# Fetched product from Railway backend
curl "https://backend-production-38d0a.up.railway.app/store/products/prod_01K73M3RK92B8BV0X5Q9ETR96F"

# Result: Variants exist but have NO price fields
# variant_keys: ['id', 'title', 'sku', ...]
# Has prices: False
# Has calculated_price: False
```

This confirms the backend data simply doesn't have pricing information yet.

## 💡 **Why This Happened**

Medusa v2 uses a separate **Pricing Module** to manage prices. When products are seeded or created, they don't automatically get prices - you must explicitly add them via:
- Medusa Admin UI (recommended for your use case)
- API calls
- Database import

## 🎯 **Expected Behavior After Fix**

Once prices are added:

```json
{
  "variant": {
    "id": "variant_123",
    "title": "Black / S",
    "calculated_price": {
      "calculated_amount": 2999,
      "currency_code": "usd"
    }
  }
}
```

The frontend will then:
- Display prices correctly on product cards
- Show prices in cart
- Pass valid prices to Stripe checkout

## 🚨 **Important Notes**

- Minimum Stripe price: $0.50 (enter `50` or higher)
- Each variant needs its own price (not just the product)
- Prices are stored in **cents** (multiply dollars by 100)
- USD is the default currency for your store

---

**Ready to add prices? Go to the admin panel and start pricing your products!** 🌊
