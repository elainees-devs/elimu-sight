#!/usr/bin/env bash
set -euo pipefail

# ElimuSight — Database Migration Script
# Usage: ./scripts/migrate.sh [command]
#   command: deploy | dev | reset (default: deploy)

COMMAND="${1:-deploy}"

echo "🗄️  Running Prisma migration (${COMMAND})..."

case "${COMMAND}" in
    deploy)
        npx prisma migrate deploy
        ;;
    dev)
        npx prisma migrate dev
        ;;
    reset)
        npx prisma migrate reset --force
        ;;
    generate)
        npx prisma generate
        ;;
    *)
        echo "Usage: $0 [deploy|dev|reset|generate]"
        exit 1
        ;;
esac

echo "✅ Migration (${COMMAND}) complete!"
