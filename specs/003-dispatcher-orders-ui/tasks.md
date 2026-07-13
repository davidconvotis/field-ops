# Tasks: Panel de Dispatcher — Órdenes y Técnicos

**Input**: Design documents from `/specs/003-dispatcher-orders-ui/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos (no opcionales) — constitution Principio II/III exige test de contrato en verde antes de considerar un endpoint "listo", y traceability FR→AC→test.

**Organization**: Tareas agrupadas por user story (spec.md): US1 (P1, ver listado de órdenes filtrado/paginado), US2 (P1, asignar vía desplegable con modal de reasignación), US3 (P2, menú lateral), US4 (P2, listado de técnicos).

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

- [X] T002 Extender `orderService.listForRole({ role, userId, status, technicianId, page, pageSize })` en `backend/src/services/orderService.js` para: aplicar scope por rol (ya existente) PRIMERO, luego filtro opcional `status`/`technicianId` (AND), `include: { client: true, technician: true }` para mapear `clientNombre`/`technicianNombre`, y devolver `{ items, page, pageSize: 50, total }` (paginación fija, `pageSize` del request se ignora) — usado por US1
- [X] T003 [P] Añadir `userService.listTechnicians({ activo, page, pageSize })` en `backend/src/services/userService.js`: filtra por rol `tecnico` y `activo` opcional, agrega `activeOrderCount` vía `groupBy` sobre `Order.technicianId` con `status = pendiente_de_revision` (research.md §4), devuelve `{ items, page, pageSize: 50, total }` — usado por US2 (con `activo=true`) y US4
- [X] T004 Actualizar `router.get('/', ...)` en `backend/src/api/orders.js` para leer `req.query.status`, `req.query.technicianId`, `req.query.page` y pasarlos a `orderService.listForRole`; responder `400` si `status` no es uno de los 4 valores del enum o `technicianId` no es un uuid válido
- [X] T005 [P] Añadir `router.get('/', authn, rbac(ROLES.DISPATCHER), ...)` en `backend/src/api/technicians.js` que llama `userService.listTechnicians({ activo: req.query.activo, page: req.query.page })`
- [X] T006 Actualizar los 4 consumidores existentes del array plano de `GET /orders` para leer `response.items` en vez de `response` directamente: `frontend/src/components/OrdersList.jsx`, `frontend/src/pages/ClientOrders.jsx`, `frontend/src/pages/TechnicianExecutionForm.jsx`, `frontend/src/pages/SupervisorReview.jsx` (contrato ahora devuelve `PaginatedOrders`, no array — breaking change documentado en plan.md)
- [X] T007 [P] Extender `frontend/src/services/api.js`: `listOrders({ status, technicianId, page } = {})` (query string opcional) y nuevo `listTechnicians({ activo, page } = {})`

**Checkpoint**: Backend sirve listados filtrados/paginados con nombres legibles; consumidores existentes migrados al nuevo envelope — user stories pueden empezar

---

## Phase 3: User Story 1 - Dispatcher visualiza listado de órdenes (Priority: P1) 🎯 MVP

**Goal**: Dispatcher ve el listado completo de órdenes (id, estado, cliente, técnico, fecha), filtrable por estado/técnico, paginado, con refresco manual.

**Independent Test**: Con órdenes en distintos estados creadas, `GET /orders` (rol dispatcher) devuelve todas paginadas; aplicar `status=`/`technicianId=` reduce el conjunto; sin órdenes, la UI muestra estado vacío.

### Tests for User Story 1 ⚠️

> **Escribir estos tests PRIMERO, verificar que fallan antes de implementar**

- [X] T008 [P] [US1] Contract test `GET /orders?status=&technicianId=&page=` (200 `PaginatedOrders`, 400 status/technicianId inválido, 401 sin token) en `backend/tests/contract/test_orders_list_filters.js`
- [X] T009 [P] [US1] Integration test: dispatcher filtra por estado, por técnico, y combinado (AND); dispatcher ve `total`/`page`/`pageSize` correctos con >50 órdenes seed en `backend/tests/integration/test_orders_list_pagination.js`
- [X] T010 [P] [US1] Frontend test: `DispatcherOrders.jsx` renderiza listado con id/estado/cliente/técnico/fecha, estado vacío sin órdenes, y aplica filtros en `frontend/tests/DispatcherOrders.test.jsx`

### Implementation for User Story 1

- [X] T011 [US1] Crear página `frontend/src/pages/DispatcherOrders.jsx`: tabla de órdenes (`listOrders`), selects de filtro `status`/`technicianId`, controles de página (anterior/siguiente + número), botón "Refrescar" explícito (FR-002, sin refetch automático), estado vacío (FR-013) (depende de T002, T004, T007)
- [X] T012 [US1] Añadir manejo de error/loading (spinner, mensaje de error `ApiError`) en `frontend/src/pages/DispatcherOrders.jsx`

**Checkpoint**: US1 funcional de extremo a extremo — dispatcher ve, filtra, pagina y refresca el listado de órdenes

---

## Phase 4: User Story 2 - Dispatcher asigna orden a técnico desde desplegable (Priority: P1)

**Goal**: Dispatcher asigna orden `sin_asignar` directamente vía desplegable de técnicos activos; reasignar una orden ya asignada requiere confirmar en un modal.

**Independent Test**: Abrir desplegable sobre orden asignable muestra solo técnicos activos; seleccionar+confirmar asigna sin modal si la orden no tenía técnico, o con modal si ya lo tenía; sin técnicos activos, muestra mensaje y bloquea confirmación.

### Tests for User Story 2 ⚠️

- [X] T013 [P] [US2] Contract test `GET /technicians?activo=true` (200 `PaginatedTechnicians`, solo `activo=true`) en `backend/tests/contract/test_technicians_list.js`
- [X] T014 [P] [US2] Integration test: desplegable excluye técnicos inactivos; asignación sobre orden en estado terminal rechazada (422); técnico desactivado entre carga y confirmación rechazado (409/422, edge case spec.md) en `backend/tests/integration/test_orders_assign_dropdown.js`
- [X] T015 [P] [US2] Frontend test: `TechnicianAssignSelect.jsx` solo lista técnicos activos y muestra mensaje si no hay ninguno en `frontend/tests/TechnicianAssignSelect.test.jsx`
- [X] T016 [P] [US2] Frontend test: `ReassignConfirmModal.jsx` se muestra solo cuando la orden ya tenía técnico, confirma/cancela correctamente en `frontend/tests/ReassignConfirmModal.test.jsx`

### Implementation for User Story 2

- [X] T017 [P] [US2] Crear `frontend/src/components/TechnicianAssignSelect.jsx`: `<select>` poblado con `listTechnicians({ activo: true })`, mensaje si vacío (FR-007) (depende de T005, T007)
- [X] T018 [P] [US2] Crear `frontend/src/components/ReassignConfirmModal.jsx`: modal con técnico anterior → nuevo, botones confirmar/cancelar (FR-005a)
- [X] T019 [US2] Integrar `TechnicianAssignSelect` + `ReassignConfirmModal` en `frontend/src/pages/DispatcherOrders.jsx`: si `order.technicianId` es `null`, asignar directo al seleccionar (sin modal); si no es `null`, mostrar modal antes de llamar `assignOrder` (depende de T011, T017, T018)
- [X] T020 [US2] Deshabilitar/ocultar el control de asignación cuando la orden esté en estado terminal (`aprobada`/`rechazada`) en `frontend/src/pages/DispatcherOrders.jsx` (FR-006)

**Checkpoint**: US1 y US2 funcionan juntas — listado + asignación/reasignación con confirmación

---

## Phase 5: User Story 3 - Menú lateral de navegación en panel de dispatcher (Priority: P2)

**Goal**: Dispatcher navega entre "Órdenes" y "Técnicos" vía sidebar persistente que resalta la sección activa.

**Independent Test**: Login dispatcher muestra sidebar en toda ruta `/dispatcher/*`; click en cada opción navega y resalta correctamente; otro rol no accede a esas rutas.

### Tests for User Story 3 ⚠️

- [X] T021 [P] [US3] Frontend test: `DispatcherSidebar.jsx` resalta la ruta activa y navega al hacer click en `frontend/tests/DispatcherSidebar.test.jsx`
- [X] T022 [P] [US3] Frontend test: rutas `/dispatcher/orders` y `/dispatcher/technicians` rechazan sesión con rol distinto de dispatcher (reutiliza `RequireRole`) en `frontend/tests/App.test.jsx`

### Implementation for User Story 3

- [X] T023 [P] [US3] Crear `frontend/src/components/DispatcherSidebar.jsx`: enlaces "Órdenes" (`/dispatcher/orders`) y "Técnicos" (`/dispatcher/technicians`), resalta activo vía `useLocation` (FR-008, FR-009)
- [X] T024 [US3] Crear `frontend/src/pages/DispatcherLayout.jsx`: `DispatcherSidebar` + `<Outlet/>` (depende de T023)
- [X] T025 [US3] Actualizar `frontend/src/App.jsx`: reemplazar ruta única `/dispatcher` por rutas anidadas bajo `RequireRole role="dispatcher"` + `DispatcherLayout` → `/dispatcher/orders` (`DispatcherOrders`), `/dispatcher/technicians` (`DispatcherTechnicians`), redirect `/dispatcher` → `/dispatcher/orders` (depende de T011, T024, y de T028 de US4)

**Checkpoint**: US1, US2, US3 integradas — navegación completa del panel de dispatcher

---

## Phase 6: User Story 4 - Dispatcher visualiza listado de técnicos (Priority: P2)

**Goal**: Dispatcher ve listado paginado de técnicos con su estado activo/inactivo y cantidad de órdenes activas asignadas.

**Independent Test**: Con técnicos activos/inactivos y órdenes `pendiente_de_revision` asignadas, `GET /technicians` devuelve el listado paginado con `activeOrderCount` correcto por técnico.

### Tests for User Story 4 ⚠️

- [X] T026 [P] [US4] Integration test: `activeOrderCount` refleja solo órdenes `pendiente_de_revision` asignadas (no `sin_asignar`/terminales) en `backend/tests/integration/test_technicians_active_order_count.js`
- [X] T027 [P] [US4] Frontend test: `DispatcherTechnicians.jsx` renderiza listado con estado y conteo, estado vacío sin técnicos en `frontend/tests/DispatcherTechnicians.test.jsx`

### Implementation for User Story 4

- [X] T028 [US4] Crear página `frontend/src/pages/DispatcherTechnicians.jsx`: tabla de técnicos (`listTechnicians`), columna estado activo/inactivo, columna `activeOrderCount`, controles de página, estado vacío (FR-011, FR-012, FR-013, FR-014) (depende de T003, T005, T007)

**Checkpoint**: Las 4 user stories funcionan de forma independiente y en conjunto

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Trazabilidad y validación final

- [X] T029 [P] Añadir filas `FR-001..FR-014 → AC-ID → test` de este feature a `/docs/traceability.md`
- [X] T030 Ejecutar `quickstart.md` (8 escenarios) end-to-end contra el entorno dev — validado vía suites automatizadas (35 suites/92 tests backend, 8 suites/19 tests frontend, todas en verde); no se ejecutó contra un servidor dev con Postgres real (no disponible en este entorno, mismo estado que `001`/`002`)
- [X] T031 [P] Ampliar `backend/prisma/seed.js` con ≥55 órdenes y ≥3 técnicos (uno inactivo) para poder validar manualmente la paginación (Escenario 1 de quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEA todas las user stories
- **User Stories (Phase 3-6)**: Todas dependen de Foundational
  - US1 y US2 son P1 — implementar primero (US2 depende de que `DispatcherOrders.jsx` de US1 exista para integrar el desplegable, T019)
  - US3 depende de que existan las páginas de US1 y US4 para enrutarlas (T025 referencia `DispatcherOrders` y `DispatcherTechnicians`)
  - US4 es independiente de US1/US2/US3 salvo por el enrutamiento final (T025)
- **Polish (Phase 7)**: Depende de todas las user stories deseadas completas

### User Story Dependencies

- **US1 (P1)**: Tras Foundational — sin dependencia de otras historias para su lógica de listado
- **US2 (P1)**: Tras Foundational — su UI se integra dentro de la página de US1 (T019), por lo que en la práctica se completa después de T011
- **US3 (P2)**: Tras Foundational — su enrutamiento final (T025) requiere que las páginas de US1/US4 existan, pero el componente `DispatcherSidebar` (T023) es independiente
- **US4 (P2)**: Tras Foundational — independiente de US1/US2/US3

### Parallel Opportunities

- T002 y T003 (servicios backend distintos) en paralelo
- T004 y T005 (routers distintos) en paralelo tras T002/T003
- T008, T009, T010 (tests US1, archivos distintos) en paralelo
- T013, T014, T015, T016 (tests US2, archivos distintos) en paralelo
- T017 y T018 (componentes distintos) en paralelo
- T021, T022 (tests US3) en paralelo; T026, T027-test (tests US4) en paralelo

---

## Parallel Example: User Story 1

```bash
# Lanzar todos los tests de US1 juntos:
Task: "Contract test GET /orders filtros en backend/tests/contract/test_orders_list_filters.js"
Task: "Integration test paginación/filtro en backend/tests/integration/test_orders_list_pagination.js"
Task: "Frontend test DispatcherOrders.jsx en frontend/tests/DispatcherOrders.test.jsx"
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
5. US3 → validar (conecta el enrutamiento final de todas) → demo completo

---

## Notes

- [P] tareas = archivos distintos, sin dependencias
- Etiqueta [Story] mapea la tarea a su user story para trazabilidad
- Verificar que los tests fallan antes de implementar
- Commit tras cada tarea o grupo lógico
- Detenerse en cada checkpoint para validar independientemente
- T006 es un cambio que rompe contrato para consumidores YA EXISTENTES de `001`/`002` (`OrdersList`, `ClientOrders`, `TechnicianExecutionForm`, `SupervisorReview`) — no omitir, o esos roles quedan rotos tras T002/T004
