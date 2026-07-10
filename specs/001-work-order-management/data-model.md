# Data Model: Gestión de Órdenes de Trabajo

Derivado de `spec.md` § Key Entities. Tipos son conceptuales (mapeo Prisma en `backend/src/models/schema.prisma`).

## User

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | UUID | PK |
| `role` | enum(`cliente`,`tecnico`,`dispatcher`,`supervisor`) | inmutable tras creación (fuera de alcance: cambio de rol) |
| `activo` | boolean | default `true`; controlado manualmente por dispatcher/admin (Clarifications, ronda 1, Q1). Un técnico con `activo=false` no puede recibir nuevas asignaciones (FR-004) y dispara FR-004d al pasar a `false` |
| `nombre`, `email` | string | de sistema de identidad externo (fuera de alcance su gestión) |

**Relaciones**: 1 `User` (rol cliente) → N `Order` (como propietario); 1 `User` (rol técnico) → N `Order` (como asignado, 0..1 a la vez por orden).

## Order (Orden de trabajo)

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | UUID | PK |
| `status` | enum(`sin_asignar`,`pendiente_de_revision`,`aprobada`,`rechazada`) | `aprobada`/`rechazada` terminales — ninguna transición sale de ellos |
| `clientId` | FK → User (rol cliente) | requerido, inmutable |
| `technicianId` | FK → User (rol técnico), nullable | null en `sin_asignar`; requerido antes de transicionar a `pendiente_de_revision` (FR-04b/FR-002) |
| `version` | integer | optimistic lock (Research §6); incrementa en cada transición de `status` |
| `createdAt` | timestamp | set en creación (FR-001) |
| `assignedAt` | timestamp, nullable | set en cada (re)asignación (FR-002) |
| `submittedAt` | timestamp, nullable | set al pasar a `pendiente_de_revision` (FR-005) |
| `resolvedAt` | timestamp, nullable | set al pasar a `aprobada`/`rechazada` |
| `rejectionReason` | string, nullable | requerido no-vacío-tras-trim si `status=rechazada` (FR-007/FR-014) |
| `resolvedByUserId` | FK → User (rol supervisor), nullable | set en aprobación/rechazo (FR-013/FR-015) |

**Transiciones válidas**:

```
sin_asignar --(FR-002, requiere technicianId)--> sin_asignar (reasignación, sin cambio de status)
sin_asignar --(FR-005, ejecución enviada)--> pendiente_de_revision
pendiente_de_revision --(FR-002, reasignación)--> pendiente_de_revision (sin cambio de status)
pendiente_de_revision --(FR-013, aprobar)--> aprobada [terminal]
pendiente_de_revision --(FR-015, rechazar + motivo)--> rechazada [terminal]
```

Cualquier transición fuera de este grafo (incl. sobre `aprobada`/`rechazada`) responde `409`/`422` según FR-003/FR-011/FR-016.

## ExecutionRecord (Registro de ejecución)

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | UUID | PK |
| `orderId` | FK → Order | 1:1 activo (una orden solo tiene un envío de ejecución vigente; reintentos usan el mismo `idempotencyKey`) |
| `technicianId` | FK → User (rol técnico) | debe coincidir con `Order.technicianId` al momento de escritura (FR-010, chequeo atómico) |
| `notes` | text | no vacío tras trim (FR-007); ver Research §7 para uso en resumen IA |
| `idempotencyKey` | string | **único** a nivel global; colisión con payload distinto → 409 (FR-012b) |
| `submittedAt` | timestamp | |

**Relación**: 1 `ExecutionRecord` → N `EvidencePhoto` (≥1, validado en escritura — FR-006).

## EvidencePhoto (Foto de evidencia)

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | UUID | PK |
| `executionRecordId` | FK → ExecutionRecord | |
| `mimeType` | enum(`image/jpeg`,`image/png`,`image/heic`) | validado por contenido/magic bytes, no extensión (FR-008/NFR-08) |
| `storageKey` | string, nullable | referencia al `storageAdapter`; `null` tras borrado por retención (job de NFR-04c), la fila persiste como metadata |
| `sizeBytes` | integer | ≤ 10 MB (SC-003/NFR-06) |
| `uploadedAt` | timestamp | solo se confirma tras persistencia exitosa en `storageAdapter` (NFR-06b) |
| `retentionExpiresAt` | timestamp | `uploadedAt + 12 meses`; el job de retención purga `storageKey` al vencer |

**Regla todo-o-nada**: si cualquier foto de un mismo envío falla validación de tipo, se revierten (rollback) todas las fotos ya persistidas de ese envío (FR-009/FR-011 vía NFR-06b transaccional).

## AuditLogEntry (Registro de auditoría)

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | UUID | PK |
| `orderId` | FK → Order | |
| `actorUserId` | FK → User | |
| `action` | enum(`crear`,`asignar`,`reasignar`,`desactivar_tecnico_reasigna`,`enviar_ejecucion`,`aprobar`,`rechazar`,`conflicto_concurrente`) | `conflicto_concurrente` registra intentos perdedores en carreras (FR-05b/FR-016b) |
| `timestamp` | timestamp | |
| `metadata` | jsonb | p. ej. técnico anterior/nuevo (FR-004), motivo de rechazo (FR-015) |
| `retentionExpiresAt` | timestamp | `timestamp + 12 meses` (NFR-04) |

**Atomicidad**: cada fila se escribe en la misma transacción DB que el cambio de `Order.status`/`technicianId` que registra (NFR-04b); si la escritura de auditoría falla, toda la transacción hace rollback.

## Diagrama de relaciones

```
User (cliente) 1---N Order N---1 User (técnico, nullable)
Order 1---1 ExecutionRecord 1---N EvidencePhoto
Order 1---N AuditLogEntry N---1 User (actor)
```
