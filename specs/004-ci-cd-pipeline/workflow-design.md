# Phase 1 Design: Job Graphs, Cross-Workflow Independence, Gate→Tool Mapping

Supplements `research.md`/`data-model.md` with the internal job-level design each
of the 6 workflows must follow. Backend and frontend variants share the same job
shape per workflow type — only the component-specific tool invocation differs
(see Gate → Tool → Component table below).

## Cross-workflow dependencies: none by design

The 6 workflows never reference each other via `workflow_run`, `needs` (across
workflow files), or repository-dispatch. Each triggers solely from its own event +
`paths:` filter (contracts/workflow-triggers.md). This is deliberate — per
pipeline-constitution Principle V, `develop`/`main` divergence must never let one
workflow block or wait on another. The only real ordering between them is
temporal, not a wired dependency: a `ci-main-*` run naturally happens after some
earlier `ci-develop-*` run merged, but `ci-main-*` does not `needs:` or poll for
that run's completion — it reacts only to the `push` to `main`.

## Job graph — `pr-validation-back`

```text
checkout ─┬─→ lint ─────────┐
          ├─→ test ─────────┤
          ├─→ gitleaks ─────┤
          └─→ spectral ─────┼─→ oasdiff ─┐
                             ├─→ build ───┤
                                          ├─→ constitution-guardian ─→ code-review-gate ─→ (report combined verdict)
```

- Trigger: `pull_request` (opened/synchronize) targeting `develop`, with
  `paths: ['backend/**', 'contracts/**']` (FR-000b) — the added `contracts/**`
  path is required because the OpenAPI contract lives outside `backend/**` and
  Spectral/oasdiff would otherwise never run on a contract-only change.
- `lint`, `test`, `gitleaks`, `spectral` run in parallel jobs off `checkout`
  alone (none depends on another) — kept parallel to protect NFR-001.
- `spectral` lints `contracts/openapi.yaml` (not a `backend/**` path — see
  trigger note above).
- `oasdiff` depends on `spectral` succeeding (no point diffing a contract that
  doesn't even lint); compares `contracts/openapi.yaml` on `develop` against
  the PR's copy, fails on any breaking change unless the PR title contains
  `BREAKING:` (FR-003c).
- `build` depends on `lint` + `test` succeeding — no point compiling if either
  already failed. `gitleaks`/`spectral`/`oasdiff` do not gate `build` directly
  (independent findings), but all of them gate the final combined verdict.
- `constitution-guardian` depends on `build`, `gitleaks`, and `oasdiff`
  succeeding; calls the API (contracts/constitution-guardian-api.md),
  fail-closed on any non-`pass` verdict (research.md §2).
- `code-review-gate` (Job Dummy, FR-022/023) depends on
  `constitution-guardian` succeeding — it is a no-op job that only runs, and
  only reports success, when everything upstream passed. It performs no check
  of its own.
- **No image build, no push, no dist publish** — FR-003 explicitly prohibits
  publishing from PR validation.

## Job graph — `pr-validation-front`

```text
checkout ─┬─→ lint ─────────┐
          ├─→ test ─────────┤
          └─→ gitleaks ─────┤
                             ├─→ build ─→ constitution-guardian ─→ code-review-gate ─→ (report combined verdict)
```

- `lint`, `test`, `gitleaks` run in parallel off `checkout` alone.
- `build` depends on `lint` + `test`; `constitution-guardian` depends on
  `build` and `gitleaks` succeeding.
- `code-review-gate` (Job Dummy, FR-022/023) mirrors `pr-validation-back`: runs
  only if `constitution-guardian` succeeded.
- No Spectral/oasdiff here — the OpenAPI contract lives under `backend/**`
  (per user decision, front does not re-validate it).
- **No image build, no push, no dist publish** — FR-006 explicitly prohibits
  publishing from PR validation.

## Job graph — `ci-develop-{back,front}`

```text
checkout ─┬─→ lint ─────────┐
          └─→ test ─────────┤
                             ├─→ build ─┬─→ build-image ─→ trivy-scan ─→ push-image ─→ deploy-dev ─→ health-check-dev ─→ [check-aceptance (back only)] ─→ code-review-gate
                                        └─→ publish-dist-snapshot (workflow artifact, 90d)
```

- Same `lint`/`test` parallel gate as PR validation, reusing the same tool
  invocations (build once, don't re-validate what the PR gate already proved,
  but `develop` always CI's again since merges can combine multiple approved
  PRs).
- `build-image` and `publish-dist-snapshot` both depend on `build`, run in
  parallel (image and dist are independent outputs of the same build).
- `trivy-scan` depends on `build-image`, scans the built (unpushed) image;
  fails the workflow on any critical-severity finding (FR-008/FR-010) — runs
  **before** `push-image` so a vulnerable image never reaches the registry.
- `push-image` is a **separate job** from `build-image` specifically so
  `packages: write` (pipeline-constitution Principle II / NFR-004) is scoped only
  to this one job, not the whole workflow; it depends on `trivy-scan` passing.
- `deploy-dev` depends on `push-image` (needs the image to exist in GHCR first),
  guarded by the `dev-{component}` concurrency group (FR-017).
- `health-check-dev` depends on `deploy-dev`; its result is what actually marks
  the deployment successful (FR-018/019).
- `check-aceptance` (backend only, FR-008b) depends on `health-check-dev`
  succeeding; runs `check-aceptance.js` against the `dev` API, verifying
  spec.md's acceptance scenarios against the real deployed backend. Not present
  in `ci-develop-front` (no API to exercise).
- `code-review-gate` (Job Dummy, FR-022/023) depends on whichever of the above
  is the workflow's last real gate (`check-aceptance` for backend,
  `health-check-dev` for frontend) succeeding — a no-op certification seal.

