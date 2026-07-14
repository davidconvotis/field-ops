# Implementation Plan: Pipeline CI/CD FieldOps

**Branch**: `004-ci-cd-pipeline` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-ci-cd-pipeline/spec.md`

## Summary

Construir 6 GitHub Actions workflows (independientes, sin cross-trigger) que
implementan las gates de validación de PR, la integración continua de
`develop` (imagen snapshot + artifact dist) y la integración continua de
`main` (imagen semver final + GitHub Release), siguiendo
`pipeline-constitution.md` (pin SHA, permisos mínimos, no rebuild en CD,
spec antes que YAML, GHCR sin secrets extra).

## Technical Context

**Language/Version**: YAML (GitHub Actions), Bash/Node.js para scripts de
soporte (`scripts/bump-version.sh` ya existe).

**Primary Dependencies**: GitHub Actions runners (`ubuntu-latest`), Docker
Buildx, GHCR (`ghcr.io`), Spectral CLI/Action, oasdiff CLI/Action, Gitleaks
Action, Trivy Action, Claude Code Action (guardián de Constitución),
`actions/upload-artifact`, `softprops/action-gh-release`.

**Storage**: N/A (no persistencia propia; GHCR y GitHub Releases actúan como
almacenes de artefactos).

**Testing**: `npm test` (Jest) en backend y frontend, ya configurado
(`package.json` de cada componente).

**Target Platform**: GitHub Actions (`ubuntu-latest` runners).

**Project Type**: Web application (monorepo `backend/` + `frontend/`) — CI/CD
únicamente, sin cambios de aplicación.

**Performance Goals**: SC-002 — workflow de validación de PR < 10 min en 95%
de ejecuciones.

**Constraints**: Pin por SHA (Principio I), permisos mínimos por job
(Principio II), sin rebuild en CD (Principio III), sin secrets adicionales
para GHCR (Principio VI).

**Scale/Scope**: 6 workflows, 2 componentes, 3 entornos opcionales
(dev/pre/prod).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Contra `pipeline-constitution.md` v1.1.0:

| Principio | Cumplimiento planeado |
|---|---|
| I. Pin por SHA | Todo `uses:` fijado por SHA completo en los 6 workflows (verificado en Fase 6 checklist). |
| II. Permisos mínimos | Cada job declara `permissions:` explícito; `packages: write` solo en job de push a GHCR. |
| III. No rebuild en CD | CD opcional (Capa 2) consume digest ya publicado; no hay `docker build` en jobs de deploy. |
| IV. Spec antes que YAML | `spec.md` + `pipeline-constitution.md` ya committed antes de crear ningún `.yml` (verificado por `git log`). |
| V. Flujos separados por componente | 6 workflows con `paths: backend/**` / `paths: frontend/**`, sin lógica interna de detección — filtro nativo del trigger. |
| VI. OIDC/Secrets mínimos | Login a GHCR vía `GITHUB_TOKEN`; sin PAT ni secret adicional. |
| VII. Promoción explícita entre entornos | CD a prod (Capa 2) requiere GitHub Environment `production` con reviewer — nunca implícito por push a `main`. |
| VIII. Rollback inmediato | Fuera del alcance mínimo de este plan (Capa 2); documentado como pendiente si se implementa CD. |
| IX. Gate de salud post-despliegue | Fuera del alcance mínimo (Capa 2); pendiente si se implementa CD. |

Sin violaciones que requieran `Complexity Tracking` para la Capa 1 (mínima).
Los principios VIII/IX solo aplican si se construye la Capa 2 opcional.

## Project Structure

### Documentation (this feature)

```text
specs/004-ci-cd-pipeline/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output (gate → tool → componente)
└── tasks.md              # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
.github/
└── workflows/
    ├── pr-validation-back.yml
    ├── pr-validation-front.yml
    ├── ci-develop-back.yml
    ├── ci-develop-front.yml
    ├── ci-main-back.yml
    └── ci-main-front.yml

backend/
├── src/                  # ya existe
├── VERSION               # ya existe (fuente semver base)
└── Dockerfile             # ya existe

frontend/
├── src/                  # ya existe
├── VERSION               # ya existe (fuente semver base)
└── Dockerfile             # ya existe

scripts/
├── bump-version.sh       # ya existe — usado por ci-main-*.yml
└── deploy.sh              # ya existe — usado solo por CD opcional (Capa 2)
```

**Structure Decision**: Monorepo ya existente `backend/` + `frontend/`
(Opción 2 del template). Los workflows nuevos viven exclusivamente en
`.github/workflows/`; no se reestructura código de aplicación. Cada
workflow usa `paths:` acotado a su carpeta de componente (Principio V).

## Orden y paralelismo de jobs por workflow

**pr-validation-back.yml** (jobs en paralelo donde no hay dependencia, gates
específicas después de lint+test):

```
lint+test (npm test) ──┬─► spectral (contrato OpenAPI)
                        ├─► oasdiff (breaking changes)
                        ├─► gitleaks (secrets)
                        ├─► check-acceptance (ACs vs API)
                        ├─► trivy (imagen — requiere build previo de imagen local)
                        └─► constitution-guardian (Claude Code Action)
                                │
                                ▼
                        code-review (job dummy, needs: [todos los anteriores])
```

- `lint+test` es el único job bloqueante inicial (gate rápida, falla rápido).
- Spectral/oasdiff/Gitleaks/check-acceptance corren en paralelo tras
  `lint+test` — son independientes entre sí.
- `trivy` necesita una imagen local construida (no publicada) — job propio
  con `docker build --load` previo al scan, en paralelo con las gates de
  texto/contrato.
- `constitution-guardian` corre en paralelo (llamada a API externa,
  potencialmente la más lenta — no debe bloquear a las demás).
- `code-review` (dummy) es el job final: `needs:` de todos los anteriores,
  certifica que el PR pasó todas las gates.

**pr-validation-front.yml**: mismo patrón simplificado —
`lint+test → [gitleaks, constitution-guardian] → code-review`.

**ci-develop-back.yml / ci-develop-front.yml**:

```
ci (lint+test+build) ─► docker build ─► push GHCR (snapshot tag)
                                      └─► upload-artifact (dist, 90d)
                    [opcional] ─► CD a dev (needs: push GHCR)
```

- `push GHCR` y `upload-artifact` corren en paralelo (ambos dependen solo de
  `docker build`/`npm run build`, no entre sí) — ambos deben referenciar el
  mismo commit (FR-015).
- CD a dev (Capa 2) depende de que la imagen ya esté en GHCR (`needs:
  push-image`), nunca reconstruye.

**ci-main-back.yml / ci-main-front.yml**:

```
ci (lint+test+build) ─► docker build ─► push GHCR (semver final tag)
                                      └─► gh-release (dist como asset)
                    [opcional] ─► CD a pre (needs: push GHCR)
                                      └─► CD a prod (needs: CD a pre, environment: production con reviewer)
```

- La versión semver final se obtiene del tag de git (creado antes vía
  `scripts/bump-version.sh`) — job de versión precede a build.
- `push GHCR` y `gh-release` en paralelo, igual patrón que develop.
- CD a `prod` (Capa 2) es el único job con `environment: production` y
  aprobación manual explícita — nunca automático tras CD a `pre`.

## Dependencias entre los 6 workflows

Ninguna cruzada — diseño intencional (Principio V + FR-003):

| Workflow | Trigger | Depende de otro workflow |
|---|---|---|
| `pr-validation-back.yml` | `pull_request` → `develop`, `paths: backend/**` | No |
| `pr-validation-front.yml` | `pull_request` → `develop`, `paths: frontend/**` | No |
| `ci-develop-back.yml` | `push` → `develop`, `paths: backend/**` | No |
| `ci-develop-front.yml` | `push` → `develop`, `paths: frontend/**` | No |
| `ci-main-back.yml` | `push` → `main`, `paths: backend/**` | No |
| `ci-main-front.yml` | `push` → `main`, `paths: frontend/**` | No |

Cada workflow es autocontenido: no usa `workflow_call`/`workflow_run` para
encadenar con otro de los 6. Jobs *dentro* de un mismo workflow sí tienen
dependencias (`needs:`), documentadas arriba.

## Mapeo gate → tool → componente

| Gate | Tool | Componente | Workflow(s) |
|---|---|---|---|
| Lint y test unitarios | `npm test` (Jest) | Front + Back | `pr-validation-*`, `ci-develop-*`, `ci-main-*` |
| Validación contrato OpenAPI | Spectral | Back | `pr-validation-back` |
| Detección breaking changes | oasdiff | Back | `pr-validation-back` |
| Escaneo de secrets | Gitleaks | Front + Back | `pr-validation-*` |
| Verificación ACs vs API | `check-acceptance.js` (por crear) | Back | `pr-validation-back` |
| Vulnerabilidades de imagen | Trivy | Back (imagen backend) | `pr-validation-back` |
| Revisión de Constitución | Claude Code Action | Front + Back | `pr-validation-*` |
| Code review registrado | Job dummy | Front + Back | `pr-validation-*` |

## Decisión de plataforma CD (Capa 2, opcional)

No bloqueante para Capa 1. `scripts/deploy.sh` ya existe como stub genérico
(`kubectl`/`ecs`/`ssh+compose` a elegir); no se fija plataforma concreta en
este plan — se documenta como decisión abierta a resolver solo si se aborda
la Capa 2. No afecta ninguna tarea de la Capa 1 mínima.

## Complexity Tracking

*Sin violaciones de constitution que requieran justificación en la Capa 1.*
