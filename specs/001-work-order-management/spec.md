# Feature Specification: Gestión de Órdenes de Trabajo

**Feature Branch**: `001-work-order-management`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "SPEC-v2.md — Spec v2: Gestión de Órdenes de Trabajo (revisión de SPEC.md incorporando resolución de preguntas abiertas y edge cases de edge-cases.md)"

## Clarifications

### Session 2026-07-10

- Q: FR-004 rechaza asignar un "tecnicoId inexistente o inactivo" pero no define qué hace a un técnico "inactivo" ni quién lo controla → A: Inactivo = campo `activo` (booleano) en la entidad Usuario, que dispatcher/admin alterna manualmente por cualquier motivo (baja, suspensión, licencia).
- Q: No existe flujo de cancelación de una orden por parte de cliente o dispatcher (H-006) → A: Fuera de alcance en esta versión; una orden solo se cierra vía aprobación o rechazo del ciclo normal, no hay estado/acción de cancelación.
- Q: FR-012 no define qué ocurre si el mismo `idempotencyKey` se reutiliza para un `orderId`/payload distinto (H-008) → A: El sistema rechaza (`409 Conflict`, "idempotency key ya usado con payload distinto"); nunca reutiliza ni sobrescribe el resultado de otro envío.
- Q: No se especifica qué ocurre con las órdenes asignadas a un técnico cuando este pasa a `activo = false` (H-009) → A: Reasignación automática inmediata: toda orden en `sin_asignar` o `pendiente_de_revision` asignada a ese técnico vuelve a `sin_asignar` (sin técnico) en el mismo momento de la desactivación.
- Q: FR-016 cubre aprobaciones/rechazos idénticos simultáneos pero no el caso de un supervisor A aprobando y un supervisor B rechazando la misma orden casi al mismo tiempo (H-011) → A: Extiende FR-016 — gana la primera transacción en comprometerse (check-and-set); el perdedor recibe `409 Conflict` con el estado final resultante en el cuerpo de la respuesta; ambos intentos quedan en el audit log.

### Session 2026-07-10 (ronda 2 — revisión adversarial)

- Q: Los NFR de seguridad/atomicidad de SPEC-v2.md (cifrado, TLS, atomicidad audit-log, fallos KMS/IdP/storage/antivirus) solo existían como narrativa en Edge Cases, sin FR-ID trazable (H-001) → A: Se promueven a sección formal `Non-Functional Requirements`, trasladando NFR-01 a NFR-08b de SPEC-v2 con sus mismos códigos HTTP y condiciones.
- Q: Ningún FR declaraba explícitamente el rechazo cross-rol (p.ej. técnico invocando creación/aprobación reservada a dispatcher/supervisor) (H-002) → A: Se añade un único FR transversal (FR-000) que exige verificación de rol en cada endpoint: token ausente/inválido → 401; rol válido sin permiso sobre la operación → 403.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Técnico registra ejecución de orden (Priority: P1)

Un técnico autenticado, con una orden asignada, registra la ejecución adjuntando al menos una foto de evidencia y notas de texto obligatorias. El sistema valida el contenido de las fotos (no solo la extensión) y pasa la orden a estado "pendiente de revisión".

**Why this priority**: Es el flujo núcleo del sistema — sin registro de ejecución no hay nada que aprobar/rechazar. Es el evento que dispara todo el ciclo de vida de la orden.

**Independent Test**: Puede probarse de forma aislada creando una orden en `sin_asignar`, asignándola a un técnico, y enviando un registro de ejecución con 1 foto válida y notas no vacías — se verifica la transición a `pendiente_de_revision` con timestamp.

**Acceptance Scenarios**:

