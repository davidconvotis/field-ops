# Quickstart: Panel de Dispatcher — Órdenes y Técnicos

Prerequisito: entorno de `001-work-order-management` y `002-login-rbac` ya instalado
y corriendo (ver sus respectivos `quickstart.md`/`README.md` — un único comando de
instalación y uno de test, por constitution).

## Setup

```bash
# backend
cd backend && npm install && npm test

# frontend
cd frontend && npm install && npm test
```

Arrancar ambos servicios según el README raíz (dev servers backend + frontend).

## Escenario 1 — Ver listado de órdenes filtrado y paginado (US1, FR-001, FR-002a, FR-014)

1. Login como usuario con rol `dispatcher` (ver `002-login-rbac/quickstart.md`).
2. Navegar a `/dispatcher/orders`.
3. Verificar que se ve el listado completo (id, estado, cliente, técnico asignado, fecha).
4. Aplicar filtro por `status=pendiente_de_revision`: verificar que solo aparecen órdenes en ese estado.
5. Aplicar además filtro por técnico: verificar que ambos filtros se combinan (AND).
6. Limpiar filtros: verificar que vuelve el listado completo.
7. Con >50 órdenes de prueba (seed), verificar controles de página y que cada página trae 50 registros (`pageSize` fijo).

**Validación de contrato**: `GET /api/v1/orders?status=pendiente_de_revision&technicianId=<uuid>&page=1` responde `200` con `PaginatedOrders` (ver `contracts/openapi.yaml` → `/orders`).

## Escenario 2 — Refrescar listado manualmente (FR-002)

1. Con el listado de órdenes abierto, cambiar el estado de una orden desde otro rol (ej. técnico envía ejecución).
2. Verificar que el listado del dispatcher NO cambia solo, hasta pulsar el botón "Refrescar".
3. Pulsar "Refrescar": verificar que el estado actualizado aparece.

## Escenario 3 — Asignar orden (sin técnico previo) vía desplegable (US2, FR-003..FR-005)

1. Sobre una orden en `sin_asignar`, abrir el desplegable de asignación.
2. Verificar que solo aparecen técnicos con `activo=true`.
3. Seleccionar un técnico y confirmar: verificar que NO aparece modal adicional (FR-005a solo aplica a reasignación) y que la orden queda asignada.

## Escenario 4 — Reasignar orden ya asignada (FR-005a)

1. Sobre una orden ya asignada a un técnico, abrir el desplegable y seleccionar un técnico distinto.
2. Verificar que aparece el modal de confirmación mostrando técnico anterior → nuevo.
3. Cancelar: verificar que la orden conserva el técnico anterior (sin llamada a `PATCH /orders/{id}/assign`).
4. Repetir y confirmar: verificar que la orden queda con el nuevo técnico.

## Escenario 5 — Sin técnicos activos disponibles (FR-007)

1. Desactivar (vía `PATCH /technicians/{id}/activo`) a todos los técnicos de prueba.
2. Abrir el desplegable de asignación sobre una orden asignable: verificar mensaje de "no hay técnicos disponibles" y que no se puede confirmar.

## Escenario 6 — Menú lateral (US3, FR-008, FR-009)

1. Login como dispatcher: verificar sidebar visible con "Órdenes" y "Técnicos".
2. Click en "Técnicos": verificar navegación a `/dispatcher/technicians` y resaltado de esa opción.
3. Click en "Órdenes": verificar navegación a `/dispatcher/orders` y resaltado de esa opción.
4. Login con otro rol (ej. `tecnico`) e intentar acceder a `/dispatcher/orders` directamente por URL: verificar redirección/rechazo (RBAC ya existente).

## Escenario 7 — Ver listado de técnicos (US4, FR-011, FR-012)

1. Navegar a `/dispatcher/technicians`.
2. Verificar que aparecen técnicos activos e inactivos con su estado correcto.
3. Sobre un técnico con órdenes en `pendiente_de_revision` asignadas, verificar que `activeOrderCount` coincide con el número real.

