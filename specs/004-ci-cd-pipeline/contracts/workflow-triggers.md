# Contract: Workflow Triggers & Manual Inputs

The interface each of the 6 workflows exposes — what triggers it, and what manual
inputs it accepts (for the two workflows with a human-triggered step: `prod`
promotion and rollback).

## Automatic triggers (no manual input)

| Workflow | Trigger | Path filter |
|---|---|---|
| `pr-validation-back` | `pull_request` (opened/synchronize) targeting `develop` | `backend/**` |
| `pr-validation-front` | `pull_request` (opened/synchronize) targeting `develop` | `frontend/**` |
| `ci-develop-back` | `push` to `develop` | `backend/**` |
| `ci-develop-front` | `push` to `develop` | `frontend/**` |
| `ci-main-back` | `push` to `main` | `backend/**` |
| `ci-main-front` | `push` to `main` | `frontend/**` |

## Manual dispatch inputs

### `prod` promotion (part of `ci-main-{back,front}`, or a separate
`promote-prod-{back,front}` workflow triggered via `workflow_dispatch`)

| Input | Type | Required | Description |
|---|---|---|---|
| `component` | enum: `backend` \| `frontend` | yes | Which component to promote |
| `image_tag` | string | yes | The exact `pre`-validated tag to promote (must already be running in `pre`) |

Gated by a GitHub `environment: prod` protection rule requiring one approval
(research.md §4). Rejects (FR-013/016) if `image_tag` isn't the one currently
running in `pre`.

### Rollback (`workflow_dispatch`)

| Input | Type | Required | Description |
|---|---|---|---|
| `component` | enum: `backend` \| `frontend` | yes | Which component to roll back |
| `environment` | enum: `dev` \| `pre` \| `prod` | yes | Target environment |

No `image_tag` input — rollback always targets the immediately-previous recorded
artifact for that `(component, environment)` pair (research.md §3), read from the
Deployment Record history (data-model.md).

## Concurrency contract

Every workflow that deploys declares a `concurrency` group keyed on
`{environment}-{component}` so a second deployment to the same environment cannot
start while one is in flight (FR-017).
