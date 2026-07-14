# CI/CD Environment Setup (Manual, One-Time)

Per `specs/004-ci-cd-pipeline/spec.md` (FR-007, FR-010) and
`pipeline-constitution.md` v1.1.0 Principle VII. GitHub does not let
environment protection rules be defined as committed YAML, so this is a
manual repo-admin step, done once. This layer is optional (Capa 2 — CD a
dev/pre/prod) and non-blocking for the mandatory Capa 1 scope.

## Steps (GitHub repo Settings → Environments)

1. Create environment `dev`
   - No protection rules (auto-deploy from `ci-develop-{back,front}`).
2. Create environment `pre`
   - No protection rules (auto-deploy from `ci-main-{back,front}`).
3. Create environment `prod`
   - **Required reviewers**: add 1 authorized release manager (single-approver
     gate, not N-of-M — see spec.md FR-010).
   - Restrict "Deployment branches" to `main` to match FR-010 (prod deploy
     only follows a `main` Release, never an arbitrary ref).

## Verification

- `dev`/`pre` environments show "No required reviewers" in Settings → Environments.
- `prod` environment shows exactly 1 required reviewer.
- A test `workflow_dispatch` run targeting `environment: prod` pauses for
  approval before running deploy steps (confirms the gate is live).

## Required repo secret (needed NOW, Capa 1 — not optional)

`.github/actions/constitution-guardian` calls `anthropics/claude-code-action`
directly (guardián de Constitución, FR-001/FR-002), which needs an Anthropic
API key:

| Secret | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | `pr-validation-back`, `pr-validation-front` (via `constitution-guardian` composite action) |

This is a secret (not a plain variable) — it's a credential, unlike the
table below. It does **not** violate pipeline-constitution.md Principle VI
(no extra secrets for **GHCR**); that principle is scoped to registry auth,
which stays on `GITHUB_TOKEN`.

## Required repo variables (Settings → Secrets and variables → Actions → Variables) — Capa 2 only

For the health-check step (Principle IX), if/when Capa 2 (CD a dev/pre/prod)
is implemented:

| Variable | Example value | Used by |
|---|---|---|
| `DEV_BACKEND_URL` | `https://dev-api.fieldops.example` | `ci-develop-back` |
| `DEV_FRONTEND_URL` | `https://dev.fieldops.example` | `ci-develop-front` |
| `PRE_BACKEND_URL` | `https://pre-api.fieldops.example` | `ci-main-back` |
| `PRE_FRONTEND_URL` | `https://pre.fieldops.example` | `ci-main-front` |
| `PROD_BACKEND_URL` | `https://api.fieldops.example` | prod promotion/rollback (Capa 2) |
| `PROD_FRONTEND_URL` | `https://fieldops.example` | prod promotion/rollback (Capa 2) |

These are plain repo *variables* (not secrets) — none of them are
credentials, per pipeline-constitution.md Principle VI (no extra secrets).

## Out of scope

Defining the `dev`/`pre`/`prod` compute infrastructure itself (hosts, DNS,
networking) — this doc only covers the GitHub-side deployment gate, per
spec.md Assumptions ("dev/pre/prod environments already defined at the
infrastructure level").
