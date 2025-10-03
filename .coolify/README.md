# Coolify Deployment Configuration

This directory contains Coolify-specific deployment configuration.

## Docker Compose File

Coolify should use: **`docker-compose.coolify.prod.yml`**

This file includes:
- PostgreSQL 15 database (local to Coolify)
- Redis 7 cache (local to Coolify)
- Medusa backend with auto-initialization

## Required Environment Variables

Set these in Coolify's environment variables section:

### Database
- `POSTGRES_DB=medusa_db`
- `POSTGRES_USER=medusa_user`
- `POSTGRES_PASSWORD=<strong-password>`

### Security Secrets
- `JWT_SECRET=<32+ character secret>`
- `COOKIE_SECRET=<32+ character secret>`

### Admin User
- `ADMIN_EMAIL=admin@shennastudio.com`
- `ADMIN_PASSWORD=<strong-password>`

### Optional
- `STARTUP_MODE=full` (for auto-migration, auto-seed, auto-admin-creation)
- `AUTO_MIGRATE=true`
- `AUTO_SEED=true`
- `AUTO_CREATE_ADMIN=true`

## Deployment

1. In Coolify, set the Docker Compose file path to: `docker-compose.coolify.prod.yml`
2. Add all required environment variables
3. Deploy the application
4. The system will automatically:
   - Create database tables (migrations)
   - Seed sample products
   - Create admin user
   - Start the backend on port 9000

## Access

- **Backend API**: http://your-domain:9000
- **Admin Panel**: http://your-domain:9000/app
- **Frontend**: Deploy separately or configure reverse proxy

## Notes

- PostgreSQL and Redis run as separate containers within Coolify
- All data persists in Docker volumes
- Health checks are configured for all services
- Auto-initialization runs on first startup
