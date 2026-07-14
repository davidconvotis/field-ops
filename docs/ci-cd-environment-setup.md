# CI/CD Environment Setup (Manual, One-Time)

Per `specs/004-ci-cd-pipeline/plan.md` and `pipeline-constitution.md` v1.1.0
Principle VII. GitHub does not let environment protection rules be defined as
committed YAML, so this is a manual repo-admin step, done once.

## Steps (GitHub repo Settings → Environments)

1. Create environment `dev`
   - No protection rules (auto-deploy from `ci-develop-{back,front}`).
2. Create environment `pre`
   - No protection rules (auto-deploy from `ci-main-{back,front}`).
3. Create environment `prod`
   - **Required reviewers**: add 1 authorized release manager (research.md §4 —
     single-approver gate, not N-of-M).
   - Do **not** restrict to `main` only via "Deployment branches" if
     `promote-prod.yml`/`rollback.yml` use `workflow_dispatch` from any ref —
     otherwise restrict to `main` to match FR-013/016.

## Verification

- `dev`/`pre` environments show "No required reviewers" in Settings → Environments.
- `prod` environment shows exactly 1 required reviewer.
- A test `workflow_dispatch` run targeting `environment: prod` pauses for
  approval before running deploy steps (confirms the gate is live).

## Required repo variables (Settings → Secrets and variables → Actions → Variables)

For health checks (`.github/actions/health-check`) and the Constitution
Guardian call (`.github/actions/constitution-guardian`) to know where to
probe/call:

| Variable | Example value | Used by |
|---|---|---|
| `CONSTITUTION_GUARDIAN_API_URL` | `https://guardian.internal/api/check` | `pr-validation-{back,front}` |
| `DEV_BACKEND_URL` | `https://dev-api.fieldops.example` | `ci-develop-back` |
| `DEV_FRONTEND_URL` | `https://dev.fieldops.example` | `ci-develop-front` |
| `PRE_BACKEND_URL` | `https://pre-api.fieldops.example` | `ci-main-back` |
| `PRE_FRONTEND_URL` | `https://pre.fieldops.example` | `ci-main-front` |
| `PROD_BACKEND_URL` | `https://api.fieldops.example` | `promote-prod`, `rollback` |
| `PROD_FRONTEND_URL` | `https://fieldops.example` | `promote-prod`, `rollback` |

These are plain repo *variables* (not secrets) — none of them are
credentials, per NFR-005 / Principle VI (no extra secrets).

## Out of scope

Defining the `dev`/`pre`/`prod` compute infrastructure itself (hosts, DNS,
networking) — this doc only covers the GitHub-side deployment gate, per
spec.md Assumptions ("already defined at the infrastructure level").
