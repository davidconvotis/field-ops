# Research: Gestión de Órdenes de Trabajo

Todas las incógnitas de Technical Context quedan resueltas abajo. No quedan marcadores `NEEDS CLARIFICATION`.

## 1. Framework backend: Express vs NestJS

- **Decision**: Express.
- **Rationale**: La constitución permite ambos ("a elección del autor"). El slice tiene ~8 endpoints y 4 roles; NestJS aporta DI/decoradores y estructura modular pensada para dominios más grandes, con curva de aprendizaje y ceremonia que no se justifican aquí. Express + middleware explícito (`authn`, `rbac`) es más directo de testear con Supertest y de mantener trazable a un único archivo de rutas por recurso (Principio II/III).
- **Alternatives considered**: NestJS — rechazado por sobre-ingeniería para el tamaño del slice (Principio V, "preferible una feature bien hecha que tres incompletas" aplica también a no sobre-construir infraestructura).

## 2. Persistencia y ORM

- **Decision**: PostgreSQL en producción, SQLite en memoria para tests, ambos vía Prisma (mismo schema, migraciones versionadas).
- **Rationale**: Constitución fija PostgreSQL/SQLite explícitamente. Prisma da migraciones + tipado alineado a TypeScript opcional en los adaptadores, y soporta ambos motores con el mismo `schema.prisma`, cumpliendo "arranque con un único comando" (migrate + seed).
- **Alternatives considered**: Knex (más boilerplate manual de tipos), TypeORM (más pesado, decorators adicionales sin beneficio claro sobre Prisma para este tamaño).

## 3. Autenticación / IdP externo

- **Decision**: Bearer JWT verificado por middleware `authn`; claim `role` en el payload. Adaptador `idpAdapter` con dos implementaciones: producción (verifica firma contra JWKS del IdP externo real) y dev/test (emite/verifica tokens firmados con secreto local para los 4 roles).
- **Rationale**: Spec asume "sistema de autenticación/IdP externo reutilizable que emite tokens verificables" (Assumptions) — no se re-implementa login, solo verificación. JWT permite diferenciar limpiamente 401 (firma/expiración inválida) de 503 (JWKS endpoint inalcanzable — NFR-03b) sin acoplar el dominio al proveedor concreto.
- **Alternatives considered**: Sesiones server-side con cookie — rechazado porque el spec ya asume un IdP externo emisor de tokens, no un sistema de sesión propio.

## 4. Cifrado en reposo (NFR-02/02b) — KMS

- **Decision**: Interfaz `encryptionAdapter` con dos implementaciones: producción (envelope encryption vía AWS KMS o equivalente), dev/test (AES-256-GCM local con `node:crypto`, data key desde variable de entorno, nunca en el repo).
- **Rationale**: Permite correr y testear el slice completo sin credenciales cloud reales, preservando el comportamiento contractual: si el adaptador falla (simulable en tests forzando una excepción), la escritura completa se aborta con `503` y nunca se persiste en claro (NFR-02b) — el contrato de la interfaz es idéntico en ambos entornos.
- **Alternatives considered**: Cifrado a nivel de columna en Postgres (`pgcrypto`) — rechazado como único mecanismo porque no cubre el cifrado de las fotos (blobs), que viven en el adaptador de almacenamiento, no en la base de datos.

## 5. Almacenamiento de fotos de evidencia

- **Decision**: Interfaz `storageAdapter` (put/get/delete + `getSignedUrl`), con implementación prod = almacenamiento S3-compatible, dev/test = filesystem local bajo directorio ignorado por git. Timeout explícito configurable (constante `STORAGE_TIMEOUT_MS`) envolviendo cada llamada.
- **Rationale**: NFR-06b exige no marcar la ejecución como `pendiente_de_revision` si la foto no confirmó persistencia, y responder 502/503/504 explícitos ante fallo/timeout — la interfaz común permite testear esos tres caminos de fallo sin depender de un bucket real en CI.
- **Alternatives considered**: Subir directo a un bucket real incluso en tests — rechazado por fragilidad/latencia de CI y por acoplar tests unitarios/integración a credenciales cloud.

