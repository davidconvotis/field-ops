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

## Job graph — `pr-validation-{back,front}`

```text
checkout ─┬─→ lint ─────────┐
          └─→ test ─────────┤
                             ├─→ build ─→ constitution-guardian ─→ (report combined verdict)
```

- `lint` and `test` run in parallel jobs (both only need `checkout` + dependency
  install); this is the main parallelism win keeping the workflow under 10 min
  (NFR-001).
- `build` depends on both `lint` and `test` succeeding — no point compiling if
  either already failed.
- `constitution-guardian` depends on `build` succeeding, calls the API
  (contracts/constitution-guardian-api.md), fail-closed on any non-`pass`
  verdict (research.md §2).
- **No image build, no push, no dist publish** — FR-003/FR-006 explicitly
  prohibit publishing from PR validation.

## Job graph — `ci-develop-{back,front}`

```text
checkout ─┬─→ lint ─────────┐
          └─→ test ─────────┤
                             ├─→ build ─┬─→ build-image ─→ push-image ─→ deploy-dev ─→ health-check-dev
                                        └─→ publish-dist-snapshot (workflow artifact, 90d)
```

- Same `lint`/`test` parallel gate as PR validation, reusing the same tool
  invocations (build once, don't re-validate what the PR gate already proved,
  but `develop` always CI's again since merges can combine multiple approved
  PRs).
- `build-image` and `publish-dist-snapshot` both depend on `build`, run in
  parallel (image and dist are independent outputs of the same build).
- `push-image` is a **separate job** from `build-image` specifically so
  `packages: write` (pipeline-constitution Principle II / NFR-004) is scoped only
  to this one job, not the whole workflow.
- `deploy-dev` depends on `push-image` (needs the image to exist in GHCR first),
  guarded by the `dev-{component}` concurrency group (FR-017).
- `health-check-dev` depends on `deploy-dev`; its result is what actually marks
  the deployment successful (FR-018/019).

## Job graph — `ci-main-{back,front}`

```text
checkout ─┬─→ lint ─────────┐
          └─→ test ─────────┤
                             ├─→ build ─→ tag-and-release ─┬─→ build-image ─→ push-image ─→ deploy-pre ─→ health-check-pre
                                                            └─→ (bump develop VERSION)
```

- `tag-and-release` depends on `build` succeeding. It reads `VERSION` (as merged),
  creates the per-component git tag (`{component}-v{x.y.z}`), creates the GitHub
  Release, and pushes the `develop` bump commit — all per research.md §1. This is
  the one job unique to `ci-main-*` vs `ci-develop-*`.
- `build-image` uses the tag from `tag-and-release` as the image tag (`x.y.z`,
  no `-snapshot` suffix) and additionally attaches dist as a **permanent Release
  asset** instead of a 90-day workflow artifact (research.md §1/§5, FR-011/014).
- `push-image`, `deploy-pre`, `health-check-pre` mirror `ci-develop-*` exactly,
  targeting `pre` instead of `dev`.
- **`prod` deploy is NOT part of this graph** — it is the separate
  `workflow_dispatch`-triggered promotion described in
  contracts/workflow-triggers.md, gated by the `prod` environment's required
  reviewer (research.md §4). `ci-main-*` ends at `deploy-pre`.

## Gate → Tool → Component mapping

| Gate | Tool | Backend invocation | Frontend invocation | Workflow(s) |
|---|---|---|---|---|
| Lint | ESLint | `eslint src --ext .ts` | `eslint src --ext .ts,.tsx` | all 6 |
| Test | Jest | `jest --runInBand` (with test-DB setup per `pretest`) | `jest` | all 6 |
| Build | tsc / Vite | `tsc -p tsconfig.json` | `vite build` | all 6 |
| Constitution Guardian | External API | `contracts/constitution-guardian-api.md` | same | `pr-validation-*` only |
| Image build | Docker Buildx | `backend/Dockerfile` | `frontend/Dockerfile` | `ci-develop-*`, `ci-main-*` |
| Image push | `docker/build-push-action` → GHCR | `ghcr.io/.../fieldops-backend` | `ghcr.io/.../fieldops-frontend` | `ci-develop-*`, `ci-main-*` |
| Dist publish (snapshot) | `actions/upload-artifact`, 90d | backend build output | frontend build output | `ci-develop-*` |
| Dist publish (final) | GitHub Releases API | backend build output | frontend build output | `ci-main-*` |
| Version tag/bump | git tag + commit (custom step) | `backend/VERSION` | `frontend/VERSION` | `ci-main-*` only |
| Health check | HTTP probe | `GET /health` (expects `{status:"ok"}`) | `GET /` (expects HTTP 200) | `ci-develop-*`, `ci-main-*`, promotion, rollback |