1. **Given** una orden asignada al técnico en estado `pendiente_de_revision`-compatible, **When** el técnico envía ejecución con ≥1 foto válida y notas no vacías, **Then** el sistema persiste la ejecución, transiciona la orden a `pendiente_de_revision` y registra el timestamp de envío.
2. **Given** una orden asignada al técnico, **When** el técnico envía ejecución sin ninguna foto adjunta, **Then** el sistema rechaza el envío (400) exigiendo mínimo 1 foto.
3. **Given** una orden asignada al técnico, **When** el técnico adjunta varios archivos y al menos uno no es imagen válida (jpg/png/heic, validado por contenido), **Then** el sistema rechaza el envío completo (415) y no persiste ninguna foto del envío (todo-o-nada, incluye rollback de fotos ya subidas).
4. **Given** una orden asignada al técnico, **When** el técnico envía ejecución sin notas o con notas vacías, **Then** el sistema rechaza el envío (400) exigiendo notas obligatorias.
5. **Given** una orden ya en estado `aprobada` o `rechazada`, **When** el técnico intenta enviar ejecución, **Then** el sistema rechaza la operación (409) sin alterar estado ni timestamps existentes.
6. **Given** una orden asignada a otro técnico, **When** el técnico intenta registrar ejecución sobre ella, **Then** el sistema rechaza con error de autorización (403), incluso si la orden fue reasignada entre la carga del formulario y el envío.
7. **Given** un envío de ejecución exitoso previo, **When** el técnico reintenta el mismo envío (mismo idempotency key) tras timeout de red, **Then** el sistema devuelve el resultado original (200, sin duplicar registro) o rechaza (409) si el estado ya no permite el envío.

---

### User Story 2 - Dispatcher crea y (re)asigna órdenes (Priority: P1)

Un dispatcher autenticado crea nuevas órdenes (sin técnico asignado inicialmente) y asigna o reasigna técnicos a órdenes que aún no son terminales.

**Why this priority**: Sin asignación no hay técnico que pueda ejecutar la orden — es el segundo eslabón imprescindible del flujo, previo a la ejecución (US1).

**Independent Test**: Puede probarse de forma aislada creando una orden (verificando que queda `sin_asignar`) y luego asignándola/reasignándola a un técnico activo, verificando el registro de auditoría del cambio (dispatcher, técnico anterior, técnico nuevo, timestamp).

**Acceptance Scenarios**:

1. **Given** un dispatcher autenticado, **When** crea una nueva orden, **Then** el sistema la persiste en estado `sin_asignar` sin técnico asignado.
2. **Given** una orden en `sin_asignar` o `pendiente_de_revision`, **When** el dispatcher la (re)asigna a un técnico activo existente, **Then** el sistema actualiza el técnico asignado y registra el cambio (id dispatcher, técnico anterior, técnico nuevo, timestamp).
3. **Given** una orden en `aprobada` o `rechazada`, **When** el dispatcher intenta reasignarla, **Then** el sistema rechaza la reasignación (422) por estado inválido/terminal — incluso si la orden pasó a `aprobada` entre la lectura previa y el intento (409 en ese caso de carrera).
4. **Given** un `tecnicoId` inexistente o inactivo, **When** el dispatcher intenta asignarlo a una orden, **Then** el sistema rechaza la operación (422) antes de persistir cualquier cambio.

---

### User Story 3 - Supervisor aprueba o rechaza orden (Priority: P1)

Un supervisor autenticado revisa una orden en `pendiente_de_revision` y la aprueba o la rechaza (con motivo obligatorio), dejando el estado terminal correspondiente.

**Why this priority**: Cierra el ciclo de vida de la orden; sin esta capacidad el trabajo del técnico nunca queda validado ni auditado como completo.

**Independent Test**: Puede probarse de forma aislada llevando una orden a `pendiente_de_revision` (vía US1) y luego aprobándola o rechazándola, verificando la transición a estado terminal y el registro de auditoría (supervisor, timestamp, motivo si aplica).

**Acceptance Scenarios**:

1. **Given** una orden en `pendiente_de_revision`, **When** el supervisor la aprueba, **Then** el sistema transiciona a `aprobada` (terminal) y registra id del supervisor y timestamp.
2. **Given** una orden en `pendiente_de_revision`, **When** el supervisor la rechaza con motivo no vacío (tras trim), **Then** el sistema transiciona a `rechazada` (terminal) y registra motivo, id del supervisor y timestamp.
3. **Given** una orden en `pendiente_de_revision`, **When** el supervisor intenta rechazarla sin motivo o con motivo vacío/solo espacios, **Then** el sistema rechaza la operación (400) exigiendo motivo obligatorio.
4. **Given** una orden que ya no está en `pendiente_de_revision` (ya `aprobada` o `rechazada`), **When** el supervisor intenta aprobarla o rechazarla, **Then** el sistema rechaza como no-op (409), sin reaplicar timestamp/id, usando chequeo atómico (optimistic lock) para que ante dos operaciones simultáneas solo la primera surta efecto.

---

### User Story 4 - Consulta de listado de órdenes por rol (Priority: P2)

Cada rol (cliente, técnico, dispatcher, supervisor) consulta el listado de órdenes con el alcance de visibilidad correspondiente a su rol.

