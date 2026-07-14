# Phase 0 Research: CI/CD Pipeline

## 1. Semver bump mechanics (`develop` → `main`)

**Decision**: A `VERSION` file (plain text, e.g. `1.2.0`) lives in each of
`backend/` and `frontend/`, on `develop`. `ci-main-*`:

1. Reads `VERSION` from the merged commit → this is the release version (e.g. `1.2.0`).
2. Creates git tag `backend-v1.2.0` / `frontend-v1.2.0` on `main` (per-component tag,
   since backend/frontend release independently per FR-000/FR-005).
3. Publishes the final-version image tagged `1.2.0`.
4. Opens (or pushes directly to, since this is automated) a commit on `develop` that
   bumps `VERSION` to the next minor (`1.2.0` → `1.3.0`), so `develop` is always
   ahead of the last release.

**Rationale**: Matches the user's explicit rule (develop 1.2 → main 1.2, develop →
1.3) exactly. A file-based version avoids depending on conventional-commit parsing
or an external semantic-release tool — one less moving part, and the bump rule
(always minor, always automatic) is simple enough not to need one.

**Alternatives considered**:
- *Conventional-commits-derived bump* (semantic-release style): rejected — user's
  rule is fixed-minor-bump, not commit-message-driven; adding that inference would
  contradict the explicit rule and add an unused dependency.
- *Tag-only (no VERSION file)*, computing next version from the latest git tag:
  rejected — two components release independently, so a single repo-wide "latest
  tag" is ambiguous; a per-component `VERSION` file is unambiguous.

## 2. Constitution Guardian API failure mode

**Decision**: Fail-closed. If the Constitution Guardian API call times out, errors,
or is unreachable, `pr-validation-*` reports failure and blocks merge — identical
to a normal check failure. No fail-open bypass.

**Rationale**: Consistent with the FieldOps constitution's general security
posture (RBAC is non-negotiable, defaults to deny) and pipeline-constitution's
"non-negotiable" framing. Fail-open would let unreviewed changes merge silently
whenever the Guardian happens to be down — an availability problem becoming a
governance hole.

**Alternatives considered**: Fail-open with a flagged warning — rejected, defers
enforcement risk to reviewers who may not notice the flag.

## 3. Rollback target selection

**Decision**: Rollback redeploys the immediately-previous artifact recorded for
that environment (per FR-021's deployment record) — a single "rollback" action,
no arbitrary version picker in this feature's scope.

**Rationale**: Simplest mechanism that satisfies FR-011/FR-020 and SC-003 (<10 min,
no rebuild). Picking an arbitrary older artifact is a superset capability with no
current requirement driving it (spec's Assumptions already scope retention to "at
least the previous known-good version").

**Alternatives considered**: Arbitrary-version rollback (pick any retained tag) —
deferred as a possible future enhancement; not required by any FR/SC in spec.md.

## 4. Production promotion approval

**Decision**: A single required reviewer via a GitHub `environment` protection
rule on `prod` (one approval gate, not N-of-M).

**Rationale**: Matches FR-012/013/015/016's "release manager" framing (singular
role) and pipeline-constitution Principle VII's "aprobación manual" (no count
specified beyond "manual"). GitHub environments support required-reviewers lists
natively — no custom approval logic needed.

**Alternatives considered**: Multi-approver (2+) — rejected as unnecessary process
overhead not requested anywhere in spec.md; can be tightened later by changing the
environment's protection rule without a workflow redesign.

## 5. Dockerfile / build strategy for backend and frontend

**Decision**: `backend/Dockerfile` — multi-stage Node 20 build (deps → `tsc` build
→ slim runtime image running `dist/`). `frontend/Dockerfile` — multi-stage build
(deps → `vite build` → static assets served via a minimal web server image, e.g.
`nginx:alpine` pinned by digest). Both built with `docker/build-push-action`
(SHA-pinned) using Buildx, tagged per the scheme in research item 1.

**Rationale**: Standard, well-understood pattern for Node/TS backend + Vite SPA;
minimizes final image size and attack surface (no dev dependencies/build tools in
the runtime layer).

**Alternatives considered**: Single-stage image — rejected, ships build tools and
devDependencies to production, larger and less secure.

## 6. Health-check mechanism for post-deploy gate

**Decision**: Reuse backend's existing `/health` endpoint (`backend/src/api/app.ts:27`,
already returns `{status: 'ok'}`). Frontend health check hits the deployed static
site's root path expecting HTTP 200 (no existing frontend health route to reuse,
so this is the simplest equivalent — reachability, not app-level health, since a
static SPA has no server-side health signal).

**Rationale**: Backend already has exactly what's needed (per spec Assumptions).
Frontend has no equivalent — HTTP 200 on `/` is the standard proxy for "the static
assets deployed and are being served."

**Alternatives considered**: Adding a dedicated `/healthz` route to the frontend
build — rejected as unnecessary complexity for a static site with no backend logic
to check.

## Outstanding NEEDS CLARIFICATION

None — all Technical Context unknowns resolved above.
