#!/usr/bin/env bash
# Deploy integration point. spec.md Assumptions: "dev/pre/prod environments
# already defined at the infrastructure level" — this feature only triggers
# deployment to them, it does not define the target infra.
#
# Real deploy mechanism: Render, via the Render API. Each environment+component
# maps to a Render service (image-backed web service pulling from GHCR); this
# script tells that service to deploy a specific, already-built image tag —
# no rebuild, matching the promote/rollback requirement to redeploy the exact
# pre-validated artifact.
#
# Usage: deploy.sh <environment> <component> <image_tag>
#
# Required env vars (set by the calling workflow step):
#   RENDER_API_KEY      - Render API key (secrets.RENDER_API_KEY)
#   RENDER_SERVICE_ID   - Render service id for this environment+component
#                         (e.g. vars.PROD_BACKEND_RENDER_SERVICE_ID)
set -euo pipefail

ENVIRONMENT="${1:?Usage: deploy.sh <environment> <component> <image_tag>}"
COMPONENT="${2:?Usage: deploy.sh <environment> <component> <image_tag>}"
IMAGE_TAG="${3:?Usage: deploy.sh <environment> <component> <image_tag>}"

: "${RENDER_API_KEY:?RENDER_API_KEY env var is required}"
: "${RENDER_SERVICE_ID:?RENDER_SERVICE_ID env var is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY env var is required (set by GitHub Actions)}"

case "$COMPONENT" in
  backend) IMAGE_NAME="fieldops-back" ;;
  frontend) IMAGE_NAME="fieldops-front" ;;
  *) echo "::error::Unknown component '${COMPONENT}'" >&2; exit 1 ;;
esac

IMAGE_URL="ghcr.io/${GITHUB_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "::notice::Deploying ${COMPONENT} image ${IMAGE_URL} to ${ENVIRONMENT} (Render service ${RENDER_SERVICE_ID})"

RESPONSE="$(curl -sS -w '\n%{http_code}' \
  -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\": \"${IMAGE_URL}\"}")"

HTTP_CODE="$(echo "$RESPONSE" | tail -n1)"
BODY="$(echo "$RESPONSE" | sed '$d')"

if [[ "$HTTP_CODE" -ge 300 ]]; then
  echo "::error::Render deploy request failed (HTTP ${HTTP_CODE}): ${BODY}"
  exit 1
fi

DEPLOY_ID="$(echo "$BODY" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).id||'')}catch(e){console.log('')}})")"

if [[ -z "$DEPLOY_ID" ]]; then
  echo "::error::Could not read deploy id from Render response: ${BODY}"
  exit 1
fi

echo "::notice::Render deploy ${DEPLOY_ID} triggered — polling for completion"

MAX_ATTEMPTS=60   # ~10 minutes at 10s intervals
for ((i = 1; i <= MAX_ATTEMPTS; i++)); do
  sleep 10
  STATUS_RESPONSE="$(curl -sS \
    "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys/${DEPLOY_ID}" \
    -H "Authorization: Bearer ${RENDER_API_KEY}")"

  STATUS="$(echo "$STATUS_RESPONSE" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).status||'')}catch(e){console.log('')}})")"

  echo "::notice::Render deploy ${DEPLOY_ID} status: ${STATUS} (attempt ${i}/${MAX_ATTEMPTS})"

  case "$STATUS" in
    live)
      echo "::notice::Render deploy ${DEPLOY_ID} is live"
      exit 0
      ;;
    build_failed|update_failed|canceled|deactivated)
      echo "::error::Render deploy ${DEPLOY_ID} ended with status '${STATUS}'"
      exit 1
      ;;
  esac
done

echo "::error::Timed out waiting for Render deploy ${DEPLOY_ID} to go live"
exit 1
