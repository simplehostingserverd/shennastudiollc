# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shenna's Studio is an ocean-themed e-commerce platform built with Next.js and Medusa.js. It's a family-owned business that donates 10% of proceeds to ocean conservation efforts. The platform consists of a Next.js frontend and a Medusa backend for e-commerce functionality.

## Architecture

This is a monorepo structure with separate frontend and backend directories.

- **Frontend**: Next.js 15.5.3 application in `/frontend/` with App Router, standalone output mode
- **Backend**: Medusa 2.10.1 e-commerce backend in `/backend/`
- **Database**: PostgreSQL 15 (containerized on port 5433)
- **Cache**: Redis 7 (containerized on port 6379)
- **Payment**: Stripe integration
- **Search**: Algolia (optional)
- **Images**: Cloudinary (optional)
- **Deployment**: Docker Compose orchestration with health checks

## Development Commands

### Quick Start (Recommended)

```bash
cd frontend && node start-dev.js                         # Start both frontend and backend
cd frontend && node start-dev.js --turbo                 # Start with Turbopack (faster)
```

**Note**: The `start-dev.js` script is located in the `frontend/` directory and manages both frontend and backend processes.

### Docker Development (Alternative)

Multiple Docker Compose configurations are available:

- `docker-compose.yml` - Standard development with local PostgreSQL and Redis
- `docker-compose.dev.yml` - Minimal development setup
- `docker-compose.prod.yml` - Production deployment with external databases
- `docker-compose.coolify.prod.yml` - Coolify VPS-specific production setup with local PostgreSQL and Redis

```bash
docker-compose up -d --build                              # Start all services
docker-compose exec medusa-backend npx medusa db:migrate  # Run migrations
docker-compose exec medusa-backend npm run create-admin   # Create admin user
docker-compose exec medusa-backend npm run seed          # Seed data
```

### Frontend (`frontend/`)

