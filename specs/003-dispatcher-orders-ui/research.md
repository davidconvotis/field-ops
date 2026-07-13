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

**Decision**: El modal de confirmación (FR-005a) es un componente puramente de frontend (`ReassignConfirmModal.tsx`); no requiere cambio de contrato backend — la llamada a `PATCH /orders/{orderId}/assign` (ya existente, con `expectedVersion` para lock optimista) se dispara solo tras confirmar en el modal.

**Rationale**: El backend ya implementa el chequeo atómico (`expectedVersion`, `001-work-order-management` FR-05b); el modal es una fricción de UX del lado cliente antes de invocar la API ya existente, sin lógica de negocio nueva.

**Alternatives considered**: N/A — no hay alternativa de diseño backend relevante, es puramente un gate de UI.

---

## Revisión 2 (2026-07-13) — US5-US8: CRUD de clientes/técnicos, cancelación de orden

Contexto: ADR-002 (constitution v1.2.0) mueve esta funcionalidad a "Dentro del slice"; ADR-003 (constitution v2.0.0) hace TypeScript obligatorio (ya migrado y verificado en verde para US1-US4). Las decisiones siguientes cubren únicamente lo nuevo.

## 6. Búsqueda de clientes "por cualquier campo" (US5)

**Decision**: Nuevo endpoint `GET /clients?q=<texto>` (dispatcher-only) que busca sobre `nombre` y `email` con `contains` de Prisma, y adicionalmente compara `id` con igualdad exacta si `q` tiene forma de uuid. Respuesta paginada igual que `/technicians` (`{ items, page, pageSize, total }`). Frontend debounced (300ms) para no disparar una request por tecla.

**Decision (revisado — resolución de C1 de `/speckit-analyze`)**: Prisma `mode: 'insensitive'` NO existe en el provider SQLite (usado por `schema.test.prisma`) — lanza `PrismaClientValidationError` en runtime, no solo "se comporta distinto". `clientService.searchClients` construye el filtro condicionalmente según el datasource activo:

```ts
const caseInsensitive = process.env.NODE_ENV !== 'test'; // false en SQLite de test, true en Postgres real
const textMatch = (q: string) => caseInsensitive ? { contains: q, mode: 'insensitive' as const } : { contains: q };
```

En producción (Postgres) la búsqueda es insensible a mayúsculas (cumple AC1 de US5). En el entorno de test (SQLite) queda sensible a mayúsculas — los tests/fixtures de `T041`/`T042` deben usar el mismo casing en el `q` de búsqueda que en los datos sembrados, documentado explícitamente como simplificación del entorno de test, no como comportamiento de producción.

**Rationale**: FR-021 pide "cualquier campo (nombre, email o id)". Prisma no soporta buscar por múltiples campos heterogéneos con un único operador `contains` de forma type-safe sin un `OR`; se arma `OR: [{ nombre: textMatch(q) }, { email: textMatch(q) }, ...(isUuid(q) ? [{ id: q }] : [])]`.

**Alternatives considered**:
- Full-text search (Postgres `tsvector`): rechazado — sobre-ingeniería para un campo nombre/email de tamaño pequeño (clientes de una operación de despacho, no miles simultáneos); `contains` es suficiente y ya usado en el resto del proyecto (ningún índice FTS existe hoy).
- Buscar client-side sobre todo el dataset cargado: rechazado — igual que en research.md §1/§4, requeriría cargar todos los clientes sin paginar.
- SQL crudo (`$queryRaw` con `LOWER(...)`) para uniformidad cross-provider: rechazado — el resto del proyecto usa exclusivamente Prisma ORM tipado; introducir raw SQL rompe esa consistencia y el type-safety ganado con TypeScript (ADR-003) por un caso de bajo riesgo (dataset pequeño, entorno de test ya documentado como simplificación aceptable).

## 7. CRUD de clientes y técnicos — servicio nuevo vs. extender existente

**Decision**: Nuevo `clientService.ts` (createClient, updateClient, setClientActive, searchClients) espejando la forma de `userService.ts`, en vez de generalizar un "userService" único para ambos roles. `userService.ts` se extiende con `createTechnician`/`updateTechnician` (mismo archivo que ya tiene `setTechnicianActive`/`listTechnicians`).

