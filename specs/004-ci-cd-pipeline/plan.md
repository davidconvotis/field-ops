# Implementation Plan: CI/CD Pipeline

**Branch**: `004-ci-cd-pipeline` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-ci-cd-pipeline/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Six GitHub Actions workflows (`pr-validation-{front,back}`, `ci-develop-{front,back}`,
`ci-main-{front,back}`) that gate merges with M9 checks + a Constitution Guardian API
call, then build/publish Docker images to GHCR and deploy to `dev` (auto, from
`develop`) and `pre`/`prod` (auto/manual gate, from `main`) — never rebuilding at
deploy time. Versioning is trunk-based: `develop` carries the in-progress version;
merging to `main` freezes that version on `main` and bumps `develop` to the next
minor. Within each workflow, `lint`/`test` run in parallel, gating a serial
`build → image/dist publish → deploy → health-check` chain (see
`workflow-design.md`); the 6 workflows have zero dependencies on each other.

## Technical Context

**Language/Version**: GitHub Actions YAML (workflow definitions); Node.js 20+ /
TypeScript for the two components being built (backend: Express/NestJS + Prisma;
frontend: React 18 + Vite), per `.specify/memory/constitution.md`.

**Primary Dependencies**: `actions/checkout`, `docker/setup-buildx-action`,
`docker/login-action`, `docker/build-push-action`, `docker/metadata-action` (all
pinned by SHA per pipeline-constitution Principle I); GHCR as the image registry;
GitHub Releases API for release-asset publishing; Constitution Guardian agent API
(external, called from `pr-validation-*` — contract defined in `contracts/`);
Spectral (OpenAPI contract lint) and oasdiff (breaking-change detection), both in
`pr-validation-back`; Gitleaks (secret scanning), in `pr-validation-back` and
`pr-validation-front`; Trivy (container image vulnerability scan), in
`ci-develop-*`/`ci-main-*` between `build-image` and `push-image`; a custom
`check-aceptance.js` Node script (verifies spec.md's acceptance scenarios against
the real deployed backend API), run post-health-check in `ci-develop-back` and
`ci-main-back`.

**Storage**: N/A for the pipeline itself. Snapshot dist artifacts → GitHub Actions
workflow artifacts (90-day retention). Final-version dist artifacts → permanent
GitHub Release assets. Images → GHCR.

**Testing**: Workflow correctness is validated via the `quickstart.md` scenarios
(real PRs/merges against a disposable branch) — GitHub Actions has no unit-test
harness of its own; `act` (local runner) MAY be used for fast iteration but is not
required for acceptance.

**Target Platform**: GitHub-hosted runners (`ubuntu-latest`); deploy targets are
the `dev`/`pre`/`prod` environments already defined at the infrastructure level
(out of scope to (re)define here — this feature only deploys to them).

**Project Type**: Web application (existing `backend/` + `frontend/` split) — this
feature adds CI/CD automation on top, no application source code changes.

**Performance Goals**: NFR-001 — each of the 6 workflows completes in <10 min.

**Constraints**: All constitution Principles I-IX in `pipeline-constitution.md`
v1.1.0 (SHA-pinning, least-privilege permissions, no-rebuild CD, spec-before-YAML,
per-component isolation, `GITHUB_TOKEN`-only auth, environment promotion gate,
rollback support, post-deploy health gate) plus FR-000–FR-021/NFR-001–006 in
`spec.md`.

**Scale/Scope**: 6 workflows, 2 components, 3 environments, 1 external API
dependency (Constitution Guardian).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This feature is governed by **two** constitutions:

- `.specify/memory/constitution.md` (FieldOps product constitution) — only
  Principle VI (Spec Antes que Código) applies directly; this feature is
  infrastructure, not a product slice, so Principles I-V (RBAC, API contract,
  traceability, AI fallback, small-slice) are N/A.
- `pipeline-constitution.md` v1.1.0 — all 9 principles apply directly; this is
  the primary governing document for this feature.

