#!/usr/bin/env bash
# Render build command for the frontend service (source-based deploy, no Docker).
# Set as this service's Build Command in the Render dashboard:
#   ./scripts/render-build-frontend.sh
set -euo pipefail

cd "$(dirname "$0")/../frontend"

npm ci
npm run build
