# Quickstart: Validating the CI/CD Pipeline

End-to-end scenarios to prove the 6 workflows behave per `spec.md`. Run against a
disposable `feature/*` branch — do not use real `prod`.

## Prerequisites

- `backend/Dockerfile`, `frontend/Dockerfile`, `backend/VERSION`, `frontend/VERSION`
  exist (Phase 2 tasks create these).
- `.github/workflows/{pr-validation,ci-develop,ci-main}-{back,front}.yml` exist.
- Repo has `dev`, `pre`, `prod` GitHub `environment`s configured; `prod` has one
  required reviewer.
- GHCR write access is via `GITHUB_TOKEN` only (no extra secrets configured or
  needed).

## Scenario 1 — Isolated PR validation (US1, FR-000–006)

1. Create `feature/test-backend-only`, edit a file under `backend/`, open a PR
   into `develop`.
2. **Expect**: only `pr-validation-back` runs; `pr-validation-front` does not
   trigger. Check completes in <10 min (NFR-001) and reports pass/fail on the PR.
3. Repeat with a `frontend/`-only change on a separate branch/PR — confirm the
   mirror image (only `pr-validation-front` runs).
4. Force a lint failure in the backend change — confirm merge is blocked and the
   Constitution Guardian call result (if reached) is visible in the check output.

## Scenario 2 — `develop` merge → snapshot → `dev` (FR-007–010)

1. Merge the passing PR from Scenario 1 into `develop`.
2. **Expect**: `ci-develop-back` runs full CI, publishes
   `fieldops-backend:{version}-snapshot.{sha}` to GHCR, uploads dist as a workflow
   artifact, and auto-deploys to `dev`.
3. Confirm `dev`'s backend health check (`/health`) passes and the deployment is
   recorded (data-model.md Deployment Record) with `trigger: auto-deploy`.

## Scenario 3 — `main` merge → version freeze/bump → `pre` (FR-010b, FR-011–016)

1. Note `backend/VERSION` on `develop` (e.g. `1.2.0`).
2. Merge `develop` into `main` (or the relevant release PR).
3. **Expect**:
   - `ci-main-back` tags `main` `backend-v1.2.0`, publishes image `1.2.0`, creates
     a permanent GitHub Release with dist assets, auto-deploys to `pre`.
   - A follow-up commit on `develop` bumps `backend/VERSION` to `1.3.0`.
4. Confirm `pre`'s health check passes before the deployment is marked successful.
5. Trigger the `prod` promotion `workflow_dispatch` with `image_tag: 1.2.0`.
   **Expect**: blocked pending the required `prod` environment approval; after
   approval, `prod` runs the identical `1.2.0` image (no rebuild, SC-002) and its
   health check gates success.

## Scenario 4 — Rollback (FR-011/FR-020, US3)

1. With `1.2.0` running in `prod`, trigger the rollback `workflow_dispatch` for
   `component: backend`, `environment: prod`.
2. **Expect**: the previous artifact (pre-`1.2.0`) redeploys without any build
   step, health check reruns, and the action completes in <10 min (SC-003).

## Scenario 5 — Guardian-down fail-closed (research.md §2)

1. Point the Guardian API call at an unreachable endpoint (test-only override).
2. Open a PR with a valid backend change.
3. **Expect**: `pr-validation-back` reports failure and blocks merge, even though
   M9 gates alone would have passed.

## Cleanup

Delete the disposable `feature/*` branch(es); if `prod`/`pre` were touched with
test images, roll back to the last real release afterward.
