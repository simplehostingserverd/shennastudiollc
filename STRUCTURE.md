# Project Structure

This document outlines the reorganized project structure for Shenna's Studio.

## Directory Overview

```
shennastudiollc/
├── frontend/              # Next.js storefront application
├── backend/               # Medusa e-commerce backend
├── docs/                  # All documentation files
├── scripts/               # Utility scripts
│   ├── railway/          # Railway deployment scripts
│   └── deployment/       # General deployment scripts
├── config/                # Configuration files
│   ├── railway/          # Railway configurations
│   └── nixpacks/         # Nixpacks configurations
├── logs/                  # Log files
└── uploads/               # Upload directory

## Root Files

- `.env` - Environment variables (not committed)
- `.env.example` - Environment variable template
- `.env.production` - Production environment variables (not committed)
- `docker-compose.yml` - Development Docker orchestration
- `docker-compose.dev.yml` - Minimal development setup
- `docker-compose.prod.yml` - Production Docker orchestration
- `CLAUDE.md` - Claude Code project instructions
- `README.md` - Project documentation
- `Procfile` - Process file for deployment
- `.gitignore` - Git ignore rules
- `.dockerignore` - Docker ignore rules
- `.railwayignore` - Railway ignore rules
- `.mcp.json` - MCP configuration
- `.nvmrc` - Node version specification

## Frontend Directory (`frontend/`)

Contains the Next.js 15.5.3 storefront application:

- `app/` - Next.js App Router pages and components
- `src/lib/` - Shared utilities
- `prisma/` - Database schema and migrations
- `scripts/` - Frontend utility scripts
- `public/` - Static assets
- `package.json` - Frontend dependencies
- `Dockerfile` - Frontend Docker build

## Backend Directory (`backend/`)

Contains the Medusa 2.10.1 e-commerce backend:

- `src/` - Backend source code
  - `admin/` - Admin panel customizations
  - `api/` - Custom API routes
  - `jobs/` - Background jobs
  - `links/` - Module links
  - `modules/` - Custom modules
  - `scripts/` - Utility scripts (seed, create-admin)
  - `subscribers/` - Event subscribers
  - `workflows/` - Business workflows
- `integration-tests/` - HTTP and module integration tests
- `medusa-config.ts` - Medusa configuration
- `package.json` - Backend dependencies
- `Dockerfile` - Backend Docker build

## Documentation (`docs/`)

All documentation files organized by topic:

### Coolify Deployment
- Coolify setup guides
- Coolify environment configuration
- Coolify Docker Compose setup

### Railway Deployment
- Railway setup guides
- Railway configuration files
- Railway environment setup
- Railway troubleshooting

### General
- Security documentation
- Testing results
- Deployment checklists
- CORS configuration

## Scripts (`scripts/`)

### Railway Scripts (`scripts/railway/`)
- Railway deployment automation
- Environment variable management
- Service configuration

### Deployment Scripts (`scripts/deployment/`)
- Health check scripts
- Admin user creation
- Diagnostic tools

## Configuration (`config/`)

### Railway Config (`config/railway/`)
- Railway service configurations
- Environment variable JSON files
- Railway templates

### Nixpacks Config (`config/nixpacks/`)
- Nixpacks build configurations

### Root Config Files
- `.env.coolify.example` - Coolify environment template
- `.env.production.example` - Production environment template
- `.env.vault` - Encrypted environment variables
- `docker-compose.coolify.yml` - Coolify Docker Compose
- `docker-compose.coolify.prod.yml` - Coolify production setup
- `init-db.sql` - Database initialization script

## Development Workflow

### Local Development

1. **Start both services:**
   ```bash
   node start-dev.js
   ```

2. **Or start individually:**
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend
   cd frontend && npm run dev
   ```

### Docker Development

```bash
# Start all services
docker-compose up -d --build

# Run migrations
docker-compose exec medusa-backend npx medusa db:migrate

# Create admin user
docker-compose exec medusa-backend npm run create-admin

# Seed data
docker-compose exec medusa-backend npm run seed
```

## Migration Notes

This structure was reorganized from:
- Root directory → `frontend/`
- `ocean-backend/` → `backend/`
- Various `.md` files → `docs/`
- Various scripts → `scripts/railway/` and `scripts/deployment/`
- Config files → `config/`

All Docker Compose files, documentation, and configuration files have been updated to reflect the new paths.
