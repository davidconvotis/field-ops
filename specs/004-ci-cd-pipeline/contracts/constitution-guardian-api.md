# Contract: Constitution Guardian Agent API

External dependency called by `pr-validation-back` and `pr-validation-front`
(FR-001/FR-004). Per spec Assumptions, the agent itself is designed by a separate
feature — this contract states only what this pipeline feature requires of it.

## Request

- **Trigger**: One call per `pr-validation-*` run, after M9 gates, before final
  pass/fail is reported.
- **Method/transport**: HTTP POST (exact endpoint/auth TBD by the Guardian
  feature; this workflow reads it from a repo variable, not hardcoded).
- **Payload** (minimum required fields):

  | Field | Type | Description |
  |---|---|---|
  | `repository` | string | e.g. `owner/fieldops` |
  | `pull_request_number` | integer | |
  | `component` | enum: `backend` \| `frontend` | Which side triggered this check |
  | `head_sha` | string | Commit being validated |

## Response

| Field | Type | Description |
|---|---|---|
| `verdict` | enum: `pass` \| `fail` | Required |
| `reasons` | array of string | Optional, surfaced in the PR check output on `fail` |

## Failure handling (research.md §2)

- HTTP timeout, 5xx, or connection failure → treated as `verdict: fail`
  (fail-closed). The workflow SHALL NOT treat "no response" as `pass`.
- HTTP 2xx with a malformed/missing `verdict` field → treated as `verdict: fail`.

## Out of scope

- Guardian API authentication scheme, rate limits, and internal logic — owned by
  the Guardian feature, not this pipeline feature.
