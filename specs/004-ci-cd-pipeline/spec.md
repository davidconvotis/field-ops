# Feature Specification: CI/CD Pipeline

**Feature Branch**: `004-ci-cd-pipeline`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "CI/CD pipeline feature — implement GitHub Actions workflows for FieldOps per pipeline-constitution.md v1.1.0: separate CI/CD flows for backend and frontend, SHA-pinned actions, minimal per-job permissions, CD deploys pre-built GHCR image without rebuild, environment promotion gate, rollback support, post-deploy health check gate, GITHUB_TOKEN-only auth to GHCR (no extra secrets)."

## Clarifications

### Session 2026-07-13

- Q: ¿Cómo se detectan cambios por ruta (`paths:` filter exacto, qué patrones)? → A: `paths: ['backend/**']` / `paths: ['frontend/**']` — root-level component dirs only
- Q: ¿Cómo se calcula versión semver — snapshot vs final? → A: Snapshot `x.y.z-snapshot.{sha}` (short commit SHA) on `develop`; final `x.y.z` read directly from the git tag on `main`
- Q: ¿Cómo se diferencia artefacto dist develop vs main? → A: `develop` snapshot dist stored as a GitHub Actions workflow artifact with 90-day retention; `main` final dist stored as a GitHub Release asset, permanent
- Q: ¿Quién crea el tag semver antes del merge a main? → A: Automated — `ci-main-*` computes and creates the semver tag itself on merge, no manual tagging step

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Validation on Every Change (Priority: P1)

A developer pushes a change to the backend or frontend (or opens a pull request).
The system automatically builds and tests only the affected component and reports
a pass/fail result before the change can be merged.

**Why this priority**: Without automatic validation, broken code reaches `main` and
blocks everyone. This is the minimum viable slice — it delivers value the moment a
single component has a working pipeline, even before deployment exists.

**Independent Test**: Push a backend-only change and a frontend-only change
separately; confirm only the corresponding pipeline runs and reports a clear
pass/fail status on the change.

**Acceptance Scenarios**:

1. **Given** a pull request that only touches backend code, **When** it is opened
   or updated, **Then** only the backend validation pipeline runs and its result is
   visible on the pull request.
2. **Given** a pull request that only touches frontend code, **When** it is opened
   or updated, **Then** only the frontend validation pipeline runs, independently of
   the backend pipeline.
3. **Given** a validation pipeline fails, **When** a reviewer looks at the change,
   **Then** the failure is clearly reported and merging is discouraged/blocked.

---

### User Story 2 - Controlled Promotion to an Environment (Priority: P2)

A release manager promotes a change that has already passed validation and been
published as a build artifact to a target environment (`pre`, then `prod`),
without triggering a fresh build.

**Why this priority**: Once validation exists, teams need a safe, repeatable way to
actually ship the validated artifact. This depends on Story 1 (there must be
something validated to promote) but is independently demonstrable once a build
artifact exists.

**Independent Test**: Take an already-validated and published build artifact and
promote it to `pre`, then to `prod`, confirming no rebuild occurs and the exact
same artifact reaches both environments.

**Acceptance Scenarios**:

1. **Given** a build artifact has been validated and published, **When** it
   auto-deploys to `pre`, **Then** `pre` runs that exact artifact.
2. **Given** an artifact is running correctly in `pre`, **When** a release manager
   explicitly promotes it to `prod`, **Then** `prod` runs the identical artifact
   (not a rebuild).
3. **Given** no deliberate promotion action has been taken, **When** a change merges
   to the main line, **Then** production is not automatically updated.

---

### User Story 3 - Fast Rollback and Deployment Health Confirmation (Priority: P3)

After a deployment, the system automatically confirms the new version is healthy.
If it isn't, or if a release manager later discovers a problem, they can restore
the previous known-good version quickly, without waiting for a new build.

**Why this priority**: This closes the safety loop around Story 2. It's lower
priority because it's only needed once deployments already happen, but it is what
makes deployments low-risk enough to trust.

**Independent Test**: Deploy a version, then trigger a rollback action, and confirm
the previous artifact is restored and confirmed healthy without any build step
running.

**Acceptance Scenarios**:

1. **Given** a deployment has just completed, **When** the post-deploy health check
   runs, **Then** the deployment is only marked successful if the check passes.
2. **Given** a post-deploy health check fails, **When** this happens, **Then** the
   failure is visible and flagged for rollback, not silently ignored.
3. **Given** a release manager needs to undo a bad deployment, **When** they trigger
   rollback, **Then** the previously known-good artifact is redeployed without
   rebuilding, and its health is reconfirmed.

