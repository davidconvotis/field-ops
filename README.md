# FieldOps

Work order management system — see `specs/` for feature specifications and
`.specify/memory/constitution.md` / `pipeline-constitution.md` for governance.

## CI/CD

Six independent GitHub Actions workflows (no cross-triggering — see
`specs/004-ci-cd-pipeline/plan.md`) implement the mandatory Capa 1 pipeline
defined in `specs/004-ci-cd-pipeline/`. CD to dev/pre/prod is an optional,
non-blocking Capa 2 and is **not** implemented yet (see `tasks.md` T047-T050).

### Branching strategy

| Branch | Purpose |
|---|---|
| `feature/*` | Work in progress. Never deployed directly. |
| `develop` | Integration line. Every feature goes through here before `main`. |
| `main` | Final versions. Only receives merges from `develop`. |

### Workflows

| Branch / Trigger | Workflow(s) | What happens |
|---|---|---|
| PR `feature/*` → `develop`, `paths: backend/**` | `pr-validation-back` | Lint+test, Spectral, oasdiff, Gitleaks, `check-acceptance.js`, Trivy, Constitution Guardian, code-review (dummy). Blocks merge on any failure. |
| PR `feature/*` → `develop`, `paths: frontend/**` | `pr-validation-front` | Lint+test, Gitleaks, Constitution Guardian, code-review (dummy). Blocks merge on any failure. |
| Push to `develop`, `paths: backend/**` | `ci-develop-back` | Full CI + snapshot image (`x.y.z-snapshot.{sha}`) pushed to GHCR + 90-day dist workflow artifact. |
| Push to `develop`, `paths: frontend/**` | `ci-develop-front` | Same, for frontend. |
| Push of tag `back-v*.*.*` | `ci-main-back` | Full CI + image tagged with the semver from the tag, pushed to GHCR + permanent GitHub Release with dist asset. |
| Push of tag `front-v*.*.*` | `ci-main-front` | Same, for frontend. |

### Opening a test PR

1. Branch from `develop`: `git checkout -b feature/my-change develop`.
2. Touch only `backend/**` or only `frontend/**` to see path-scoped triggering.
3. Open a PR into `develop` — only the matching `pr-validation-*` workflow
   runs; the merge button stays disabled until it's green.

### Verifying a snapshot in GHCR

After merging to `develop`, check the "Packages" tab of the repo (or
`ghcr.io/<org>/<repo>/fieldops-{back,front}`) for a tag
`x.y.z-snapshot.{short-sha}` matching `git rev-parse --short HEAD` on
`develop`, and a matching workflow artifact under the Actions run.

### Cutting a release

Before merging `develop` → `main`, run `scripts/release-tag.sh back` and/or
`scripts/release-tag.sh front` (creates and pushes `back-vX.Y.Z` /
`front-vX.Y.Z`) — that tag push is what triggers `ci-main-{back,front}`, not
the merge itself. See `specs/004-ci-cd-pipeline/quickstart.md` for the full
end-to-end walkthrough, and `docs/ci-cd-environment-setup.md` /
`docs/ci-cd-branch-protection.md` for one-time manual repo setup (branch
protection rules; environments only needed if Capa 2 is implemented later).
