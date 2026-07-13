# Data Model: Login con verificación RBAC

Extiende el schema de Prisma ya existente en `backend/prisma/schema.prisma`
(`001-work-order-management`). No se crea un schema nuevo.

## User (modificado)

Campo nuevo:

| Campo | Tipo | Reglas |
|---|---|---|
| `passwordHash` | `String` | bcrypt (cost ≥10) sobre contraseña de origen mínimo 8 caracteres. Nunca expuesto en respuestas API. |

Resto de campos (`id`, `role`, `activo`, `nombre`, `email`) sin cambios respecto a
`001`.

## RevokedRefreshToken (nuevo)

| Campo | Tipo | Reglas |
|---|---|---|
| `jti` | `String` @id | Identificador único del refresh token revocado (claim `jti` del JWT). |
| `userId` | `String` | FK a `User.id`, para auditoría/purga por usuario si fuera necesario. |
| `revokedAt` | `DateTime` @default(now()) | Momento del logout. |
| `expiresAt` | `DateTime` | Igual al `exp` original del refresh token — permite purgar filas vencidas sin perder capacidad de revocación mientras el token viviría. |

Índice: `@@index([expiresAt])` para el job de purga periódica (reutiliza el patrón
de `retentionJob.js` ya existente en `001`).

## Relaciones

- `RevokedRefreshToken.userId` → `User.id` (many-to-one, sin relación inversa
  obligatoria en `User` — no se necesita navegar de usuario a sus tokens revocados
  para este feature).

## Transiciones de estado (JWT, no entidad persistida)

```
[sin sesión] --login exitoso--> [access+refresh emitidos]
[access+refresh emitidos] --access expira (15min)--> [refresh silencioso]
[refresh silencioso] --refresh.jti no revocado y no expirado--> [nuevo access+refresh]
[refresh silencioso] --refresh.jti revocado o expirado--> [sin sesión, forzar login]
[access+refresh emitidos] --logout--> [refresh.jti insertado en RevokedRefreshToken, cookies borradas, sin sesión]
```

## Validación derivada de Functional Requirements

- FR-002/FR-002a: emisión y refresh del par de tokens — cubierto por transición
  arriba.
- FR-003: credenciales inválidas → sin registro de `RevokedRefreshToken`, respuesta
  401 genérica.
- FR-009: logout → inserta fila en `RevokedRefreshToken`.
- FR-010: rate limit — no requiere entidad persistida (contador en memoria, ver
  research.md §5); no forma parte de este data model.
