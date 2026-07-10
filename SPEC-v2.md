# Spec v2: Gestión de Órdenes de Trabajo

Revisión de SPEC.md incorporando resolución de preguntas abiertas y edge cases (edge-cases.md). Cambios marcados `[NUEVO]` / `[MOD]` respecto a v1.

## Decisiones de producto (resuelven Preguntas Abiertas de SPEC.md)

| # | Pregunta | Decisión |
|---|----------|----------|
| 1 | Creación/asignación inicial de orden | Dispatcher crea la orden **sin técnico asignado** (estado inicial "sin asignar"). |
| 2 | ¿"Rechazada" es terminal? | **Sí, terminal.** No hay reenvío de ejecución tras rechazo. |
| 3 | Reasignación en "rechazada"/"pendiente de revisión" | Permitida en **"pendiente de revisión"**. Bloqueada en **"rechazada"** (terminal, igual que "aprobada"). |
| 4 | Notas de técnico | **Obligatorias** en el registro de ejecución (junto a foto). |
| 5 | Alcance de "sus órdenes" | Técnico ve solo **sus órdenes asignadas**. Dispatcher y supervisor ven **todas las órdenes**, sin restricción de equipo/región. |
| 6 | Cifrado de fotos | **Sí**, mismo alcance que NFR-02 (AES-256 en reposo). |
| 7 | Retención de fotos | **12 meses**, igual que audit log (NFR-04). Borrado automático tras ese periodo. |

## Estados de la orden

`sin_asignar → pendiente_de_revision → {aprobada | rechazada}`

- `sin_asignar`: creada por dispatcher, sin técnico. Transición a `pendiente_de_revision` ocurre solo vía envío de ejecución (implica que debe tener técnico asignado antes — ver FR-04b).
- `aprobada`: **terminal**. No reasignable (FR-05), no re-ejecutable (E-09).
- `rechazada`: **terminal** `[MOD respecto a v1, resuelve pregunta #2]`. No reasignable, no reenviable.

## Functional Requirements

**FR-01** — WHEN un técnico autenticado envía el registro de ejecución de una orden sin ninguna foto adjunta THE sistema SHALL rechazar el envío (`400 Bad Request`) indicando que se requiere mínimo 1 foto de evidencia.

**FR-01b** `[NUEVO, resuelve E-05]` — WHEN el registro de ejecución incluye archivos adjuntos donde al menos uno no es imagen válida (jpg/png/heic) THE sistema SHALL rechazar el envío completo (`415 Unsupported Media Type`), incluso si otros archivos adjuntos sí son válidos. No se acepta envío parcial.

**FR-02** — WHEN un técnico autenticado envía el registro de ejecución de una orden asignada a él, en estado `pendiente_de_revision`-compatible (ver FR-02b), con al menos 1 foto válida y notas de texto no vacías THE sistema SHALL persistir la ejecución con estado `pendiente_de_revision` y timestamp de envío. `[MOD: notas ahora obligatorias, resuelve pregunta #4]`

**FR-02b** `[NUEVO, resuelve E-09]` — WHEN un técnico envía ejecución de una orden que ya está en estado `aprobada` o `rechazada` THE sistema SHALL rechazar la operación (`409 Conflict`, mensaje "orden en estado terminal"), sin reescribir estado ni timestamps existentes.

**FR-03** — WHEN un técnico intenta registrar la ejecución de una orden que no está asignada a él THE sistema SHALL rechazar la operación con error de autorización (`403 Forbidden`).

**FR-03b** `[NUEVO, resuelve C-02]` — La validación de asignación de FR-03 SHALL ejecutarse de forma atómica en el momento de la escritura (no solo en lectura previa de UI). Si la orden fue reasignada a otro técnico entre la carga del formulario y el envío, THE sistema SHALL rechazar con `403 Forbidden` (motivo: "orden reasignada durante operación").

**FR-04** — WHEN un dispatcher autenticado reasigna una orden a otro técnico THE sistema SHALL actualizar el campo técnico-asignado y registrar el cambio con id del dispatcher, técnico anterior, técnico nuevo y timestamp.

**FR-04b** `[NUEVO, resuelve pregunta #1]` — WHEN un dispatcher autenticado crea una nueva orden THE sistema SHALL persistirla en estado `sin_asignar` sin técnico asignado. La asignación de primer técnico usa el mismo mecanismo que FR-04 (reasignación desde `sin_asignar`).

**FR-04c** `[NUEVO, resuelve E-10]` — WHEN un dispatcher reasigna una orden a un `tecnicoId` que no existe o está inactivo THE sistema SHALL rechazar la operación (`422 Unprocessable Entity`) antes de persistir cualquier cambio.

**FR-05** — WHEN un dispatcher intenta reasignar una orden en estado `aprobada` **o `rechazada`** THE sistema SHALL rechazar la reasignación con error de estado inválido (`422 Unprocessable Entity`). `[MOD: se extiende bloqueo a "rechazada", resuelve pregunta #3 / E-03]`

