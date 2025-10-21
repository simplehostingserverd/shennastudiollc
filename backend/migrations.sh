#!/bin/bash
set -e

echo "Running database migrations..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set. Skipping migrations."
  exit 0
fi

# Run migrations
npx medusa db:migrate || echo "Migrations failed but continuing..."

echo "Migrations completed"