**Why this priority**: Necesario para que cada rol opere sobre las órdenes correctas, pero depende de que existan órdenes creadas (US2) — es de soporte, no bloqueante para el ciclo de vida central.

**Independent Test**: Puede probarse de forma aislada con datos fijos (varias órdenes con distintos propietarios/técnicos asignados) y verificando que cada rol recibe exactamente el subconjunto esperado.

**Acceptance Scenarios**:

1. **Given** un usuario con rol cliente, **When** solicita su listado de órdenes, **Then** el sistema devuelve únicamente las órdenes donde es el propietario/cliente asociado.
2. **Given** un usuario con rol técnico, **When** solicita el listado, **Then** el sistema devuelve únicamente las órdenes asignadas a él.
3. **Given** un usuario con rol dispatcher o supervisor, **When** solicita el listado, **Then** el sistema devuelve todas las órdenes, sin restricción de equipo/región.
4. **Given** cualquier operación sobre un `orderId` inexistente, **When** el usuario no tendría acceso a ese tipo de orden en ningún caso, **Then** el sistema responde `403 Forbidden` uniforme; **When** el usuario tiene rol con acceso potencial a la ruta, **Then** responde `404 Not Found` — sin filtrar existencia según el rol.

---

### User Story 5 - Resumen automático de notas para supervisor (Priority: P3)

Al abrir una orden con notas de técnico registradas, el supervisor ve un resumen automático generado a partir de esas notas, con degradación explícita si el servicio de resumen falla o no responde a tiempo.

**Why this priority**: Mejora la experiencia de revisión del supervisor pero es explícitamente opcional/fase 2 y no bloquea ningún flujo de negocio central.

**Independent Test**: Puede probarse de forma aislada abriendo una orden con notas registradas y verificando que el resumen aparece en ≤5s, o que la vista se degrada con gracia (200 + indicador "resumen no disponible") si el servicio de resumen fallara o excediera el tiempo límite.

**Acceptance Scenarios**:

1. **Given** una orden con notas de técnico registradas, **When** el supervisor la abre, **Then** el sistema muestra un resumen automático en P95 ≤ 5s.
2. **Given** una orden con notas de técnico registradas, **When** el servicio de resumen no responde en 5s o falla, **Then** el sistema muestra la orden sin resumen (200 OK + indicador "resumen no disponible"), sin bloquear la vista.

---

### Edge Cases