| Principle | Check | Status |
|---|---|---|
| Pipeline I — Pin por SHA | All `uses:` in the 6 workflows pinned by full commit SHA, including the new Spectral/oasdiff/Gitleaks/Trivy actions | Planned (task-level, Phase 2) |
| Pipeline II — Permisos Mínimos | Each job declares its own minimal `permissions:`; `packages: write` only on publish jobs | Planned |
| Pipeline III — No Rebuild en CD | `prod` promotion redeploys the exact `pre` image by digest/tag, no rebuild | Planned (FR-012/015) |
| Pipeline IV — Spec Antes que YAML | spec.md + this plan committed before any `.github/workflows/*.yml` | Satisfied by process (this plan precedes implementation) |
| Pipeline V — Flujos Separados | `paths: ['backend/**']` / `paths: ['frontend/**']` isolate the 6 workflows into 3 independent pairs | Planned (FR-000) |
| Pipeline VI — OIDC/Secrets Mínimos | `GITHUB_TOKEN` only for GHCR login; no extra PAT | Planned |
| Pipeline VII — Promoción Explícita | `prod` requires manual `environment` approval; `pre` is auto but `prod` is not | Planned (FR-012/013/015/016) |
| Pipeline VIII — Rollback | Rollback redeploys a previously published image/digest, no rebuild | Planned (FR-020) |
| Pipeline IX — Gate de Salud | Post-deploy health check gates deployment success on all 3 environments | Planned (FR-018/019) |
| FieldOps VI — Spec Antes que Código | git history shows spec → clarify → plan before `.github/workflows/` commits | Satisfied by process |

No violations identified. **Complexity Tracking is empty** — no gate requires
justification.

## Project Structure

### Documentation (this feature)

```text
specs/004-ci-cd-pipeline/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── workflow-design.md   # Phase 1 output — job graphs, gate→tool mapping, cross-workflow independence
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
.github/
└── workflows/
    ├── pr-validation-back.yml
    ├── pr-validation-front.yml
    ├── ci-develop-back.yml
    ├── ci-develop-front.yml
    ├── ci-main-back.yml
    └── ci-main-front.yml

contracts/
└── openapi.yaml           # EXISTING (per FieldOps constitution Principle II) — linted by Spectral, diffed by oasdiff; pr-validation-back additionally triggers on contracts/** (FR-000b)

backend/
├── Dockerfile            # NEW — does not exist yet, required for GHCR publish
├── VERSION               # NEW — holds the develop in-progress semver (per FR-010b)
├── src/
└── ...

scripts/
├── bump-version.sh       # EXISTING
├── deploy.sh             # EXISTING
└── check-aceptance.js    # NEW — verifies spec.md acceptance scenarios against the deployed backend API (FR-008b/FR-011c)

frontend/
├── Dockerfile            # NEW — does not exist yet, required for GHCR publish
├── VERSION               # NEW — holds the develop in-progress semver (per FR-010b)
├── src/
└── ...
```

**Structure Decision**: Existing `backend/` + `frontend/` web-application split is
reused unchanged (per FieldOps constitution stack section). This feature adds only
`.github/workflows/*.yml` plus one `Dockerfile` and one `VERSION` file per
component — no changes to application source layout. `Dockerfile`/`VERSION` do not
exist yet in the repo today; their creation is in scope for this feature (a
pipeline that publishes images needs something to build).

## Post-Design Constitution Check

*Re-evaluated after Phase 1 (research.md, data-model.md, contracts/, quickstart.md).*

All 6 decisions in research.md (§1–6) and the data model stay within the 9
pipeline-constitution principles and FR-000–FR-021 — no new violation introduced
by design:

- VERSION-file + per-component tag scheme (§1) implements FR-010b without adding
  an external tool, keeping Principle IV (spec-before-YAML) and this plan in sync.
- Fail-closed Guardian handling (§2) and single-approver `prod` gate (§4) are
  captured in `contracts/` so a task implementing them has an explicit target.
- No principle requires re-justification. **Complexity Tracking remains empty.**

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(Empty — no violations identified in either Constitution Check pass.)*
