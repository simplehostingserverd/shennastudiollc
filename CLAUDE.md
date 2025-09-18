# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shenna's Studio is an ocean-themed e-commerce platform built with Next.js and Medusa.js. It's a family-owned business that donates 10% of proceeds to ocean conservation efforts. The platform consists of a Next.js frontend and a Medusa backend for e-commerce functionality.

## Architecture

This is a monorepo structure with the frontend in the root directory and backend in `/ocean-backend/`.

- **Frontend**: Next.js 15.5.2 application in root directory with App Router, standalone output mode
- **Backend**: Medusa 2.10.1 e-commerce backend in `/ocean-backend/`
- **Database**: PostgreSQL 15 (containerized on port 5433)
- **Cache**: Redis 7 (containerized on port 6379)
- **Payment**: Stripe integration
- **Search**: Algolia (optional)
- **Images**: Cloudinary (optional)
- **Deployment**: Docker Compose orchestration with health checks

## Development Commands

### Quick Start (Recommended)

```bash
node start-dev.js                                         # Start both frontend and backend
node start-dev.js --turbo                                # Start with Turbopack (faster)
```

### Docker Development (Alternative)

```bash
docker-compose up -d --build                              # Start all services
docker-compose exec medusa-backend npx medusa db:migrate  # Run migrations
docker-compose exec medusa-backend npm run create-admin   # Create admin user
docker-compose exec medusa-backend npm run seed          # Seed data
```

### Root Level (Frontend)

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

## TypeScript Configuration

- **Frontend**: Uses Next.js TypeScript config with App Router support
- **Backend**: Standard TypeScript with Node.js 20+ target
- **Path Mapping**: Frontend uses `@/*` for absolute imports from root
- **Build Target**: ES2017 for broad compatibility

## Key Dependencies

- **Frontend**: Next.js 15.5.2, React 19.1.1, Tailwind CSS, Stripe, NextAuth 5.0.0-beta.28, Prisma 6.15.0
- **Backend**: Medusa 2.10.1, MikroORM 6.4.3, PostgreSQL, Redis, TypeScript 5.7.2
- **Testing**: Jest 30.1.2 with experimental VM modules (backend only)
- **Build Tools**: SWC compiler, Turbopack (optional)

## Project Structure

```
shennastudiollc/
├── app/                   # Next.js App Router pages and components
│   ├── about/            # About page components
│   ├── api/              # API routes
│   ├── cart/             # Shopping cart pages
│   ├── checkout/         # Checkout flow
│   ├── components/       # Reusable React components
│   ├── contact/          # Contact page
│   ├── context/          # React context providers
│   ├── faq/              # FAQ pages
│   ├── products/         # Product listing and detail pages
│   ├── returns/          # Returns policy page
│   └── shipping/         # Shipping information
├── ocean-backend/         # Medusa e-commerce backend
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
│   └── medusa-config.ts  # Medusa configuration
├── src/lib/              # Shared utilities
├── prisma/               # Database schema and migrations (frontend)
├── scripts/              # Frontend utility scripts
├── public/               # Static assets (images, favicon, etc.)
├── docker-compose.yml    # Docker orchestration for development
├── docker-compose.prod.yml # Production Docker configuration
└── Dockerfile            # Multi-stage Docker build
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

- **Frontend**: http://localhost:3000 (Next.js storefront)
- **Medusa Admin**: http://localhost:7001 (Admin dashboard)
- **Medusa API**: http://localhost:9000 (Backend API)
- **PostgreSQL**: localhost:5433 (Database)
- **Redis**: localhost:6379 (Cache)

### Production Deployment

- Use `docker-compose.prod.yml` for production with external databases
- See `COOLIFY_DEPLOYMENT.md` for Coolify deployment instructions
- See `PRODUCTION-SETUP.md` for general production setup
- Contains auto-initialization features (AUTO_MIGRATE, AUTO_SEED, AUTO_CREATE_ADMIN)

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

- **Email**: admin@shennastudio.com
- **Password**: ChangeThisPassword123!

Access at http://localhost:7001 (development) or configured admin URL.

The system includes auto-initialization that creates the admin user on first run via Docker environment variables.

## Deployment Notes

- Use Coolify VPS for production (see COOLIFY_DEPLOYMENT.md)
- Configure SSL/TLS certificates
- Set up proper CORS for production domains
- Use strong secrets in production
- Enable database backups
- Monitor health check endpoints

## Frontend Architecture Patterns

### Component Structure

- **Pages**: App Router structure in `app/` directory with route-based folders
- **Components**: Reusable UI components in `app/components/`
- **Context**: React Context providers for global state (CartContext, etc.)
- **API Integration**: Medusa.js SDK client in `src/lib/medusa.ts`

### Key Design Patterns

- **Product Fetching**: Uses Medusa SDK with error handling and loading states
- **Dynamic Imports**: Medusa client is dynamically imported to avoid SSR issues
- **Collection Filtering**: Client-side filtering using keyword matching
- **Background Images**: Uses CSS classes with Tailwind for ocean-themed backgrounds
- **State Management**: React hooks with useCallback for performance optimization

### Common Issues & Solutions

- **Backend Connection**: Frontend expects backend at `localhost:9000`, ensure backend is running
- **Background Images**: CSS classes like `products-page-background` must be defined in `globals.css`
- **Medusa Client**: Always check if client is initialized before API calls
- **CORS**: Backend must include frontend domain in STORE_CORS configuration
- **Environment Variables**: All `NEXT_PUBLIC_*` vars are exposed to browser

## Important Notes

- **Node.js Version**: Backend requires Node.js 20+
- **Package Overrides**: Both projects include security overrides for axios, braces, ws, and other dependencies
- **Development Mode**: Use Turbopack (`npm run dev:turbo`) for faster development builds
- **Database Migrations**: Always run `npx medusa db:migrate` after pulling backend changes
- **Testing**: Backend tests require experimental VM modules flag in NODE_OPTIONS
- **Next.js Configuration**: Uses standalone output mode for optimized Docker builds
- **Container Architecture**: Health checks are configured for all services
- **Image Optimization**: Configured for Cloudinary domains and unoptimized static assets
- **Container Persistence**: Uses Docker volumes for PostgreSQL data, Redis data, and Medusa uploads

## Container Architecture Details

The Docker setup includes:

- **Multi-stage builds**: Optimized for production deployment
- **Health checks**: All services have proper health monitoring
- **Named volumes**: Data persistence for database and file uploads
- **Network isolation**: Services communicate via Docker network
- **Auto-initialization**: Backend automatically migrates, seeds, and creates admin on startup
- **Service dependencies**: Proper startup order with health check dependencies

# Important Instructions

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (\*.md) or README files unless explicitly requested by the User