**Rationale**: Clientes y técnicos comparten el modelo `User` pero sus reglas de negocio ya divergen (baja de técnico dispara reasignación automática de órdenes, FR-004d; baja de cliente NO toca sus órdenes, ver Edge Cases de spec.md) — mantenerlos en servicios separados evita condicionales `if (role === ...)` dispersos y sigue el patrón ya establecido (un servicio por "concepto de negocio", no por tabla).

**Alternatives considered**: Un único `userService.ts` con todas las operaciones de cliente+técnico: rechazado por la divergencia de reglas de negocio ya mencionada; haría el archivo más largo sin beneficio real.

## 8. Conflicto de email duplicado (FR-018)

**Decision**: `createClient`/`updateClient`/`createTechnician`/`updateTechnician` capturan la excepción de Prisma `P2002` (unique constraint violation sobre `email`) y la traducen a `HttpError(409, 'email ya registrado por otro usuario')`, en vez de dejar que se propague como 500. La detección es duck-typed (`err.code === 'P2002'`), NO `instanceof Prisma.PrismaClientKnownRequestError` — el cliente de test (SQLite, `src/generated/prisma-test-client`) y el de producción (`@prisma/client`) son paquetes generados por separado, sus clases de error no comparten identidad entre sí, por lo que `instanceof` contra un import de `@prisma/client` falla silenciosamente en el entorno de test (devuelve 500 en vez de 409).

**Rationale**: El constraint `email @unique` ya existe en el schema desde `001` (sin cambios necesarios) — el trabajo es puramente de manejo de errores en la capa de servicio, consistente con el patrón `HttpError` ya usado en todo el proyecto.

**Alternatives considered**: Verificar existencia previa con un `findUnique` antes del `create`/`update` (evitar el catch): rechazado — introduce una carrera (TOCTOU) entre el check y el write bajo escritura concurrente; capturar `P2002` es atómico y ya es el patrón recomendado por Prisma.

## 9. Cancelación de orden — nuevo estado vs. reutilizar `rechazada`

**Decision**: Nuevo valor de enum `OrderStatus.cancelada` + columna `Order.cancellationReason String?` (nullable), en vez de reutilizar `rechazada`/`rejectionReason`. `cancelOrder` vive en `orderService.ts` (no en `reviewService.ts`) porque puede aplicarse desde `sin_asignar` O `pendiente_de_revision` (cualquier estado no terminal), a diferencia de `approve`/`reject` que solo aplican desde `pendiente_de_revision` — no encaja en el helper compartido `resolveOrder` de `reviewService.ts` sin generalizarlo innecesariamente.

**Rationale**: Ya decidido en ADR-002 (alternativa "tratar cancelación como rechazo" fue rechazada explícitamente ahí — mezclaría dos motivos semánticamente distintos). `cancelOrder` reutiliza `optimisticUpdateOrder` (mismo lock por `version` que `assignTechnician`/`resolveOrder`) para el mismo chequeo atómico ante carreras (edge case ya documentado en spec.md).

**Alternatives considered**: Ver ADR-002 "Alternativas consideradas" (ya resuelto ahí, no se repite el análisis).

## 10. Edición del cliente de una orden (FR-023) — endpoint dedicado vs. extender `/assign`

**Decision**: Nuevo `PATCH /orders/{orderId}` (body `{ clientId }`) dedicado a editar el cliente, separado de `PATCH /orders/{orderId}/assign` (que edita `technicianId`).

**Rationale**: Mantener un endpoint por campo editable es más simple de documentar/testear (permisos, validaciones y respuestas de error no se mezclan) y sigue el patrón REST ya usado (`/assign` es su propio sub-recurso). Ambos exigen estado no terminal y usan el mismo `optimisticUpdateOrder`.

**Alternatives considered**: Generalizar `/assign` a un `PATCH /orders/{orderId}` único que acepte `clientId` y/o `technicianId`: rechazado — mezclaría dos flujos de UI distintos (desplegable de asignación vs. edición de cliente) en un solo contrato, complicando la matriz de tests sin necesidad real (no hay caso de uso que edite ambos a la vez).