### Edge Cases

- What happens when a change touches both backend and frontend in the same commit?
  Both validation pipelines MUST run independently, each reporting its own result.
- What happens when someone attempts to promote to production without an already
  validated and published artifact? The promotion MUST be rejected.
- What happens when the post-deploy health check cannot reach the deployed service
  at all (not just an unhealthy response)? It MUST be treated as a failed check.
- What happens when a rollback target no longer exists (artifact retention expired
  or was deleted)? The rollback MUST fail clearly rather than silently deploying
  something else.
- What happens when two people trigger a promotion to the same environment at the
  same time? The system MUST prevent overlapping deployments to the same
  environment from racing each other.

## Requirements *(mandatory)*

### Branch → Workflow Mapping

| Evento | Componente afectado | Workflow(s) | Qué debe ocurrir |
|---|---|---|---|
| PR `feature/*` → `develop` | Front y/o back (solo el que tiene cambios) | `pr-validation-front`, `pr-validation-back` | Todas las gates de M9 (lint + test + build) + llamada a la API del agente guardián de Constitución. Bloquea el merge si falla cualquiera de las dos. |
| Merge a `develop` | Front y/o back (solo el que tiene cambios) | `ci-develop-front`, `ci-develop-back` | CI completo + imagen **snapshot** + publicación en el registro + CD automático a `dev`. |
| Merge a `main` | Front y/o back (solo el que tiene cambios) | `ci-main-front`, `ci-main-back` | CI completo + imagen **versión final** + GitHub Release con artefactos + CD automático a `pre` + CD a `prod` con aprobación manual. |

Each pair runs independently per component (front/back); a change touching only one
component MUST NOT trigger the other component's workflow (constitution Principle V).

### Environment Mapping

| Environment | Fed by branch | Deploy trigger | Approval required |
|---|---|---|---|
| `dev` | `develop` | Automatic, on successful `ci-develop-*` | No |
| `pre` (staging) | `main` | Automatic, on successful `ci-main-*` | No |
| `prod` | `main` (same artifact already running in `pre`) | Manual promotion action | Yes — release manager approval |

### Functional Requirements (EARS)

- **FR-000**: The system SHALL detect "changes affecting the backend component"
  as any change under `backend/**`, and "changes affecting the frontend
  component" as any change under `frontend/**` — the two `paths:` filters used
  by every workflow that scopes itself to one component.
- **FR-000b**: `pr-validation-back` SHALL additionally trigger on any change
  under `contracts/**` (the OpenAPI contract, stored per FieldOps constitution
  Principle II at `contracts/openapi.yaml`, NOT under `backend/**`) — otherwise
  the Spectral/oasdiff gates in FR-003b/FR-003c could never fire on the file
  they exist to protect. This additional path applies only to
  `pr-validation-back`'s trigger, not to `ci-develop-back`/`ci-main-back`
  (a contract-only change with no `backend/**` change does not need a
  rebuild/redeploy).

**`pr-validation-back`**

- **FR-001**: When a pull request from `feature/*` targeting `develop` is opened or
  updated with changes affecting the backend component, the system SHALL run all
  M9 validation gates (lint, test, build) for the backend, validate the OpenAPI
  contract with Spectral, detect breaking changes against the contract currently
  on `develop` with oasdiff, scan the changed files for committed secrets with
  Gitleaks, AND call the Constitution Guardian agent API, reporting a combined
  pass/fail status on that pull request.
- **FR-002**: If any of the M9 gates, the Spectral lint, the oasdiff breaking-change
  check, the Gitleaks scan, or the Constitution Guardian check fails, then the
  system SHALL block merge of that pull request.
- **FR-003**: While `pr-validation-back` is running or has failed, the system SHALL
  NOT publish a backend build artifact.
- **FR-003b**: The Spectral gate SHALL fail the pull request if
  `contracts/openapi.yaml` (the canonical contract per FieldOps constitution
  Principle II) does not lint clean against the project's ruleset.
