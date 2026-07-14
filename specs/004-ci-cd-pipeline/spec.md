# Feature Specification: Pipeline CI/CD FieldOps

**Feature Branch**: `004-ci-cd-pipeline`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "Pipeline CI/CD vía Spec-Kit para FieldOps — 6 workflows (pr-validation-front/back, ci-develop-front/back, ci-main-front/back), gates M9, versionado semver, publicación GHCR + artefactos dist, CD opcional dev/pre/prod"

## Clarifications

### Session 2026-07-14

- Q: ¿Qué patrón exacto de `paths:` filter detecta cambios por componente? → A: `backend/**` y `frontend/**`.
- Q: ¿Cómo se calcula la versión snapshot en `develop`? → A: leer `x.y.z` de `backend/VERSION` / `frontend/VERSION` y componer `x.y.z-snapshot.{short-sha}`.
- Q: ¿Quién crea el tag semver antes del merge a `main`? → A: `scripts/bump-version.sh` automatizado (no manual).
- Q: ¿Qué contenido exacto incluye el dist de develop/main? → A: build compilado del componente (`dist/`/`build/`), comprimido, sin `node_modules` ni fuente.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validación de PR bloquea código roto (Priority: P1)

Un desarrollador abre un PR desde `feature/*` hacia `develop` tocando backend o
frontend. El pipeline corre automáticamente todas las gates correspondientes al
componente modificado y bloquea el merge si alguna falla.

**Why this priority**: Es la primera línea de defensa — sin esto, código con
vulnerabilidades, breaking changes o secrets filtrados llega a `develop`.

**Independent Test**: Abrir un PR que rompe un test unitario de backend y
verificar que `pr-validation-back.yml` falla y el merge queda bloqueado.

**Acceptance Scenarios**:

1. **Given** un PR `feature/*` → `develop` con cambios solo en `backend/`,
   **When** se abre o actualiza el PR, **Then** corre `pr-validation-back.yml`
   (lint+test, Spectral, oasdiff, Gitleaks, check-acceptance, Trivy, guardián
   de Constitución, code review dummy) y `pr-validation-front.yml` NO se
   ejecuta.
2. **Given** un PR con cambios solo en `frontend/`, **When** se abre o
   actualiza el PR, **Then** corre `pr-validation-front.yml` (lint+test,
   Gitleaks, guardián de Constitución) y `pr-validation-back.yml` NO se
   ejecuta.
3. **Given** cualquier gate de validación falla, **When** se evalúa el estado
   del PR, **Then** el merge queda bloqueado hasta que se corrija.

---

### User Story 2 - Integración en develop publica snapshot (Priority: P2)

Al hacer merge de un PR aprobado a `develop`, el pipeline construye y publica
una imagen Docker snapshot y el artefacto dist correspondiente, dejando
trazabilidad de qué commit generó qué artefacto.

**Why this priority**: Sin esto no hay forma de desplegar ni verificar el
resultado de la integración continua antes de llegar a producción.

**Independent Test**: Mergear un PR a `develop` y verificar que aparece una
imagen `x.y.z-snapshot.{sha}` en GHCR y un artifact de workflow con el dist.

**Acceptance Scenarios**:

1. **Given** un merge a `develop` con cambios en `backend/`, **When** termina
   el CI, **Then** se publica en GHCR una imagen
   `ghcr.io/<org>/<repo>/fieldops-back:x.y.z-snapshot.{short-sha}` y se sube
   un artifact de workflow con el dist comprimido (retención 90 días).
2. **Given** un merge a `develop` con cambios en `frontend/`, **When** termina
   el CI, **Then** ocurre el mismo comportamiento equivalente para el
   componente frontend.
3. **Given** el CD opcional a `dev` está habilitado, **When** la imagen
   snapshot se publica, **Then** se despliega automáticamente a `dev` sin
   aprobación manual.

---

### User Story 3 - Integración en main publica release final (Priority: P3)

Al hacer merge a `main` (desde `develop`, con tag semver ya creado), el
pipeline construye la imagen con versión final, publica un GitHub Release con
el dist como asset permanente, y opcionalmente despliega a `pre` y `prod` con
aprobación manual para este último.

**Why this priority**: Es el cierre del ciclo — sin esto no hay entrega
formal versionada ni trazabilidad permanente del artefacto de producción.

