# Implementation Plan: Gestión de Órdenes de Trabajo

**Branch**: `001-work-order-management` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-work-order-management/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Sistema de gestión de órdenes de trabajo (FieldOps) con ciclo de vida `sin_asignar → pendiente_de_revision → {aprobada | rechazada}`. Dispatcher crea y (re)asigna órdenes a técnicos; técnico registra ejecución con evidencia fotográfica (≥1 foto validada por contenido) y notas obligatorias; supervisor aprueba o rechaza. RBAC en doble capa (401/403) en todos los endpoints, idempotencia en el envío de ejecución, chequeo atómico (optimistic lock) en transiciones concurrentes, cifrado en reposo y auditoría atómica con retención de 12 meses. Enfoque técnico: backend Node.js/Express con contrato OpenAPI-first, frontend React con vistas por rol, PostgreSQL como store principal, adaptadores pluggables para KMS/almacenamiento de fotos/IdP para poder correr el slice completo en local sin dependencias cloud reales.

## Technical Context

**Language/Version**: Node.js 20+ (backend, TypeScript opcional pero recomendado para los adaptadores tipados), JavaScript/JSX + React 18+ (frontend)

**Primary Dependencies**: Express (backend HTTP), Prisma (ORM + migraciones sobre PostgreSQL/SQLite), `jsonwebtoken`/`jose` (verificación JWT), `multer` (multipart de fotos), `node-cron` (job de retención/borrado 12 meses), React 18+ con React Router (frontend), React Testing Library

**Storage**: PostgreSQL (producción); SQLite en memoria (tests) — mismo esquema vía Prisma. Fotos de evidencia vía adaptador de almacenamiento (interfaz común; prod = S3-compatible, dev/test = filesystem local bajo `.gitignore`)

**Testing**: Jest + Supertest (contract + integration + unit backend), React Testing Library (frontend), golden cases en `/evals/summary/` (FR-020 / Principio IV)

**Target Platform**: Servicio web backend (Linux/Node) + SPA frontend servida por el mismo stack

**Project Type**: Web application (backend + frontend, "Option 2" del template)

**Performance Goals**: NFR-05 — P95 ≤ 300 ms / P99 ≤ 800 ms en CRUD de órdenes a 100 req/s; NFR-06 — subida de foto ≤10MB en P95 ≤ 3s a 10 Mbps; FR-020 — resumen IA P95 ≤ 5s con degradación explícita

**Constraints**: TLS 1.2+ obligatorio (NFR-01); cifrado AES-256 en reposo para datos de cliente y fotos (NFR-02); fallo de KMS/IdP/storage/antivirus NUNCA degrada a inseguro — responde 503/502/504 explícito (NFR-02b/03b/06b/08b); todo cambio de estado es atómico con su registro de auditoría (NFR-04b); retención de fotos y audit log 12 meses con borrado automático (NFR-04c); RBAC en doble capa 401/403 en el 100% de endpoints (FR-000, NFR-03)

**Scale/Scope**: 1 slice — 4 roles (cliente, técnico, dispatcher, supervisor), ~8 endpoints (crear orden, (re)asignar, activar/desactivar técnico, registrar ejecución, aprobar, rechazar, listar por rol, detalle+resumen), sin modelo de equipos/regiones, sin dashboard ni notificaciones push (fuera de alcance)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Nota |
|---|---|---|
| I. RBAC en Doble Capa (NON-NEGOTIABLE) | PASS | spec.md FR-000 (transversal) + NFR-03/03b cubren 401/403 en el 100% de endpoints; se implementa como middleware `authn` + `rbac` reutilizable, con tests de contrato forzando rol incorrecto (Phase 1 contracts + tasks de test). |
| II. Contrato Antes que Código | PASS (proceso) | `contracts/openapi.yaml` (raíz del repo, por mandato de la constitución) se genera en Phase 1, antes de cualquier implementación de endpoint; tests de contrato se derivan de él en `/speckit-tasks`. |
| III. Trazabilidad Requisito → Test | PASS (pendiente de tasks) | `/docs/traceability.md` (FR-ID → AC-ID → test file:test name) se puebla durante `/speckit-tasks`/implementación; no bloquea el plan, pero es gate de "terminado" por requisito. |
| IV. IA con Fallback Explícito — No Invención | PASS con nota | FR-020/NFR describen contrato y degradación explícita; `/evals/summary/` con golden cases (nominal, evidencia insuficiente, notas ambiguas) se crea en Phase 1 (quickstart) y se puebla antes de la primera ejecución en producción — ver Research §7. |
| V. Slice Pequeño y Completo | PASS con nota (ver Complexity Tracking) | La constitución solo enumera explícitamente reasignación, registro de ejecución, aprobación/rechazo, RBAC y resumen IA como "dentro del slice". El spec añade creación de orden (FR-001), listado por rol (FR-017-019), idempotencia (FR-012/012b), reasignación automática al desactivar técnico (FR-004d) y borrado por retención (NFR-04c). Se documentan como extensiones necesarias, no como scope creep — ver tabla de justificación abajo. |
| VI. Spec Antes que Código | PASS | Orden de commits respetado hasta ahora: `constitution` → `spec` → `clarify` (2 rondas) → `plan` (este documento). `checklist`, `tasks`, `analyze` siguen antes de cualquier commit en `src/`. |