- **FR-003c**: The oasdiff gate SHALL fail the pull request if it detects a
  breaking change (per oasdiff's breaking-changes classification) between
  `contracts/openapi.yaml` on `develop` and the same file in the pull request,
  unless the pull request title contains the literal marker `BREAKING:` (an
  explicit, greppable declaration that the break is intentional — no separate
  approval mechanism is required for this feature).
- **FR-003d**: The Gitleaks gate SHALL fail the pull request if it detects any
  committed secret in the diff introduced by that pull request.

**`pr-validation-front`**

- **FR-004**: When a pull request from `feature/*` targeting `develop` is opened or
  updated with changes affecting the frontend component, the system SHALL run all
  M9 validation gates (lint, test, build) for the frontend, scan the changed files
  for committed secrets with Gitleaks, AND call the Constitution Guardian agent
  API, reporting a combined pass/fail status on that pull request, independently
  of `pr-validation-back`.
- **FR-005**: If any of the M9 gates, the Gitleaks scan, or the Constitution
  Guardian check fails, then the system SHALL block merge of that pull request.
- **FR-006**: While `pr-validation-front` is running or has failed, the system
  SHALL NOT publish a frontend build artifact.
- **FR-006b**: The Gitleaks gate SHALL fail the pull request if it detects any
  committed secret in the diff introduced by that pull request.

**`ci-develop-back`**

- **FR-007**: When a change affecting the backend component is merged to
  `develop`, the system SHALL run the full backend CI, scan the built backend
  image for vulnerabilities with Trivy, publish a backend **snapshot** image
  tagged `x.y.z-snapshot.{sha}` (short commit SHA) to the registry, store its
  build distributables as a workflow artifact with 90-day retention, and deploy
  the image to `dev` automatically.
- **FR-008**: If backend CI fails on `develop`, or the Trivy scan finds a
  critical-severity vulnerability in the built image, then the system SHALL NOT
  publish the snapshot image or deploy to `dev`, and SHALL report the failure.
- **FR-008b**: After `deploy-dev` and its health check succeed, the system SHALL
  run `check-aceptance.js` against the backend API now running in `dev`,
  verifying the acceptance scenarios in `spec.md` hold against the real deployed
  API, and SHALL report its pass/fail result. If `check-aceptance.js` fails, the
  deployment SHALL be flagged unhealthy per FR-019 (same consequence as a
  failed health check), even though `health-check-dev` itself already passed.

**`ci-develop-front`**

- **FR-009**: When a change affecting the frontend component is merged to
  `develop`, the system SHALL run the full frontend CI, scan the built frontend
  image for vulnerabilities with Trivy, publish a frontend **snapshot** image
  tagged `x.y.z-snapshot.{sha}` (short commit SHA) to the registry, store its
  build distributables as a workflow artifact with 90-day retention, and deploy
  the image to `dev` automatically, independently of `ci-develop-back`.
- **FR-010**: If frontend CI fails on `develop`, or the Trivy scan finds a
  critical-severity vulnerability in the built image, then the system SHALL NOT
  publish the snapshot image or deploy to `dev`, and SHALL report the failure.

**`ci-main-back`**

- **FR-010b**: When a change (of either component) is merged to `main`, the
  system SHALL automatically tag `main` with the version currently held on
  `develop` (e.g. `develop` at `1.2` → `main` tagged `1.2`) before publishing any
  image, and SHALL then bump `develop`'s version to the next minor version (e.g.
  `1.2` → `1.3`) so `develop` is always ahead of the last released version — no
  manual tagging step by a developer or release manager is required.
- **FR-011**: When a change affecting the backend component is merged to `main`,
  the system SHALL run the full backend CI, scan the built backend image for
  vulnerabilities with Trivy, publish a backend **final-version** image tagged
  `x.y.z` read directly from the semver tag created per FR-010b, attach its
  build distributables as permanent GitHub Release assets (no expiry), and
  deploy that image to `pre` automatically.
- **FR-011b**: If the Trivy scan finds a critical-severity vulnerability in the
  built backend image, the system SHALL NOT publish the final-version image or
  deploy to `pre`, and SHALL report the failure.
- **FR-011c**: After `deploy-pre` and its health check succeed, the system SHALL
  run `check-aceptance.js` against the backend API now running in `pre`,
  verifying the acceptance scenarios in `spec.md` hold against the real deployed
  API, and SHALL report its pass/fail result. If `check-aceptance.js` fails, the
  deployment SHALL be flagged unhealthy per FR-019, and the release manager
  SHALL NOT be permitted to promote that image to `prod` (FR-012) until a new
  `pre` deployment passes both the health check and `check-aceptance.js`.
- **FR-012**: When a backend final-version image is running correctly in `pre`,
  the system SHALL allow a release manager to trigger promotion of that exact same
  image to `prod` without rebuilding.
- **FR-013**: The system SHALL NOT deploy to `prod` automatically as a side effect
  of `ci-main-back`; promotion SHALL always require the explicit manual approval
  in FR-012.

**`ci-main-front`**

- **FR-014**: When a change affecting the frontend component is merged to `main`,
  the system SHALL run the full frontend CI, scan the built frontend image for
  vulnerabilities with Trivy, publish a frontend **final-version** image tagged
  `x.y.z` read directly from the semver tag created per FR-010b, attach its
  build distributables as permanent GitHub Release assets (no expiry), and
  deploy that image to `pre` automatically, independently of `ci-main-back`.
