# Implementation Plan: Login con verificación RBAC

**Branch**: `002-login-rbac` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-login-rbac/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Vista de login (Tailwind CSS) que autentica contra un endpoint backend nuevo,
emitiendo access JWT (15 min) vía cookie httpOnly + refresh token (cookie httpOnly
separada) sin sesión server-side, con denylist mínima de refresh tokens revocados
para permitir logout real. Reutiliza el RBAC de doble capa ya existente
(`authn.js`/`rbac.js`, `idpAdapter.js`) del slice `001-work-order-management`,
extendiéndolo: `User` gana `passwordHash` (bcrypt, cost ≥10); se agrega tabla
`RevokedRefreshToken`; `authn` pasa a leer el JWT desde cookie en vez de header
`Authorization`. Tailwind CSS se adopta como sistema de estilos único del frontend
(retroactivo a las vistas ya existentes de `001`).

## Technical Context

**Language/Version**: Node.js 20+ (backend), JavaScript/JSX + React 18+ (frontend) — mismo stack que `001-work-order-management`

**Primary Dependencies**: Express, Prisma (ya en uso); `bcrypt` (hash de contraseña, nuevo); `jsonwebtoken` (ya en uso, reutilizado para access+refresh JWT); `cookie-parser` (nuevo, lectura de cookies httpOnly); Tailwind CSS + `postcss`/`autoprefixer` (nuevo, frontend)

**Storage**: PostgreSQL vía Prisma (mismo esquema que `001`) — se extiende con `User.passwordHash` y modelo `RevokedRefreshToken`

**Testing**: Jest + Supertest (contract + integration backend), React Testing Library (frontend) — mismos frameworks que `001`

**Target Platform**: Mismo servicio web backend (Node) + SPA frontend (Vite) que `001`

**Project Type**: Web application (backend + frontend) — se extiende el proyecto existente, no se crea uno nuevo

**Performance Goals**: SC-001 — login completo en <5s percibido por el usuario; verificación de token en cada request protegido sin latencia perceptible adicional (mismo middleware `authn` ya medido en NFR-05 de `001`)

**Constraints**: Token JAMÁS en `localStorage` (constitution, ya vigente); cookies de sesión con `httpOnly`, `secure`, `sameSite=strict`; access JWT 15 min, refresh token con expiración mayor (ver research.md) y revocación real vía denylist; bcrypt cost ≥10; rate limit 5 intentos/15min por email (FR-010) → 429

**Scale/Scope**: 1 feature pequeño — 3 endpoints nuevos (`POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`), 1 vista nueva (Login), migración de Prisma (passwordHash + RevokedRefreshToken), migración de estilos existentes a Tailwind

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Nota |
|---|---|---|
| I. RBAC en Doble Capa (NON-NEGOTIABLE) | PASS | Reutiliza `authn`/`rbac` ya existentes; FR-008 exige 401/403 en el 100% de endpoints protegidos, ya cubierto por middleware compartido. Tests de contrato forzando rol/token incorrecto se generan en `/speckit-tasks`. |
| II. Contrato Antes que Código | PASS (proceso) | `/auth/login`, `/auth/refresh`, `/auth/logout` se añaden a `contracts/openapi.yaml` (ruta canónica ya establecida) en Phase 1, antes de implementar los endpoints. |
| III. Trazabilidad Requisito → Test | PASS (pendiente de tasks) | Se amplía `/docs/traceability.md` existente con FR-001..FR-010 de este feature durante `/speckit-tasks`/implementación. |
| IV. IA con Fallback Explícito — No Invención | N/A | Este feature no incluye componente de resumen IA; no aplica. |
| V. Slice Pequeño y Completo | PASS | Scope acotado a login/logout/refresh + RBAC ya existente; registro y recuperación de contraseña quedan fuera (ADR-001), evitando scope creep. |
| VI. Spec Antes que Código | PASS | Orden respetado: enmienda constitution (v1.1.0) → ADR-001 → `spec` → `clarify` (5 preguntas) → `plan` (este documento). `checklist`/`tasks`/`analyze` siguen antes de tocar `src/`. |

Sin violaciones — no se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-login-rbac/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output — apunta al contrato canónico en /contracts/openapi.yaml
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

Se extiende la estructura ya existente de `001-work-order-management` (no se crea un
proyecto nuevo):

```text
contracts/
└── openapi.yaml          # Se añaden paths /auth/login, /auth/refresh, /auth/logout

backend/
├── prisma/
│   └── schema.prisma       # + User.passwordHash, + model RevokedRefreshToken
├── src/
│   ├── adapters/
│   │   └── idpAdapter.js    # Se extiende: issueTokenPair (access+refresh), verifyRefreshToken, revokeRefreshToken
│   ├── services/
│   │   └── authService.js    # nuevo: login (bcrypt.compare), refresh, logout
│   ├── api/
│   │   └── auth.js            # nuevo router: POST /login, /refresh, /logout
│   └── middleware/
│       └── authn.js            # modificado: lee JWT desde cookie httpOnly en vez de header Authorization
└── tests/
    ├── contract/                 # + auth.contract.test.js
    ├── integration/                # + login flow, rate limit, logout+refresh revocado
    └── unit/                       # + authService (bcrypt, denylist)

frontend/
├── tailwind.config.js          # nuevo
├── postcss.config.js            # nuevo
├── src/
│   ├── index.css                 # nuevo: directivas Tailwind
│   ├── pages/
│   │   └── Login.jsx              # nueva vista
│   └── services/
│       └── authClient.js           # nuevo: login/refresh/logout (fetch con credentials:'include')
└── tests/
    └── Login.test.jsx               # nuevo
```

**Structure Decision**: Se reutiliza el monorepo `backend/` + `frontend/` de `001` (Option 2 del template, ya adoptada). Este feature no introduce nuevos proyectos; extiende Prisma schema, adapters, middleware y añade un router `auth` y una página `Login` siguiendo las convenciones ya establecidas (services/adapters/api en backend; pages/components/services en frontend).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Sin violaciones — tabla no aplica.
