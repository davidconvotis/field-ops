---

description: "Task list for feature implementation"

---

# Tasks: CI/CD Pipeline

**Input**: Design documents from `/specs/004-ci-cd-pipeline/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, workflow-design.md, contracts/, quickstart.md

**Tests**: Not requested — no dedicated test tasks generated; `quickstart.md` scenarios serve as end-to-end validation (Polish phase).

**Organization**: Tasks are grouped by user story (US1/US2/US3 from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1/US2/US3)
- Exact file paths are included in each description

## Path Conventions

Existing web-app split (`backend/`, `frontend/`) is reused; new files for this
feature land in `.github/workflows/`, `.github/actions/`, `scripts/`, plus one
`Dockerfile`/`VERSION` per component (per plan.md Project Structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Files and repo configuration every workflow ultimately depends on, none of which requires the other stories to exist first.

- [X] T001 [P] Create `backend/Dockerfile` (multi-stage: install deps → `tsc` build → slim Node 20 runtime), per research.md §5
- [X] T002 [P] Create `frontend/Dockerfile` (multi-stage: install deps → `vite build` → static assets on `nginx:alpine`, digest-pinned), per research.md §5
- [X] T003 [P] Create `backend/VERSION` containing `0.1.0` (initial in-progress version, per research.md §1)
- [X] T004 [P] Create `frontend/VERSION` containing `0.1.0` (initial in-progress version, per research.md §1)
- [X] T005 Document manual repo setup in `docs/ci-cd-environment-setup.md`: create GitHub `environment`s `dev`, `pre`, `prod`; add 1 required reviewer to `prod` only (research.md §4)

**Checkpoint**: Dockerfiles, VERSION files, and environment setup instructions exist — nothing here blocks starting US1, but US2/US3 need T001-T004 before their workflows can build/deploy anything real.

---

## Phase 2: Foundational (Blocking Prerequisites for US2 + US3)

**Purpose**: Composite actions shared by 2+ workflows across US2 and US3 (US1 needs none of these — it never touches GHCR, deploys, or deployment records).

**⚠️ CRITICAL**: US2 and US3 workflow tasks reference these actions by path — they must exist first. US1 is NOT blocked by this phase and can proceed in parallel.

- [X] T006 [P] Create composite action `.github/actions/ghcr-login/action.yml` — logs into GHCR using `${{ secrets.GITHUB_TOKEN }}` only, no extra secret (NFR-005 / pipeline-constitution Principle VI)
- [X] T007 [P] Create composite action `.github/actions/health-check/action.yml` — inputs `component`, `base_url`; probes `GET /health` (backend, expects `{status:"ok"}`) or `GET /` (frontend, expects HTTP 200); fails the step on non-2xx or timeout (research.md §6, FR-018/019) — also emits `flagged_for_rollback` output (T020 folded in here)
- [X] T008 [P] Create composite action `.github/actions/record-deployment/action.yml` — inputs `environment`, `component`, `artifact_tag`, `trigger` (`auto-deploy`\|`manual-promotion`\|`rollback`); writes a Deployment Record (data-model.md) via the GitHub Deployments API, readable later to find "the previous artifact" for rollback (FR-021, research.md §3)

**Checkpoint**: `.github/actions/{ghcr-login,health-check,record-deployment}` exist — US2 and US3 workflow tasks can now proceed.

---

## Phase 3: User Story 1 - Automatic Validation on Every Change (Priority: P1) 🎯 MVP

**Goal**: A PR touching only `backend/` or only `frontend/` triggers exactly that component's validation (M9 gates + Constitution Guardian) and blocks merge on failure.

**Independent Test**: Open a `feature/*` PR into `develop` touching only `backend/`; confirm only `pr-validation-back` runs, reports pass/fail on the PR, and a forced lint failure blocks merge. Repeat for a `frontend/`-only PR.

### Implementation for User Story 1

- [X] T009 [P] [US1] Create composite action `.github/actions/constitution-guardian/action.yml` — calls the Guardian API per `contracts/constitution-guardian-api.md`; treats timeout/5xx/malformed response as `fail` (fail-closed, research.md §2)
- [X] T010 [P] [US1] Create `.github/workflows/pr-validation-back.yml` — trigger `pull_request` (opened/synchronize) targeting `develop`, `paths: ['backend/**']`; jobs `lint` ‖ `test` → `build` → constitution-guardian (via T009); every `uses:` pinned by full SHA; job permissions limited to `contents: read` (workflow-design.md job graph)
- [X] T011 [P] [US1] Create `.github/workflows/pr-validation-front.yml` — mirror of T010 scoped to `paths: ['frontend/**']` and frontend lint/test/build commands
- [X] T012 [US1] Document required-status-checks setup in `docs/ci-cd-branch-protection.md`: `develop` branch protection requires `pr-validation-back` and `pr-validation-front` to pass before merge (FR-002/FR-005)

**Checkpoint**: User Story 1 fully functional and independently testable — PR validation works with zero dependency on US2/US3 artifacts.

---

## Phase 4: User Story 2 - Controlled Promotion to an Environment (Priority: P2)

**Goal**: A merge to `develop` auto-builds/publishes/deploys a snapshot to `dev`; a merge to `main` freezes the version, publishes a final release, auto-deploys to `pre`, and allows a gated manual promotion to `prod` — never rebuilding.

**Independent Test**: Merge a validated change to `develop`, confirm a snapshot image reaches `dev` automatically; merge to `main`, confirm version freeze/bump + release + auto-deploy to `pre`; trigger `promote-prod` and confirm the *same* image reaches `prod` only after approval.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create `scripts/bump-version.sh` — reads a `VERSION` file, prints the current value, and rewrites it bumped to the next minor (`1.2.0` → `1.3.0`), per research.md §1
- [X] T014 [P] [US2] Create `.github/workflows/ci-develop-back.yml` — trigger `push` to `develop`, `paths: ['backend/**']`; jobs `lint` ‖ `test` → `build` (incl. dist upload) → `build-image` [uses T006, `packages: write` scoped to this job only] → `deploy-dev` [uses T008, `concurrency: dev-backend`] → health check [T007] (workflow-design.md `ci-develop-*` graph, FR-007/008)
- [X] T015 [P] [US2] Create `.github/workflows/ci-develop-front.yml` — mirror of T014 for frontend, `paths: ['frontend/**']`, `concurrency: dev-frontend` (FR-009/010)
- [X] T016 [US2] Create `.github/workflows/ci-main-back.yml` — trigger `push` to `main`, `paths: ['backend/**']`; jobs `lint` ‖ `test` → `build` → `tag-and-release` (reads `backend/VERSION`, tag-exists race guard per analyze finding E1, creates tag `backend-v{x.y.z}`, creates permanent GitHub Release, runs T013 and pushes the bump commit to `develop`) → `build-image` (tag `x.y.z`) → `deploy-pre` [T006, T008, `concurrency: ci-main-back` repo-wide] → health check [T007] (workflow-design.md `ci-main-*` graph, FR-010b/011, depends on T013)
- [X] T017 [US2] Create `.github/workflows/ci-main-front.yml` — mirror of T016 for frontend, `paths: ['frontend/**']`, tag `frontend-v{x.y.z}`, `concurrency: ci-main-front` (FR-014, depends on T013)
- [X] T018 [US2] Create `.github/workflows/promote-prod.yml` — `workflow_dispatch` inputs `component`, `image_tag`; verifies against the pre Deployment Record before the `environment: prod` gate (1 required reviewer); rejects if `image_tag` isn't the one currently running in `pre`; redeploys that exact image [T006, T008] with no rebuild, `concurrency: prod-${{ inputs.component }}`; health check [T007] (contracts/workflow-triggers.md, FR-012/013/015/016)

**Checkpoint**: User Stories 1 AND 2 both work independently — `dev`/`pre`/`prod` promotion pipeline is fully functional.

---

## Phase 5: User Story 3 - Fast Rollback and Deployment Health Confirmation (Priority: P3)

**Goal**: Every deployment is health-gated before being called successful, and a bad deployment can be rolled back to the previous known-good artifact without rebuilding.

**Independent Test**: With a known version running in any environment, trigger `rollback.yml` for that `(component, environment)`; confirm the previous artifact redeploys with no build step and its health check reruns before being marked successful.

### Implementation for User Story 3

- [X] T019 [P] [US3] Create `.github/workflows/rollback.yml` — `workflow_dispatch` inputs `component`, `environment`; looks up the previous artifact for that `(component, environment)` via T008's recorded history; redeploys it [T006] with no build step, `concurrency: ${{ inputs.environment }}-${{ inputs.component }}`; re-runs `health-check` [T007]; records the rollback via T008 with `trigger: rollback` (FR-011/020, research.md §3)
- [X] T020 Done as part of T007 — `.github/actions/health-check/action.yml` already emits `flagged_for_rollback` output on failure (FR-019)

**Checkpoint**: All 3 user stories independently functional — validation, promotion, and rollback/health-confirmation all work standalone and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Repo-wide verification and documentation once all stories are in place.

- [X] T021 [P] Create `README.md` (didn't exist) with a CI/CD section: branch → workflow → environment mapping table (from spec.md)
- [X] T022 [P] Audited all 8 workflows + 4 composite actions — every `uses:` pinned by full 40-char commit SHA (fetched live from GitHub API, not guessed), pipeline-constitution Principle I — 0 mutable tags found
- [X] T023 [P] Audited every job across all 8 workflows — all declare explicit `permissions:`; `packages: write` only on the 4 `build-image` jobs; `contents: write` only on the 2 `tag-and-release` jobs — pipeline-constitution Principle II / NFR-004
- [X] T024 **Partial** — could not run live quickstart.md scenarios (no GitHub remote/Actions runner in this environment). Did instead: YAML-parsed all 12 workflow/action files (0 errors), bash -n on both scripts (0 errors), and ran the exact `lint`/`build` commands each workflow invokes locally for both components (all exit 0; backend build output confirmed at `dist/src/api/app.js` matching the Dockerfile CMD). Real end-to-end run (PR open, merge, dispatch) still needs to happen against the actual GitHub repo.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: No dependency on Phase 1's outputs, but conceptually follows it — BLOCKS US2 and US3 only (US1 does not depend on Phase 2)
- **US1 (Phase 3)**: Depends only on Phase 1 completing (repo exists) — can start in parallel with Phase 2
- **US2 (Phase 4)**: Depends on Phase 1 (T001-T004) AND Phase 2 (T006, T008)
- **US3 (Phase 5)**: Depends on Phase 2 (T006, T007, T008) AND on US2 existing conceptually (there must be a deployment to roll back from) — implement after US2 for a meaningful independent test, though the workflow file itself has no file-level dependency on US2's workflow files
- **Polish (Phase 6)**: Depends on all 3 stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependency on US2/US3 — fully independent
- **US2 (P2)**: No dependency on US1's workflow files (independent artifacts), but delivers no value without Phase 1/2 foundations
- **US3 (P3)**: Reuses US2's `record-deployment` history to have something to roll back to — implement after US2 is deployed at least once for realistic testing

### Parallel Opportunities

- T001-T004 (Setup) all parallel; T005 is a docs-only task, also parallel
- T006-T008 (Foundational) all parallel with each other, and with all of Phase 3 (US1)
- T009-T011 (US1) parallel; T012 depends on T010+T011 existing
- T013 (US2) parallel with T014/T015 start, but T016/T017 depend on T013
- T014/T015 (ci-develop-*) parallel with each other and with T016/T017 (ci-main-*)
- T019 (US3) parallel with Phase 4 tasks once Phase 2 is done
- T021-T023 (Polish) all parallel; T024 runs last

---

## Parallel Example: User Story 1

```bash
# After Phase 1 completes, launch US1's independent-file tasks together:
Task: "Create composite action .github/actions/constitution-guardian/action.yml"
Task: "Create .github/workflows/pr-validation-back.yml"
Task: "Create .github/workflows/pr-validation-front.yml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 3: User Story 1 (T009-T012) — Phase 2 is NOT required for US1
3. **STOP and VALIDATE**: Run quickstart.md Scenario 1 + Scenario 5 (Guardian fail-closed)
4. This alone delivers real value: no more broken code reaching `develop`/`main` unreviewed

### Incremental Delivery

1. Setup → US1 (MVP: validation gate live)
2. Add Foundational (T006-T008) → US2 (T013-T018) → validate Scenarios 2/3 → `dev`/`pre`/`prod` promotion live
3. Add US3 (T019-T020) → validate Scenario 4 → rollback safety net live
4. Polish (T021-T024) → full quickstart.md pass

### Parallel Team Strategy

With multiple engineers:

1. One engineer: Setup (T001-T005)
2. In parallel: Engineer A takes US1 (T009-T012, no Phase 2 dependency); Engineer B takes Foundational (T006-T008) then starts US2 (T013-T018)
3. Once US2 lands, a third engineer takes US3 (T019-T020)
4. Regroup for Polish (T021-T024)

---

## Notes

- [P] tasks touch different files with no unmet dependencies
- [Story] label maps every Phase 3+ task to US1/US2/US3 for traceability
- No test tasks generated — tests were not requested for this feature; `quickstart.md` is the validation mechanism (T024)
- Commit after each task or logical group
- The three deferred clarifications resolved in research.md (Guardian fail-closed, single-artifact rollback, single-approver `prod`) are implemented by T009, T019, and T018 respectively — no further open decisions block implementation
