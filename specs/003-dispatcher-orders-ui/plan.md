# Implementation Plan: Panel de Dispatcher — Órdenes y Técnicos

**Branch**: `003-dispatcher-orders-ui` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-dispatcher-orders-ui/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Vista de panel para el rol dispatcher con menú lateral persistente ("Órdenes" /
"Técnicos"), listado de órdenes filtrable por estado y técnico con paginación,
asignación de técnico vía desplegable (solo técnicos activos) con modal de
confirmación cuando la orden ya tiene técnico asignado, y vista de listado de
técnicos con su estado y cantidad de órdenes activas asignadas. Reutiliza
íntegramente el backend de `001-work-order-management` (`Order`, `User`) y el
RBAC de `002-login-rbac`; extiende `GET /orders` con query params de filtro y
paginación, y añade `GET /technicians` (nuevo, solo lectura) — sin cambios de
esquema Prisma (no se agregan columnas ni migraciones).

## Technical Context

**Language/Version**: Node.js 20+ (backend), JavaScript/JSX + React 18+ (frontend) — mismo stack que `001`/`002`

**Primary Dependencies**: Express, Prisma (ya en uso, solo lectura extendida); `react-router-dom` (ya en uso, nuevas rutas anidadas para sidebar) — no se introduce ninguna dependencia nueva

**Storage**: PostgreSQL vía Prisma — sin cambios de esquema; se reutilizan `Order` y `User` tal como están (`status`, `technicianId`, `activo`, `nombre`)

**Testing**: Jest + Supertest (contract + integration backend), React Testing Library (frontend) — mismos frameworks que `001`/`002`

**Target Platform**: Mismo servicio web backend (Node) + SPA frontend (Vite) que `001`/`002`

**Project Type**: Web application (backend + frontend) — se extiende el proyecto existente, no se crea uno nuevo

**Performance Goals**: SC-002 — listados de órdenes/técnicos cargan en <2s con hasta 500 registros, garantizado por paginación con tamaño de página fijo (FR-014); SC-001 — localizar estado de una orden en <10s

**Constraints**: Acceso restringido a rol dispatcher (FR-010, reutiliza RBAC de `002`); sin actualización en tiempo real (refresco solo manual, FR-002); modal de confirmación obligatorio en reasignación sobre orden ya asignada (FR-005a); técnicos inactivos nunca aparecen en el desplegable de asignación (FR-004)

**Scale/Scope**: 2 endpoints backend (extender `GET /orders` con `status`, `technicianId`, `page`, `pageSize`; nuevo `GET /technicians` con `page`, `pageSize`), 1 layout con sidebar, 2 páginas nuevas (listado de órdenes con filtro/paginación/asignación, listado de técnicos), 1 componente de modal de confirmación de reasignación

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Nota |
|---|---|---|
| I. RBAC en Doble Capa (NON-NEGOTIABLE) | PASS | `GET /orders`, `GET /technicians` y `assignOrder` ya exigen 401/403 vía middleware compartido (`authn`); FR-010 exige restringir el panel a rol dispatcher. Tests de contrato forzando rol incorrecto se generan en `/speckit-tasks`. |
| II. Contrato Antes que Código | PASS (proceso) | Query params de `GET /orders` y el nuevo `GET /technicians` se añaden a `contracts/openapi.yaml` en Phase 1, antes de tocar el router. |
| III. Trazabilidad Requisito → Test | PASS (pendiente de tasks) | Se amplía `/docs/traceability.md` con FR-001..FR-014 de este feature durante `/speckit-tasks`/implementación. |
| IV. IA con Fallback Explícito — No Invención | N/A | Este feature no incluye componente de resumen IA. |
| V. Slice Pequeño y Completo | PASS | Alcance acotado a lectura (listados) + asignación ya existente en backend; no se agregan endpoints de escritura nuevos, ni funcionalidades fuera del brief. |
| VI. Spec Antes que Código | PASS | Orden respetado: `spec` → `clarify` (4 preguntas) → `plan` (este documento). `checklist`/`tasks`/`analyze` siguen antes de tocar `src/`. |

Sin violaciones — no se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/003-dispatcher-orders-ui/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output — apunta al contrato canónico en /contracts/openapi.yaml
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

Se extiende la estructura ya existente de `001-work-order-management` /
`002-login-rbac` (no se crea un proyecto nuevo):

```text
contracts/
└── openapi.yaml              # GET /orders: + query params (status, technicianId, page, pageSize) + envelope paginado
                               # + nuevo path GET /technicians

backend/
├── src/
│   ├── api/
│   │   ├── app.js              # + registro del router technicians (GET)
│   │   ├── orders.js            # modificado: listOrders lee filtros/paginación, incluye nombre de cliente/técnico
│   │   └── technicians.js        # nuevo: GET /technicians (lista + activeOrderCount derivado)
│   └── services/
│       └── orderQueryService.js   # nuevo: construcción de filtro Prisma + paginación (reutilizado por orders.js)
└── tests/
    ├── contract/                    # + test_orders_list_filters.js, + test_technicians_list.js
    └── integration/                   # + dispatcher ve listado filtrado/paginado, + rol no-dispatcher rechazado (403)

frontend/
├── src/
│   ├── components/
│   │   ├── DispatcherSidebar.jsx    # nuevo: menú lateral (Órdenes/Técnicos), resalta sección activa
│   │   ├── TechnicianAssignSelect.jsx # nuevo: desplegable de técnicos activos
│   │   └── ReassignConfirmModal.jsx   # nuevo: modal de confirmación (técnico anterior → nuevo)
│   ├── pages/
│   │   ├── DispatcherLayout.jsx      # nuevo: layout con sidebar + <Outlet/>, reemplaza uso directo de NavBar en /dispatcher
│   │   ├── DispatcherOrders.jsx       # nuevo: listado de órdenes (filtro estado/técnico, paginación, asignar/reasignar)
│   │   └── DispatcherTechnicians.jsx   # nuevo: listado de técnicos (estado, cantidad de órdenes activas)
│   ├── App.jsx                        # modificado: rutas anidadas /dispatcher/orders, /dispatcher/technicians bajo DispatcherLayout
│   └── services/
│       └── api.js                     # + listOrders(params), + listTechnicians(params)
└── tests/
    ├── DispatcherOrders.test.jsx        # nuevo
    └── DispatcherTechnicians.test.jsx     # nuevo
```

**Structure Decision**: Se reutiliza el monorepo `backend/` + `frontend/` de `001`/`002` (Option 2 del template). No se introduce ningún proyecto nuevo ni cambio de esquema Prisma; el feature es principalmente de lectura (listados) más un layout de navegación, siguiendo las convenciones ya establecidas (api/services en backend; pages/components/services en frontend).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Sin violaciones — tabla no aplica.