**Independent Test**: Crear un tag semver, mergear `develop` → `main` y
verificar que se crea un GitHub Release con el dist adjunto y la imagen
`x.y.z` en GHCR.

**Acceptance Scenarios**:

1. **Given** un merge a `main` con cambios en backend y un tag semver
   preexistente, **When** termina el CI, **Then** se publica en GHCR la
   imagen `ghcr.io/<org>/<repo>/fieldops-back:x.y.z` y se crea un GitHub
   Release con el dist comprimido como asset.
2. **Given** el CD opcional a `pre`/`prod` está habilitado, **When** el
   Release se publica, **Then** se despliega automáticamente a `pre`, y el
   despliegue a `prod` queda pendiente de aprobación manual vía GitHub
   Environment con reviewer.

---

### Edge Cases

- ¿Qué pasa si un PR toca `frontend/` y `backend/` a la vez? Ambos workflows
  de validación deben correr en paralelo, cada uno evaluando solo su propio
  conjunto de gates.
- ¿Qué pasa si se intenta mergear a `main` sin tag semver creado por
  `scripts/bump-version.sh`? El workflow de `ci-main-*` debe fallar y no
  publicar imagen versión final ni Release.
- ¿Qué pasa si Trivy detecta una vulnerabilidad crítica en la imagen? El job
  de build/push debe fallar y no publicar la imagen a GHCR.
- ¿Qué pasa si el guardián de Constitución (Claude Code Action) no puede
  contactar la API del agente (timeout/error de red)? El gate debe fallar de
  forma segura (fail-closed), bloqueando el merge en vez de asumir éxito.

## Requirements *(mandatory)*

### Functional Requirements

**Validación de PR (pr-validation-front.yml / pr-validation-back.yml)**

- **FR-001**: CUANDO se abre o actualiza un PR de `feature/*` hacia `develop`
  con cambios en `backend/`, el sistema DEBE ejecutar
  `pr-validation-back.yml` con las gates: lint+test (`npm test`), Spectral
  (contrato OpenAPI), oasdiff (breaking changes), Gitleaks (secrets),
  `check-acceptance.js` (ACs vs API), Trivy (vulnerabilidades de imagen),
  guardián de Constitución (Claude Code Action) y job dummy de code review.
- **FR-002**: CUANDO se abre o actualiza un PR de `feature/*` hacia `develop`
  con cambios en `frontend/`, el sistema DEBE ejecutar
  `pr-validation-front.yml` con las gates: lint+test, Gitleaks, guardián de
  Constitución.
- **FR-003**: SI un PR no contiene cambios en `backend/**`, ENTONCES el
  sistema NO DEBE ejecutar `pr-validation-back.yml` (y análogamente
  `frontend/**` para frontend), usando filtros de ruta (`paths:`) exactos
  `backend/**` / `frontend/**` en el trigger.
- **FR-004**: SI cualquier gate de un workflow de validación de PR falla,
  ENTONCES el sistema DEBE bloquear el merge del PR.

**CI de develop (ci-develop-front.yml / ci-develop-back.yml)**

- **FR-005**: CUANDO se hace merge a `develop` con cambios en `backend/`
  (o `frontend/`), el sistema DEBE ejecutar el CI completo del componente
  afectado, construir una imagen Docker etiquetada
  `x.y.z-snapshot.{short-sha}`, publicarla en GHCR, y subir como workflow
  artifact (retención 90 días) el build compilado del componente
  (`dist/`/`build/`) comprimido, sin `node_modules` ni código fuente.
- **FR-006**: El sistema DEBE calcular la versión snapshot leyendo `x.y.z`
  del archivo `VERSION` del componente (`backend/VERSION` /
  `frontend/VERSION`) y componiendo `x.y.z-snapshot.{short-sha}` con el
  short-sha del commit actual.
- **FR-007 (opcional, Capa 2)**: TRAS publicar la imagen snapshot en GHCR, el
  sistema PUEDE desplegar automáticamente al entorno `dev` sin aprobación
  manual.

**CI de main (ci-main-front.yml / ci-main-back.yml)**

- **FR-008**: CUANDO se hace merge a `main` con cambios en `backend/` (o
  `frontend/`), el sistema DEBE ejecutar el CI completo del componente
  afectado, construir una imagen Docker con la versión semver final derivada
  del tag de git, publicarla en GHCR, y crear un GitHub Release con el build
  compilado del componente (`dist/`/`build/`) comprimido como asset
  permanente.
