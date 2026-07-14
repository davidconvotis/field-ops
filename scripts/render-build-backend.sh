#!/usr/bin/env bash
# Render build command for the backend service (source-based deploy, no Docker).
# Set as this service's Build Command in the Render dashboard:
#   ./scripts/render-build-backend.sh
set -euo pipefail

cd "$(dirname "$0")/../backend"

npm ci
npm run prisma:generate
npm run build