- **FR-014b**: If the Trivy scan finds a critical-severity vulnerability in the
  built frontend image, the system SHALL NOT publish the final-version image or
  deploy to `pre`, and SHALL report the failure.
- **FR-015**: When a frontend final-version image is running correctly in `pre`,
  the system SHALL allow a release manager to trigger promotion of that exact same
  image to `prod` without rebuilding.
- **FR-016**: The system SHALL NOT deploy to `prod` automatically as a side effect
  of `ci-main-front`; promotion SHALL always require the explicit manual approval
  in FR-015.

**Cross-cutting (all 6 workflows)**

- **FR-017**: While any deployment (to `dev`, `pre`, or `prod`) is in progress, the
  system SHALL prevent a second deployment to that same environment from starting
  concurrently.
- **FR-018**: When any deployment completes (including rollback), the system SHALL
  run an automated health confirmation and SHALL NOT mark the deployment successful
  until that confirmation passes.
- **FR-019**: If a post-deploy health confirmation fails, then the system SHALL
  report the failure visibly and flag the deployment for rollback.
- **FR-020**: The system SHALL provide a way to redeploy the previous known-good
  artifact to `dev`, `pre`, or `prod` (rollback) without rebuilding, and SHALL
  re-run the health confirmation from FR-018 after rollback.
- **FR-021**: The system SHALL record, for every deployment and rollback across all
  6 workflows, which artifact was deployed, to which environment, when, and by what
  trigger (auto-deploy, manual promotion, or rollback).
- **FR-022**: Each of the 6 workflows SHALL end with a final `code-review-gate` job
  (Job Dummy) that runs only if every prior gate in that workflow succeeded, and
  that certifies on the pull request or commit that all gates for that workflow
  passed. It performs no independent check of its own — it is a visible
  pass/fail seal, not a real code-review integration (that integration is out of
  scope for this feature).
- **FR-023**: If any gate earlier in the workflow fails, then `code-review-gate`
  SHALL NOT run, and the workflow SHALL report as failed without a certification
  seal.

### Non-Functional Requirements

- **NFR-001** (Speed): Each of the 6 workflows SHALL complete in under 10 minutes
  from trigger to reported result, under normal load.
- **NFR-002** (Isolation): Front and back workflows for the same branch SHALL run
  independently and in parallel — one SHALL NOT wait on the other.
- **NFR-003** (Immutability): Every external action/dependency referenced by any of
  the 6 workflows SHALL be pinned to an immutable reference (constitution Principle
  I) — 0% referenced by a mutable tag.
- **NFR-004** (Least privilege): Each job within the 6 workflows SHALL declare only
  the permissions it needs; only the publish job in `ci-develop-*`/`ci-main-*`
  SHALL hold `packages: write` (constitution Principle II).
- **NFR-005** (No extra secrets): Authentication to the registry across all 6
  workflows SHALL rely solely on the platform-injected token — no additional
  manually-managed secret SHALL be introduced (constitution Principle VI).
- **NFR-006** (Auditability): Every deploy/rollback/promotion action SHALL be
  traceable to an actor and a timestamp, retrievable after the fact.

### Acceptance Criteria by Workflow

| Workflow | Gate that runs | Blocks merge? | What gets published |
|---|---|---|---|
| `pr-validation-back` | M9 gates (lint+test+build, backend) + Spectral (OpenAPI lint) + oasdiff (breaking changes) + Gitleaks (secrets) + Constitution Guardian API call + `code-review-gate` seal | Yes, on failure of any | Nothing (validation only) |
| `pr-validation-front` | M9 gates (lint+test+build, frontend) + Gitleaks (secrets) + Constitution Guardian API call + `code-review-gate` seal | Yes, on failure of any | Nothing (validation only) |
| `ci-develop-back` | Full backend CI + Trivy image scan, must pass to proceed; `check-aceptance.js` runs post-deploy | N/A (post-merge) | Backend **snapshot** image `x.y.z-snapshot.{sha}` in registry + dist as 90-day workflow artifact; auto-deployed to `dev` |
| `ci-develop-front` | Full frontend CI + Trivy image scan, must pass to proceed | N/A (post-merge) | Frontend **snapshot** image `x.y.z-snapshot.{sha}` in registry + dist as 90-day workflow artifact; auto-deployed to `dev` |
| `ci-main-back` | Full backend CI + Trivy image scan, must pass to proceed; `check-aceptance.js` runs post-deploy | N/A (post-merge) | Auto-tagged `x.y.z`; backend **final-version** image + permanent GitHub Release asset; auto-deployed to `pre`; promotable to `prod` (manual) |
| `ci-main-front` | Full frontend CI + Trivy image scan, must pass to proceed | N/A (post-merge) | Auto-tagged `x.y.z`; frontend **final-version** image + permanent GitHub Release asset; auto-deployed to `pre`; promotable to `prod` (manual) |

