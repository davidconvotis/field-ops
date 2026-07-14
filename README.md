# FieldOps

Work order management system — see `specs/` for feature specifications and
`.specify/memory/constitution.md` / `pipeline-constitution.md` for governance.

## CI/CD

Six automated workflows plus two manual-dispatch workflows implement the
pipeline defined in `specs/004-ci-cd-pipeline/`.

| Branch / Trigger | Workflow(s) | What happens |
|---|---|---|
| PR `feature/*` → `develop` | `pr-validation-back`, `pr-validation-front` | Lint + test + build (only the changed component) + Constitution Guardian check. Blocks merge on failure of either. |
| Merge to `develop` | `ci-develop-back`, `ci-develop-front` | Full CI + snapshot image (`x.y.z-snapshot.{sha}`) published to GHCR + 90-day dist artifact + auto-deploy to `dev`. |
| Merge to `main` | `ci-main-back`, `ci-main-front` | Full CI + freezes the `develop` version as the release tag + permanent GitHub Release + auto-deploy to `pre` + bumps `develop`'s `VERSION` to the next minor. |
| Manual (`workflow_dispatch`) | `promote-prod` | Promotes the exact image already validated in `pre` to `prod`, gated by a required-reviewer approval. Never rebuilds. |
| Manual (`workflow_dispatch`) | `rollback` | Redeploys the immediately-previous known-good artifact for a given `(component, environment)`. Never rebuilds. |

Environments: `dev` (auto), `pre` (auto), `prod` (manual approval only).

See `specs/004-ci-cd-pipeline/quickstart.md` for end-to-end validation
scenarios, and `docs/ci-cd-environment-setup.md` /
`docs/ci-cd-branch-protection.md` for the one-time manual repo setup this
pipeline depends on.