- **FR-009**: El sistema DEBE derivar la versión final de imagen y Release
  del tag de git creado antes del merge a `main` mediante
  `scripts/bump-version.sh`, ejecutado de forma automatizada (no manual)
  como parte del flujo de release.
- **FR-010 (opcional, Capa 2)**: TRAS publicar el Release, el sistema PUEDE
  desplegar automáticamente a `pre`, y DEBE requerir aprobación manual
  (GitHub Environment con reviewer) antes de desplegar a `prod`.

**Transversales**

- **FR-011**: El sistema DEBE fijar toda GitHub Action externa por SHA
  completo de commit en todos los workflows (no tags mutables).
- **FR-012**: Cada job DEBE declarar sus propios `permissions` mínimos;
  `packages: write` DEBE limitarse al job que publica en GHCR.
- **FR-013**: El sistema NUNCA DEBE reconstruir imagen desde código fuente en
  un job de despliegue (CD) — DEBE consumir la imagen ya publicada en GHCR
  por el CI correspondiente.
- **FR-014**: El sistema DEBE autenticarse contra GHCR usando el
  `GITHUB_TOKEN` inyectado automáticamente, sin secrets adicionales.
- **FR-015**: La imagen Docker publicada y el artefacto dist publicado para
  un mismo evento (merge a `develop` o a `main`) DEBEN corresponder al mismo
  commit.

### Key Entities

- **Workflow de validación de PR**: Ejecuta gates de calidad/seguridad sobre
  un componente al abrir/actualizar un PR hacia `develop`; resultado
  bloqueante para el merge.
- **Workflow CI de develop**: Ejecuta CI completo tras merge a `develop`;
  produce imagen snapshot + artifact dist temporal (90 días).
- **Workflow CI de main**: Ejecuta CI completo tras merge a `main`; produce
  imagen versión final + GitHub Release con dist permanente.
- **Imagen Docker (GHCR)**: Artefacto de imagen versionado por snapshot o
  semver final, trazable a un commit específico.
- **Artefacto dist**: Build comprimido del componente, publicado como
  workflow artifact (develop) o Release asset (main).
- **Gate de validación**: Unidad de verificación (lint/test, Spectral,
  oasdiff, Gitleaks, check-acceptance, Trivy, guardián de Constitución, code
  review dummy) asociada a un componente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un PR con cambios solo en un componente dispara únicamente el
  workflow de validación de ese componente — verificable en 100% de los PRs
  de prueba.
- **SC-002**: El tiempo total de ejecución de cada workflow de validación de
  PR es inferior a 10 minutos en el 95% de las ejecuciones.
- **SC-003**: Todo merge a `develop` produce una imagen en GHCR y un
  artifact dist localizables y correlacionables al mismo commit en menos de
  15 minutos tras el merge.
- **SC-004**: Todo merge a `main` produce un GitHub Release visible desde la
  pestaña Releases con el dist adjunto, en menos de 15 minutos tras el merge.
- **SC-005**: Ningún workflow generado contiene una referencia de Action
  externa por tag mutable — 0 excepciones verificables por revisión estática.
- **SC-006**: El despliegue a `prod` nunca ocurre sin un registro de
  aprobación manual explícita — 0 excepciones en el historial de deployments.

## Assumptions

- Los 6 workflows son independientes entre sí (sin triggers cruzados),
  siguiendo el diseño de `pipeline-constitution.md`.
- Las gates de validación (Spectral, oasdiff, Gitleaks, check-acceptance,
  Trivy) ya existen como scripts/configuración de la fase M9 y solo se
  integran en los nuevos workflows, no se rediseñan.
- El repositorio es público o el plan de GitHub incluye GHCR sin costo
  adicional relevante para este alcance.
- La creación de tags semver para `main` está automatizada vía
  `scripts/bump-version.sh` (ya presente en el repo), no es un paso manual.
- `backend/VERSION` y `frontend/VERSION` (ya presentes en el repo) son la
  fuente de verdad de la versión base `x.y.z` para el cálculo de snapshot.
- El CD a `dev`/`pre`/`prod` (Capa 2) es opcional y no bloqueante para
  considerar completa la Capa 1 mínima del reto.
- Existe un GitHub Environment `production` configurable con reviewer para
  la aprobación manual de `prod`.
