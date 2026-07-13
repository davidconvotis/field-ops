# Implementation Plan: Panel de Dispatcher — Órdenes y Técnicos

**Branch**: `003-dispatcher-orders-ui` | **Date**: 2026-07-13 (revisión 2 — ampliación CRUD + TypeScript) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-dispatcher-orders-ui/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Revisión 2 de este plan: la spec creció de 4 a 8 user stories (US5-US8: búsqueda de
clientes por cualquier campo al crear orden, CRUD de clientes, CRUD ampliado de
técnicos, edición/cancelación de órdenes — ver ADR-002/constitution v1.2.0) y el
stack completo migró a TypeScript obligatorio (ADR-003/constitution v2.0.0,
migración retroactiva de `001`/`002`/`003` ya ejecutada y verificada en verde).

US1-US4 (listado de órdenes filtrado/paginado, asignación vía desplegable con
modal de confirmación, sidebar, listado de técnicos) **ya están implementadas**
(ahora en `.ts`/`.tsx`, backend+frontend+tests en verde). Este plan cubre el
diseño de lo que falta: US5 (búsqueda de clientes), US6 (CRUD de clientes), US7
(CRUD ampliado de técnicos — falta crear/editar, activar/desactivar ya existe),
US8 (editar cliente de una orden + cancelar orden — nuevo estado `cancelada`).