**FR-05b** `[NUEVO, resuelve C-04]` — La validación de estado de FR-05 SHALL ser atómica al momento de escritura. Si la orden pasó a `aprobada` entre la lectura previa y el intento de reasignación, THE sistema SHALL rechazar (`409 Conflict`) aunque la lectura previa mostrara `pendiente_de_revision`.

**FR-06** — WHEN un supervisor autenticado aprueba una orden en estado `pendiente_de_revision` THE sistema SHALL cambiar el estado a `aprobada` y registrar id del supervisor y timestamp.

**FR-06b** `[NUEVO, resuelve E-02, C-01]` — WHEN un supervisor intenta aprobar una orden que no está en estado `pendiente_de_revision` (ya `aprobada` o `rechazada`) THE sistema SHALL rechazar como no-op (`409 Conflict`), sin re-aplicar timestamp ni id de supervisor. La transición de estado SHALL usar chequeo atómico (optimistic lock / check-and-set) para que, ante dos aprobaciones/rechazos simultáneos, solo la primera transacción tenga efecto.

**FR-07** — WHEN un supervisor autenticado rechaza una orden en estado `pendiente_de_revision` sin motivo de rechazo, o con motivo vacío/solo espacios en blanco THE sistema SHALL rechazar la operación (`400 Bad Request`) y exigir motivo obligatorio no vacío tras normalización (trim). `[MOD: incluye validación de whitespace, resuelve E-07]`

**FR-08** — WHEN un supervisor autenticado rechaza una orden en estado `pendiente_de_revision` con motivo válido THE sistema SHALL cambiar el estado a `rechazada` (terminal) y registrar motivo, id del supervisor y timestamp.

**FR-08b** `[NUEVO, resuelve E-01]` — WHEN un supervisor intenta rechazar una orden que no está en estado `pendiente_de_revision` THE sistema SHALL rechazar (`409 Conflict`), sin transicionar estado.

**FR-09** — WHEN un usuario autenticado (rol "cliente") solicita el listado de sus órdenes THE sistema SHALL devolver únicamente las órdenes donde ese usuario es el propietario/cliente asociado.

**FR-09b** `[NUEVO, resuelve pregunta #5]` — WHEN un técnico solicita el listado de órdenes THE sistema SHALL devolver únicamente las órdenes asignadas a él. WHEN un dispatcher o supervisor solicita el listado THE sistema SHALL devolver todas las órdenes, sin restricción de equipo/región (fuera de alcance: modelo de equipos/regiones).

**FR-09c** `[NUEVO, resuelve E-08]` — WHEN cualquier operación (ejecutar/aprobar/rechazar/reasignar/consultar) referencia un `orderId` inexistente THE sistema SHALL verificar autorización y existencia de forma consistente para no filtrar existencia a usuarios sin permiso sobre esa orden. Si el usuario tiene rol con acceso potencial a la ruta: `404 Not Found`. Si el rol no tendría acceso a ese tipo de orden en ningún caso: `403 Forbidden` uniforme (no revelar si existe).

**FR-10** *(opcional, fase 2)* — WHEN un supervisor abre una orden con notas de técnico registradas THE sistema SHALL generar y mostrar un resumen automático basado en esas notas en P95 ≤ 5 s. `[NUEVO comportamiento de fallo, resuelve X-03]` Si el servicio de resumen no responde en 5 s o falla, THE sistema SHALL degradar con gracia: mostrar la orden sin resumen (`200 OK` + indicador "resumen no disponible"), sin bloquear la vista del supervisor.

### Concurrencia — subida de fotos

**FR-11** `[NUEVO, resuelve C-06]` — WHEN un técnico sube múltiples fotos en paralelo para una misma ejecución y al menos una falla validación de tipo (NFR-08) THE sistema SHALL aplicar semántica todo-o-nada: revertir (rollback) las fotos ya persistidas de ese envío y rechazar la ejecución completa (`415 Unsupported Media Type`). No se admite envío parcial de ejecución con subset de fotos válidas.

**FR-12** `[NUEVO, resuelve C-05]` — La operación de envío de ejecución (FR-02) SHALL ser idempotente: WHEN un técnico reintenta el mismo envío (mismo `idempotencyKey`) tras timeout de red THE sistema SHALL devolver el resultado del envío original (`200 OK`, sin duplicar registro) si el primer envío tuvo éxito, o rechazar (`409 Conflict`) si el estado ya no permite el envío.

### Fuera de alcance (sin cambios respecto a v1)
- Dashboard de métricas de productividad.
- Notificaciones push a técnicos.
- Modelo de equipos/regiones para filtrado de dispatcher/supervisor (ver FR-09b).

## Non-Functional Requirements

**NFR-01 (Seguridad — transporte)** — Todo tráfico cliente-servidor SHALL usar TLS 1.2 o superior; conexiones sin TLS SHALL ser rechazadas.

