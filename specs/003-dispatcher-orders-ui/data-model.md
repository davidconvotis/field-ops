# Data Model: Panel de Dispatcher — Órdenes y Técnicos

Sin cambios al esquema Prisma (`backend/prisma/schema.prisma`). Este feature es de solo lectura sobre entidades ya existentes (`Order`, `User`); documenta los DTOs de respuesta (read models) nuevos/extendidos.

## Entidades existentes reutilizadas (sin cambios)

- **Order** (`001-work-order-management`): `id`, `status`, `clientId`, `technicianId`, `version`, `createdAt`, `assignedAt`, `submittedAt`, `resolvedAt`, `rejectionReason`.
- **User** (`001`/`002`): `id`, `role`, `activo`, `nombre`, `email`. Rol `tecnico` es lo que esta feature llama "Técnico".

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

## Reglas de validación / filtrado (sin cambios de estado, solo lectura)

- `GET /orders?status=X`: `X` MUST ser uno de `sin_asignar | pendiente_de_revision | aprobada | rechazada`; valor inválido → `400`.
- `GET /orders?technicianId=Y`: `Y` MUST ser un uuid válido; no se valida existencia (si no hay coincidencias, `items` vacío, no error).
- `GET /orders?page=N&pageSize=M`: `N ≥ 1`; `pageSize` es fijo (50) y no configurable por el cliente en esta versión (FR-014) — si el cliente envía `pageSize`, se ignora.
- El scope por rol de `001-work-order-management` (FR-017/FR-018) se aplica ANTES del filtro de esta feature (un dispatcher ve todas; los filtros `status`/`technicianId` reducen ese conjunto, nunca lo amplían).

## Transiciones de estado

Ninguna — este feature no introduce nuevas transiciones de `Order` ni de `User.activo`; reutiliza `PATCH /orders/{orderId}/assign` y `PATCH /technicians/{technicianId}/activo` ya existentes sin modificarlos.