### Key Entities

- **Build Artifact**: A validated, immutable image for one component (backend or
  frontend), published once per successful CI run. Two kinds: **snapshot** (from
  `develop`, feeds `dev`) and **final-version** (from `main`, feeds `pre`/`prod`
  and a GitHub Release).
- **Constitution Guardian Check**: An automated gate, called via API during PR
  validation, that verifies the change complies with project constitution
  principles before the M9 gates' result is considered final.
- **OpenAPI Contract Gate**: The Spectral lint + oasdiff breaking-change check run
  in `pr-validation-back` against `contracts/openapi.yaml` (per FR-000b, this
  workflow additionally triggers on `contracts/**`); blocks merge on lint
  failure or a breaking change not marked `BREAKING:` in the PR title.
- **Secret Scan**: The Gitleaks scan run in `pr-validation-back` and
  `pr-validation-front` against the PR's diff; blocks merge if a secret is found.
- **Image Vulnerability Scan**: The Trivy scan run against the built Docker image
  in `ci-develop-*`/`ci-main-*`, before `push-image`; blocks publish/deploy on a
  critical-severity finding.
- **Acceptance Check**: The `check-aceptance.js` script, run after a successful
  post-deploy health check in `ci-develop-back`/`ci-main-back`, that exercises the
  acceptance scenarios in this spec against the real deployed backend API.
- **Code Review Gate (Job Dummy)**: A final, no-op certification job in each of
  the 6 workflows that only runs — and only succeeds — if every prior gate in
  that workflow run succeeded; a visible seal, not a real review integration.
- **GitHub Release**: The versioned, artifact-bearing record created for every
  `main`-merge final-version image, used as the reference for what is deployable
  to `pre`/`prod`.
- **Environment**: A deployment target (`dev`, `pre`, `prod`) with its own
  currently-running artifact and its own deployment history.
- **Deployment Record**: The result of deploying a specific artifact to a specific
  environment, including its health-check outcome and whether it was an
  auto-deploy, a manual promotion, or a rollback.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A change to only one component triggers validation for that component
  alone, within 10 minutes of the change being pushed, in 100% of cases.
- **SC-002**: 100% of `prod` deployments use the exact final-version image already
  validated and already running in `pre` — zero same-change rebuilds at deploy
  time.
- **SC-003**: Rollback to a previous known-good version completes and is confirmed
  healthy in under 10 minutes, without any build step being executed.
- **SC-004**: 100% of deployments (including rollbacks) have an automated health
  confirmation outcome recorded before being considered complete.
- **SC-005**: Zero production deployments occur without an explicit, auditable
  promotion action.
- **SC-006**: Every external dependency used by the pipelines is referenced by an
  immutable, auditable reference (0% referenced by a mutable/movable reference).

## Assumptions

- Three environments are in scope: `dev`, `pre` (staging), and `prod`. Additional
  environments (e.g., preview-per-PR) are out of scope for this feature.
- Branch/environment mapping (`feature/*` → PR gate, `develop` → `dev`, `main` →
  `pre`/`prod`) reflects RETO-M12.md section 4 as provided by the user.
- Promotion to `prod` requires a manual approval step by an authorized release
  manager; fully automatic production deployment on every merge is out of scope.
- "Component" boundaries match the existing `backend/` and `frontend/` top-level
  directories in the repository.
- "M9 gates" refers to the existing lint/test/build validation already used by the
  project (per prior milestone); this feature wires them into the 6 named
  workflows rather than redefining them.
- The Constitution Guardian agent API already exists or is defined by a separate
  feature; this feature only specifies that PR validation calls it and gates
  merge on its result — designing the agent itself is out of scope.
- Snapshot build distributables (`develop`) are retained 90 days as workflow
  artifacts; final-version build distributables (`main`) are retained permanently
  as GitHub Release assets. Registry image retention beyond what's needed for
  rollback to the previous known-good version per environment is out of scope.
- The health confirmation check reuses each component's existing health/readiness
  endpoint; defining new health-check business logic is out of scope.
- Authentication needed by the pipelines to publish and pull artifacts relies
  solely on credentials automatically provided by the CI/CD platform for the
  repository — no additional manually-managed credentials are introduced.
