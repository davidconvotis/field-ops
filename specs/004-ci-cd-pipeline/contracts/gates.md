# Contract: Gate → Tool → Componente → Workflow

Este contrato fija qué gate corre en qué workflow, para qué componente, y su
efecto de bloqueo. Es la referencia autoritativa para Fase 6 (Implement) y
para `docs/ci-cd-branch-protection.md`.

| Gate | Tool/mecanismo | Componente | Workflow | Bloquea merge/push |
|---|---|---|---|---|
| Lint y test unitarios | `npm test` (Jest) | Front + Back | `pr-validation-*`, `ci-develop-*`, `ci-main-*` | Sí |
| Validación contrato OpenAPI | Spectral sobre `contracts/openapi.yaml` | Back | `pr-validation-back` | Sí |
| Detección breaking changes | oasdiff (base `develop` vs PR) | Back | `pr-validation-back` | Sí |
| Escaneo de secrets | Gitleaks | Front + Back | `pr-validation-*` | Sí |
| Verificación ACs vs API | `check-acceptance.js` (por crear en Fase 6) | Back | `pr-validation-back` | Sí |
| Vulnerabilidades de imagen | Trivy sobre imagen local (`docker build --load`) | Back | `pr-validation-back` | Sí |
| Revisión de Constitución | Claude Code Action vía `CONSTITUTION_GUARDIAN_API_URL` | Front + Back | `pr-validation-*` | Sí (fail-closed) |
| Code review registrado | Job dummy, `needs:` todas las gates anteriores | Front + Back | `pr-validation-*` | Sí (certificación final) |

## Contrato de imagen publicada

| Campo | `ci-develop-*.yml` | `ci-main-*.yml` |
|---|---|---|
| Repositorio | `ghcr.io/<org>/<repo>/fieldops-{back,front}` | igual |
| Tag | `x.y.z-snapshot.{short-sha}` | `x.y.z` (desde tag git) |
| Permiso requerido | `packages: write` (solo job de push) | igual |
| Origen versión | `<componente>/VERSION` + short-sha | tag git (creado por `scripts/bump-version.sh`) |

## Contrato de artefacto dist

| Campo | `ci-develop-*.yml` | `ci-main-*.yml` |
|---|---|---|
| Mecanismo | `actions/upload-artifact` | `softprops/action-gh-release` |
| Retención | 90 días | Permanente |
| Contenido | build compilado (`dist/`/`build/`), sin `node_modules` ni fuente | igual |
| Debe corresponder a | mismo `commit_sha` que la imagen GHCR del mismo evento | igual |
