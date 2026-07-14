#!/usr/bin/env bash
# Reads a component's VERSION file, prints the current value, and rewrites
# the file bumped to the next minor version (1.2.0 -> 1.3.0).
# Called by scripts/release-tag.sh, which adds the git tag/push step this
# script does not perform. research.md §2 / spec.md FR-009.
#
# Usage: bump-version.sh <path-to-VERSION-file>
# Prints the CURRENT (pre-bump) version to stdout — this is the version to
# tag/release. The file itself ends up holding the NEXT version.
set -euo pipefail

VERSION_FILE="${1:?Usage: bump-version.sh <path-to-VERSION-file>}"

if [ ! -f "$VERSION_FILE" ]; then
  echo "::error::VERSION file not found: $VERSION_FILE" >&2
  exit 1
fi

CURRENT=$(tr -d '[:space:]' < "$VERSION_FILE")

if ! [[ "$CURRENT" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
  echo "::error::VERSION file does not contain a valid x.y.z semver: '$CURRENT'" >&2
  exit 1
fi

MAJOR="${BASH_REMATCH[1]}"
MINOR="${BASH_REMATCH[2]}"
PATCH="${BASH_REMATCH[3]}"

NEXT="${MAJOR}.$((MINOR + 1)).0"

echo "$NEXT" > "$VERSION_FILE"

echo "$CURRENT"
