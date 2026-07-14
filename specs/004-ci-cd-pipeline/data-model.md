# Phase 1 Data Model: CI/CD Pipeline

Not a persistence data model — this feature has no application database changes.
These are the logical entities the 6 workflows produce and consume, expanded from
`spec.md`'s Key Entities with the concrete shape decided in `research.md`.

## Build Artifact

| Field | Type | Notes |
|---|---|---|
| `component` | enum: `backend` \| `frontend` | Which component this artifact belongs to |
| `kind` | enum: `snapshot` \| `final-version` | `snapshot` from `develop`, `final-version` from `main` |
| `image_tag` | string | `x.y.z-snapshot.{sha}` (snapshot) or `x.y.z` (final-version) |
| `sha` | string | Short git commit SHA the snapshot was built from |
| `dist_location` | string | Workflow-artifact URL (snapshot, 90-day) or GitHub Release asset URL (final-version, permanent) |
| `created_at` | timestamp | Build time |

## Component Version (`VERSION` file, per component)

| Field | Type | Notes |
|---|---|---|
| `component` | enum: `backend` \| `frontend` | One `VERSION` file per component |
| `value` | semver string (`x.y.z`) | Lives on `develop`; represents the in-progress version |
| `branch` | `develop` | This entity only exists meaningfully on `develop` — `main` reads it at merge time, never writes it directly |

State transition: on merge to `main`, `ci-main-{back,front}` reads the current
value, freezes it as that release's tag, then opens a bump commit on `develop`
setting `value` to the next minor version. See research.md §1.

## Constitution Guardian Check

| Field | Type | Notes |
|---|---|---|
| `pull_request_id` | string | PR being validated |
| `component` | enum: `backend` \| `frontend` | Which `pr-validation-*` invoked it |
| `verdict` | enum: `pass` \| `fail` | Fail-closed on timeout/unreachable — see research.md §2 |
| `checked_at` | timestamp | |

## GitHub Release

| Field | Type | Notes |
|---|---|---|
| `tag` | string | `backend-v{x.y.z}` or `frontend-v{x.y.z}` (per-component, per research.md §1) |
| `component` | enum: `backend` \| `frontend` | |
| `assets` | list of files | Permanent dist distributables for that release |
| `image_tag` | string | The GHCR image tag this Release corresponds to |

## Environment

| Field | Type | Notes |
|---|---|---|
| `name` | enum: `dev` \| `pre` \| `prod` | |
| `fed_by_branch` | `develop` (for `dev`) \| `main` (for `pre`/`prod`) | |
| `current_artifact` | Build Artifact ref | Per component — `dev`/`pre`/`prod` each track backend + frontend independently |
| `requires_approval` | boolean | `true` only for `prod` |

## Deployment Record

| Field | Type | Notes |
|---|---|---|
| `environment` | Environment ref | |
| `component` | enum: `backend` \| `frontend` | |
| `artifact` | Build Artifact ref | What was deployed |
| `trigger` | enum: `auto-deploy` \| `manual-promotion` \| `rollback` | Per FR-021 |
| `actor` | string | Who/what triggered it (workflow run for auto, user for manual/rollback) |
| `health_check_result` | enum: `pass` \| `fail` \| `pending` | Gates whether the deployment counts as successful (FR-018) |
| `deployed_at` | timestamp | |

## Relationships

```text
Component Version (develop) --[frozen at merge]--> Build Artifact (final-version, main)
Build Artifact --[published as]--> GitHub Release (final-version only)
Build Artifact --[deployed via]--> Deployment Record --[targets]--> Environment
Constitution Guardian Check --[gates]--> merge of the PR that would produce a Build Artifact
```