**NFR-02 (Seguridad — datos en reposo)** — Los datos de cliente (nombre, dirección, contacto) **y las fotos de evidencia** SHALL estar cifrados en reposo con AES-256. `[MOD: se extiende a fotos, resuelve pregunta #6]`

**NFR-02b** `[NUEVO, resuelve X-02]` — WHEN el servicio de cifrado (KMS) falla al momento de persistir datos de cliente o fotos THE sistema SHALL fallar la escritura completa (`503 Service Unavailable`). Nunca se persiste en claro como fallback.

**NFR-03 (Seguridad — autorización)** — Cada endpoint SHALL requerir autenticación válida y aplicar control de acceso por rol (técnico, dispatcher, supervisor, usuario); el 100% de los endpoints SHALL rechazar peticiones sin token válido con `401`.

**NFR-03b** `[NUEVO, resuelve X-04]` — El sistema SHALL diferenciar "token inválido" (`401 Unauthorized`) de "fallo del validador externo de tokens" (`503 Service Unavailable`). Un fallo del IdP externo no SHALL exponerse como `401` (evitar denegación de acceso engañosa ante fallo de infraestructura).

**NFR-04 (Auditoría)** — Todo cambio de estado de una orden (envío, reasignación, aprobación, rechazo) SHALL quedar registrado en log de auditoría con actor, acción y timestamp, retención mínima 12 meses.

**NFR-04b** `[NUEVO, resuelve X-05, C-03]` — El registro en audit log SHALL ser atómico con el cambio de estado (todo-o-nada). WHEN el servicio de auditoría falla al momento de un cambio de estado THE sistema SHALL bloquear (rollback) la operación de cambio de estado (`503 Service Unavailable`), nunca aplicar el cambio sin su registro correspondiente. En reasignaciones concurrentes (C-03) donde hay condición de carrera legítima, AMBOS intentos SHALL quedar reflejados en el audit log aunque solo uno persista como estado final.

**NFR-04c** `[NUEVO]` — Las fotos de evidencia SHALL tener retención de 12 meses, alineada con NFR-04, con borrado automático posterior. `[Resuelve pregunta #7]`

**NFR-05 (Rendimiento — API)** — Operaciones CRUD sobre órdenes (excluyendo subida de fotos) SHALL responder P95 ≤ 300 ms, P99 ≤ 800 ms bajo carga nominal (100 req/s).

**NFR-06 (Rendimiento — subida de evidencia)** — Subida de foto hasta 10 MB SHALL completarse P95 ≤ 3 s con conexión de referencia 10 Mbps.

**NFR-06b** `[NUEVO, resuelve X-01, X-07]` — WHEN el servicio de almacenamiento de fotos (S3/blob) falla o hace timeout durante subida THE sistema SHALL: (a) no marcar la ejecución como `pendiente_de_revision` si la foto no confirmó persistencia; (b) no dejar la orden en estado inconsistente (foto referenciada pero inexistente); (c) responder `503 Service Unavailable` o `502 Bad Gateway`. Todo servicio externo dependiente de estas operaciones SHALL tener timeout explícito configurado (no espera indefinida); exceder ese timeout responde `504 Gateway Timeout` y se registra como violación de NFR-05/NFR-06 para monitoreo.

**NFR-07 (Disponibilidad)** — El sistema SHALL mantener disponibilidad mensual ≥ 99.5%.

**NFR-08 (Integridad de evidencia)** — El sistema SHALL validar que cada archivo adjunto sea imagen real (jpg/png/heic) — validación de contenido/magic bytes, no solo extensión `[MOD, resuelve E-06]` — y rechazar cualquier archivo que no cumpla con `415`.

**NFR-08b** `[NUEVO, resuelve X-06]` — Si la validación de NFR-08 delega en un servicio externo de escaneo (antivirus/verificación de tipo) y este falla o hace timeout THE sistema SHALL rechazar el archivo explícitamente (`503 Service Unavailable`) — nunca aceptar un archivo sin validación completa por fallback inseguro. Reintento acotado permitido antes de rechazar.

## Trazabilidad edge-cases → requisitos

| Edge case | Requisito que lo cubre |
|---|---|
| C-01 | FR-06b |
| C-02 | FR-03b |
| C-03 | NFR-04b |
| C-04 | FR-05b |
| C-05 | FR-12 |
| C-06 | FR-11 |
| E-01 | FR-08b |
| E-02 | FR-06b |
| E-03 | FR-05 (extendido) |
| E-04 | Resuelto: rechazada terminal, no hay reenvío |
| E-05 | FR-01b |
| E-06 | NFR-08 (mod) |
| E-07 | FR-07 (mod) |
| E-08 | FR-09c |
| E-09 | FR-02b |
| E-10 | FR-04c |
| X-01 | NFR-06b |
| X-02 | NFR-02b |
| X-03 | FR-10 |
| X-04 | NFR-03b |
| X-05 | NFR-04b |
| X-06 | NFR-08b |
| X-07 | NFR-06b |
