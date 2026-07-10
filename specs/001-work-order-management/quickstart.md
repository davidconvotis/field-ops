# Quickstart: Gestión de Órdenes de Trabajo

Guía de validación end-to-end del slice. No contiene código de implementación — ver
`data-model.md` y `/contracts/openapi.yaml` para el detalle de datos/API, y `tasks.md`
(generado por `/speckit-tasks`) para el desglose de trabajo.

## Prerrequisitos

- Node.js 20+
- PostgreSQL local (o solo SQLite para el modo test-only, sin Docker)
- Variables de entorno (`.env`, no versionado): `DATABASE_URL`, `JWT_DEV_SECRET`,
  `ENCRYPTION_DATA_KEY` (dev), `STORAGE_TIMEOUT_MS`, `RETENTION_MONTHS=12`

## Arranque (un único comando por operación, constitución)

```bash
# instalar + migrar + seed (usuarios de los 4 roles, tokens dev)
npm run setup

# levantar backend + frontend
npm run dev

# correr toda la suite (contract + integration + unit + frontend)
npm test
```

## Escenarios de validación (mapeados a User Stories de spec.md)

### US1 — Técnico registra ejecución

1. Con token de dispatcher, `POST /api/v1/orders` → orden en `sin_asignar`.
2. Con token de dispatcher, `PATCH /api/v1/orders/{id}/assign` con `technicianId` de un técnico activo → `status=sin_asignar` (aún, reasignación no cambia estado), `technicianId` seteado.
3. Con token del técnico asignado, `POST /api/v1/orders/{id}/executions` (header `Idempotency-Key`, ≥1 foto jpg/png real, `notes` no vacío) → `201`, orden pasa a `pendiente_de_revision`.
4. Repetir el mismo request con el mismo `Idempotency-Key` → `200` con el mismo resultado, sin duplicar (FR-012).
5. Repetir con mismo `Idempotency-Key` pero `notes` distinto → `409` (FR-012b).
6. Intentar sin fotos → `400`. Intentar con un archivo `.txt` renombrado a `.jpg` → `415`, y verificar que ninguna foto del envío quedó persistida (todo-o-nada, FR-009).

### US2 — Dispatcher crea y (re)asigna

1. `POST /api/v1/orders` sin token de dispatcher (usar token de técnico) → `403` (FR-000).
2. `PATCH /api/v1/orders/{id}/assign` con `technicianId` de un técnico `activo=false` → `422` (FR-004).
3. Aprobar una orden (ver US3) y luego intentar reasignarla → `422` (FR-003).
4. `PATCH /api/v1/technicians/{id}/activo` con `activo=false` sobre un técnico con órdenes en `sin_asignar`/`pendiente_de_revision` → verificar que esas órdenes vuelven a `sin_asignar` sin técnico (FR-004d) y que queda una entrada en audit log.

### US3 — Supervisor aprueba o rechaza

1. Con orden en `pendiente_de_revision`, `POST /api/v1/orders/{id}/reject` sin `reason` → `400` (FR-014).
2. Con `reason` válido → `200`, orden `rechazada` (terminal).
3. Reintentar aprobar/rechazar la misma orden → `409` no-op (FR-016).
4. Simular carrera: dos requests casi simultáneos, uno `approve` y otro `reject`, sobre la misma orden en `pendiente_de_revision` → solo uno gana (`200`), el otro recibe `409` con el estado final real en el cuerpo; ambos quedan en audit log (FR-016b).

### US4 — Listado por rol

1. `GET /api/v1/orders` con token de cliente → solo sus órdenes.
2. `GET /api/v1/orders` con token de técnico → solo las asignadas a él.
3. `GET /api/v1/orders` con token de dispatcher/supervisor → todas.
4. `GET /api/v1/orders/{idInexistente}` con token de cliente sin relación a esa orden → `404` (rol con acceso potencial a la ruta); con token de un rol sin acceso a órdenes en absoluto (si existiera) → `403` uniforme (FR-019).

### US5 — Resumen automático (fase 2, FR-020)

1. Abrir una orden con notas ≥20 palabras → `GET /api/v1/orders/{id}` incluye `summary` en ≤5s.
2. Abrir una orden con notas vacías o <20 palabras → respuesta incluye fallback explícito, nunca un resumen inventado (Principio IV).
3. Forzar fallo/timeout del `summaryService` (flag de test) → `200` con `summaryUnavailable=true`, la vista no se bloquea.

## Verificación de seguridad (NFR-01/02/02b/03/03b)

- Confirmar que una conexión sin TLS es rechazada por el servidor (NFR-01).
- Confirmar (con el adaptador de cifrado en modo "fallo simulado") que ninguna foto se persiste en claro — la operación responde `503` (NFR-02b).
- Confirmar que un JWT expirado responde `401`, y que un fallo simulado del JWKS/IdP responde `503`, nunca `401` (NFR-03b).

## Definition of Done de este quickstart

- Todos los escenarios anteriores tienen un test de contrato o integración correspondiente en `backend/tests/` (Principio II/III).
- `/docs/traceability.md` referencia cada AC de `spec.md` a su test (Principio III) — se puebla en `/speckit-tasks`/implementación.
- `/evals/summary/` contiene los 3 golden cases de FR-020 antes de habilitar el resumen en producción (Principio IV).