**Extensiones de alcance sobre la tabla "Dentro del slice" de la constitución** (justificación, no requieren enmienda formal por ser prerequisitos funcionales directos de los 3 ítems ya aprobados):

| Extensión | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| FR-001 (creación de orden) | La reasignación (ítem 1 del slice) requiere que la orden exista y tenga un estado inicial `sin_asignar`; sin creación no hay "orden" que reasignar en un slice ejecutable end-to-end. | Asumir que las órdenes se insertan directamente en BD (seed manual) rompe el Principio V ("frontend, backend y tests en verde a la vez") y el Principio II (no habría endpoint que contratar). |
| FR-017–019 (listado por rol) | El RBAC en doble capa (ítem 4 del slice) es inverificable sin un endpoint de consulta que demuestre el alcance de visibilidad por rol; es el vehículo de prueba del propio Principio I. | Verificar RBAC solo sobre endpoints de escritura deja sin cubrir la fuga de existencia (FR-019) que la propia constitución exige probar "independientemente del estado de la UI". |
| FR-012/012b (idempotencia) | El registro de ejecución (ítem 2 del slice) ocurre en campo con conectividad inestable (app técnico); sin idempotencia un reintento de red duplicaría evidencia, violando NFR-04 (auditoría fiel). | Sin idempotencia, un simple retry del cliente ante timeout genera doble registro de ejecución sobre la misma orden — inconsistencia de datos que ningún workaround de UI puede evitar. |
| FR-004d (auto-reasignación al desactivar técnico) | Consecuencia directa de permitir desactivar técnicos (necesario para que FR-004 "inactivo" sea comprobable) sin dejar trabajo huérfano, que el propio Principio V prohíbe ("slice completo", no bugs conocidos sin resolver). | Dejar la orden asignada a un técnico inactivo sin ruta de recuperación deja el slice deliberadamente incompleto. |
| NFR-04c (borrado por retención) | Consecuencia directa de NFR-04 (auditoría con retención mínima 12 meses), ya presente en la constitución como restricción de seguridad mínima implícita en el manejo de fotos. | No implementar el borrado deja un requisito de compliance a medias, violando Principio III (requisito sin prueba trazable de cumplimiento). |

## Project Structure

### Documentation (this feature)

```text
specs/001-work-order-management/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output — apunta al contrato canónico en /contracts/openapi.yaml
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
contracts/
└── openapi.yaml          # Contrato canónico OpenAPI 3.x (Principio II — ruta fija exigida por la constitución)

backend/
├── src/
│   ├── models/            # Prisma schema + tipos: Order, ExecutionRecord, EvidencePhoto, AuditLogEntry, User
│   ├── services/           # orderService, executionService, reviewService, authzService, auditService, summaryService
│   ├── adapters/            # encryptionAdapter (KMS), storageAdapter (S3/local), idpAdapter (JWT/JWKS), retentionJob
│   ├── api/                  # routers/controllers: orders, executions, reviews, users
│   └── middleware/            # authn.js (401), rbac.js (403)
└── tests/
    ├── contract/               # generados desde contracts/openapi.yaml
    ├── integration/             # por user story (US1..US5)
    └── unit/

frontend/
├── src/
│   ├── components/
│   ├── pages/                   # DispatcherBoard, TechnicianExecutionForm, SupervisorReview, ClientOrders
│   └── services/                 # api client (fetch/axios + manejo 401/403/409/415/422/503)
└── tests/

docs/
├── adr/                            # ADRs de enmiendas a la constitución (si aplica)
└── traceability.md                 # FR-ID → AC-ID → test file:test name (Principio III, poblado en tasks/implementación)

evals/
└── summary/                          # golden cases FR-020 / Principio IV (nominal, evidencia insuficiente, notas ambiguas)
```

**Structure Decision**: Web application de dos proyectos (`backend/` + `frontend/`) sobre un contrato OpenAPI único en `/contracts/openapi.yaml` (ruta fija por mandato de la constitución, Principio II — no se duplica bajo `specs/`, la carpeta `contracts/` de la feature solo referencia esa ruta canónica). Persistencia con Prisma sobre PostgreSQL (SQLite en tests) para poder migrar/testear con un único comando (constitución, "Arranque"). Adaptadores (`encryptionAdapter`, `storageAdapter`, `idpAdapter`) aíslan las dependencias externas (KMS, blob storage, IdP) detrás de una interfaz común, permitiendo correr el slice completo en local (constitución: instalación/test con un único comando) mientras se preserva el comportamiento de fallo explícito exigido por NFR-02b/03b/06b/08b.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No hay violaciones que requieran justificación fuera de la tabla de "Extensiones de alcance" ya documentada en Constitution Check (Principio V) — esas extensiones son prerequisitos funcionales directos de los ítems ya aprobados en la constitución, no complejidad añadida discrecionalmente.
