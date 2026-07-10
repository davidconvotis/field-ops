---

description: "Task list for Gestión de Órdenes de Trabajo"
---

# Tasks: Gestión de Órdenes de Trabajo

**Input**: Design documents from `/specs/001-work-order-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml (raíz repo), quickstart.md

**Tests**: Incluidos y NO opcionales — la constitución del proyecto exige contrato antes que código (Principio II, "ningún endpoint listo sin al menos un test de contrato en verde") y trazabilidad requisito→test (Principio III).

**Organization**: Tareas agrupadas por user story (spec.md) para implementación y prueba independiente de cada una.

**Nota de revisión (`/speckit-analyze`)**: esta versión incorpora las correcciones de los hallazgos HIGH C1 y C2 — tarea centralizada de matriz RBAC (T074) y tareas dedicadas de fallo de dependencia externa por adaptador (T016, T017, T024, T025).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: User story a la que pertenece (US1..US5)
- Rutas de archivo exactas en cada descripción

## Path Conventions (de plan.md)

- **Backend**: `backend/src/`, `backend/tests/`, `backend/prisma/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **Contrato canónico**: `contracts/openapi.yaml` (raíz repo, ruta fija por constitución)
- **Cross-cutting**: `docs/`, `evals/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto y estructura base

- [ ] T001 Crear estructura de repositorio per plan.md (`backend/`, `frontend/`, `contracts/`, `docs/adr/`, `evals/summary/`)
- [ ] T002 Inicializar proyecto backend Node.js 20+ con Express y TypeScript (`backend/package.json`, `backend/tsconfig.json`)
- [ ] T003 [P] Inicializar `backend/prisma/schema.prisma` (datasource PostgreSQL, `DATABASE_URL` env var; datasource alterno SQLite para tests)
- [ ] T004 [P] Inicializar proyecto frontend React 18+ con React Router (`frontend/package.json`, `frontend/src/main.jsx`)
- [ ] T005 [P] Configurar ESLint + Prettier para backend y frontend (`backend/.eslintrc.cjs`, `frontend/.eslintrc.cjs`)
- [ ] T006 [P] Configurar Jest + Supertest en backend (`backend/jest.config.js`) y React Testing Library en frontend (`frontend/jest.config.js`)
- [ ] T007 Definir scripts raíz de un-único-comando por operación (`package.json`: `setup`, `dev`, `test`) per constitución "Arranque"

**Checkpoint**: Estructura de proyecto lista para infraestructura compartida.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura núcleo que DEBE completarse antes de cualquier user story

**⚠️ CRITICAL**: Ninguna user story puede empezar hasta completar esta fase

- [ ] T008 Definir schema Prisma completo (`User`, `Order`, `ExecutionRecord`, `EvidencePhoto`, `AuditLogEntry`) per `data-model.md` en `backend/prisma/schema.prisma`
- [ ] T009 Generar y ejecutar migración inicial + config de datasource de test SQLite en memoria en `backend/prisma/migrations/` y `backend/prisma/schema.test.prisma`
- [ ] T010 [P] Implementar `idpAdapter` (verificación JWT prod vía JWKS + modo dev con secreto local) en `backend/src/adapters/idpAdapter.js`
- [ ] T011 [P] Implementar `encryptionAdapter` (KMS prod / AES-256-GCM local dev, NFR-02/02b) en `backend/src/adapters/encryptionAdapter.js`
- [ ] T012 [P] Implementar `storageAdapter` (S3-compatible prod / filesystem local dev, con wrapper de timeout explícito, NFR-06b) en `backend/src/adapters/storageAdapter.js`
- [ ] T013 [P] Implementar middleware `authn` (401 en token ausente/inválido, 503 en fallo de IdP, NFR-03b) en `backend/src/middleware/authn.js` (usa T010)
- [ ] T014 Implementar middleware `rbac` (403 transversal por rol, FR-000) en `backend/src/middleware/rbac.js` (depende de T013)
- [ ] T015 [P] Implementar `auditService` (escritura de audit log atómica con el cambio de estado, NFR-04b) en `backend/src/services/auditService.js`
- [ ] T016 [P] Integration test: fallo simulado del IdP/JWKS → `503` (nunca `401`) en `backend/tests/integration/test_idp_failure.js` (NFR-03b; depende de T010, T013)
- [ ] T017 [P] Integration test: fallo simulado de `auditService` durante un cambio de estado → rollback completo `503`, ningún cambio se persiste sin su registro de auditoría en `backend/tests/integration/test_audit_failure.js` (NFR-04b; depende de T015)
- [ ] T018 Montar esqueleto de app Express + enrutamiento base en `backend/src/api/app.js` (depende de T013, T014)
- [ ] T019 [P] Script de seed: usuarios de los 4 roles + tokens JWT de dev en `backend/prisma/seed.js`
- [ ] T020 Configurar generación de tests de contrato desde `contracts/openapi.yaml` en `backend/tests/contract/setup.js`

**Checkpoint**: Fundación lista — la implementación de user stories puede comenzar.

---

## Phase 3: User Story 1 - Técnico registra ejecución de orden (Priority: P1) 🎯 MVP

**Goal**: Un técnico con orden asignada registra ejecución (≥1 foto válida + notas obligatorias), la orden pasa a `pendiente_de_revision`, con validación de tipo real, todo-o-nada, autorización atómica e idempotencia.

**Independent Test**: Seed directo en BD de una orden `sin_asignar`→asignada a un técnico (sin pasar por US2), enviar ejecución vía `POST /orders/{id}/executions` y verificar transición + persistencia.

**Nota de independencia**: para no depender de US2, el fixture de test crea la orden y la asignación directamente vía Prisma (no vía endpoints de US2).

### Tests for User Story 1 ⚠️

> Escribir estos tests PRIMERO, verificar que fallan antes de implementar

- [ ] T021 [P] [US1] Contract test `POST /orders/{orderId}/executions` en `backend/tests/contract/test_executions_post.js`
- [ ] T022 [P] [US1] Integration test escenario 1 (envío válido → `pendiente_de_revision` + timestamp) en `backend/tests/integration/test_us1_submit_execution.js`
- [ ] T023 [P] [US1] Integration test escenarios 2-7 (sin foto→400, tipo inválido→415 con rollback, notas vacías→400, orden terminal→409, no asignado→403 incl. reasignación en vuelo, reintento idempotente→200, idempotencyKey con payload distinto→409) en `backend/tests/integration/test_us1_edge_cases.js`
- [ ] T024 [P] [US1] Integration test: fallo/timeout simulado de `storageAdapter` durante subida de foto → `502`/`503`/`504`, orden nunca marcada `pendiente_de_revision`, sin foto huérfana referenciada en `backend/tests/integration/test_us1_storage_failure.js` (NFR-06b)
- [ ] T025 [P] [US1] Integration test: fallo simulado de `encryptionAdapter`/KMS al persistir una foto → `503`, ninguna foto se persiste en claro como fallback en `backend/tests/integration/test_us1_encryption_failure.js` (NFR-02b, SC-007)

### Implementation for User Story 1

- [ ] T026 [US1] Implementar recepción multipart (`multer`) + validación de tipo por magic bytes (jpg/png/heic, FR-008/NFR-08) en `backend/src/services/executionService.js` (usa T012)
- [ ] T027 [US1] Implementar semántica todo-o-nada: rollback de fotos ya persistidas si alguna falla validación (FR-009) en `backend/src/services/executionService.js`
- [ ] T028 [US1] Implementar lookup/dedupe de `idempotencyKey` + 409 en colisión con payload distinto (FR-012/FR-012b) en `backend/src/services/executionService.js`
- [ ] T029 [US1] Implementar chequeo atómico de asignación (FR-010) y de estado terminal (FR-011) en el momento de escritura en `backend/src/services/executionService.js`
- [ ] T030 [US1] Cifrar fotos vía `encryptionAdapter` antes de persistir (NFR-02/02b) en `backend/src/services/executionService.js` (usa T011, T026)
- [ ] T031 [US1] Implementar ruta `POST /orders/:orderId/executions` con `authn` + `rbac(tecnico)` + `executionService` en `backend/src/api/executions.js` (depende de T014, T026-T030)
- [ ] T032 [US1] Registrar audit log atómico con la transición a `pendiente_de_revision` (usa T015) en `backend/src/services/executionService.js`
- [ ] T033 [P] [US1] Frontend: componente `TechnicianExecutionForm` (selector de fotos, notas, generación de `Idempotency-Key`) en `frontend/src/pages/TechnicianExecutionForm.jsx`
- [ ] T034 [P] [US1] Frontend: método `submitExecution` en cliente API con manejo de 400/403/409/415/503 en `frontend/src/services/api.js`

**Checkpoint**: User Story 1 (MVP) funcional y testeable de forma independiente.

---

## Phase 4: User Story 2 - Dispatcher crea y (re)asigna órdenes (Priority: P1)

**Goal**: Dispatcher crea órdenes (`sin_asignar`), (re)asigna técnicos activos, bloquea reasignación en estados terminales, y la desactivación de un técnico reasigna automáticamente su trabajo en curso.

**Independent Test**: Crear orden vía `POST /orders`, verificar `sin_asignar`; (re)asignar vía `PATCH /orders/{id}/assign`; desactivar técnico y verificar auto-reasignación (FR-004d) — sin depender de US1/US3.

### Tests for User Story 2 ⚠️

- [ ] T035 [P] [US2] Contract test `POST /orders` en `backend/tests/contract/test_orders_post.js`
- [ ] T036 [P] [US2] Contract test `PATCH /orders/{orderId}/assign` en `backend/tests/contract/test_orders_assign.js`
- [ ] T037 [P] [US2] Contract test `PATCH /technicians/{technicianId}/activo` en `backend/tests/contract/test_technicians_activo.js`
- [ ] T038 [P] [US2] Integration test escenarios 1-4 (crear `sin_asignar`, reasignar a técnico activo, bloqueo en terminal 422/409 de carrera, `tecnicoId` inexistente/inactivo 422) en `backend/tests/integration/test_us2_assign.js`
- [ ] T039 [P] [US2] Integration test FR-004d (desactivar técnico con órdenes en curso → auto-reasignación a `sin_asignar` + audit log) en `backend/tests/integration/test_us2_deactivate_reassign.js`

### Implementation for User Story 2

- [ ] T040 [US2] Implementar `orderService.createOrder` (FR-001) en `backend/src/services/orderService.js`
- [ ] T041 [US2] Implementar `orderService.assignTechnician` con optimistic lock (FR-002/FR-003/FR-004/FR-003) en `backend/src/services/orderService.js` (depende de T040)
- [ ] T042 [US2] Implementar `userService.setTechnicianActive` + cascada de auto-reasignación (FR-004d) en `backend/src/services/userService.js` (reutiliza lógica de T041)
- [ ] T043 [US2] Implementar rutas `POST /orders`, `PATCH /orders/:id/assign`, `PATCH /technicians/:id/activo` con `rbac(dispatcher)` en `backend/src/api/orders.js` y `backend/src/api/technicians.js` (depende de T014, T040-T042)
- [ ] T044 [US2] Registrar audit log para `crear`/`asignar`/`reasignar`/`desactivar_tecnico_reasigna` (usa T015) en `backend/src/services/orderService.js` y `userService.js`
- [ ] T045 [P] [US2] Frontend: componente `DispatcherBoard` (crear orden, asignar/reasignar, activar/desactivar técnico) en `frontend/src/pages/DispatcherBoard.jsx`
- [ ] T046 [P] [US2] Frontend: métodos `createOrder` / `assignOrder` / `setTechnicianActive` en `frontend/src/services/api.js`

**Checkpoint**: User Stories 1 y 2 funcionan de forma independiente.

---

## Phase 5: User Story 3 - Supervisor aprueba o rechaza orden (Priority: P1)

**Goal**: Supervisor aprueba o rechaza (con motivo obligatorio) una orden en `pendiente_de_revision`, con chequeo atómico ante transiciones/conflictos concurrentes.

**Independent Test**: Seed de una orden en `pendiente_de_revision` (sin depender de US1), aprobar/rechazar vía endpoints y verificar transición terminal + audit log.

### Tests for User Story 3 ⚠️

- [ ] T047 [P] [US3] Contract test `POST /orders/{orderId}/approve` en `backend/tests/contract/test_orders_approve.js`
- [ ] T048 [P] [US3] Contract test `POST /orders/{orderId}/reject` en `backend/tests/contract/test_orders_reject.js`
- [ ] T049 [P] [US3] Integration test escenarios 1-3 (aprobar, rechazar con motivo, motivo vacío/espacios→400, no-op→409) en `backend/tests/integration/test_us3_review.js`
- [ ] T050 [P] [US3] Integration test carrera aprobar-vs-rechazar simultáneo (FR-016b) en `backend/tests/integration/test_us3_concurrent_conflict.js`

### Implementation for User Story 3

- [ ] T051 [US3] Implementar `reviewService.approve` con optimistic lock (FR-013/FR-016) en `backend/src/services/reviewService.js`
- [ ] T052 [US3] Implementar `reviewService.reject` con validación de motivo trim-no-vacío + optimistic lock (FR-014/FR-015/FR-016b) en `backend/src/services/reviewService.js` (depende de T051, comparte helper de lock)
- [ ] T053 [US3] Implementar rutas `POST /orders/:id/approve` y `POST /orders/:id/reject` con `rbac(supervisor)` en `backend/src/api/reviews.js` (depende de T014, T051, T052)
- [ ] T054 [US3] Registrar audit log incl. `conflicto_concurrente` para la transacción perdedora (usa T015) en `backend/src/services/reviewService.js`
- [ ] T055 [P] [US3] Frontend: componente `SupervisorReview` (aprobar / rechazar con motivo) en `frontend/src/pages/SupervisorReview.jsx`
- [ ] T056 [P] [US3] Frontend: métodos `approveOrder` / `rejectOrder` con manejo de cuerpo de 409 (estado final real) en `frontend/src/services/api.js`

**Checkpoint**: User Stories 1, 2 y 3 (ciclo de vida completo) funcionan de forma independiente.

---

## Phase 6: User Story 4 - Consulta de listado de órdenes por rol (Priority: P2)

**Goal**: Cada rol consulta únicamente el subconjunto de órdenes correspondiente a su alcance, sin fuga de existencia a roles sin acceso.

**Independent Test**: Seed de órdenes con distintos propietarios/técnicos, consultar `GET /orders` con tokens de cada rol y verificar el subconjunto exacto; verificar 403/404 uniforme en `GET /orders/{id}` inexistente.

### Tests for User Story 4 ⚠️

- [ ] T057 [P] [US4] Contract test `GET /orders` (alcance por rol) en `backend/tests/contract/test_orders_list.js`
- [ ] T058 [P] [US4] Contract test `GET /orders/{orderId}` (403 uniforme vs 404, FR-019) en `backend/tests/contract/test_orders_get.js`
- [ ] T059 [P] [US4] Integration test escenarios 1-4 (scoping cliente/técnico/dispatcher-supervisor + 403/404 uniforme) en `backend/tests/integration/test_us4_listing.js`

### Implementation for User Story 4

- [ ] T060 [US4] Implementar `orderService.listForRole` (scoping cliente/técnico/dispatcher/supervisor, FR-017/FR-018) en `backend/src/services/orderService.js`
- [ ] T061 [US4] Implementar chequeo consistente de autorización + existencia (FR-019) en `orderService.getById` en `backend/src/services/orderService.js`
- [ ] T062 [US4] Implementar rutas `GET /orders` y `GET /orders/:id` en `backend/src/api/orders.js` (depende de T014, T060, T061)
- [ ] T063 [P] [US4] Frontend: componente `ClientOrders` (listado de solo lectura para rol cliente) en `frontend/src/pages/ClientOrders.jsx`
- [ ] T064 [P] [US4] Frontend: componente compartido `OrdersList` consumiendo `GET /orders` con scoping por rol en `frontend/src/components/OrdersList.jsx`

**Checkpoint**: Listado por rol funcional de forma independiente sobre las stories anteriores.

---

## Phase 7: User Story 5 - Resumen automático de notas para supervisor (Priority: P3, fase 2 opcional)

**Goal**: Al abrir una orden con notas, el supervisor ve un resumen automático o una degradación explícita si el servicio falla/excede tiempo — nunca un resumen inventado (Principio IV).

**Independent Test**: Seed de una orden con notas registradas, forzar los 3 golden cases (nominal, insuficiente, ambiguo) contra `summaryService` y verificar `GET /orders/{id}`.

### Tests for User Story 5 ⚠️

- [ ] T065 [P] [US5] Golden cases (nominal, evidencia insuficiente <20 palabras, notas ambiguas) en `evals/summary/golden_cases.json`
- [ ] T066 [P] [US5] Integration test escenarios 1-2 (resumen disponible P95≤5s, degradación 200+`summaryUnavailable`) en `backend/tests/integration/test_us5_summary.js`

### Implementation for User Story 5

- [ ] T067 [US5] Implementar `summaryService` (resumen basado en reglas + fallback explícito <20 palabras + wrapper de timeout 5s) en `backend/src/services/summaryService.js`
- [ ] T068 [US5] Integrar `summaryService` en `GET /orders/:id` (`summary`/`summaryUnavailable`) en `backend/src/api/orders.js` (depende de T062, T067)
- [ ] T069 [P] [US5] Frontend: mostrar resumen o indicador de fallback en `SupervisorReview` (depende de T055) en `frontend/src/pages/SupervisorReview.jsx`

**Checkpoint**: Las 5 user stories funcionan de forma independiente y en conjunto.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras transversales a todas las user stories

- [ ] T070 [P] Implementar job de retención/borrado 12 meses (`node-cron`, NFR-04c) en `backend/src/adapters/retentionJob.js`
- [ ] T071 [P] Aplicar enforcement de TLS 1.2+ (rechazo de conexiones no-TLS, NFR-01) en `backend/src/middleware/tlsEnforce.js`
- [ ] T072 [P] Poblar `/docs/traceability.md` (FR-ID → AC-ID → test file:test name, Principio III) referenciando todos los tests de T016-T069
- [ ] T073 [P] Endurecimiento de seguridad: sin stack traces en respuestas de error de producción (`backend/src/middleware/errorHandler.js`); confirmar que el frontend nunca almacena tokens en `localStorage` (constitución, "Seguridad mínima")
- [ ] T074 [P] Integration test: matriz RBAC completa — los 4 roles contra los 8 endpoints del contrato, verificando `403` en cada combinación rol-incorrecto/operación y `401` sin token en `backend/tests/integration/test_rbac_matrix.js` (FR-000, NFR-03, SC-006; depende de que todas las rutas de US1-US4 existan: T031, T043, T053, T062)
- [ ] T075 Ejecutar validación completa de `quickstart.md` end-to-end
- [ ] T076 [P] Script de verificación de rendimiento básico contra NFR-05/NFR-06 en `backend/tests/performance/load_check.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias — puede iniciar de inmediato
- **Foundational (Phase 2)**: depende de Setup — BLOQUEA todas las user stories
- **User Stories (Phase 3-7)**: todas dependen de completar Foundational
  - Cada una es independientemente testeable vía seed directo (ver notas de independencia por story)
  - Se pueden trabajar en paralelo o en orden de prioridad (US1/US2/US3 → US4 → US5)