- ¿Qué ocurre si un técnico intenta reenviar la ejecución de una orden ya `rechazada`? → Rechazada es terminal: no hay reenvío de ejecución tras rechazo (ver US1, escenario 5).
- ¿Cómo maneja el sistema una reasignación concurrente donde dos dispatchers reasignan la misma orden casi simultáneamente? → Solo la primera transacción tiene efecto (check-and-set); ambos intentos quedan reflejados en el audit log aunque solo uno persista como estado final.
- ¿Qué ocurre si el servicio de cifrado (KMS) falla al persistir fotos? → La escritura completa falla (503); nunca se persiste en claro como fallback.
- ¿Qué ocurre si el validador externo de tokens (IdP) falla? → Se responde 503 (fallo de infraestructura), diferenciado explícitamente de 401 (token inválido), para no denegar acceso de forma engañosa.
- ¿Qué ocurre si el servicio de almacenamiento de fotos falla o hace timeout durante la subida? → La ejecución no se marca `pendiente_de_revision` si la foto no confirmó persistencia; no se deja la orden en estado inconsistente (foto referenciada pero inexistente); se responde 503/502, o 504 si excede el timeout explícito configurado.
- ¿Qué ocurre si el registro en el log de auditoría falla en el momento de un cambio de estado? → Se bloquea (rollback) la operación de cambio de estado completa (503); el cambio nunca se aplica sin su registro de auditoría correspondiente.
- ¿Qué ocurre si el servicio externo de validación de contenido de fotos (antivirus/verificación de tipo) falla o hace timeout? → El archivo se rechaza explícitamente (503); nunca se acepta sin validación completa. Se permite un reintento acotado antes de rechazar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-000 (RBAC transversal)**: Todo endpoint de este feature MUST verificar que el rol del actor autenticado coincide con el rol requerido por la operación antes de ejecutarla: petición sin token o con token inválido MUST rechazarse con `401 Unauthorized`; petición con token válido pero rol sin permiso sobre esa operación (p. ej. un técnico invocando creación/reasignación de FR-001/FR-002, o aprobación/rechazo de FR-013/FR-015; un cliente invocando cualquier operación de escritura) MUST rechazarse con `403 Forbidden`. Aplica a todas las operaciones de creación, asignación, ejecución, aprobación, rechazo y consulta descritas en este documento.
- **FR-001**: El sistema MUST permitir a un dispatcher crear una orden nueva, persistiéndola en estado `sin_asignar` sin técnico asignado.
- **FR-002**: El sistema MUST permitir a un dispatcher asignar o reasignar un técnico a una orden en estado `sin_asignar` o `pendiente_de_revision`, registrando el cambio con id del dispatcher, técnico anterior, técnico nuevo y timestamp.
- **FR-003**: El sistema MUST rechazar la reasignación de una orden en estado `aprobada` o `rechazada` (422 por estado inválido; 409 si la orden transicionó a terminal entre lectura previa e intento de escritura).
- **FR-004**: El sistema MUST rechazar la asignación de un `tecnicoId` inexistente o inactivo (`activo = false`) (422), antes de persistir cualquier cambio.
- **FR-004d**: WHEN un dispatcher/admin desactiva a un técnico (`activo = false`) THE sistema MUST reasignar automáticamente a `sin_asignar` (sin técnico) toda orden en estado `sin_asignar` o `pendiente_de_revision` que estuviera asignada a ese técnico, registrando el cambio en el log de auditoría.
- **FR-005**: El sistema MUST permitir a un técnico autenticado, con orden asignada a él, enviar un registro de ejecución con al menos 1 foto de evidencia válida y notas de texto no vacías, transicionando la orden a `pendiente_de_revision` con timestamp de envío.
- **FR-006**: El sistema MUST rechazar (400) el envío de ejecución sin ninguna foto adjunta.
- **FR-007**: El sistema MUST rechazar (400) el envío de ejecución con notas vacías o ausentes.
- **FR-008**: El sistema MUST validar que cada archivo adjunto sea una imagen real (jpg/png/heic) mediante verificación de contenido (magic bytes), no solo por extensión, y rechazar (415) cualquier archivo que no cumpla.
- **FR-009**: El sistema MUST aplicar semántica todo-o-nada en el envío de ejecución con múltiples fotos: si alguna falla la validación de tipo, revierte las fotos ya persistidas de ese envío y rechaza la ejecución completa (415), sin aceptar envío parcial.
- **FR-010**: El sistema MUST rechazar (403) el registro de ejecución si la orden no está asignada al técnico que la envía, validando la asignación de forma atómica en el momento de la escritura (no solo en lectura previa de UI).
- **FR-011**: El sistema MUST rechazar (409) el envío de ejecución sobre una orden ya en estado terminal (`aprobada` o `rechazada`), sin reescribir estado ni timestamps existentes.
- **FR-012**: El sistema MUST tratar el envío de ejecución como idempotente: un reintento con el mismo `idempotencyKey` tras timeout de red devuelve el resultado del envío original (200, sin duplicar registro) si el primero tuvo éxito, o rechaza (409) si el estado ya no lo permite.
- **FR-012b**: El sistema MUST rechazar (409, "idempotency key ya usado con payload distinto") cualquier reintento que reutilice un `idempotencyKey` ya registrado para un `orderId` o contenido de envío distinto al original; nunca reutiliza ni sobrescribe el resultado de otro envío.
- **FR-013**: El sistema MUST permitir a un supervisor aprobar una orden en `pendiente_de_revision`, transicionándola a `aprobada` (terminal) y registrando id del supervisor y timestamp.
- **FR-014**: El sistema MUST exigir un motivo de rechazo obligatorio y no vacío (tras trim) al rechazar una orden; de lo contrario rechaza la operación (400).
- **FR-015**: El sistema MUST permitir a un supervisor rechazar una orden en `pendiente_de_revision` con motivo válido, transicionándola a `rechazada` (terminal) y registrando motivo, id del supervisor y timestamp.
- **FR-016**: El sistema MUST rechazar (409), como no-op, cualquier intento de aprobar o rechazar una orden que ya no está en `pendiente_de_revision`, sin reaplicar timestamp ni id, usando chequeo atómico (optimistic lock / check-and-set) para que ante transiciones concurrentes solo la primera tenga efecto.
- **FR-016b**: WHEN dos supervisores distintos intentan aprobar y rechazar la misma orden casi simultáneamente (acciones opuestas) THE sistema MUST aplicar el mismo chequeo atómico de FR-016: solo la primera transacción en comprometerse tiene efecto; la segunda MUST recibir `409 Conflict` con el estado final resultante de la orden en el cuerpo de la respuesta; ambos intentos MUST quedar reflejados en el log de auditoría.
- **FR-017**: El sistema MUST devolver, ante una solicitud de listado de órdenes de un cliente, únicamente las órdenes donde ese usuario es el propietario/cliente asociado.
- **FR-018**: El sistema MUST devolver, ante una solicitud de listado de un técnico, únicamente las órdenes asignadas a él; y ante una solicitud de un dispatcher o supervisor, todas las órdenes sin restricción de equipo/región.
- **FR-019**: El sistema MUST aplicar verificación consistente de autorización y existencia en toda operación sobre un `orderId`, de modo que no se filtre la existencia de una orden a usuarios sin permiso sobre ella (403 uniforme si el rol nunca tendría acceso; 404 si el rol tiene acceso potencial a la ruta).
- **FR-020** *(opcional, fase 2)*: El sistema SHOULD generar y mostrar, al abrir una orden con notas de técnico, un resumen automático basado en esas notas en P95 ≤ 5s, degradando con gracia (200 OK + indicador "resumen no disponible") sin bloquear la vista si el servicio de resumen falla o no responde a tiempo.

