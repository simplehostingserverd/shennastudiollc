# Database Migration Instructions

## ⚠️ IMPORTANT: Run This Before Deploying!

This migration adds address capture fields to the Order model.

## Migration Commands

Run these commands in your production environment:

```bash
cd frontend
npx prisma migrate dev --name add-order-addresses
npx prisma generate
```

## What This Migration Does

Adds the following fields to the `Order` table:

### Customer Information
- `customerEmail` - String (optional)
- `customerName` - String (optional)
- `customerPhone` - String (optional)

### Stripe Tracking
- `stripeSessionId` - String (optional, unique)
- `stripePaymentIntent` - String (optional)

### Shipping Address
- `shippingName` - String (optional)
- `shippingLine1` - String (optional)
- `shippingLine2` - String (optional)
- `shippingCity` - String (optional)
- `shippingState` - String (optional)
- `shippingPostalCode` - String (optional)
- `shippingCountry` - String (optional)

### Billing Address
- `billingName` - String (optional)
- `billingLine1` - String (optional)
- `billingLine2` - String (optional)
- `billingCity` - String (optional)
- `billingState` - String (optional)
- `billingPostalCode` - String (optional)
- `billingCountry` - String (optional)

### Indexes
- Index on `stripeSessionId` for fast lookups
- Index on `customerEmail` for customer order history

## Manual Migration SQL (if needed)

If automatic migration fails, run this SQL directly:

```sql
-- Add new columns to Order table
ALTER TABLE "Order" ADD COLUMN "stripeSessionId" TEXT;
ALTER TABLE "Order" ADD COLUMN "stripePaymentIntent" TEXT;
ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT;
ALTER TABLE "Order" ADD COLUMN "customerName" TEXT;
ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingName" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingLine1" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingLine2" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingCity" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingState" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingPostalCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingCountry" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingName" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingLine1" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingLine2" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingCity" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingState" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingPostalCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "billingCountry" TEXT;

-- Make userId optional
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- Add unique constraint
ALTER TABLE "Order" ADD CONSTRAINT "Order_stripeSessionId_key" UNIQUE ("stripeSessionId");

-- Add indexes
CREATE INDEX "Order_stripeSessionId_idx" ON "Order"("stripeSessionId");
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");
```

## Verification

After running the migration, verify with:

```bash
cd frontend
npx prisma db push
npx prisma generate
```

## Testing

Test the migration worked by:

1. Place a test order through Stripe
2. Check the database for the order
3. Verify all address fields are populated
4. Check the admin panel shows the addresses

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Drop indexes
DROP INDEX IF EXISTS "Order_stripeSessionId_idx";
DROP INDEX IF EXISTS "Order_customerEmail_idx";

-- Drop constraint
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_stripeSessionId_key";

-- Remove columns
ALTER TABLE "Order" DROP COLUMN IF EXISTS "stripeSessionId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "stripePaymentIntent";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "customerEmail";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "customerName";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "customerPhone";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingName";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingLine1";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingLine2";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingCity";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingState";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingPostalCode";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingCountry";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "billingName";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "billingLine1";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "billingLine2";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "billingCity";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "billingState";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "billingPostalCode";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "billingCountry";

-- Make userId required again
ALTER TABLE "Order" ALTER COLUMN "userId" SET NOT NULL;
```
