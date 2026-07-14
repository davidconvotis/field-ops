---

description: "Task list for Pipeline CI/CD FieldOps (004-ci-cd-pipeline)"
---

# Tasks: Pipeline CI/CD FieldOps

**Input**: Design documents from `/specs/004-ci-cd-pipeline/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/gates.md, quickstart.md

**Tests**: No se solicitan tests automatizados de los propios workflows en spec.md; la validación es manual vía `quickstart.md` (Fase 7 del roadmap). No se generan tareas de test.

**Organization**: Tareas agrupadas por user story (spec.md). Cada story = 2 workflows (back+front), independientemente entregable y probable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[Story]**: US1 (validación PR), US2 (CI develop), US3 (CI main)

## Path Conventions

Monorepo web app: `.github/workflows/`, `backend/`, `frontend/`, `scripts/` (ver plan.md → Project Structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffolding compartido antes de crear ningún workflow.

- [ ] T001 Crear directorio `.github/workflows/` (vacío, listo para los 6 archivos)
- [ ] T002 [P] Verificar que `contracts/openapi.yaml`, `backend/VERSION`, `frontend/VERSION`, `scripts/bump-version.sh` existen y son válidos (prerrequisito de FR-006/FR-009)
- [ ] T003 [P] Crear `backend/scripts/check-acceptance.js` (stub ejecutable que valida ACs del spec de negocio contra la API; gate de `pr-validation-back.yml` por contrato de `contracts/gates.md`)
- [ ] T003a [P] Crear `scripts/release-tag.sh <back|front>` (wrapper: invoca `scripts/bump-version.sh`, luego `git tag -a <back|front>-vX.Y.Z` + `git push origin <tag>` — corrige hallazgo C1/C2 de `/speckit-analyze`: `bump-version.sh` por sí solo no toca git)

**Checkpoint**: Estructura lista, nada bloqueante creado aún.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Composite actions/config reutilizados por múltiples workflows — DEBEN existir antes de escribir cualquier `pr-validation-*`/`ci-*` workflow que los invoque.

**⚠️ CRITICAL**: Ningún workflow de Fase 3+ puede referenciar estos sin que existan primero.

- [ ] T004 [P] Crear composite action `.github/actions/constitution-guardian/action.yml` (invoca `CONSTITUTION_GUARDIAN_API_URL`, fail-closed ante timeout/error — usado por `pr-validation-back` y `pr-validation-front`)
- [ ] T005 [P] Documentar en `docs/ci-cd-environment-setup.md` (ya existe) que `CONSTITUTION_GUARDIAN_API_URL` es prerrequisito de T004 — solo actualizar si el contrato de la action cambia
- [ ] T006 Fijar por SHA completo las Actions externas de terceros a usar (`actions/checkout`, `actions/upload-artifact`, `docker/build-push-action`, `docker/login-action`, gitleaks-action, trivy-action, spectral-action, `softprops/action-gh-release`) en un bloque de referencia versionado en `research.md` (Principio I) para reutilizar el mismo SHA en los 6 workflows

**Checkpoint**: Composite actions y SHAs fijados — los 3 pares de workflows pueden implementarse en paralelo.

---

## Phase 3: User Story 1 - Validación de PR bloquea código roto (Priority: P1) 🎯 MVP

**Goal**: Todo PR `feature/*` → `develop` corre las gates de su componente y bloquea el merge si alguna falla.

**Independent Test**: Abrir un PR con un test roto en backend → `pr-validation-back` falla → merge bloqueado; un PR con cambios solo en frontend no dispara `pr-validation-back`.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Crear `.github/workflows/pr-validation-back.yml`: trigger `pull_request` → `develop`, `paths: ["backend/**"]`, permisos mínimos (`contents: read`)
- [ ] T008 [US1] Job `lint-test` en `pr-validation-back.yml` (`npm test` vía `package.json` de `backend/`) (depende de T007)
- [ ] T009 [P] [US1] Job `spectral` en `pr-validation-back.yml` sobre `contracts/openapi.yaml` (depende de T008, `needs: lint-test`)
- [ ] T010 [P] [US1] Job `oasdiff` en `pr-validation-back.yml` (base `develop` vs PR) (depende de T008)
- [ ] T011 [P] [US1] Job `gitleaks` en `pr-validation-back.yml` (depende de T008)
- [ ] T012 [P] [US1] Job `check-acceptance` en `pr-validation-back.yml` ejecutando `backend/scripts/check-acceptance.js` (depende de T003, T008)
- [ ] T013 [P] [US1] Job `trivy` en `pr-validation-back.yml`: `docker build --load` de `backend/Dockerfile` + scan (depende de T008)
- [ ] T014 [P] [US1] Job `constitution-guardian` en `pr-validation-back.yml` usando la action de T004 (depende de T004, T008)
- [ ] T015 [US1] Job `code-review` (dummy) en `pr-validation-back.yml` con `needs:` de T009–T014, certifica el paso
- [ ] T016 [P] [US1] Crear `.github/workflows/pr-validation-front.yml`: trigger `pull_request` → `develop`, `paths: ["frontend/**"]`, permisos mínimos
- [ ] T017 [US1] Job `lint-test` en `pr-validation-front.yml` (depende de T016)
- [ ] T018 [P] [US1] Job `gitleaks` en `pr-validation-front.yml` (depende de T017)
- [ ] T019 [P] [US1] Job `constitution-guardian` en `pr-validation-front.yml` usando la action de T004 (depende de T004, T017)
- [ ] T020 [US1] Job `code-review` (dummy) en `pr-validation-front.yml` con `needs:` de T018, T019
- [ ] T021 [US1] Configurar branch protection de `develop` requiriendo `pr-validation-back`/`pr-validation-front` (seguir `docs/ci-cd-branch-protection.md`, paso manual — registrar hecho, no archivo)

**Checkpoint**: User Story 1 completa — PRs quedan validados y bloqueados de forma independiente por componente.

---

## Phase 4: User Story 2 - Integración en develop publica snapshot (Priority: P2)

**Goal**: Merge a `develop` construye y publica imagen snapshot + dist artifact, trazables al commit.

**Independent Test**: Mergear a `develop` → aparece `x.y.z-snapshot.{sha}` en GHCR + artifact dist con el mismo sha (SC-003).

### Implementation for User Story 2

- [ ] T022 [P] [US2] Crear `.github/workflows/ci-develop-back.yml`: trigger `push` → `develop`, `paths: ["backend/**"]`, permisos (`contents: read`, `packages: write` solo en job de push)
- [ ] T023 [US2] Job `ci` (lint+test+build) en `ci-develop-back.yml` (depende de T022)
- [ ] T024 [US2] Job `version` que calcula `x.y.z-snapshot.{short-sha}` desde `backend/VERSION` (FR-006) (depende de T023)
- [ ] T025 [P] [US2] Job `docker-build-push` en `ci-develop-back.yml`: build + push a `ghcr.io/<org>/<repo>/fieldops-back:<tag>` con `GITHUB_TOKEN` (depende de T024)
- [ ] T026 [P] [US2] Job `upload-dist` en `ci-develop-back.yml`: `actions/upload-artifact` del build compilado, retención 90 días (depende de T023)
- [ ] T027 [P] [US2] Crear `.github/workflows/ci-develop-front.yml`: trigger `push` → `develop`, `paths: ["frontend/**"]`, mismos permisos que T022
- [ ] T028 [US2] Job `ci` (lint+test+build) en `ci-develop-front.yml` (depende de T027)
- [ ] T029 [US2] Job `version` (snapshot desde `frontend/VERSION`) en `ci-develop-front.yml` (depende de T028)
- [ ] T030 [P] [US2] Job `docker-build-push` en `ci-develop-front.yml` (depende de T029)
- [ ] T031 [P] [US2] Job `upload-dist` en `ci-develop-front.yml` (depende de T028)

**Checkpoint**: User Stories 1 y 2 funcionan de forma independiente — snapshot verificable en GHCR tras cada merge a develop.

---

## Phase 5: User Story 3 - Integración en main publica release final (Priority: P3)

**Goal**: Merge a `main` construye imagen semver final y publica GitHub Release con dist permanente.

**Independent Test**: Mergear a `main`, crear tag semver vía `scripts/release-tag.sh back` (p.ej. `back-v1.2.0`), empujarlo → Release visible con imagen `1.2.0` en GHCR (SC-004).

### Implementation for User Story 3

- [ ] T032 [P] [US3] Crear `.github/workflows/ci-main-back.yml`: trigger `push` de tag `back-v*.*.*` (NO push genérico de rama `main` — el tag es prerrequisito, creado por T003a antes del merge), permisos (`contents: write` para Release, `packages: write` solo en job de push)
- [ ] T033 [US3] Job `ci` (lint+test+build) en `ci-main-back.yml` (depende de T032)
- [ ] T034 [US3] Job `version` que extrae `X.Y.Z` del nombre del tag `back-vX.Y.Z` que disparó el workflow (FR-009) (depende de T033)
- [ ] T035 [P] [US3] Job `docker-build-push` en `ci-main-back.yml`: build + push `ghcr.io/<org>/<repo>/fieldops-back:x.y.z` (depende de T034)
- [ ] T036 [P] [US3] Job `gh-release` en `ci-main-back.yml`: `softprops/action-gh-release` con dist comprimido como asset (depende de T033)
- [ ] T037 [P] [US3] Crear `.github/workflows/ci-main-front.yml`: trigger `push` de tag `front-v*.*.*`, mismos permisos que T032
- [ ] T038 [US3] Job `ci` (lint+test+build) en `ci-main-front.yml` (depende de T037)
- [ ] T039 [US3] Job `version` que extrae `X.Y.Z` del nombre del tag `front-vX.Y.Z` (depende de T038)
- [ ] T040 [P] [US3] Job `docker-build-push` en `ci-main-front.yml` (depende de T039)
- [ ] T041 [P] [US3] Job `gh-release` en `ci-main-front.yml` (depende de T038)

**Checkpoint**: Los 6 workflows de la Capa 1 mínima están completos e independientemente funcionales.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificación transversal de las reglas no negociables y cierre de Capa 1.

- [ ] T042 [P] Verificar que todo `uses:` en los 6 workflows está fijado por SHA completo (Principio I) — revisión estática
- [ ] T043 [P] Verificar `permissions:` mínimos declarados por job en los 6 workflows (Principio II)
- [ ] T044 Actualizar `README.md` con branching strategy, cómo abrir PR de prueba, cómo verificar snapshot en GHCR (Fase 7 roadmap)
- [ ] T045 Ejecutar `quickstart.md` end-to-end (PR de prueba → merge develop → merge main) y registrar resultado
- [ ] T046 Confirmar vía `git log` que `spec.md`/`plan.md`/`pipeline-constitution.md` preceden al primer commit de `.github/workflows/*.yml` (Principio IV, verificable)

**Capa 2 (opcional, no bloqueante — solo si se aborda tras cerrar Capa 1)**:

- [ ] T047 [P] Job de CD a `dev` en `ci-develop-{back,front}.yml`, `needs:` del job de push de imagen, usando `scripts/deploy.sh`
- [ ] T048 [P] Job de CD a `pre` en `ci-main-{back,front}.yml`, `needs:` del job de push de imagen
- [ ] T049 Job de CD a `prod` con `environment: production` (reviewer manual), `needs:` del job de CD a `pre`
- [ ] T050 Health-check post-despliegue (Principio IX) en los jobs de CD de T047–T049

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup — bloquea toda referencia a `constitution-guardian` action o a SHAs fijados en Fase 3+.
- **User Stories (Phase 3-5)**: dependen de Foundational. Independientes entre sí (US1/US2/US3 no se referencian mutuamente — ninguna usa `workflow_call`/`workflow_run` cruzado, por diseño de plan.md).
- **Polish (Phase 6)**: depende de que al menos US1–US3 (Capa 1) estén completas.

### User Story Dependencies

- **US1 (P1)**: sin dependencia de otras stories.
- **US2 (P2)**: sin dependencia de US1 a nivel de workflow (trigger distinto: `push` a `develop` vs `pull_request`); en la práctica un merge a `develop` normalmente sigue a un PR validado por US1, pero el workflow de US2 no invoca ni requiere el de US1.
- **US3 (P3)**: análogo — depende en la práctica de que `main` reciba el merge desde `develop`, pero el workflow no tiene dependencia técnica con US1/US2.

### Parallel Opportunities

- T007–T015 (back) y T016–T020 (front) de US1 pueden avanzar en paralelo (archivos distintos).
- Todas las tareas `[P]` dentro de una story usan archivos distintos o jobs independientes dentro del mismo workflow.
- US1, US2 y US3 pueden trabajarse en paralelo por distintos desarrolladores una vez completada Foundational — aunque el orden recomendado (MVP) es secuencial por prioridad.

---

## Parallel Example: User Story 1

```bash
# Workflow backend y frontend en paralelo (archivos distintos):
Task: "Crear .github/workflows/pr-validation-back.yml"
Task: "Crear .github/workflows/pr-validation-front.yml"

# Gates independientes dentro de pr-validation-back.yml, tras lint-test:
Task: "Job spectral en pr-validation-back.yml"
Task: "Job oasdiff en pr-validation-back.yml"
Task: "Job gitleaks en pr-validation-back.yml"
Task: "Job check-acceptance en pr-validation-back.yml"
Task: "Job trivy en pr-validation-back.yml"
Task: "Job constitution-guardian en pr-validation-back.yml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Fase 1: Setup
2. Fase 2: Foundational (crítico — bloquea todo lo demás)
3. Fase 3: User Story 1 (`pr-validation-back.yml` + `pr-validation-front.yml`)
4. **STOP y VALIDAR**: abrir PR de prueba, confirmar aislamiento por componente y bloqueo de merge (quickstart.md pasos 1-2)

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → validar independientemente → PRs ya protegidos (MVP)
3. US2 → validar independientemente → snapshot en GHCR funcionando
4. US3 → validar independientemente → Release final funcionando
5. Capa 2 (opcional) solo si se decide abordarla — no bloquea el cierre de Capa 1

---

## Notes

- Ningún workflow de Fase 3-5 debe disparar a otro de los 6 (Principio V / plan.md — Dependencias entre los 6 workflows).
- Cada tarea de creación de workflow (`T007`, `T016`, `T022`, `T027`, `T032`, `T037`) es la base — los jobs subsiguientes del mismo archivo se añaden incrementalmente al mismo YAML, no archivos nuevos.
- Verificar Principio I (pin SHA) en cada `uses:` añadido, no solo al final (T042 es la verificación de cierre, no la única oportunidad de corregir).
- Commit tras cada tarea o grupo lógico — recordar Principio IV: el primer commit de cualquier `.github/workflows/*.yml` debe ser posterior al de `spec.md`/`plan.md` (ya cumplido, ver `git log`).
