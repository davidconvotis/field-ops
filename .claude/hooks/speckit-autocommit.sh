#!/usr/bin/env bash
# PostToolUse hook on the Skill tool: after a speckit-* skill finishes, auto-commit
# whatever it changed with a prefix identifying the spec-kit phase.
set -uo pipefail

input="$(cat)"
skill="$(printf '%s' "$input" | jq -r '.tool_input.skill // empty' 2>/dev/null)"

case "$skill" in
  speckit-specify) prefix="spec" ;;
  speckit-clarify) prefix="clarify" ;;
  speckit-checklist) prefix="checklist" ;;
  speckit-plan) prefix="plan" ;;
  speckit-tasks) prefix="tasks" ;;
  speckit-analyze) prefix="analyze" ;;
  speckit-implement) prefix="impl" ;;
  speckit-constitution) prefix="constitution" ;;
  speckit-taskstoissues) prefix="issues" ;;
  speckit-agent-context-update) prefix="chore" ;;
  *) exit 0 ;;
esac

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$repo_root" ]; then
  exit 0
fi
cd "$repo_root" || exit 0

git add -A
if git diff --cached --quiet; then
  exit 0
fi

if git commit -m "${prefix}: auto-commit after /${skill}" --quiet; then
  sha="$(git rev-parse --short HEAD)"
  printf '{"systemMessage": "Auto-committed /%s changes as %s (%s)"}\n' "$skill" "$sha" "$prefix"
else
  printf '{"systemMessage": "speckit-autocommit: git commit failed after /%s — changes are staged but not committed, check manually"}\n' "$skill"
fi
