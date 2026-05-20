#!/usr/bin/env bash
set -euo pipefail

# ElimuSight — Deployment Script
# Usage: ./scripts/deploy.sh [environment]
#   environment: production | staging (default: production)

ENVIRONMENT="${1:-production}"
COMPOSE_FILE="docker-compose.yml"

echo "🚀 Deploying ElimuSight to ${ENVIRONMENT}..."

if [ "${ENVIRONMENT}" = "production" ]; then
    export NODE_ENV=production
fi

# Pull latest images
echo "📦 Pulling latest images..."
docker compose -f "${COMPOSE_FILE}" pull

# Build and deploy
echo "🔨 Building services..."
docker compose -f "${COMPOSE_FILE}" build

# Run migrations
echo "🗄️  Running database migrations..."
docker compose -f "${COMPOSE_FILE}" run --rm api npx prisma migrate deploy

# Start services
echo "▶️  Starting services..."
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans

# Health check
echo "🏥 Waiting for health checks..."
sleep 10
docker compose -f "${COMPOSE_FILE}" ps

echo "✅ Deployment to ${ENVIRONMENT} complete!"