- **Polish (Phase 8)**: depende de las user stories deseadas completas — T074 (matriz RBAC) específicamente depende de que TODAS las rutas de US1-US4 existan

### User Story Dependencies

- **US1 (P1)**: puede iniciar tras Foundational — independiente vía seed directo de orden asignada
- **US2 (P1)**: puede iniciar tras Foundational — sin dependencia de US1/US3
- **US3 (P1)**: puede iniciar tras Foundational — independiente vía seed directo de orden `pendiente_de_revision`
- **US4 (P2)**: puede iniciar tras Foundational — se integra naturalmente con US1-US3 pero es testeable con datos fijos propios
- **US5 (P3)**: puede iniciar tras Foundational y tras T062 (endpoint `GET /orders/:id` de US4) para su integración final; su `summaryService` (T067) es desarrollable en paralelo

### Within Each User Story

- Tests escritos y en rojo antes de implementar
- Modelos (ya en Foundational) → servicios → endpoints → frontend
- Story completa antes de pasar a la siguiente prioridad

### Parallel Opportunities

- Todas las tareas [P] de Setup en paralelo
- Todas las tareas [P] de Foundational en paralelo (T010-T013, T015-T017, T019)
- Tras Foundational: US1, US2, US3 en paralelo (equipos distintos); US4 y US5 pueden empezar en paralelo sobre servicios ya existentes
- Todos los tests [P] de una story en paralelo
- Tareas de frontend [P] de una story en paralelo con las de backend de otra story