### Non-Functional Requirements

- **NFR-01 (Seguridad — transporte)**: Todo tráfico cliente-servidor MUST usar TLS 1.2 o superior; conexiones sin TLS MUST ser rechazadas.
- **NFR-02 (Seguridad — datos en reposo)**: Las fotos de evidencia MUST estar cifradas en reposo con AES-256. (Los datos de identidad/contacto del cliente residen en el sistema de identidad externo asumido — Assumptions — y no se persisten localmente en este slice; por eso quedan fuera del alcance de este NFR.)
- **NFR-02b**: WHEN el servicio de cifrado (KMS) falla al momento de persistir fotos THE sistema MUST fallar la escritura completa (`503 Service Unavailable`). Nunca se persiste en claro como fallback.
- **NFR-03 (Seguridad — autorización)**: Cada endpoint MUST requerir autenticación válida y aplicar control de acceso por rol (técnico, dispatcher, supervisor, cliente); el 100% de los endpoints MUST rechazar peticiones sin token válido con `401`.
- **NFR-03b**: El sistema MUST diferenciar "token inválido" (`401 Unauthorized`) de "fallo del validador externo de tokens" (`503 Service Unavailable`); un fallo del IdP externo no debe exponerse como `401`.
- **NFR-04 (Auditoría)**: Todo cambio de estado de una orden (envío, reasignación, aprobación, rechazo) MUST quedar registrado en log de auditoría con actor, acción y timestamp, retención mínima 12 meses.
- **NFR-04b**: El registro en audit log MUST ser atómico con el cambio de estado (todo-o-nada). WHEN el servicio de auditoría falla al momento de un cambio de estado THE sistema MUST bloquear (rollback) la operación completa (`503 Service Unavailable`); nunca se aplica un cambio de estado sin su registro de auditoría correspondiente. En reasignaciones o aprobaciones/rechazos concurrentes con condición de carrera legítima (ver FR-003, FR-016b), AMBOS intentos MUST quedar reflejados en el audit log aunque solo uno persista como estado final.
- **NFR-04c**: Las fotos de evidencia MUST tener retención de 12 meses, alineada con NFR-04, con borrado automático posterior.
- **NFR-05 (Rendimiento — API)**: Operaciones CRUD sobre órdenes (excluyendo subida de fotos) MUST responder P95 ≤ 300 ms, P99 ≤ 800 ms bajo carga nominal (100 req/s).
- **NFR-06 (Rendimiento — subida de evidencia)**: Subida de foto hasta 10 MB MUST completarse P95 ≤ 3 s con conexión de referencia 10 Mbps.
- **NFR-06b**: WHEN el servicio de almacenamiento de fotos (S3/blob) falla o hace timeout durante la subida THE sistema MUST: (a) no marcar la ejecución como `pendiente_de_revision` si la foto no confirmó persistencia; (b) no dejar la orden en estado inconsistente (foto referenciada pero inexistente); (c) responder `503 Service Unavailable` o `502 Bad Gateway`. Todo servicio externo dependiente MUST tener timeout explícito configurado; exceder ese timeout responde `504 Gateway Timeout` y se registra como violación de NFR-05/NFR-06 para monitoreo.
- **NFR-07 (Disponibilidad)**: El sistema MUST mantener disponibilidad mensual ≥ 99.5%.
- **NFR-08 (Integridad de evidencia)**: El sistema MUST validar que cada archivo adjunto sea imagen real (jpg/png/heic) mediante validación de contenido/magic bytes, no solo extensión, y rechazar (`415`) cualquier archivo que no cumpla.
- **NFR-08b**: Si la validación de NFR-08 delega en un servicio externo de escaneo (antivirus/verificación de tipo) y este falla o hace timeout THE sistema MUST rechazar el archivo explícitamente (`503 Service Unavailable`) — nunca aceptar un archivo sin validación completa por fallback inseguro. Reintento acotado permitido antes de rechazar.

