# Data Model: Panel de Dispatcher — Órdenes y Técnicos

**Revisión 2 (2026-07-13)**: esta feature deja de ser puramente de lectura. Requiere el primer cambio de esquema Prisma desde `001-work-order-management` (ver "Cambios de esquema" abajo), para soportar US5-US8 (búsqueda/CRUD de clientes, CRUD ampliado de técnicos, edición/cancelación de orden).

## Entidades existentes reutilizadas

- **Order** (`001-work-order-management`): `id`, `status`, `clientId`, `technicianId`, `version`, `createdAt`, `assignedAt`, `submittedAt`, `resolvedAt`, `rejectionReason`, y en esta revisión **+`cancellationReason`** (ver abajo).
- **User** (`001`/`002`): `id`, `role`, `activo`, `nombre`, `email` (`email` ya `@unique` a nivel de tabla, reutilizado para FR-018 — ver research.md §8). Rol `tecnico` = "Técnico"; rol `cliente` = "Cliente".

## Cambios de esquema (revisión 2 — requiere migración Prisma)

```prisma
enum OrderStatus {
  sin_asignar
  pendiente_de_revision
  aprobada
  rechazada
  cancelada          // NUEVO — FR-025/FR-026
}

enum AuditAction {
  crear
  asignar
  reasignar
  desactivar_tecnico_reasigna
  enviar_ejecucion
  aprobar
  rechazar
  cancelar           // NUEVO — auditoría de FR-025
  editar_cliente     // NUEVO — auditoría de FR-023 (edición de cliente de una orden)
  conflicto_concurrente
}

model Order {
  // ...campos existentes sin cambios...
  cancellationReason String?   // NUEVO, nullable — motivo de cancelación (FR-025)
  // resolvedByUserId/resolvedAt se REUTILIZAN (ya genéricos, no específicos de
  // rechazo) para registrar quién canceló y cuándo — sin nueva columna para eso.
}
```

Migración: `npx prisma migrate dev --name add_order_cancellation` (o `db push` en el datasource de test, mismo patrón que `002-login-rbac` T004 — Postgres real no disponible en este entorno de desarrollo, aplicar contra el entorno real antes de producción).

## DTOs / Read Models nuevos

### OrderSummary (respuesta de `GET /orders`)

Extiende `Order` (mismo objeto) agregando dos campos derivados, solo para lectura:

| Campo | Tipo | Origen |
|---|---|---|
| `clientNombre` | string | `Order.client.nombre` (join) |
| `technicianNombre` | string \| null | `Order.technician.nombre` (join), `null` si `technicianId` es `null` |

No se persiste — se calcula en cada request vía `include` de Prisma.

### TechnicianSummary (respuesta de `GET /technicians`)

| Campo | Tipo | Origen |
|---|---|---|
| `id` | uuid | `User.id` |
| `nombre` | string | `User.nombre` |
| `activo` | boolean | `User.activo` |
| `activeOrderCount` | integer | Derivado: count de `Order` con `technicianId = User.id` y `status = pendiente_de_revision` (ver research.md §4) |

No se persiste — se calcula en cada request vía agregación.

### PaginatedEnvelope<T> (envelope común de `GET /orders` y `GET /technicians`)

| Campo | Tipo | Descripción |
|---|---|---|
| `items` | `T[]` | Página actual de resultados (`OrderSummary[]` o `TechnicianSummary[]`) |
| `page` | integer | Página solicitada (default 1) |
| `pageSize` | integer | Tamaño fijo de página (50) |
| `total` | integer | Total de registros que cumplen el filtro (sin paginar) |

### ClientSummary (respuesta de `GET /clients`)

| Campo | Tipo | Origen |
|---|---|---|
| `id` | uuid | `User.id` (rol `cliente`) |
| `nombre` | string | `User.nombre` |
| `email` | string | `User.email` |
| `activo` | boolean | `User.activo` |

### PaginatedClients

Mismo shape que `PaginatedEnvelope<T>` (abajo) con `T = ClientSummary`.

## Reglas de validación / filtrado (lectura, US1/US4/US5)

- `GET /orders?status=X`: `X` MUST ser uno de `sin_asignar | pendiente_de_revision | aprobada | rechazada`; valor inválido → `400`.
- `GET /orders?technicianId=Y`: `Y` MUST ser un uuid válido; no se valida existencia (si no hay coincidencias, `items` vacío, no error).
- `GET /orders?page=N&pageSize=M`: `N ≥ 1`; `pageSize` es fijo (50) y no configurable por el cliente en esta versión (FR-014) — si el cliente envía `pageSize`, se ignora.
- El scope por rol de `001-work-order-management` (FR-017/FR-018 de `001`) se aplica ANTES del filtro de esta feature (un dispatcher ve todas; los filtros `status`/`technicianId` reducen ese conjunto, nunca lo amplían).
- `GET /clients?q=X`: `X` opcional; sin `q`, listado completo paginado. Con `q`, `OR` sobre `nombre`/`email` (`contains`, insensible a mayúsculas) + `id` (igualdad exacta si `q` tiene forma de uuid) — ver research.md §6.

## Reglas de validación / escritura (US5-US8, revisión 2)

- **Crear/editar cliente o técnico** (FR-015/FR-016/FR-019/FR-020): `nombre` no vacío (trim), `email` formato válido; conflicto de unicidad de `email` (Prisma `P2002`) → `409` (research.md §8), nunca `500`.
- **Baja de cliente/técnico** (FR-017, `activo=false`): SIEMPRE baja lógica, sin excepción, incluso sin historial de órdenes (clarify ronda 2) — nunca hay operación de borrado físico expuesta.
- **Editar cliente de una orden** (FR-023, `PATCH /orders/{orderId}`): solo si `order.status` es no terminal (`sin_asignar` o `pendiente_de_revision`); `clientId` MUST referenciar un `User` con `role=cliente` existente; usa `optimisticUpdateOrder` (mismo lock por `version` que `assignTechnician`) — `409` si la orden cambió de estado entre lectura e intento.
- **Cancelar orden** (FR-025, `POST /orders/{orderId}/cancel`): solo si `order.status` es no terminal; `reason` obligatorio no vacío (trim) → `400` si falta; usa `optimisticUpdateOrder` igual que arriba → `409` en carrera.
- **Rechazo uniforme sobre estado terminal** (FR-024/FR-026): `editClient`/`assignTechnician`/`cancelOrder` sobre una orden `aprobada`, `rechazada` O `cancelada` → `422`, sin excepción — `cancelada` se agrega a la lista de estados terminales ya usada en `001` (`TERMINAL_STATUSES`).

## Transiciones de estado

**Nueva transición** (revisión 2): `sin_asignar | pendiente_de_revision` → `cancelada` (terminal), vía `POST /orders/{orderId}/cancel`, análoga a la transición existente hacia `aprobada`/`rechazada` pero disparada por dispatcher (no supervisor) y sin requisito de haber pasado por `pendiente_de_revision` primero.

Sin cambios a las transiciones de `User.activo` — `PATCH /clients/{id}/activo` reutiliza la misma semántica ya implementada en `PATCH /technicians/{technicianId}/activo` (`001` FR-004d para técnicos; sin efecto sobre órdenes existentes para clientes, ver Edge Cases de spec.md).
