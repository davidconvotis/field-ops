# Research: Panel de Dispatcher — Órdenes y Técnicos

Sin `NEEDS CLARIFICATION` pendientes en Technical Context (todos resueltos en `/speckit-clarify`, sesión 2026-07-13). Este documento registra las decisiones de diseño técnico derivadas de esas respuestas.

## 1. Paginación de listados

**Decision**: Paginación por página con parámetros `page` (default 1) y `pageSize` (fijo, 50 registros) en `GET /orders` y `GET /technicians`. Respuesta como envelope `{ items, page, pageSize, total }` en vez de array plano.

**Rationale**: La clarificación (Q4) exige "paginación con controles de página, tamaño fijo". Un envelope con `total` permite al frontend renderizar controles de página (anterior/siguiente, número de página) sin una llamada adicional de conteo. 50 registros por página cumple SC-002 (<2s con hasta 500 registros → máx. 10 páginas) sin sobrecargar la UI.

**Alternatives considered**:
- Array plano sin envelope: rechazado — el frontend no podría saber si hay más páginas sin un `total` o un flag `hasMore`.
- Scroll infinito / cursor-based: rechazado explícitamente en clarificación (Q4 → Option A, no C).
- Carga completa sin paginar: rechazado explícitamente (Q4 → no Option B).

## 2. Filtro de órdenes por estado y técnico

**Decision**: Query params opcionales `status` (uno de los 4 valores del enum `OrderStatus`) y `technicianId` (uuid) en `GET /orders`, combinables (AND). Sin filtro aplicado, listado completo (respetando el scope por rol ya existente en `001` — dispatcher ve todas).

**Rationale**: Clarificación Q1 exige filtro combinable por estado y técnico. Reutilizar query params sobre el endpoint ya existente (`GET /orders`) evita duplicar lógica de scope-por-rol; solo se añade un `WHERE` adicional sobre el query ya construido.

**Alternatives considered**:
- Endpoint de búsqueda separado (`POST /orders/search`): rechazado — innecesario, el filtro es simple (igualdad, no full-text) y los query params GET son suficientes y cacheables.

## 3. Nombre de cliente/técnico en el listado

**Decision**: `GET /orders` incluye `clientNombre` y `technicianNombre` (derivados vía `include` de Prisma sobre las relaciones `client`/`technician` ya definidas en el schema) en la respuesta de listado, sin exponer más campos de `User` que el nombre.

**Rationale**: FR-001 exige mostrar "cliente" y "técnico asignado" de forma legible en el listado del dispatcher; los IDs UUID no son legibles para un humano. El schema ya tiene las relaciones (`Order.client`, `Order.technician`), por lo que no requiere cambio de schema, solo un `include` adicional en la query.

**Alternatives considered**:
- Mostrar solo IDs y resolver nombres en el frontend con llamadas adicionales por cada orden (N+1): rechazado por rendimiento (violaría SC-002).

## 4. Conteo de órdenes activas por técnico

**Decision**: `GET /technicians` calcula `activeOrderCount` con un `count` agrupado (`groupBy` de Prisma sobre `Order.technicianId` filtrando `status = pendiente_de_revision`) en una sola query adicional, no N+1 por técnico.

**Rationale**: FR-012 exige mostrar la cantidad de órdenes no terminales asignadas por técnico. `sin_asignar` no aplica (sin técnico); el único estado no terminal con técnico asignado es `pendiente_de_revision` (ver Assumptions de spec.md). Una query de agregación evita N+1 y mantiene SC-002.

**Alternatives considered**:
- Calcular el conteo en el frontend iterando el listado de órdenes ya cargado: rechazado — requeriría cargar todas las órdenes (sin paginar) para tener el conteo completo, contradiciendo la decisión de paginación (§1).

## 5a. Reutilización de `GET /technicians` para el desplegable de asignación (US2)

**Decision**: El desplegable de asignación (US2) reutiliza `GET /technicians?activo=true` (primera página, 50) en vez de crear un endpoint dedicado.

**Rationale**: Evita duplicar el mismo listado en dos endpoints. El límite de 50 activos es una limitación conocida para el MVP (orgs con >50 técnicos activos simultáneos no están en el scope actual; no se pidió clarificación explícita sobre esto por ser de bajo impacto/probabilidad).

**Alternatives considered**: Endpoint separado sin paginar (`GET /technicians/active`): rechazado por duplicar lógica de filtro ya existente.

## 5. Modal de confirmación de reasignación

**Decision**: El modal de confirmación (FR-005a) es un componente puramente de frontend (`ReassignConfirmModal.jsx`); no requiere cambio de contrato backend — la llamada a `PATCH /orders/{orderId}/assign` (ya existente, con `expectedVersion` para lock optimista) se dispara solo tras confirmar en el modal.

**Rationale**: El backend ya implementa el chequeo atómico (`expectedVersion`, `001-work-order-management` FR-05b); el modal es una fricción de UX del lado cliente antes de invocar la API ya existente, sin lógica de negocio nueva.

**Alternatives considered**: N/A — no hay alternativa de diseño backend relevante, es puramente un gate de UI.
