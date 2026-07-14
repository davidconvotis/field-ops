#!/usr/bin/env bash
# Creates and pushes the git tag that ci-main-{back,front}.yml waits for.
# bump-version.sh only rewrites the component's VERSION file and prints the
# current (pre-bump) version — it never touches git. This wrapper adds the
# missing step: tag the CURRENT version (prefixed by component so
# ci-main-back.yml / ci-main-front.yml can each resolve their own release
# independently) and push it.
# spec.md FR-009 / research.md §2 (analyze findings C1/C2).
#
# Usage: release-tag.sh <back|front>
set -euo pipefail

COMPONENT="${1:?Usage: release-tag.sh <back|front>}"

case "$COMPONENT" in
  back) VERSION_FILE="backend/VERSION" ;;
  front) VERSION_FILE="frontend/VERSION" ;;
  *) echo "::error::Unknown component '$COMPONENT' (expected 'back' or 'front')" >&2; exit 1 ;;
esac

CURRENT=$(scripts/bump-version.sh "$VERSION_FILE")
TAG="${COMPONENT}-v${CURRENT}"

git tag -a "$TAG" -m "Release ${COMPONENT} ${CURRENT}"
git push origin "$TAG"

echo "$TAG"
