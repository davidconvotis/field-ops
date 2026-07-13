# Tasks: Panel de Dispatcher — Órdenes y Técnicos

**Input**: Design documents from `/specs/003-dispatcher-orders-ui/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos (no opcionales) — constitution Principio II/III exige test de contrato en verde antes de considerar un endpoint "listo", y traceability FR→AC→test.

**Organization**: Tareas agrupadas por user story (spec.md): US1 (P1, ver listado de órdenes filtrado/paginado), US2 (P1, asignar vía desplegable con modal de reasignación), US3 (P2, menú lateral), US4 (P2, listado de técnicos), US5 (P1, búsqueda de clientes al crear orden), US6 (P2, CRUD de clientes), US7 (P2, CRUD ampliado de técnicos), US8 (P2, editar/cancelar órdenes).

**Nota (revisión 2, 2026-07-13)**: Fases 1-7 (US1-US4) **ya están implementadas** — quedan como registro histórico, todas `[X]`. Rutas de archivo actualizadas de `.js`/`.jsx` a `.ts`/`.tsx` tras la migración retroactiva a TypeScript (ADR-003). Fases 8-13 (Setup 2, US5-US8, Polish 2) son el trabajo NUEVO de esta revisión, generado a partir de `plan.md`/`research.md`/`data-model.md` revisión 2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1, US2, US3, US4 — mapea a spec.md
- Rutas de archivo exactas en cada descripción

## Path Conventions

Web app existente (`001-work-order-management`, `002-login-rbac`, reutilizada): `backend/src/`, `backend/tests/`, `frontend/src/`, `frontend/tests/`.

---

## Phase 1: Setup

**Purpose**: Sin dependencias nuevas (research.md — no se añade ningún paquete). Solo verificación de que el contrato ya extendido es válido.

- [X] T001 Verificar que `contracts/openapi.yaml` (paths `/orders` extendido, `/technicians` extendido) es YAML válido: `node -e "require('js-yaml').load(require('fs').readFileSync('contracts/openapi.yaml','utf8'))"` desde la raíz del repo

**Checkpoint**: Contrato validado, sin instalación adicional requerida

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cambios de servicio compartidos por varias user stories — ninguna historia puede completarse sin esto

**⚠️ CRITICAL**: No dar por completada ninguna user story hasta que su parte de esta fase esté lista

- [X] T002 Extender `orderService.listForRole({ role, userId, status, technicianId, page, pageSize })` en `backend/src/services/orderService.ts` para: aplicar scope por rol (ya existente) PRIMERO, luego filtro opcional `status`/`technicianId` (AND), `include: { client: true, technician: true }` para mapear `clientNombre`/`technicianNombre`, y devolver `{ items, page, pageSize: 50, total }` (paginación fija, `pageSize` del request se ignora) — usado por US1
- [X] T003 [P] Añadir `userService.listTechnicians({ activo, page, pageSize })` en `backend/src/services/userService.ts`: filtra por rol `tecnico` y `activo` opcional, agrega `activeOrderCount` vía `groupBy` sobre `Order.technicianId` con `status = pendiente_de_revision` (research.md §4), devuelve `{ items, page, pageSize: 50, total }` — usado por US2 (con `activo=true`) y US4
- [X] T004 Actualizar `router.get('/', ...)` en `backend/src/api/orders.ts` para leer `req.query.status`, `req.query.technicianId`, `req.query.page` y pasarlos a `orderService.listForRole`; responder `400` si `status` no es uno de los 4 valores del enum o `technicianId` no es un uuid válido
- [X] T005 [P] Añadir `router.get('/', authn, rbac(ROLES.DISPATCHER), ...)` en `backend/src/api/technicians.ts` que llama `userService.listTechnicians({ activo: req.query.activo, page: req.query.page })`
- [X] T006 Actualizar los 4 consumidores existentes del array plano de `GET /orders` para leer `response.items` en vez de `response` directamente: `frontend/src/components/OrdersList.tsx`, `frontend/src/pages/ClientOrders.tsx`, `frontend/src/pages/TechnicianExecutionForm.tsx`, `frontend/src/pages/SupervisorReview.tsx` (contrato ahora devuelve `PaginatedOrders`, no array — breaking change documentado en plan.md)
- [X] T007 [P] Extender `frontend/src/services/api.ts`: `listOrders({ status, technicianId, page } = {})` (query string opcional) y nuevo `listTechnicians({ activo, page } = {})`

**Checkpoint**: Backend sirve listados filtrados/paginados con nombres legibles; consumidores existentes migrados al nuevo envelope — user stories pueden empezar

---

## Phase 3: User Story 1 - Dispatcher visualiza listado de órdenes (Priority: P1) 🎯 MVP

**Goal**: Dispatcher ve el listado completo de órdenes (id, estado, cliente, técnico, fecha), filtrable por estado/técnico, paginado, con refresco manual.

**Independent Test**: Con órdenes en distintos estados creadas, `GET /orders` (rol dispatcher) devuelve todas paginadas; aplicar `status=`/`technicianId=` reduce el conjunto; sin órdenes, la UI muestra estado vacío.

### Tests for User Story 1 ⚠️

> **Escribir estos tests PRIMERO, verificar que fallan antes de implementar**

- [X] T008 [P] [US1] Contract test `GET /orders?status=&technicianId=&page=` (200 `PaginatedOrders`, 400 status/technicianId inválido, 401 sin token) en `backend/tests/contract/test_orders_list_filters.ts`
- [X] T009 [P] [US1] Integration test: dispatcher filtra por estado, por técnico, y combinado (AND); dispatcher ve `total`/`page`/`pageSize` correctos con >50 órdenes seed en `backend/tests/integration/test_orders_list_pagination.ts`
- [X] T010 [P] [US1] Frontend test: `DispatcherOrders.tsx` renderiza listado con id/estado/cliente/técnico/fecha, estado vacío sin órdenes, y aplica filtros en `frontend/tests/DispatcherOrders.test.tsx`

### Implementation for User Story 1

- [X] T011 [US1] Crear página `frontend/src/pages/DispatcherOrders.tsx`: tabla de órdenes (`listOrders`), selects de filtro `status`/`technicianId`, controles de página (anterior/siguiente + número), botón "Refrescar" explícito (FR-002, sin refetch automático), estado vacío (FR-013) (depende de T002, T004, T007)
- [X] T012 [US1] Añadir manejo de error/loading (spinner, mensaje de error `ApiError`) en `frontend/src/pages/DispatcherOrders.tsx`

**Checkpoint**: US1 funcional de extremo a extremo — dispatcher ve, filtra, pagina y refresca el listado de órdenes

---

## Phase 4: User Story 2 - Dispatcher asigna orden a técnico desde desplegable (Priority: P1)

**Goal**: Dispatcher asigna orden `sin_asignar` directamente vía desplegable de técnicos activos; reasignar una orden ya asignada requiere confirmar en un modal.

**Independent Test**: Abrir desplegable sobre orden asignable muestra solo técnicos activos; seleccionar+confirmar asigna sin modal si la orden no tenía técnico, o con modal si ya lo tenía; sin técnicos activos, muestra mensaje y bloquea confirmación.

### Tests for User Story 2 ⚠️

- [X] T013 [P] [US2] Contract test `GET /technicians?activo=true` (200 `PaginatedTechnicians`, solo `activo=true`) en `backend/tests/contract/test_technicians_list.ts`
- [X] T014 [P] [US2] Integration test: desplegable excluye técnicos inactivos; asignación sobre orden en estado terminal rechazada (422); técnico desactivado entre carga y confirmación rechazado (409/422, edge case spec.md) en `backend/tests/integration/test_orders_assign_dropdown.ts`
- [X] T015 [P] [US2] Frontend test: `TechnicianAssignSelect.tsx` solo lista técnicos activos y muestra mensaje si no hay ninguno en `frontend/tests/TechnicianAssignSelect.test.tsx`
- [X] T016 [P] [US2] Frontend test: `ReassignConfirmModal.tsx` se muestra solo cuando la orden ya tenía técnico, confirma/cancela correctamente en `frontend/tests/ReassignConfirmModal.test.tsx`

### Implementation for User Story 2

- [X] T017 [P] [US2] Crear `frontend/src/components/TechnicianAssignSelect.tsx`: `<select>` poblado con `listTechnicians({ activo: true })`, mensaje si vacío (FR-007) (depende de T005, T007)
- [X] T018 [P] [US2] Crear `frontend/src/components/ReassignConfirmModal.tsx`: modal con técnico anterior → nuevo, botones confirmar/cancelar (FR-005a)
- [X] T019 [US2] Integrar `TechnicianAssignSelect` + `ReassignConfirmModal` en `frontend/src/pages/DispatcherOrders.tsx`: si `order.technicianId` es `null`, asignar directo al seleccionar (sin modal); si no es `null`, mostrar modal antes de llamar `assignOrder` (depende de T011, T017, T018)
- [X] T020 [US2] Deshabilitar/ocultar el control de asignación cuando la orden esté en estado terminal (`aprobada`/`rechazada`) en `frontend/src/pages/DispatcherOrders.tsx` (FR-006)

**Checkpoint**: US1 y US2 funcionan juntas — listado + asignación/reasignación con confirmación

---

## Phase 5: User Story 3 - Menú lateral de navegación en panel de dispatcher (Priority: P2)

**Goal**: Dispatcher navega entre "Órdenes" y "Técnicos" vía sidebar persistente que resalta la sección activa.

**Independent Test**: Login dispatcher muestra sidebar en toda ruta `/dispatcher/*`; click en cada opción navega y resalta correctamente; otro rol no accede a esas rutas.

### Tests for User Story 3 ⚠️

- [X] T021 [P] [US3] Frontend test: `DispatcherSidebar.tsx` resalta la ruta activa y navega al hacer click en `frontend/tests/DispatcherSidebar.test.tsx`
- [X] T022 [P] [US3] Frontend test: rutas `/dispatcher/orders` y `/dispatcher/technicians` rechazan sesión con rol distinto de dispatcher (reutiliza `RequireRole`) en `frontend/tests/App.test.tsx`

### Implementation for User Story 3

- [X] T023 [P] [US3] Crear `frontend/src/components/DispatcherSidebar.tsx`: enlaces "Órdenes" (`/dispatcher/orders`) y "Técnicos" (`/dispatcher/technicians`), resalta activo vía `useLocation` (FR-008, FR-009)
- [X] T024 [US3] Crear `frontend/src/pages/DispatcherLayout.tsx`: `DispatcherSidebar` + `<Outlet/>` (depende de T023)
- [X] T025 [US3] Actualizar `frontend/src/App.tsx`: reemplazar ruta única `/dispatcher` por rutas anidadas bajo `RequireRole role="dispatcher"` + `DispatcherLayout` → `/dispatcher/orders` (`DispatcherOrders`), `/dispatcher/technicians` (`DispatcherTechnicians`), redirect `/dispatcher` → `/dispatcher/orders` (depende de T011, T024, y de T028 de US4)

**Checkpoint**: US1, US2, US3 integradas — navegación completa del panel de dispatcher

---

## Phase 6: User Story 4 - Dispatcher visualiza listado de técnicos (Priority: P2)

**Goal**: Dispatcher ve listado paginado de técnicos con su estado activo/inactivo y cantidad de órdenes activas asignadas.

**Independent Test**: Con técnicos activos/inactivos y órdenes `pendiente_de_revision` asignadas, `GET /technicians` devuelve el listado paginado con `activeOrderCount` correcto por técnico.

### Tests for User Story 4 ⚠️

- [X] T026 [P] [US4] Integration test: `activeOrderCount` refleja solo órdenes `pendiente_de_revision` asignadas (no `sin_asignar`/terminales) en `backend/tests/integration/test_technicians_active_order_count.ts`
- [X] T027 [P] [US4] Frontend test: `DispatcherTechnicians.tsx` renderiza listado con estado y conteo, estado vacío sin técnicos en `frontend/tests/DispatcherTechnicians.test.tsx`

### Implementation for User Story 4

- [X] T028 [US4] Crear página `frontend/src/pages/DispatcherTechnicians.tsx`: tabla de técnicos (`listTechnicians`), columna estado activo/inactivo, columna `activeOrderCount`, controles de página, estado vacío (FR-011, FR-012, FR-013, FR-014) (depende de T003, T005, T007)

**Checkpoint**: Las 4 user stories funcionan de forma independiente y en conjunto

---

## Phase 7: Polish & Cross-Cutting Concerns (revisión 1)

**Purpose**: Trazabilidad y validación final de US1-US4

- [X] T029 [P] Añadir filas `FR-001..FR-014 → AC-ID → test` de este feature a `/docs/traceability.md`
- [X] T030 Ejecutar `quickstart.md` (8 escenarios) end-to-end contra el entorno dev — validado vía suites automatizadas (35 suites/92 tests backend, 8 suites/19 tests frontend, todas en verde); no se ejecutó contra un servidor dev con Postgres real (no disponible en este entorno, mismo estado que `001`/`002`)
- [X] T031 [P] Ampliar `backend/prisma/seed.ts` con ≥55 órdenes y ≥3 técnicos (uno inactivo) para poder validar manualmente la paginación (Escenario 1 de quickstart.md)

---

## Phase 8: Foundational 2 (revisión 2 — bloquea US5-US8)

**Purpose**: Migración de schema + servicios compartidos por US5-US8 — ninguna de esas historias puede completarse sin esto

**⚠️ CRITICAL**: No dar por completada ninguna de US5-US8 hasta que esta fase esté lista

- [X] T032 Añadir `cancelada` a enum `OrderStatus`, `cancelar` y `editar_cliente` a enum `AuditAction`, y `cancellationReason String?` (nullable) a `model Order` en `backend/prisma/schema.prisma` y `backend/prisma/schema.test.prisma` (data-model.md "Cambios de esquema"); ejecutar `npx prisma generate` (ambos schemas) y aplicar migración (`prisma migrate dev --name add_order_cancellation` en Postgres real cuando esté disponible; `prisma db push` sobre el datasource de test, mismo patrón que `002` T004)
- [X] T033 [P] Actualizar `backend/src/constants.ts`: `ORDER_STATUS.CANCELADA = 'cancelada'`, incluir en `TERMINAL_STATUSES`, `AUDIT_ACTIONS.CANCELAR = 'cancelar'`, `AUDIT_ACTIONS.EDITAR_CLIENTE = 'editar_cliente'` (depende de T032)
- [X] T034 [P] Crear `backend/src/services/clientService.ts`: `createClient({ nombre, email })`, `updateClient({ clientId, nombre, email })`, `setClientActive({ clientId, activo })`, `searchClients({ q, page })` (OR sobre nombre/email, id exacto si `q` es uuid; usa `contains` sin `mode` en test — SQLite no soporta `mode:'insensitive'` — y `mode:'insensitive'` en producción/Postgres, condicionado por `NODE_ENV`, ver research.md §6); capturar Prisma `P2002` → `HttpError(409, 'email ya registrado por otro usuario')` en create/update (research.md §8)
- [X] T035 [P] Extender `backend/src/services/userService.ts`: `createTechnician({ nombre, email })`, `updateTechnician({ technicianId, nombre, email })`, mismo manejo de `P2002` → 409 que T034
- [X] T036 Extender `backend/src/services/orderService.ts`: `editClient({ orderId, clientId, expectedVersion, dispatcherId })` (solo estado no terminal, valida `clientId` referencia a `User` con `role=cliente`, usa `optimisticUpdateOrder`, registra `AUDIT_ACTIONS.EDITAR_CLIENTE` vía `recordAuditEntry` — FR-023) y `cancelOrder({ orderId, reason, expectedVersion, dispatcherId })` (motivo obligatorio no vacío tras trim → 400; solo estado no terminal → 422; usa `optimisticUpdateOrder` → 409 en carrera; persiste `cancellationReason`, `resolvedByUserId`, `resolvedAt`, action `AUDIT_ACTIONS.CANCELAR`) (depende de T032, T033)
- [X] T037 [P] Crear `backend/src/api/clients.ts`: `GET /` (searchClients), `POST /` (createClient, 201), `PATCH /:clientId` (updateClient), `PATCH /:clientId/activo` (setClientActive) — todos `authn` + `rbac(ROLES.DISPATCHER)`; montar en `backend/src/api/app.ts` (`app.use('/api/v1/clients', clientsRouter)`) (depende de T034)
- [X] T038 Extender `backend/src/api/orders.ts`: `PATCH /:orderId` (editClient — 400/404/409/422 según research.md/data-model.md) y `POST /:orderId/cancel` (cancelOrder) (depende de T036)
- [X] T039 [P] Extender `backend/src/api/technicians.ts`: `POST /` (createTechnician, 201), `PATCH /:technicianId` (updateTechnician) (depende de T035)
- [X] T040 [P] Extender `frontend/src/services/api.ts`: `searchClients({ q, page })`, `createClient({ nombre, email })`, `updateClient(clientId, { nombre, email })`, `setClientActive(clientId, activo)`, `createTechnician({ nombre, email })`, `updateTechnician(technicianId, { nombre, email })`, `editOrderClient(orderId, { clientId, expectedVersion })`, `cancelOrder(orderId, { reason, expectedVersion })`

**Checkpoint**: Backend expone búsqueda/CRUD de clientes, CRUD ampliado de técnicos, y edición/cancelación de órdenes — US5-US8 pueden empezar

---

## Phase 9: User Story 5 - Dispatcher busca cliente existente por cualquier campo al crear una orden (Priority: P1)

**Goal**: Al crear una orden, el dispatcher busca clientes existentes por nombre/email/id (texto libre, debounced) en vez de tipear un `clientId` a ciegas; sin coincidencias, se ofrece crear un cliente nuevo.

**Independent Test**: Con clientes de prueba, tipear fragmentos de nombre/email/id en el buscador de la vista "Crear orden" y verificar que aparecen las coincidencias correctas; seleccionar uno crea la orden con ese `clientId`.

### Tests for User Story 5 ⚠️

- [X] T041 [P] [US5] Contract test `GET /clients?q=` (200 `PaginatedClients` filtrado por nombre/email/id, 401/403) en `backend/tests/contract/test_clients_search.ts`
- [X] T042 [P] [US5] Integration test: búsqueda combina nombre+email+id (cada uno por separado encuentra el cliente correcto), sin `q` devuelve listado completo paginado en `backend/tests/integration/test_clients_search.ts`
- [X] T043 [P] [US5] Frontend test: `ClientSearchSelect.tsx` debounce, muestra resultados, `onSelect` con el cliente elegido, mensaje/acción cuando no hay coincidencias en `frontend/tests/ClientSearchSelect.test.tsx`

### Implementation for User Story 5

- [X] T044 [P] [US5] Crear `frontend/src/components/ClientSearchSelect.tsx`: input de texto con debounce 300ms → `searchClients({ q })`, lista de resultados clicables, callback `onSelect(clientId)`, mensaje + acción "crear cliente" cuando no hay coincidencias (depende de T040)
- [X] T045 [US5] Integrar `ClientSearchSelect` en el formulario "Crear orden" de `frontend/src/pages/DispatcherOrders.tsx`, reemplazando el input de texto libre `clientId` (FR-022 — no se permite crear la orden sin seleccionar un resultado de búsqueda) (depende de T011, T044)

**Checkpoint**: US5 funcional — crear orden ya no requiere conocer el uuid del cliente de memoria

---

## Phase 10: User Story 6 - Dispatcher gestiona clientes (CRUD) (Priority: P2)

**Goal**: Vista dedicada `/dispatcher/clients` para crear, editar y dar de baja (lógica) clientes.

**Independent Test**: Crear un cliente, verificar que aparece en el buscador de US5; editarlo y verificar el cambio; darlo de baja y verificar que desaparece del buscador pero sus órdenes históricas siguen intactas.

### Tests for User Story 6 ⚠️

- [X] T046 [P] [US6] Contract test `POST/PATCH /clients`, `PATCH /clients/:id/activo` (201/200, 409 email duplicado, 401/403/404) en `backend/tests/contract/test_clients_crud.ts`
- [X] T047 [P] [US6] Integration test: baja de cliente no altera sus órdenes existentes (a diferencia de baja de técnico), email duplicado entre cliente y técnico también rechazado (409, unicidad es global) en `backend/tests/integration/test_clients_crud.ts`
- [X] T048 [P] [US6] Frontend test: `DispatcherClients.tsx` crea/edita/da de baja, estado vacío, error 409 mostrado en `frontend/tests/DispatcherClients.test.tsx`

### Implementation for User Story 6

- [X] T049 [US6] Crear página `frontend/src/pages/DispatcherClients.tsx`: tabla de clientes (`searchClients` sin `q` para listado completo paginado), formulario crear, edición inline de nombre/email, botón activar/desactivar, estado vacío (depende de T040)
- [X] T050 [US6] Añadir enlace "Clientes" en `frontend/src/components/DispatcherSidebar.tsx` y ruta `/dispatcher/clients` en `frontend/src/App.tsx` (depende de T024, T049)

**Checkpoint**: US5 y US6 funcionan juntas — crear cliente en US6 lo hace inmediatamente buscable en US5

---

## Phase 11: User Story 7 - Dispatcher gestiona técnicos (CRUD ampliado) (Priority: P2)

**Goal**: Además de activar/desactivar (ya existente), crear y editar técnicos desde `/dispatcher/technicians`.

**Independent Test**: Crear un técnico, verificar que aparece activo en el listado (US4) y en el desplegable de asignación (US2); editar su nombre y verificar el cambio reflejado en ambos lugares.

### Tests for User Story 7 ⚠️

- [X] T051 [P] [US7] Contract test `POST/PATCH /technicians` (201/200, 409 email duplicado, 401/403/404) en `backend/tests/contract/test_technicians_create_update.ts`
- [X] T052 [P] [US7] Integration test: técnico creado aparece en `GET /technicians?activo=true` (desplegable de US2) en `backend/tests/integration/test_technicians_create_update.ts`
- [X] T053 [P] [US7] Frontend test: `DispatcherTechnicians.tsx` crea/edita técnico, error 409 mostrado en `frontend/tests/DispatcherTechnicians.test.tsx`

### Implementation for User Story 7

- [X] T054 [US7] Extender `frontend/src/pages/DispatcherTechnicians.tsx`: formulario crear técnico, edición inline de nombre/email (depende de T028, T040)

**Checkpoint**: US7 funcional — CRUD de técnicos completo (crear/editar/activar/desactivar)

---

## Phase 12: User Story 8 - Dispatcher edita y cancela órdenes (CRUD ampliado de órdenes) (Priority: P2)

**Goal**: Corregir el cliente de una orden creada por error, y cancelar una orden no terminal indicando un motivo.

**Independent Test**: Editar el cliente de una orden no terminal y verificar el cambio; cancelar otra orden no terminal con motivo y verificar transición a `cancelada` (terminal) auditada; verificar rechazo uniforme sobre cualquier estado terminal.

### Tests for User Story 8 ⚠️

- [X] T055 [P] [US8] Contract test `PATCH /orders/:id` (editar cliente — 200/404/409/422) en `backend/tests/contract/test_orders_edit_client.ts`
- [X] T056 [P] [US8] Contract test `POST /orders/:id/cancel` (200/400 sin motivo/409/422 estado terminal) en `backend/tests/contract/test_orders_cancel.ts`
- [X] T057 [P] [US8] Integration test: cancelar desde `sin_asignar` Y desde `pendiente_de_revision` (a diferencia de aprobar/rechazar, que solo aplican desde `pendiente_de_revision`); orden `cancelada` rechaza asignar/editar/cancelar de nuevo (mismo trato que `aprobada`/`rechazada`); carrera de cancelación concurrente → 409 (mismo `optimisticUpdateOrder` que assign) en `backend/tests/integration/test_orders_edit_cancel.ts`
- [X] T058 [P] [US8] Frontend test: `DispatcherOrders.tsx` permite editar cliente (reutiliza `ClientSearchSelect`) y cancelar (exige motivo antes de confirmar) en `frontend/tests/DispatcherOrders.test.tsx`

### Implementation for User Story 8

- [X] T059 [US8] Extender `frontend/src/pages/DispatcherOrders.tsx`: acción "Editar cliente" por fila (reutiliza `ClientSearchSelect` de US5, solo visible en estado no terminal) y acción "Cancelar" (input de motivo obligatorio + confirmación, solo visible en estado no terminal) (depende de T045)

**Checkpoint**: Las 8 user stories funcionan de forma independiente y en conjunto

---

## Phase 13: Polish & Cross-Cutting Concerns (revisión 2)

**Purpose**: Trazabilidad y validación final de US5-US8

- [X] T060 [P] Añadir filas `FR-015..FR-026 → AC-ID → test` de este feature a `/docs/traceability.md`
- [X] T061 Ejecutar `quickstart.md` escenarios 9-12 end-to-end contra el entorno dev — validado vía suites automatizadas (44 suites/132 tests backend, 10 suites/30 tests frontend, todas en verde, 3 corridas consecutivas sin flakes); no se ejecutó contra un servidor dev con Postgres real (no disponible en este entorno, mismo estado que T030/`001`/`002`)
- [X] T062 [P] Ampliar `backend/prisma/seed.ts` con ≥3 clientes de prueba con nombres/emails claramente distintos (para validar búsqueda de US5 manualmente, Escenario 9 de quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEA US1-US4
- **User Stories rev.1 (Phase 3-6)**: Todas dependen de Foundational (Phase 2) — **ya completas**
- **Polish rev.1 (Phase 7)**: Depende de US1-US4 completas — **ya completo**
- **Foundational 2 (Phase 8)**: Depende de Phase 7 (schema migration nueva no debe pisar el estado ya estable de rev.1) — BLOQUEA US5-US8
- **User Stories rev.2 (Phase 9-12)**: Todas dependen de Foundational 2 (Phase 8)
  - US5 y US8 comparten `ClientSearchSelect` (T044) — US8 (T059) depende de que T044/T045 de US5 existan
  - US6 es independiente salvo por que su página se enruta desde el sidebar ya existente (T050 depende de T024, ya completo)
  - US7 extiende una página ya existente (`DispatcherTechnicians.tsx` de US4) — depende de T028 (ya completo) y de T035/T040 (Foundational 2)
- **Polish rev.2 (Phase 13)**: Depende de US5-US8 completas

### User Story Dependencies (revisión 2)

- **US5 (P1)**: Tras Foundational 2 — sin dependencia de otras historias nuevas
- **US6 (P2)**: Tras Foundational 2 — independiente de US5/US7/US8 en backend; su página es nueva
- **US7 (P2)**: Tras Foundational 2 — extiende `DispatcherTechnicians.tsx` (US4, ya existente)
- **US8 (P2)**: Tras Foundational 2 Y tras US5 (reutiliza `ClientSearchSelect` de T044 para editar cliente)

### Parallel Opportunities

**Revisión 1** (ya ejecutado): T002/T003, T004/T005, T008-T010, T013-T016, T017/T018, T021/T022, T026/T027.

**Revisión 2**:
- T033, T034, T035 (constants/clientService/userService, archivos distintos) en paralelo tras T032
- T037 y T039 (routers distintos) en paralelo tras T034/T035; T036/T038 son secuenciales entre sí (mismo archivo orderService.ts → orders.ts)
- T041, T042, T043 (tests US5, archivos distintos) en paralelo
- T046, T047, T048 (tests US6) en paralelo
- T051, T052, T053 (tests US7) en paralelo
- T055, T056, T057, T058 (tests US8, archivos distintos) en paralelo
- T060, T062 (polish, archivos distintos) en paralelo

---

## Parallel Example: User Story 1

```bash
# Lanzar todos los tests de US1 juntos:
Task: "Contract test GET /orders filtros en backend/tests/contract/test_orders_list_filters.ts"
Task: "Integration test paginación/filtro en backend/tests/integration/test_orders_list_pagination.ts"
Task: "Frontend test DispatcherOrders.tsx en frontend/tests/DispatcherOrders.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (bloquea todo)
3. Completar Phase 3: US1 (listado filtrado/paginado)
4. **STOP y VALIDAR**: probar US1 de forma independiente (Escenario 1/2/8 de quickstart.md)
5. Demo si está listo

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → validar → demo (MVP)
3. US2 → validar (integra sobre la página de US1) → demo
4. US4 → validar (independiente) → demo
5. US3 → validar (conecta el enrutamiento final de todas) → demo completo — **✅ completo (revisión 1)**

### Revisión 2 — MVP incremental (US5-US8, sobre la base ya completa de arriba)

1. Completar Phase 8: Foundational 2 (migración de schema — bloquea todo lo nuevo)
2. Completar Phase 9: US5 (búsqueda de clientes) — 🎯 MVP de esta revisión, es P1
3. **STOP y VALIDAR**: probar US5 de forma independiente (Escenario 9 de quickstart.md)
4. US6 (CRUD de clientes) → validar (Escenario 10) → demo
5. US7 (CRUD ampliado de técnicos) → validar (Escenario 11) → demo
6. US8 (editar/cancelar órdenes, depende de US5 para `ClientSearchSelect`) → validar (Escenario 12) → demo completo
7. Phase 13: Polish rev.2 (traceability, quickstart end-to-end, seed)

---

## Notes

- [P] tareas = archivos distintos, sin dependencias
- Etiqueta [Story] mapea la tarea a su user story para trazabilidad
- Verificar que los tests fallan antes de implementar
- Commit tras cada tarea o grupo lógico
- Detenerse en cada checkpoint para validar independientemente
- T006 es un cambio que rompe contrato para consumidores YA EXISTENTES de `001`/`002` (`OrdersList`, `ClientOrders`, `TechnicianExecutionForm`, `SupervisorReview`) — no omitir, o esos roles quedan rotos tras T002/T004 (ya resuelto, revisión 1)
- T032 es una migración de schema real (primera desde `001`) — correr contra Postgres antes de producción; en este entorno de desarrollo solo se valida vía `db push` sobre SQLite de test, mismo patrón que `002` T004
- El email de `User` es único a nivel de TODA la tabla (no por rol) — T034/T035 comparten el mismo manejo de conflicto `P2002`; un cliente y un técnico no pueden compartir email entre sí tampoco