## Job graph — `ci-main-{back,front}`

```text
checkout ─┬─→ lint ─────────┐
          └─→ test ─────────┤
                             ├─→ build ─→ tag-and-release ─┬─→ build-image ─→ trivy-scan ─→ push-image ─→ deploy-pre ─→ health-check-pre ─→ [check-aceptance (back only)] ─→ code-review-gate
                                                            └─→ (bump develop VERSION)
```

- `tag-and-release` depends on `build` succeeding. It reads `VERSION` (as merged),
  creates the per-component git tag (`{component}-v{x.y.z}`), creates the GitHub
  Release, and pushes the `develop` bump commit — all per research.md §1. This is
  the one job unique to `ci-main-*` vs `ci-develop-*`.
- `build-image` uses the tag from `tag-and-release` as the image tag (`x.y.z`,
  no `-snapshot` suffix) and additionally attaches dist as a **permanent Release
  asset** instead of a 90-day workflow artifact (research.md §1/§5, FR-011/014).
- `trivy-scan` depends on `build-image`, same as `ci-develop-*`: scans before
  push, fails the workflow on a critical-severity finding (FR-011b/FR-014b) so
  neither the registry nor the GitHub Release ever gets a vulnerable image.
- `push-image`, `deploy-pre`, `health-check-pre` mirror `ci-develop-*` exactly,
  targeting `pre` instead of `dev`, gated by `trivy-scan` passing.
- `check-aceptance` (backend only, FR-011c) depends on `health-check-pre`
  succeeding; runs `check-aceptance.js` against the `pre` API. Not present in
  `ci-main-front`.
- `code-review-gate` (Job Dummy, FR-022/023) depends on the workflow's last
  real gate (`check-aceptance` for backend, `health-check-pre` for frontend) —
  a no-op certification seal, same as `ci-develop-*`.
- **`prod` deploy is NOT part of this graph** — it is the separate
  `workflow_dispatch`-triggered promotion described in
  contracts/workflow-triggers.md, gated by the `prod` environment's required
  reviewer (research.md §4). `ci-main-*` ends at `code-review-gate`.

## Gate → Tool → Component mapping

| Gate | Tool | Backend invocation | Frontend invocation | Workflow(s) |
|---|---|---|---|---|
| Lint | ESLint | `eslint src --ext .ts` | `eslint src --ext .ts,.tsx` | all 6 |
| Test | Jest | `jest --runInBand` (with test-DB setup per `pretest`) | `jest` | all 6 |
| Build | tsc / Vite | `tsc -p tsconfig.json` | `vite build` | all 6 |
| OpenAPI contract lint | Spectral | `spectral lint contracts/openapi.yaml` | — | `pr-validation-back` only (trigger includes `contracts/**`, FR-000b) |
| Breaking-change detection | oasdiff | `oasdiff breaking develop:contracts/openapi.yaml HEAD:contracts/openapi.yaml` (skipped if PR title has `BREAKING:`) | — | `pr-validation-back` only |
| Secret scanning | Gitleaks | `gitleaks detect --source backend` | `gitleaks detect --source frontend` | `pr-validation-back`, `pr-validation-front` |
| Constitution Guardian | External API | `contracts/constitution-guardian-api.md` | same | `pr-validation-*` only |
| Image build | Docker Buildx | `backend/Dockerfile` | `frontend/Dockerfile` | `ci-develop-*`, `ci-main-*` |
| Image vulnerability scan | Trivy | `trivy image ghcr.io/.../fieldops-backend:{tag}` (built, unpushed) | `trivy image ghcr.io/.../fieldops-frontend:{tag}` (built, unpushed) | `ci-develop-*`, `ci-main-*` |
| Image push | `docker/build-push-action` → GHCR | `ghcr.io/.../fieldops-backend` | `ghcr.io/.../fieldops-frontend` | `ci-develop-*`, `ci-main-*` |
| Dist publish (snapshot) | `actions/upload-artifact`, 90d | backend build output | frontend build output | `ci-develop-*` |
| Dist publish (final) | GitHub Releases API | backend build output | frontend build output | `ci-main-*` |
| Version tag/bump | git tag + commit (custom step) | `backend/VERSION` | `frontend/VERSION` | `ci-main-*` only |
| Health check | HTTP probe | `GET /health` (expects `{status:"ok"}`) | `GET /` (expects HTTP 200) | `ci-develop-*`, `ci-main-*`, promotion, rollback |
| Acceptance check | `check-aceptance.js` (custom Node script) | runs against `GET`/`POST`/etc per spec.md scenarios, targeting the deployed backend base URL; failure flags the deployment unhealthy (FR-008b/FR-011c) and blocks `prod` promotion from `pre` (FR-011c) | — (no API to target) | `ci-develop-back`, `ci-main-back` |
| Code review certification | Job Dummy (`code-review-gate`) | no-op job, `if: success()` on all upstream jobs | same | all 6, always last |
