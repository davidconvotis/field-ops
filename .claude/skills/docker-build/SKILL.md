---
name: "docker-build"
description: "Build tagged Docker images (backend + frontend) for the latest commit — snapshot tag + per-environment tag"
argument-hint: "[env] — optional environment name (dev/staging/prod), defaults to dev"
compatibility: "Requires Docker running locally, and backend/Dockerfile + frontend/Dockerfile present"
metadata:
  author: "fieldops"
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

Treat `$ARGUMENTS` as the environment name (`dev`, `staging`, `prod`, ...). If empty, default to `dev`.

## Purpose

Invoked manually right after creating a commit (not a git hook — explicit, on demand). Builds one Docker image per service (`backend/`, `frontend/`) for the current commit, tagged so that:

- an **immutable** tag pins the exact commit (`<env>-<shortsha>`)
- a **moving snapshot** tag always points at the latest build for that environment (`<env>-snapshot`)

This lets you `docker run fieldops-backend:dev-snapshot` to always get the latest dev build, while `fieldops-backend:dev-a1b2c3d` stays pinned for rollback/debugging.

## Preconditions

1. Confirm there is at least one commit: `git rev-parse HEAD` (abort with a clear message if this fails — not a git repo / no commits yet).
2. Confirm the working tree matches what you're about to tag — warn (don't block) if `git status --porcelain` is non-empty, since the image would then contain uncommitted changes under the current commit's tag. Ask the user whether to proceed if dirty.
3. Confirm Docker is available and the daemon is reachable: `docker info` (a fast, non-mutating check). If it fails, stop and tell the user to start Docker Desktop / the daemon — do not retry in a loop.
4. Confirm `backend/Dockerfile` and `frontend/Dockerfile` exist. If either is missing, stop and say so (don't silently skip that service).

## Execution

1. Resolve inputs:
   - `ENV` = `$ARGUMENTS` trimmed, default `dev` if empty. Validate it's a simple token (`[a-z0-9_-]+`) — reject anything else (it becomes part of a Docker tag).
   - `SHA` = `git rev-parse --short HEAD`
   - `COMMIT_SUBJECT` = `git log -1 --format=%s` (for the report only, not part of any tag)

2. For each service in `backend`, `frontend` (run sequentially, not in parallel — clearer output, and Docker's own layer cache makes parallel builds fight over the same cache rather than help):
   - Image name: `fieldops-<service>` (e.g. `fieldops-backend`)
   - Build once, tag twice (avoid rebuilding for the second tag):

     ```sh
     docker build -t fieldops-<service>:<ENV>-<SHA> -t fieldops-<service>:<ENV>-snapshot ./<service>
     ```

   - If the build fails, stop immediately (do not attempt the other service's build blindly) — report the failing service, the failing build step from Docker's output, and do not mark anything as tagged. Ask the user whether to continue with the remaining service anyway.

3. After both builds succeed, verify the tags actually landed (`docker image ls fieldops-<service> --format '{{.Tag}}'` should list both new tags) — a quiet build failure that still exits 0 is rare but this catch is cheap.

## Report back

Summarize, per service:

- Image builds succeeded/failed
- Both tags created: `<env>-<sha>` and `<env>-snapshot`
- The commit SHA and subject this build corresponds to
- If the working tree was dirty, restate that the image contains uncommitted changes despite the commit-pinned tag name

Do not push images to any registry — this skill only builds and tags locally. If the user wants to push, ask which registry/credentials before running `docker push` (that's a separate, explicit action — pushing publishes the image and should never happen silently).

## Notes for future maintenance

- If a `docker-compose.yml` or CI pipeline is added later that also builds these images, keep the tag scheme (`<env>-<sha>`, `<env>-snapshot`) consistent so both paths produce interchangeable tags.
- `backend/Dockerfile` runs `prisma generate` at build time — if the Prisma schema changes, no skill change is needed, the build already regenerates the client.