Requiere: 1 cambio de esquema Prisma (enum `OrderStatus` +`cancelada`, enum
`AuditAction` +`cancelar`, `Order.cancellationReason` nullable), 6 endpoints
nuevos + 2 extendidos, 1 router nuevo (`clients`), 1 servicio nuevo
(`clientService`), extensiones a `orderService`/`userService`, 2 páginas
frontend nuevas (clientes, y el formulario de creación de orden ampliado con
autocomplete), extensiones a `DispatcherTechnicians`/`DispatcherOrders`.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`) en backend (Node.js 20+) y frontend (React 18+) — ADR-003/constitution v2.0.0. Backend compila a CommonJS (`ts-node` en dev, `tsc` para build); frontend vía Vite (TS/TSX nativo).

**Primary Dependencies**: Express, Prisma (ya en uso, ahora con escritura nueva sobre `Order`/`User`); `react-router-dom` (ya en uso) — no se introduce ninguna dependencia nueva de negocio. Tooling TS ya instalado en `001`(migración)/`003`: `typescript`, `ts-node`, `ts-jest` (backend), `@babel/preset-typescript` (frontend), tipos `@types/*` correspondientes.

**Storage**: PostgreSQL vía Prisma. **Cambio de esquema en esta revisión** (primero desde `001`): `OrderStatus` enum +`cancelada`; `AuditAction` enum +`cancelar`; `Order.cancellationReason String?` (nullable, análogo a `rejectionReason`). Reutiliza `resolvedByUserId`/`resolvedAt` (ya genéricos, no específicos de rechazo) para registrar quién canceló y cuándo. Sin cambios a `User` (nombre/email/activo ya existen).

**Testing**: Jest + Supertest + `ts-jest` (backend), React Testing Library + Jest + Babel TS preset (frontend) — mismos frameworks, ahora sobre `.ts`/`.tsx`.

**Target Platform**: Mismo servicio web backend (Node) + SPA frontend (Vite) que `001`/`002`/`003` rev.1.

**Project Type**: Web application (backend + frontend) — se extiende el proyecto existente.

**Performance Goals**: SC-006 — encontrar/seleccionar cliente en <10s tipeando fragmento; mismos SC-002 (listados <2s/500 registros) y SC-001 ya vigentes. Búsqueda de clientes (US5) debounced en frontend (300ms) para no disparar una request por tecla — decisión de research.md §6.

**Constraints**: Acceso restringido a rol dispatcher (FR-010, ya vigente); "eliminar" cliente/técnico SIEMPRE baja lógica, sin excepción (clarify ronda 2); cancelación de orden exige motivo obligatorio no vacío (FR-025, mismo patrón que rechazo de `001`); edición/asignación/cancelación rechazada uniformemente sobre cualquier estado terminal incluyendo el nuevo `cancelada` (FR-024/FR-026); email de cliente/técnico único a nivel de toda la tabla `User` (ya impuesto por `@unique` en schema, FR-018) — el trabajo nuevo es traducir la violación de constraint Prisma (`P2002`) a un 409 limpio en vez de 500.

**Scale/Scope**: 1 migración de schema (2 valores de enum + 1 columna nullable); 6 endpoints nuevos (`GET /clients`, `POST /clients`, `PATCH /clients/{id}`, `PATCH /clients/{id}/activo`, `POST /technicians`, `PATCH /technicians/{id}`, `PATCH /orders/{id}`, `POST /orders/{id}/cancel` — son 8, ver contracts) + 1 servicio nuevo (`clientService.ts`) + extensión de `orderService.ts`/`userService.ts`; 1 página frontend nueva (`DispatcherClients.tsx`), 1 componente nuevo (`ClientSearchSelect.tsx`, reemplaza el input de texto libre de cliente en `DispatcherOrders.tsx`), extensión de `DispatcherTechnicians.tsx` (crear/editar) y `DispatcherOrders.tsx` (editar cliente, cancelar).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Nota |
|---|---|---|
| I. RBAC en Doble Capa (NON-NEGOTIABLE) | PASS | Todos los endpoints nuevos exigen rol dispatcher vía `rbac(ROLES.DISPATCHER)` + `authn` ya existentes; 401/403 cubiertos por el mismo middleware compartido. Tests de contrato forzando rol incorrecto se generan en `/speckit-tasks`. |
| II. Contrato Antes que Código | PASS (proceso) | Los 8 endpoints nuevos/extendidos y los schemas `ClientSummary`/`PaginatedClients` se añaden a `contracts/openapi.yaml` en Phase 1, antes de tocar los routers. |
| III. Trazabilidad Requisito → Test | PASS (pendiente de tasks) | Se amplía `/docs/traceability.md` con FR-015..FR-026 durante `/speckit-tasks`/implementación. |
| IV. IA con Fallback Explícito — No Invención | N/A | Sin componente de resumen IA en esta revisión. |
| V. Slice Pequeño y Completo | PASS | Alcance ya acotado y aprobado explícitamente vía ADR-002 (mueve estas funcionalidades de "Fuera del slice" a "Dentro del slice", constitution v1.2.0) — no hay scope no autorizado. |
| VI. Spec Antes que Código | PASS | Orden respetado: `spec` (ampliada) → `clarify` (2 preguntas, ronda 2) → `constitution` (ADR-002 v1.2.0, ADR-003 v2.0.0) → `plan` (este documento, revisión 2). `tasks`/`analyze` siguen antes de tocar `src/` para lo nuevo (US5-US8; US1-US4 ya implementadas bajo la revisión 1 de este mismo plan). |

Sin violaciones — no se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/003-dispatcher-orders-ui/
├── plan.md              # This file (revisión 2)
├── research.md          # Revisión 2: +§6-§10 (US5-US8)
├── data-model.md        # Revisión 2: +cancelada, +cancellationReason, +Cliente CRUD
├── quickstart.md        # Revisión 2: +escenarios US5-US8
├── contracts/           # Apunta al contrato canónico en /contracts/openapi.yaml
└── tasks.md             # Phase 2 output (/speckit-tasks command) — a regenerar para US5-US8
```

### Source Code (repository root)

Se extiende la estructura ya implementada de `001`/`002`/`003` rev.1 (TypeScript):

```text
contracts/
└── openapi.yaml                    # + GET/POST /clients, PATCH /clients/{id}, PATCH /clients/{id}/activo
                                     # + POST /technicians, PATCH /technicians/{id}
                                     # + PATCH /orders/{id}, POST /orders/{id}/cancel
                                     # + schemas ClientSummary, PaginatedClients

backend/
├── prisma/
│   └── schema.prisma                 # OrderStatus +cancelada, AuditAction +cancelar,
│                                      # Order.cancellationReason String? — migración nueva
├── src/
│   ├── api/
│   │   ├── clients.ts                  # nuevo: GET/POST /, PATCH /:id, PATCH /:id/activo
│   │   ├── orders.ts                    # + PATCH /:orderId (editar cliente), POST /:orderId/cancel
│   │   └── technicians.ts                # + POST / (crear), PATCH /:id (editar)
│   └── services/
│       ├── clientService.ts               # nuevo: createClient, updateClient, setClientActive,
│       │                                    # searchClients (por cualquier campo)
│       ├── orderService.ts                 # + editClient, cancelOrder (reutiliza optimisticUpdateOrder)
│       └── userService.ts                  # + createTechnician, updateTechnician
└── tests/
    ├── contract/                    # + test_clients_*.ts, + test_orders_edit_cancel.ts,
    │                                  # + test_technicians_create_update.ts
    └── integration/                   # + escenarios US5-US8, conflicto de email (P2002 → 409)

frontend/
├── src/
│   ├── components/
│   │   └── ClientSearchSelect.tsx      # nuevo: autocomplete de clientes (debounce 300ms)
│   ├── pages/
│   │   ├── DispatcherClients.tsx         # nuevo: CRUD de clientes
│   │   ├── DispatcherOrders.tsx           # + usa ClientSearchSelect en "Crear orden",
│   │   │                                   # + editar cliente de orden existente, + botón Cancelar
│   │   └── DispatcherTechnicians.tsx       # + crear técnico, + editar nombre/email
│   ├── App.tsx                             # + ruta /dispatcher/clients
│   ├── components/DispatcherSidebar.tsx     # + enlace "Clientes"
│   └── services/api.ts                      # + searchClients, createClient, updateClient,
│                                              # setClientActive, createTechnician, updateTechnician,
│                                              # editOrderClient, cancelOrder
└── tests/
    ├── DispatcherClients.test.tsx        # nuevo
    └── ClientSearchSelect.test.tsx         # nuevo
```

**Structure Decision**: Se reutiliza el monorepo `backend/`+`frontend/` TypeScript ya migrado. Un router/servicio nuevo por entidad (`clients`) siguiendo la misma convención que `technicians`; `orders`/`technicians` existentes se extienden en vez de duplicarse.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Sin violaciones — tabla no aplica.