- `npm run dev` - Start Next.js frontend (standard mode)
- `npm run dev:turbo` - Start Next.js frontend with Turbopack (faster builds)
- `npm run build` - Build Next.js frontend (standard mode)
- `npm run build:turbo` - Build Next.js frontend with Turbopack
- `npm start` - Start production Next.js server (uses standalone build)
- `npm run start:pm2` - Start with PM2 process manager (production)
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests in watch mode
- `npm run test:run` - Run Vitest tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run db:seed` - Seed Prisma database (for blog, comments, affiliates)
- `npm run algolia:index` - Index products to Algolia

### Backend (`backend/`)

- `npm run dev` - Start Medusa development server (port 9000)
- `npm run build` - Build Medusa backend (outputs to `.medusa/server` and `.medusa/client` directories)
- `npm start` - Start production Medusa server (port 9000, admin at /app)
- `npm run start:pm2` - Start with PM2 process manager (production)
- `npm run seed` - Seed Medusa database with sample data
- `npm run create-admin` - Create admin user for Medusa
- `npm run test:integration:http` - Run HTTP integration tests
- `npm run test:integration:modules` - Run module integration tests
- `npm run test:unit` - Run unit tests

**Build Output**: Medusa v2 builds to `.medusa/` directory (not `build/`):
- `.medusa/server/` - Backend build output
- `.medusa/client/` - Admin panel build output

## TypeScript Configuration

- **Frontend**: Uses Next.js TypeScript config with App Router support
- **Backend**: Standard TypeScript with Node.js 20+ target
- **Path Mapping**: Frontend uses `@/*` for absolute imports from root
- **Build Target**: ES2017 for broad compatibility

## Key Dependencies

- **Frontend**: Next.js 15.5.3, React 18.3.1, Tailwind CSS, Stripe, NextAuth 5.0.0-beta.28, Prisma 6.15.0, Three.js (3D graphics)
- **Backend**: Medusa 2.10.1, MikroORM 6.4.3, PostgreSQL, Redis, TypeScript 5.7.2
- **Testing**: Vitest 3.2.4 with React Testing Library (frontend), Jest 30.1.2 with experimental VM modules (backend)
- **Build Tools**: SWC compiler, Turbopack (optional)

## Project Structure

```
shennastudiollc/
├── frontend/              # Next.js storefront application
│   ├── app/              # Next.js App Router pages and components
│   │   ├── about/        # About page components
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── api/          # API routes (affiliates, blog, comments, webhooks, etc.)
│   │   ├── blog/         # Blog system pages
│   │   ├── cart/         # Shopping cart pages
│   │   ├── checkout/     # Checkout flow
│   │   ├── community/    # Community chat feature
│   │   ├── components/   # Reusable React components
│   │   ├── conservation/ # Ocean conservation page
│   │   ├── contact/      # Contact page
│   │   ├── context/      # React context providers (CartContext, etc.)
│   │   ├── custom-design/# Custom design request page
│   │   ├── custom-tshirt/# Custom t-shirt designer
│   │   ├── faq/          # FAQ pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── products/     # Product listing and detail pages
│   │   ├── returns/      # Returns policy page
│   │   └── shipping/     # Shipping information
│   ├── src/lib/          # Shared utilities (medusa client, auth config)
│   ├── prisma/           # Prisma database (blog posts, comments, affiliates, subscribers)
│   ├── scripts/          # Frontend utility scripts (Algolia indexing, seeding)
│   ├── public/           # Static assets (images, favicon, etc.)
│   ├── start-dev.js      # Development server launcher for both frontend and backend
│   └── Dockerfile        # Frontend Docker build
├── backend/               # Medusa e-commerce backend
│   ├── src/
│   │   ├── admin/        # Admin panel customizations
│   │   ├── api/          # Custom API routes
│   │   ├── jobs/         # Background jobs
│   │   ├── links/        # Module links
│   │   ├── modules/      # Custom modules
│   │   ├── scripts/      # Utility scripts (seed, create-admin)
│   │   ├── subscribers/  # Event subscribers
│   │   └── workflows/    # Business workflows
│   ├── integration-tests/ # HTTP and module integration tests
│   ├── medusa-config.ts  # Medusa configuration
│   └── Dockerfile        # Backend Docker build
├── docker-compose.yml    # Docker orchestration for development
└── docker-compose.prod.yml # Production Docker configuration
```

## Environment Setup

### Required Environment Variables

**Frontend (frontend/.env)**:

Core:
- `DATABASE_URL` - Prisma database connection string (for blog, comments, affiliates)
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Backend API URL (default: http://localhost:9000)
- `NEXTAUTH_URL` - NextAuth base URL (default: http://localhost:3000)
- `NEXTAUTH_SECRET` - NextAuth secret key for session encryption

Payments:
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

Optional Services:
- `NEXT_PUBLIC_ALGOLIA_APPLICATION_ID` - Algolia app ID
- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` - Algolia search key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `RESEND_API_KEY` - Resend email service API key

**Backend (backend/.env)**:

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

- **Frontend**: http://localhost:3000 (Next.js storefront)
- **Medusa API**: http://localhost:9000 (Backend API)
- **Medusa Admin**: http://localhost:9000/app (Admin dashboard - Medusa v2 serves admin on same port as API)
- **PostgreSQL**: localhost:5433 (Database)
- **Redis**: localhost:6379 (Cache)

**Important**: Medusa v2 does NOT use a separate port for the admin panel. Both API and admin run on port 9000, with the admin accessible at the `/app` path.

### Production Deployment

- Use `docker-compose.prod.yml` for production with external databases
- See `COOLIFY_DEPLOYMENT.md` for Coolify deployment instructions
- See `PRODUCTION-SETUP.md` for general production setup
- Contains auto-initialization features (AUTO_MIGRATE, AUTO_SEED, AUTO_CREATE_ADMIN)

## Database Management

### Dual Database Architecture

This project uses **two separate databases** for different concerns:

1. **Medusa Database (Backend)**: Handles e-commerce data (products, orders, customers, payments)
2. **Prisma Database (Frontend)**: Handles content and community features (blog, comments, affiliates)

This separation allows:
- Independent scaling of e-commerce vs content features
- Clear separation of concerns
- Different database configurations for different needs
- Easier maintenance and migrations

**Important**: Both databases can use the same PostgreSQL instance with different database names, or separate instances entirely.

### Medusa Database (Backend)

The backend supports multiple database configurations:
- **Local PostgreSQL**: Via Docker (port 5433 for dev, 5432 for production) - default for development
- **SSL Support**: Configured via DATABASE_SSL and DATABASE_SSL_REJECT_UNAUTHORIZED env vars
- **Data**: Products, variants, orders, customers, carts, payments, shipping, inventory

Commands (run from `backend/`):
- Run migrations: `npx medusa db:migrate`
- Create admin: `npm run create-admin`
- Seed data: `npm run seed`

### Prisma Database (Frontend)

The frontend uses its own Prisma database for additional features not handled by Medusa:
- **Blog System**: Blog posts, categories, tags
- **Comments**: Blog comments and community chat messages
- **Affiliates**: Affiliate program management
- **Newsletter**: Email subscriber management
- **User Data**: NextAuth authentication and sessions

Commands (run from `frontend/`):
- Seed: `npm run db:seed`
- Generate client: `npx prisma generate`
- Push schema: `npx prisma db push`
- Migrations: `npx prisma migrate dev`

## Testing

### Frontend Testing (`frontend/`)

- Uses Vitest 3.2.4 with React Testing Library
- Run tests: `npm run test` (watch mode) or `npm run test:run` (single run)
- Coverage: `npm run test:coverage`
- Test files: `*.test.ts`, `*.test.tsx`

### Backend Testing (`backend/`)

- Uses Jest 30.1.2 with experimental VM modules
- Integration tests: `npm run test:integration:http` and `npm run test:integration:modules`
- Unit tests: `npm run test:unit`
- Tests located in `integration-tests/` directory
- NODE_OPTIONS flags are configured in package.json

## Admin Panel

Default credentials (change immediately in production):

- **Email**: admin@shennasstudio.com (or as configured in ADMIN_EMAIL)
- **Password**: ChangeThisPassword123! (or as configured in ADMIN_PASSWORD)

### Admin Panel Access

In Medusa v2, the admin panel runs on the **same port** as the API (9000), accessible at `/app` path:

- **Development**: http://localhost:9000/app
- **Production**: https://api.shennastudio.com/app (or your configured MEDUSA_BACKEND_URL + /app)

**Critical**: Medusa v2 does NOT use port 7001. There is only ONE port (9000) for both API and admin. The admin panel is a path (`/app`) on the same server, not a separate service.

The system includes auto-initialization that creates the admin user on first run via Docker environment variables (AUTO_CREATE_ADMIN=true).

## Deployment Notes

### Deployment Options

1. **Coolify VPS** (Recommended for self-hosted):
   - See `docs/COOLIFY_DEPLOYMENT_GUIDE.md` for comprehensive setup
   - See `docs/DEPLOY_ON_COOLIFY.md` for quick start
   - Uses `docker-compose.coolify.prod.yml` configuration

2. **Railway** (Cloud PaaS):
   - See Railway-related docs in `docs/` directory
   - Scripts available in `scripts/railway/`
   - Configuration files in `config/railway/`

3. **Docker Compose** (Generic deployment):
   - Use `docker-compose.prod.yml` for production
   - Configure external databases (PostgreSQL, Redis)
   - Set AUTO_MIGRATE, AUTO_SEED, AUTO_CREATE_ADMIN env vars

### Pre-Deployment Checklist

- Configure SSL/TLS certificates
- Set up proper CORS for production domains (see `docs/CORS-CONFIGURATION.md`)
- Use strong secrets (JWT_SECRET, COOKIE_SECRET, NEXTAUTH_SECRET)
- Configure external database connections
- Set up Stripe webhooks for production
- Enable database backups
- Monitor health check endpoints (`/api/health`)
- Review `docs/DEPLOYMENT_CHECKLIST.md`

## Frontend Architecture Patterns

### Component Structure

- **Pages**: App Router structure in `app/` directory with route-based folders
- **Components**: Reusable UI components in `app/components/`
- **Context**: React Context providers for global state (CartContext, etc.)
- **Hooks**: Custom React hooks in `app/hooks/` for reusable logic
- **API Integration**: Medusa.js SDK client in `src/lib/medusa.ts`

### Key Features

- **E-commerce**: Product catalog, cart, checkout with Stripe integration
- **Blog System**: Full blog with categories, tags, and comments (Prisma-based)
- **Community Chat**: Real-time community messaging system
- **Affiliate Program**: Affiliate tracking and management
- **Custom Design**: Custom t-shirt designer and design request forms
- **3D Graphics**: Three.js integration for interactive ocean-themed elements
- **Authentication**: NextAuth 5.0.0-beta.28 for user authentication

### Key Design Patterns

- **Product Fetching**: Uses Medusa SDK with error handling and loading states
- **Dynamic Imports**: Medusa client is dynamically imported to avoid SSR issues
- **Collection Filtering**: Client-side filtering using keyword matching
- **Background Images**: Uses CSS classes with Tailwind for ocean-themed backgrounds
- **State Management**: React hooks with useCallback for performance optimization
- **API Routes**: Next.js API routes in `app/api/` for serverless functions

### Common Issues & Solutions

- **Backend Connection**: Frontend expects backend at `localhost:9000`, ensure backend is running
- **Background Images**: CSS classes like `products-page-background` must be defined in `globals.css`
- **Medusa Client**: Always check if client is initialized before API calls
- **CORS**: Backend must include frontend domain in STORE_CORS configuration
- **Environment Variables**: All `NEXT_PUBLIC_*` vars are exposed to browser

## Configuration Files

### Frontend Configuration

- `next.config.js` - Next.js configuration (standalone output, image domains, webpack config)
- `tailwind.config.ts` - Tailwind CSS configuration and theme customization
- `postcss.config.js` - PostCSS configuration for Tailwind
- `vitest.config.ts` - Vitest test runner configuration
- `ecosystem.config.js` - PM2 process manager configuration
- `prisma/schema.prisma` - Prisma database schema for blog, comments, affiliates

### Backend Configuration

- `medusa-config.ts` - Medusa backend configuration (database, modules, plugins, admin)
- `jest.config.js` - Jest test configuration with experimental VM modules
- `ecosystem.config.js` - PM2 process manager configuration

### Root Configuration

- `docker-compose.yml` - Development Docker orchestration
- `docker-compose.prod.yml` - Production Docker orchestration
- `docker-compose.coolify.prod.yml` - Coolify-specific production setup
- `.nvmrc` - Node.js version specification (v20)
- `Procfile` - Process file for some deployment platforms

## Important Notes

- **Node.js Version**: Backend requires Node.js 20+ (specified in `.nvmrc`)
- **Package Overrides**: Both projects include security overrides for axios, braces, ws, and other dependencies
- **Development Mode**: Use Turbopack (`npm run dev:turbo`) for faster development builds
- **Database Migrations**: Always run `npx medusa db:migrate` after pulling backend changes
- **Prisma Changes**: Run `npx prisma generate` after schema changes in frontend
- **Testing**: Backend tests require experimental VM modules flag in NODE_OPTIONS
- **Next.js Configuration**: Uses standalone output mode for optimized Docker builds
- **Container Architecture**: Health checks are configured for all services
- **Image Optimization**: Configured for Cloudinary domains and unoptimized static assets
- **Container Persistence**: Uses Docker volumes for PostgreSQL data, Redis data, and Medusa uploads

## Common Development Workflows

### Adding a New Product (via Medusa Admin)

1. Access Medusa Admin at http://localhost:9000/app
2. Navigate to Products → Add Product
3. Fill in product details, variants, pricing
4. Upload images (stored in Medusa database)
5. Product automatically available in frontend

### Creating Blog Posts (via Frontend Admin or Prisma)

1. Access frontend admin dashboard at http://localhost:3000/admin
2. Create blog post with categories and tags
3. Data stored in Prisma database
4. Automatically appears on blog page

### Testing Stripe Integration Locally

1. Use Stripe test keys in `.env` files
2. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
5. Test checkout with Stripe test cards

### Database Migrations After Git Pull

```bash
# Backend (Medusa)
cd backend
npx medusa db:migrate

# Frontend (Prisma)
cd frontend
npx prisma generate
npx prisma migrate dev
```

### Debugging Backend Connection Issues

1. Check backend is running: `curl http://localhost:9000/health`
2. Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in frontend `.env`
3. Check CORS settings in `backend/medusa-config.ts`
4. Review backend logs for errors

### Adding Custom API Routes

**Frontend**: Create file in `frontend/app/api/[route-name]/route.ts`
**Backend**: Create file in `backend/src/api/[route-name]/route.ts`

Both follow their respective framework conventions (Next.js App Router vs Medusa routes).

## Container Architecture Details

The Docker setup includes:

- **Multi-stage builds**: Optimized for production deployment
- **Health checks**: All services have proper health monitoring
- **Named volumes**: Data persistence for database and file uploads
- **Network isolation**: Services communicate via Docker network
- **Auto-initialization**: Backend automatically migrates, seeds, and creates admin on startup
- **Service dependencies**: Proper startup order with health check dependencies

## Process Management (Production)

Both frontend and backend support PM2 for production process management:

- **Frontend**: `npm run start:pm2` - Runs Next.js standalone server with PM2
- **Backend**: `npm run start:pm2` - Runs Medusa server with PM2
- **Configuration**: `ecosystem.config.js` in respective directories
- **Benefits**: Auto-restart on failure, zero-downtime deployments, log management

# Important Instructions

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (\*.md) or README files unless explicitly requested by the User