**Validación de contrato**: `GET /api/v1/technicians?page=1` responde `200` con `PaginatedTechnicians` (ver `contracts/openapi.yaml` → `/technicians`).

## Escenario 8 — Estados vacíos (FR-013)

1. En un entorno sin órdenes: verificar mensaje de estado vacío en `/dispatcher/orders`.
2. En un entorno sin técnicos: verificar mensaje de estado vacío en `/dispatcher/technicians`.

## Escenario 9 — Buscar cliente por cualquier campo al crear orden (US5, FR-021, FR-022)

1. Con clientes de prueba creados (nombres/emails distintos), abrir "Crear orden" en `/dispatcher/orders`.
2. Tipear un fragmento del nombre de un cliente: verificar que aparece en los resultados (debounce ~300ms, research.md §6).
3. Borrar y tipear un fragmento del email de otro cliente: verificar que también aparece.
4. Tipear el `id` completo (uuid) de un tercer cliente: verificar que aparece por igualdad exacta.
5. Seleccionar un cliente de los resultados y crear la orden: verificar que la orden queda asociada al `clientId` correcto.
6. Tipear un texto sin coincidencias: verificar que se ofrece la opción de crear un cliente nuevo (US6) en vez de permitir continuar con un cliente inexistente (FR-022).

**Validación de contrato**: `GET /api/v1/clients?q=<texto>` responde `200` con `PaginatedClients` (ver `contracts/openapi.yaml` → `/clients`).

## Escenario 10 — CRUD de clientes (US6, FR-015..FR-018)

1. En `/dispatcher/clients`, crear un cliente con nombre/email válidos: verificar que aparece en el listado y queda disponible en la búsqueda del Escenario 9.
2. Editar su nombre: verificar que el cambio se refleja en el listado y en órdenes ya creadas con ese cliente.
3. Intentar crear/editar un cliente con un email ya usado por otro usuario (cualquier rol): verificar rechazo `409`.
4. Dar de baja el cliente (`activo=false`): verificar que desaparece de la búsqueda del Escenario 9, pero sus órdenes históricas siguen visibles sin cambios en `/dispatcher/orders`.

**Validación de contrato**: `POST /api/v1/clients` → `201` `ClientSummary`; `PATCH /api/v1/clients/{id}` → `200`; `PATCH /api/v1/clients/{id}/activo` → `200` (ver `contracts/openapi.yaml`).

## Escenario 11 — CRUD ampliado de técnicos (US7, FR-019, FR-020)

1. En `/dispatcher/technicians`, crear un técnico con nombre/email válidos: verificar que aparece activo por defecto, tanto en el listado como en el desplegable de asignación (US2).
2. Editar su nombre: verificar el cambio reflejado en ambos lugares.
3. Intentar crear/editar con email duplicado: verificar rechazo `409`.

**Validación de contrato**: `POST /api/v1/technicians` → `201` `TechnicianSummary`; `PATCH /api/v1/technicians/{id}` → `200` (ver `contracts/openapi.yaml`).

## Escenario 12 — Editar cliente de una orden y cancelar orden (US8, FR-023..FR-026)

1. Crear una orden asociada a un cliente por error; en `/dispatcher/orders`, editar el cliente de esa orden (no terminal) al correcto: verificar que persiste y queda auditado.
2. Intentar editar el cliente de una orden ya `aprobada`/`rechazada`/`cancelada`: verificar rechazo `422`.
3. Sobre una orden no terminal, cancelarla sin indicar motivo: verificar rechazo `400`.
4. Cancelarla indicando un motivo no vacío: verificar transición a `cancelada` (terminal), con motivo/dispatcher/timestamp auditados, y que aparece en el listado con ese estado.
5. Sobre la orden ya `cancelada`, intentar asignarla, editarla o cancelarla de nuevo: verificar rechazo uniforme (422/409 según corresponda), igual que cualquier otro estado terminal.

**Validación de contrato**: `PATCH /api/v1/orders/{id}` → `200`/`422`; `POST /api/v1/orders/{id}/cancel` → `200`/`400`/`422` (ver `contracts/openapi.yaml`).
