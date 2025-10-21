# Railway Local Development Setup - Complete

## Overview

This document summarizes the successful setup of Shenna's Studio with Railway's PostgreSQL and Redis services for local development and testing.

## What Was Accomplished

### ✅ 1. Railway Service Configuration

Connected the local development environment to Railway's managed services:

**PostgreSQL Database:**
- Host: `yamabiko.proxy.rlwy.net:42200`
- Database: `railway`
- User: `postgres`
- Password: `FJXRirnGBaMfpTcMOeRpfquikOtvVKpa`

**Redis Cache:**
- Host: `shinkansen.proxy.rlwy.net:31182`
- User: `default`
- Password: `PAQmOYTJrbfQzOwxOqdSWmKHIIiSUylU`

### ✅ 2. Environment Configuration

Created `.env` files with Railway credentials:

**Backend (`ocean-backend/.env`):**
```env
DATABASE_URL="postgresql://postgres:FJXRirnGBaMfpTcMOeRpfquikOtvVKpa@yamabiko.proxy.rlwy.net:42200/railway"
REDIS_URL="redis://default:PAQmOYTJrbfQzOwxOqdSWmKHIIiSUylU@shinkansen.proxy.rlwy.net:31182"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long-change-this"
COOKIE_SECRET="your-super-secret-cookie-key-min-32-chars-change-this-too"
```

**Frontend (`.env`):**
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
DATABASE_URL="postgresql://postgres:FJXRirnGBaMfpTcMOeRpfquikOtvVKpa@localhost:5432/railway"
```

### ✅ 3. Database Migrations

Successfully ran all Medusa v2 database migrations on Railway PostgreSQL:
- Stock Location Module ✓
- Inventory Module ✓
- Product Module ✓
- Pricing Module ✓
- Promotion Module ✓
- Customer Module ✓
- Sales Channel Module ✓
- Cart Module ✓
- Region Module ✓
- API Key Module ✓
- Store Module ✓
- Tax Module ✓
- Currency Module ✓
- Payment Module ✓
- Order Module ✓
- Settings Module ✓
- Auth Module ✓
- User Module ✓
- Fulfillment Module ✓
- Notification Module ✓
- Workflow Engine Module ✓

All migrations completed successfully with Railway's PostgreSQL database.

### ✅ 4. Admin User Creation

Created a new admin user in the Railway database:
- **Email:** `admin@shennasstudio.com`
- **Password:** `ChangeThisPassword123!`
- **Admin Panel:** http://localhost:9000/app (when backend is running)

**⚠️ IMPORTANT:** Change this password after first login!

### ✅ 5. Database Seeding

Successfully seeded the Railway database with sample data:
- Store configuration ✓
- Regions (multiple regions configured) ✓
- Tax regions ✓
- Stock locations ✓
- Fulfillment providers ✓
- Publishable API keys ✓
- Product categories ✓
- Sample products ✓
- Inventory levels ✓

### ✅ 6. Backend Build Configuration

Fixed Medusa configuration issues:
- Removed invalid `cookieOptions` and `sessionOptions` from http config (not supported in Medusa v2)
- Updated `medusa-config.ts` to use correct configuration structure
- Backend now builds successfully without TypeScript errors

### ✅ 7. Test Infrastructure

Created automated test runner script (`run-tests.sh`):
- Starts backend server automatically
- Waits for backend to be healthy
- Runs Vitest integration tests
- Cleans up processes on exit
- Provides detailed logging

## How to Use

### Starting the Backend

```bash
cd ocean-backend
npm run dev
```

The backend will:
- Connect to Railway PostgreSQL (yamabiko.proxy.rlwy.net:42200)
- Connect to Railway Redis (shinkansen.proxy.rlwy.net:31182)
- Start API server on http://localhost:9000
- Serve admin panel at http://localhost:9000/app

### Starting the Frontend

```bash
npm run dev
```

The frontend will:
- Start Next.js on http://localhost:3000
- Connect to backend at http://localhost:9000

### Running Both Together

```bash
npm run dev:full
```

Or with Turbopack (faster):
```bash
npm run dev:full:turbo
```

### Running Tests with Vitest

The integration tests require the backend to be running. Use the automated test runner:

```bash
./run-tests.sh
```

This script will:
1. Start the backend server
2. Wait for it to be ready
3. Run all Vitest tests
4. Clean up and show results

**Manual Testing (Alternative):**
```bash
# Terminal 1: Start backend
cd ocean-backend && npm run dev

