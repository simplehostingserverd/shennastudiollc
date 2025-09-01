# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shenna's Studio is an ocean-themed e-commerce platform built with Next.js and Medusa.js. It's a family-owned business that donates 10% of proceeds to ocean conservation efforts. The platform consists of a Next.js frontend and a Medusa backend for e-commerce functionality.

## Architecture

- **Frontend**: Next.js 15.5.2 application in root directory with App Router
- **Backend**: Medusa 2.10.0 e-commerce backend in `/ocean-backend/`
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Payment**: Stripe integration
- **Search**: Algolia (optional)
- **Images**: Cloudinary (optional)

## Development Commands

### Root Level
- `npm run dev` - Start Next.js frontend (standard mode)  
- `npm run dev:turbo` - Start Next.js frontend with Turbopack
- `npm run build` - Build Next.js frontend (standard mode)
- `npm run build:turbo` - Build Next.js frontend with Turbopack
- `npm start` - Start production Next.js server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed Prisma database
- `npm run algolia:index` - Index products to Algolia

### Backend (`ocean-backend/`)
- `npm run dev` - Start Medusa development server
- `npm run build` - Build Medusa backend
- `npm start` - Start production Medusa server
- `npm run seed` - Seed Medusa database with sample data
- `npm run create-admin` - Create admin user for Medusa
- `npm run test:integration:http` - Run HTTP integration tests
- `npm run test:integration:modules` - Run module integration tests
- `npm run test:unit` - Run unit tests

### Frontend (Root Directory)
- `npm run dev` - Start Next.js development server (standard mode)
- `npm run dev:turbo` - Start Next.js development server with Turbopack  
- `npm run build` - Build Next.js application (standard mode)
- `npm run build:turbo` - Build Next.js application with Turbopack
- `npm start` - Start production Next.js server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed Prisma database
- `npm run algolia:index` - Index products to Algolia

## Project Structure

```
shennastudiollc/
├── app/                   # Next.js App Router pages and components
│   ├── about/
│   ├── api/              # API routes
│   ├── cart/             # Shopping cart pages
│   ├── checkout/         # Checkout flow
│   ├── components/       # Reusable React components
│   ├── contact/
│   ├── context/          # React context providers
│   └── products/
├── ocean-backend/         # Medusa e-commerce backend
│   ├── src/
│   │   ├── admin/        # Admin customizations
│   │   ├── api/          # API routes
│   │   ├── jobs/         # Background jobs
│   │   ├── links/        # Module links
│   │   ├── modules/      # Custom modules
│   │   ├── scripts/      # Utility scripts (seed, create-admin)
│   │   ├── subscribers/  # Event subscribers
│   │   └── workflows/    # Business workflows
│   └── medusa-config.ts  # Medusa configuration
├── src/lib/              # Shared utilities
├── prisma/               # Database schema and migrations
├── scripts/              # Utility scripts
└── docker-compose.yml    # Docker orchestration
```

## Environment Setup

### Required Environment Variables

**Frontend (.env)**:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Backend API URL
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_ALGOLIA_APPLICATION_ID` - Algolia app ID (optional)
- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` - Algolia search key (optional)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name (optional)
- `CLOUDINARY_API_KEY` - Cloudinary API key (optional)
- `CLOUDINARY_API_SECRET` - Cloudinary API secret (optional)

**Backend (ocean-backend/.env)**:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT secret (minimum 32 characters)
- `COOKIE_SECRET` - Cookie secret (minimum 32 characters)
- `STORE_CORS` - Frontend URLs for CORS
- `ADMIN_CORS` - Admin panel URLs for CORS
- `AUTH_CORS` - Auth URLs for CORS
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password

## Docker Development

### Development Setup
```bash
docker-compose up -d --build
docker-compose exec medusa-backend npx medusa db:migrate
docker-compose exec medusa-backend npm run create-admin
docker-compose exec medusa-backend npm run seed
```

### Service URLs
- Frontend: http://localhost:3000
- Medusa Admin: http://localhost:7001
- Medusa API: http://localhost:9000
- PostgreSQL: localhost:5433
- Redis: localhost:6379

### Production Deployment
Use `docker-compose.prod.yml` for production with external databases (see COOLIFY_DEPLOYMENT.md).

## Database Management

### Medusa Database
- Run migrations: `npx medusa db:migrate`
- Create admin: `npm run create-admin`
- Seed data: `npm run seed`

### Prisma Database (Frontend)
- Seed: `npm run db:seed`
- Generate client: `npx prisma generate`
- Push schema: `npx prisma db push`

## Testing

- Integration tests are available in `ocean-backend/`
- Use Jest with experimental VM modules
- Run tests with appropriate NODE_OPTIONS flags set in package.json

## Admin Panel

Default credentials (change immediately in production):
- Email: admin@shennasstudio.com
- Password: AdminPassword123!

Access at http://localhost:7001 (development) or configured admin URL.

## Deployment Notes

- Use Coolify VPS for production (see COOLIFY_DEPLOYMENT.md)
- Configure SSL/TLS certificates
- Set up proper CORS for production domains
- Use strong secrets in production
- Enable database backups
- Monitor health check endpoints

## Key Dependencies

- **Frontend**: Next.js, React, Tailwind CSS, Stripe, Auth, Prisma
- **Backend**: Medusa.js, PostgreSQL, Redis, MikroORM
- **Shared**: Docker, ESLint, Prettier, TypeScript