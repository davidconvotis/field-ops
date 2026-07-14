# CI/CD Branch Protection Setup (Manual, One-Time)

Per spec.md FR-002/FR-005. GitHub branch protection rules aren't committed
YAML, so this is a manual repo-admin step, done once per protected branch.

## `develop` branch protection

Settings → Branches → Branch protection rules → add rule for `develop`:

- Require a pull request before merging.
- **Require status checks to pass before merging**, and require these two
  checks specifically (they only appear in the list after each workflow has
  run at least once):
  - `pr-validation-back` (all 4 jobs — `lint`, `test`, `build`,
    `constitution-guardian` — must report success)
  - `pr-validation-front` (same 4 jobs)
- Require branches to be up to date before merging (recommended, not
  mandated by spec.md).

## `main` branch protection

Same pattern, protecting `main` if direct PRs into `main` are allowed
(vs. only receiving merges from `develop`) — require `ci-main-back` and
`ci-main-front` to have last run successfully on the source branch.

## Verification

- Open a PR into `develop` with a deliberately failing backend lint rule.
- Confirm the PR's "Merge" button is disabled/blocked until
  `pr-validation-back` turns green, per spec.md FR-002.