### Key Entities *(include if feature involves data)*

- **Orden de trabajo**: Unidad central de trabajo. Atributos clave: estado (`sin_asignar` → `pendiente_de_revision` → `{aprobada | rechazada}`, terminal en los dos últimos), cliente/propietario asociado, técnico asignado (opcional), timestamps de cada transición.
- **Registro de ejecución**: Evidencia de trabajo realizado por un técnico sobre una orden. Atributos clave: fotos de evidencia (≥1, validadas por contenido), notas de texto (obligatorias, no vacías), timestamp de envío, idempotency key.
- **Foto de evidencia**: Archivo adjunto a un registro de ejecución. Atributos clave: tipo validado por contenido (jpg/png/heic), cifrado en reposo, retención de 12 meses con borrado automático posterior.
- **Registro de auditoría**: Traza de cada cambio de estado de una orden. Atributos clave: actor, acción, timestamp, retención mínima 12 meses; atómico con el cambio de estado que registra.
- **Usuario**: Actor del sistema con un rol (cliente, técnico, dispatcher, supervisor) que determina su alcance de visibilidad y permisos sobre las órdenes. Atributo `activo` (booleano): controlado manualmente por dispatcher/admin, representa baja, suspensión o licencia de un técnico; un técnico con `activo = false` no puede recibir nuevas asignaciones (FR-004).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un técnico puede completar el registro de ejecución de una orden asignada (adjuntar evidencia y notas, y confirmar el envío) en menos de 2 minutos en condiciones normales de red.
- **SC-002**: Las operaciones de consulta/gestión de órdenes responden en P95 ≤ 300 ms y P99 ≤ 800 ms bajo carga nominal (100 req/s).
- **SC-003**: La subida de una foto de evidencia de hasta 10 MB se completa en P95 ≤ 3 s con una conexión de referencia de 10 Mbps.
- **SC-004**: El 100% de las transiciones de estado de una orden (envío, reasignación, aprobación, rechazo) queda registrado en el log de auditoría sin excepción, con retención mínima de 12 meses.
- **SC-005**: El sistema mantiene disponibilidad mensual ≥ 99.5%.
- **SC-006**: El 100% de los endpoints protegidos rechaza peticiones sin token válido con 401, y el 100% de las peticiones con token válido pero rol sin permiso se rechaza con 403.
- **SC-007**: Cero incidentes de fuga de fotos de evidencia en claro (sin cifrado) durante fallos del servicio de cifrado, verificado por auditoría.
- **SC-008**: El resumen automático de notas técnicas (cuando está habilitado) está disponible en P95 ≤ 5s o se degrada explícitamente sin bloquear al supervisor.

## Assumptions

- El modelo de equipos/regiones para filtrado adicional de dispatcher/supervisor está fuera de alcance de esta feature (v1/v2); dispatcher y supervisor ven todas las órdenes sin restricción.
- El dashboard de métricas de productividad y las notificaciones push a técnicos están fuera de alcance de esta feature.
- La cancelación de una orden (por cliente o dispatcher) está fuera de alcance de esta feature; toda orden se cierra únicamente vía aprobación o rechazo del ciclo normal (US3).
- Existe un sistema de autenticación/IdP externo reutilizable que emite tokens verificables por el backend.
- Existe (o se integrará) un servicio de cifrado (KMS) para datos en reposo y un servicio de almacenamiento de fotos (tipo S3/blob) externos al núcleo de la aplicación.
- El componente de resumen automático de notas (US5/FR-020) es de fase 2 y puede implementarse tras el resto de la funcionalidad, con contrato de fallback explícito ante evidencia insuficiente o fallo del servicio (alineado con la constitución del proyecto).
- La validación de contenido de imágenes (magic bytes) y la verificación antivirus, si delega en un servicio externo, se consideran dependencias externas con timeout explícito configurado.