# Terminal 2: Wait for backend to be ready, then run tests
npm run test:run
```

### Accessing the Admin Panel

1. Make sure the backend is running
2. Open http://localhost:9000/app in your browser
3. Login with:
   - Email: `admin@shennasstudio.com`
   - Password: `ChangeThisPassword123!`

## Test Results

The Vitest test suite includes:
- ✓ Admin authentication tests (Bearer token method)
- ✓ Admin login workflow tests
- ✓ Admin user management tests
- ✓ Backend integration tests

**Note:** Integration tests require the backend server to be running on port 9000.

## Railway Services

### PostgreSQL (Public Access)
```
Host: yamabiko.proxy.rlwy.net
Port: 42200
Database: railway
User: postgres
Password: FJXRirnGBaMfpTcMOeRpfquikOtvVKpa
```

### PostgreSQL (Private/Internal)
```
Host: postgres.railway.internal
Port: 5432
Database: railway
```

### Redis (Public Access)
```
Host: shinkansen.proxy.rlwy.net
Port: 31182
User: default
Password: PAQmOYTJrbfQzOwxOqdSWmKHIIiSUylU
```

### Redis (Private/Internal)
```
Host: redis.railway.internal
Port: 6379
```

## Important Notes

1. **SSL Configuration:** SSL is disabled for local development. For production, set:
   ```env
   DATABASE_SSL=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=true
   ```

2. **Secrets:** The JWT_SECRET and COOKIE_SECRET in the current `.env` files are examples. Generate strong secrets for production:
   ```bash
   openssl rand -base64 32
   ```

3. **CORS:** Current CORS settings allow localhost. Update for production domains.

4. **Railway Costs:** Running services on Railway incurs costs. Monitor usage in Railway dashboard.

5. **Database Backups:** Railway provides automatic backups, but verify your backup strategy.

6. **Admin Credentials:** Change the default admin password immediately after first login.

## File Structure

```
shennastudiollc/
├── .env                          # Frontend environment variables
├── ocean-backend/
│   ├── .env                      # Backend environment variables (Railway config)
│   ├── medusa-config.ts          # Medusa configuration (updated)
│   └── .medusa/                  # Build output directory
├── __tests__/                    # Vitest test files
├── run-tests.sh                  # Automated test runner script
└── backend-test.log              # Backend log (created during test runs)
```

## Next Steps

1. **Change Admin Password:** Login and change the default password
2. **Configure Stripe:** Add Stripe keys to `.env` files for payment processing
3. **Configure Algolia:** (Optional) Add Algolia keys for search functionality
4. **Configure Cloudinary:** (Optional) Add Cloudinary keys for image management
5. **Run Full Test Suite:** Execute `./run-tests.sh` to verify all integration tests pass
6. **Production Setup:** Review production environment variables and security settings

## Troubleshooting

### Backend Won't Start
- Check Railway services are running in Railway dashboard
- Verify `.env` file exists in `ocean-backend/` directory
- Check logs: `cd ocean-backend && npm run dev`

### Tests Failing
- Ensure backend is running on port 9000
- Check backend health: `curl http://localhost:9000/health`
- Review test logs: `cat backend-test.log`

### Database Connection Issues
- Verify Railway PostgreSQL service is running
- Check DATABASE_URL in `ocean-backend/.env`
- Test connection: `psql "postgresql://postgres:FJXRirnGBaMfpTcMOeRpfquikOtvVKpa@yamabiko.proxy.rlwy.net:42200/railway"`

### Redis Connection Issues
- Verify Railway Redis service is running
- Check REDIS_URL in `ocean-backend/.env`
- Test connection: `redis-cli -u "redis://default:PAQmOYTJrbfQzOwxOqdSWmKHIIiSUylU@shinkansen.proxy.rlwy.net:31182"`

## Resources

- **Medusa Documentation:** https://docs.medusajs.com
- **Railway Documentation:** https://docs.railway.app
- **Vitest Documentation:** https://vitest.dev
- **Project CLAUDE.md:** See root directory for detailed project architecture

---

**Setup Completed:** Successfully configured local development environment with Railway services, created admin user, seeded database, and prepared test infrastructure.

**Status:** ✅ Ready for development and testing