## 6. Idempotencia y bloqueo optimista

- **Decision**: `idempotencyKey` con índice único en la tabla `ExecutionRecord`; al recibir un envío se busca por key: si existe y el payload (hash de fotos+notas+orderId) coincide → se devuelve el resultado original (200); si existe con payload distinto → 409 (FR-012b). Transiciones de estado (`aprobada`/`rechazada`/reasignación) usan una columna `version` (optimistic lock): `UPDATE ... WHERE id=? AND status=? AND version=?`; 0 filas afectadas → 409 con el estado final real en el cuerpo (FR-016b, FR-05b).
- **Rationale**: Es el patrón estándar (similar a Stripe idempotency keys) para evitar duplicar registros ante reintentos de red, y el optimistic lock es la forma más simple y testeable de garantizar "solo la primera transacción tiene efecto" sin bloqueos pesimistas que degraden NFR-05 (P95 ≤ 300ms).
- **Alternatives considered**: Locks pesimistas (`SELECT ... FOR UPDATE`) — rechazados por mayor riesgo de contención bajo carga nominal (100 req/s) sin beneficio adicional sobre optimistic lock para este volumen.

## 7. Resumen automático IA (FR-020, Principio IV)

- **Decision**: `summaryService` con contrato explícito: entrada = notas de técnico + longitud en palabras; salida = resumen o mensaje de fallback fijo (`"Evidencia insuficiente para generar resumen"`) si `< 20 palabras`, notas vacías, o el proveedor de resumen falla/excede 5s. Implementación inicial: función determinista basada en reglas (extracción de primeras N frases relevantes), con la interfaz preparada para sustituirse por un modelo real sin cambiar el contrato. Golden cases en `/evals/summary/`: caso nominal, caso de evidencia insuficiente, caso de notas ambiguas — antes de habilitar en producción.
- **Rationale**: Cumple Principio IV (no invención, fallback explícito, evals con umbrales antes de producción) sin introducir una dependencia externa de LLM no solicitada explícitamente por el spec ni el brief del bootcamp; la interfaz queda lista para intercambiar el motor de resumen.
- **Alternatives considered**: Integrar directamente una API de LLM de terceros — rechazado en esta fase por añadir una dependencia externa y credenciales fuera del alcance decidido en Assumptions del spec ("componente de fase 2").

## 8. Testing

- **Decision**: Jest + Supertest para contract/integration/unit de backend (contract tests generados desde `contracts/openapi.yaml`); React Testing Library para frontend. Cobertura: cada AC de `spec.md` debe mapear a un test nombrado con su ID (Principio III), registrado en `/docs/traceability.md`.
- **Rationale**: Mandado explícitamente por la constitución (sección "Tests").
- **Alternatives considered**: N/A — decisión fija por la constitución, no discrecional.

## 9. Job de retención/borrado (NFR-04c)

- **Decision**: `node-cron` job diario que identifica fotos y registros de auditoría con antigüedad > 12 meses: purga el blob del `storageAdapter` y anula `storageKey` en la fila (manteniendo metadata de auditoría no sensible), sin eliminar la fila de auditoría en sí (la fila registra que hubo una foto, no su contenido).
- **Rationale**: Permite cumplir el borrado de contenido sensible (NFR-04c) sin romper la trazabilidad histórica de auditoría (NFR-04) que exige que "todo cambio de estado" quede registrado con retención mínima 12 meses — el borrado afecta el blob, no el registro de que la transición ocurrió.
- **Alternatives considered**: Borrado lazy on-read (verificar antigüedad al leer) — rechazado porque no garantiza el borrado si nadie vuelve a leer esa orden, violando el "borrado automático" exigido explícitamente.
