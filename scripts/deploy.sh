#!/usr/bin/env bash
# Deploy integration point. spec.md Assumptions: "dev/pre/prod environments
# already defined at the infrastructure level" — this feature only triggers
# deployment to them, it does not define the target infra (hosts, k8s,
# ECS, etc). Replace this stub with the real deploy mechanism for this repo's
# actual infrastructure before relying on this pipeline in production.
#
# Usage: deploy.sh <environment> <component> <image_tag>
set -euo pipefail

ENVIRONMENT="${1:?Usage: deploy.sh <environment> <component> <image_tag>}"
COMPONENT="${2:?Usage: deploy.sh <environment> <component> <image_tag>}"
IMAGE_TAG="${3:?Usage: deploy.sh <environment> <component> <image_tag>}"

echo "::notice::Deploying ${COMPONENT} image tag ${IMAGE_TAG} to ${ENVIRONMENT}"
echo "TODO: replace this stub with the real deploy command for this repo's infrastructure"
echo "  (e.g. kubectl set image, ecs update-service, ssh + docker compose pull/up, etc.)"