---

## Parallel Example: User Story 1

```bash
# Lanzar todos los tests de US1 juntos:
Task: "Contract test POST /orders/{orderId}/executions en backend/tests/contract/test_executions_post.js"
Task: "Integration test escenario 1 en backend/tests/integration/test_us1_submit_execution.js"
Task: "Integration test escenarios 2-7 en backend/tests/integration/test_us1_edge_cases.js"
Task: "Integration test fallo storage en backend/tests/integration/test_us1_storage_failure.js"
Task: "Integration test fallo encryption en backend/tests/integration/test_us1_encryption_failure.js"

# Tras implementación backend, frontend de US1 en paralelo:
Task: "TechnicianExecutionForm en frontend/src/pages/TechnicianExecutionForm.jsx"
Task: "submitExecution en frontend/src/services/api.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloquea todas las stories)
3. Completar Phase 3: User Story 1
4. **DETENER y VALIDAR**: probar User Story 1 de forma independiente (seed directo de orden asignada)
5. Deploy/demo si está listo

### Incremental Delivery

1. Setup + Foundational → fundación lista
2. US1 → validar independiente → demo (MVP del flujo de ejecución)
3. US2 → validar independiente → demo (ciclo completo crear→asignar→ejecutar ya es real end-to-end sin seeds)
4. US3 → validar independiente → demo (ciclo de vida completo cerrado)
5. US4 → validar independiente → demo (visibilidad por rol)
6. US5 → validar independiente → demo (resumen IA, opcional)
7. Polish (Phase 8) → hardening, retención, matriz RBAC, trazabilidad, performance

### Parallel Team Strategy

Con múltiples desarrolladores:

1. Equipo completa Setup + Foundational junto
2. Tras Foundational:
   - Dev A: US1 (ejecución)
   - Dev B: US2 (creación/asignación)
   - Dev C: US3 (aprobación/rechazo)
3. US4/US5 se toman tras liberar capacidad de las anteriores
4. La matriz RBAC (T074) se asigna a quien libere capacidad primero, una vez existan todas las rutas

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- [Story] mapea la tarea a su user story para trazabilidad (Principio III)
- Verificar que los tests fallan antes de implementar
- Commit tras cada tarea o grupo lógico
- Detenerse en cada checkpoint para validar la story de forma independiente
- Evitar: tareas vagas, conflictos de mismo archivo sin necesidad, dependencias cross-story que rompan independencia
