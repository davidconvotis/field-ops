# Tasks: Login con verificación RBAC

**Input**: Design documents from `/specs/002-login-rbac/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos (no opcionales) — constitution Principio II/III exige test de contrato en verde antes de considerar un endpoint "listo", y traceability FR→AC→test.

**Organization**: Tareas agrupadas por user story (spec.md): US1 (P1, login exitoso), US2 (P1, rechazo de credenciales inválidas + rate limit), US3 (P2, bloqueo RBAC + logout con revocación real).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1, US2, US3 — mapea a spec.md
- Rutas de archivo exactas en cada descripción

## Path Conventions

Web app existente (`001-work-order-management`, reutilizada): `backend/src/`, `backend/tests/`, `frontend/src/`, `frontend/tests/`.

---

## Phase 1: Setup

**Purpose**: Dependencias e infraestructura de estilos nuevas para este feature

- [X] T001 Instalar `bcrypt` y `cookie-parser` en `backend/package.json` (`npm install bcrypt cookie-parser`)
- [X] T002 Instalar `tailwindcss`, `postcss`, `autoprefixer` como devDependencies en `frontend/package.json` y ejecutar `npx tailwindcss init -p` para generar `frontend/tailwind.config.js` y `frontend/postcss.config.js`
- [X] T003 [P] Configurar `content: ['./src/**/*.{js,jsx}']` en `frontend/tailwind.config.js` y añadir directivas `@tailwind base/components/utilities` en `frontend/src/index.css`, importado en el entrypoint de Vite

**Checkpoint**: Dependencias instaladas, Tailwind compila sin vistas migradas aún

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura de auth compartida por las 3 user stories — ningún endpoint de `/auth/*` puede implementarse antes de esto

**⚠️ CRITICAL**: No iniciar Phase 3+ hasta completar esta fase

- [X] T004 Añadir `passwordHash String` a `model User` y crear `model RevokedRefreshToken` (`jti` @id, `userId`, `revokedAt`, `expiresAt`, `@@index([expiresAt])`) en `backend/prisma/schema.prisma`; ejecutar `npx prisma migrate dev --name add_login_rbac` (y aplicar sobre `prisma/schema.test.prisma` si difiere) — schema validado (`prisma validate`) y aplicado al datasource de test (SQLite `db push`); migración real contra Postgres no ejecutada (no hay Postgres disponible en este entorno ni historial de `migrations/` previo — mismo estado que `001`, que tampoco corrió `migrate dev` nunca)
- [X] T005 [P] Extender `backend/src/adapters/idpAdapter.js`: añadir `issueTokenPair({userId, role})` (access JWT 15min + refresh JWT 7 días con `jti` uuid), `verifyRefreshToken(token)`, `revokeRefreshToken(jti, userId, expiresAt)` (usa Prisma `RevokedRefreshToken`), manteniendo `issueDevToken`/`verifyToken` existentes intactos
- [X] T006 [P] Registrar middleware `cookie-parser` en `backend/src/api/app.js`
- [X] T007 Modificar `backend/src/middleware/authn.js` para leer el JWT desde `req.cookies.access_token` (cookie httpOnly) en vez del header `Authorization: Bearer`, preservando la distinción 401 (`InvalidTokenError`) vs 503 (`IdpUnavailableError`)

**Checkpoint**: `authn`/`rbac` funcionan con cookies; `idpAdapter` puede emitir/verificar/revocar el par access+refresh — user stories pueden empezar

---

## Phase 3: User Story 1 - Iniciar sesión con credenciales válidas (Priority: P1) 🎯 MVP

**Goal**: Usuario con credenciales válidas se autentica y llega a la vista de su rol; la sesión persiste entre recargas vía refresh silencioso.

**Independent Test**: Enviar credenciales válidas de cada rol contra `POST /auth/login` y verificar cookies `access_token`/`refresh_token` emitidas con el rol correcto en el cuerpo de respuesta.

### Tests for User Story 1 ⚠️

> **Escribir estos tests PRIMERO, verificar que fallan antes de implementar**

- [X] T008 [P] [US1] Contract test `POST /auth/login` (200, cookies httpOnly `access_token`+`refresh_token`, body `LoginResult`) en `backend/tests/contract/auth.contract.test.js`
- [X] T009 [P] [US1] Integration test: login válido para `dispatcher`/`tecnico`/`supervisor` emite JWT con `role` correcto en `backend/tests/integration/login.test.js`
- [X] T010 [P] [US1] Integration test: `POST /auth/refresh` con `refresh_token` válido emite nuevo `access_token` (FR-002a) en `backend/tests/integration/refresh.test.js`
- [X] T011 [P] [US1] Frontend test: `Login.jsx` renderiza formulario email/password con clases Tailwind y hace submit en `frontend/tests/Login.test.jsx`

### Implementation for User Story 1

- [X] T012 [US1] Implementar `authService.login({email, password})` (bcrypt.compare contra `User.passwordHash`, llama `issueTokenPair`) en `backend/src/services/authService.js` (depende de T005)
- [X] T013 [US1] Implementar `authService.refresh(refreshToken)` (verifica denylist + expiración, rota par) en `backend/src/services/authService.js`
- [X] T014 [US1] Implementar router `POST /auth/login` y `POST /auth/refresh` (setean cookies httpOnly `secure`+`sameSite=strict`) en `backend/src/api/auth.js`, montado en `backend/src/api/app.js`
- [X] T015 [P] [US1] Implementar `authClient.login(email, password)` y `authClient.refresh()` (fetch `credentials: 'include'`) en `frontend/src/services/authClient.js`
- [X] T016 [US1] Implementar vista `Login.jsx` (formulario Tailwind, email+password) en `frontend/src/pages/Login.jsx`
- [X] T017 [US1] Implementar redirección post-login por rol (`dispatcher`→`DispatcherBoard`, `tecnico`→`TechnicianExecutionForm`, `supervisor`→`SupervisorReview`) en las rutas de React Router (`frontend/src/App.jsx` o equivalente de rutas ya existente)

**Checkpoint**: US1 funcional de extremo a extremo — login válido para los 3 roles, sesión persiste tras reload vía refresh

---

## Phase 4: User Story 2 - Rechazo de credenciales inválidas (Priority: P1)

**Goal**: Credenciales inválidas rechazadas con mensaje genérico; intentos excesivos limitados por rate limiting.

**Independent Test**: Enviar credenciales inválidas (email inexistente y password incorrecta) contra `POST /auth/login`, verificar 401 con mensaje idéntico en ambos casos; enviar 6 intentos en <15min para el mismo email y verificar 429 en el sexto.

### Tests for User Story 2 ⚠️

- [X] T018 [P] [US2] Contract test `POST /auth/login` con email inexistente y con password incorrecta → mismo 401 genérico en `backend/tests/contract/auth.contract.test.js`
- [X] T019 [P] [US2] Integration test: 6º intento fallido en 15min para el mismo email → 429 en `backend/tests/integration/login-ratelimit.test.js`

### Implementation for User Story 2

- [X] T020 [US2] Implementar rama de error en `authService.login`: mismo mensaje "Credenciales inválidas" tanto si el email no existe como si el password no coincide, sin distinguir en logs de respuesta en `backend/src/services/authService.js`
- [X] T021 [US2] Implementar middleware `loginRateLimit` (Map en memoria, 5 intentos/15min por email, 429 genérico) en `backend/src/middleware/loginRateLimit.js`, aplicado solo a `POST /auth/login` en `backend/src/api/auth.js`
- [X] T022 [US2] Mostrar mensaje de error genérico (401/429) en el formulario de `Login.jsx` sin filtrar causa en `frontend/src/pages/Login.jsx`

**Checkpoint**: US1 + US2 funcionan juntas — login exitoso y manejo de error/rate-limit correcto

---

## Phase 5: User Story 3 - Bloqueo de acceso a rutas fuera del rol (Priority: P2)

**Goal**: Verificar RBAC de doble capa con sesión real (401/403 en backend) y logout con revocación real del refresh token.

**Independent Test**: Con cookie `access_token` de rol `tecnico`, invocar directamente `POST /orders/{id}/approve` (reservado a `supervisor`) y verificar 403; hacer logout y reintentar `POST /auth/refresh` con el `refresh_token` previo, verificar 401 (denylist).

### Tests for User Story 3 ⚠️

- [X] T023 [P] [US3] Contract test: cookie `access_token` válida rol `tecnico` → 403 en `POST /orders/{id}/approve` en `backend/tests/contract/auth.contract.test.js`
- [X] T024 [P] [US3] Integration test: cookie ausente/expirada → 401 en cualquier endpoint protegido (reutilizando endpoints de `001`) en `backend/tests/integration/rbac-doublecheck.test.js`
- [X] T025 [P] [US3] Integration test: `POST /auth/logout` seguido de `POST /auth/refresh` con el mismo `refresh_token` → 401 (revocado vía denylist) en `backend/tests/integration/logout.test.js`

### Implementation for User Story 3

- [X] T026 [US3] Implementar `authService.logout(refreshToken)` (inserta `jti` en `RevokedRefreshToken` vía `revokeRefreshToken`) en `backend/src/services/authService.js`
- [X] T027 [US3] Implementar router `POST /auth/logout` (borra cookies `access_token`/`refresh_token` del cliente) en `backend/src/api/auth.js`
- [X] T028 [US3] Confirmar compatibilidad de `backend/src/middleware/rbac.js` con `req.user` poblado desde cookie (sin cambios esperados; ajustar si algún endpoint de `001` asumía header) en `backend/src/middleware/rbac.js`
- [X] T029 [US3] Añadir botón de logout (llama `authClient.logout()`, redirige a `Login.jsx`) en un componente de navegación compartido en `frontend/src/components/NavBar.jsx`

**Checkpoint**: Las 3 user stories funcionan de forma independiente y conjunta — login, rechazo/rate-limit, y RBAC+logout verificados

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Migración de vistas existentes a Tailwind (mandato de constitution v1.1.0), limpieza y trazabilidad

- [X] T030 [P] Migrar `DispatcherBoard.jsx`, `TechnicianExecutionForm.jsx`, `SupervisorReview.jsx`, `ClientOrders.jsx` y `OrdersList.jsx` (de `001`) a clases Tailwind, eliminando cualquier CSS ad-hoc, en `frontend/src/pages/*.jsx` y `frontend/src/components/*.jsx`
- [X] T031 [P] Añadir purga de `RevokedRefreshToken` vencidos al job existente en `backend/src/adapters/retentionJob.js`
- [X] T032 Actualizar `docs/traceability.md` con FR-001..FR-010 → AC-ID → archivo:test de este feature
- [X] T033 [P] Unit tests de `authService` (bcrypt compare, denylist hit/miss, expiración de refresh) en `backend/tests/unit/authService.test.js`
- [ ] T034 Ejecutar validación manual completa de `quickstart.md` (los 8 pasos) y registrar resultado — **NO ejecutado**: sin navegador ni Postgres real disponibles en este entorno. Cobertura equivalente automatizada: 30/30 suites backend (74 tests) + 6/6 tests frontend + `vite build` limpio + `eslint src` sin errores. Pendiente: click-through real en navegador (pasos 1-8 de quickstart.md).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — puede iniciar de inmediato
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEA todas las user stories
- **User Stories (Phase 3-5)**: Todas dependen de Foundational
  - US1 y US2 comparten el mismo endpoint `POST /auth/login` — US2 debe implementarse después de US1 (mismo archivo `authService.js`/`auth.js`), aunque sus tests son independientes
  - US3 depende de que `authn`/`rbac` (Foundational) ya lean cookies; es independiente de US1/US2 en código pero requiere un login funcional para su propio test de logout
- **Polish (Phase 6)**: Depende de que las user stories deseadas estén completas

### User Story Dependencies

- **US1 (P1)**: Inicia tras Foundational — sin dependencia de otras stories
- **US2 (P1)**: Inicia tras Foundational — extiende el mismo endpoint de US1 (no paralelizable con US1 a nivel de archivo, sí a nivel de tests)
- **US3 (P2)**: Inicia tras Foundational — independiente en código; su test de logout requiere un login previo (usa el endpoint de US1)

### Within Each User Story

- Tests escritos y en rojo antes de implementación
- Servicios (`authService`) antes de routers (`auth.js`)
- Backend antes de integración frontend

### Parallel Opportunities

- T003 (Tailwind config) en paralelo con T001/T002 una vez instaladas dependencias
- T005, T006 en paralelo dentro de Foundational (T007 depende de T006)
- Todos los tests [P] de una story en paralelo entre sí
- T015 (frontend authClient) en paralelo con T012-T014 (backend) dentro de US1
- T030, T031, T033 en paralelo dentro de Polish

---

## Parallel Example: User Story 1

```bash
# Tests en paralelo:
Task: "Contract test POST /auth/login en backend/tests/contract/auth.contract.test.js"
Task: "Integration test login válido 3 roles en backend/tests/integration/login.test.js"
Task: "Integration test refresh en backend/tests/integration/refresh.test.js"
Task: "Frontend test Login.jsx en frontend/tests/Login.test.jsx"

# Backend y frontend en paralelo tras servicios base:
Task: "authClient.login/refresh en frontend/src/services/authClient.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO)
3. Completar Phase 3: US1
4. **DETENER Y VALIDAR**: login exitoso end-to-end para los 3 roles, sesión persiste tras reload
5. Deploy/demo si está listo

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → validar independientemente → demo (MVP)
3. US2 → validar independientemente → demo (manejo de error + rate limit)
4. US3 → validar independientemente → demo (RBAC verificado con sesión real + logout)
5. Polish → Tailwind en todo el proyecto + trazabilidad

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- [Story] mapea cada tarea a su user story para trazabilidad
- Verificar que los tests fallan antes de implementar (constitution Principio III)
- Cada checkpoint es un punto de demo válido, no solo una marca interna
- Evitar: tareas vagas, conflictos de mismo archivo entre tareas [P], dependencias cruzadas entre stories que rompan independencia
