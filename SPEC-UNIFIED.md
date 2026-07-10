# Spec Unificada: Gestión de Órdenes de Trabajo

Fuente: `SPEC.md` + `edge-cases.md`. Este documento resuelve preguntas abiertas donde la resolución es forzosa para implementar sin ambigüedad, y marca explícitamente **[SPEC THEATER]** cada punto donde spec original aparentaba estar completa pero no lo estaba.

---

## 0. Máquina de estados de Orden (faltaba — spec theater: FRs referencian estados sin definir grafo completo)

Estados: `creada` → `asignada` → `pendiente_revision` → `aprobada` | `rechazada`

Transiciones permitidas:

| Desde | Acción | Hacia | Actor |
|---|---|---|---|
| (ninguna) | crear orden | `creada` | dispatcher |
| `creada` | asignar técnico | `asignada` | dispatcher |
| `asignada` | enviar ejecución (≥1 foto) | `pendiente_revision` | técnico asignado |
| `asignada`/`pendiente_revision` | reasignar | `asignada` (nuevo técnico) | dispatcher |
| `pendiente_revision` | aprobar | `aprobada` | supervisor |
| `pendiente_revision` | rechazar (con motivo) | `rechazada` | supervisor |
| `rechazada` | reenviar ejecución | `pendiente_revision` | técnico asignado |
| `aprobada` | — | — | **estado terminal, ninguna transición permitida** |

**[SPEC THEATER corregido]** Original solo definía FR-04 (reasignación) y FR-05 (bloqueo si "aprobada"), sin definir cómo nace una orden ni si "rechazada" es terminal. Ambigüedad real que bloqueaba implementación (Preguntas Abiertas #1, #2, #3). Resolución adoptada arriba: **rechazada NO es terminal** (vuelve a técnico), **aprobada SÍ es terminal**. Requiere confirmación de producto pero se fija un default implementable en vez de dejarlo abierto.

---

## 1. Functional Requirements (corregidos y ampliados)

**FR-00 (nuevo — cubre Pregunta Abierta #1)** — WHEN un dispatcher autenticado crea una orden de trabajo con cliente asociado THE sistema SHALL persistirla en estado `creada` y permitir asignación de primer técnico en la misma operación o en operación separada, quedando en estado `asignada`. Sin este FR, FR-02/FR-04 no tienen origen válido.

**FR-01** — WHEN un técnico autenticado envía el registro de ejecución de una orden sin ninguna foto válida adjunta THE sistema SHALL rechazar el envío con `400 Bad Request` indicando que se requiere mínimo 1 foto de evidencia válida.
**[corrección]** "sin ninguna foto adjunta" → "sin ninguna foto **válida**": E-05 muestra que fotos inválidas mezcladas con válidas no deben contar. La validación de tipo (NFR-08) ocurre **antes** de contar el mínimo.

**FR-02** — WHEN un técnico autenticado envía el registro de ejecución de una orden en estado `asignada` o `rechazada`, asignada a él, con al menos 1 foto válida adjunta THE sistema SHALL persistir la ejecución con estado `pendiente_revision` y timestamp de envío.
**[corrección]** Original no acotaba el estado de origen — E-09 muestra que enviar ejecución sobre orden ya `aprobada` debía rechazarse pero el FR no lo decía explícitamente. Ahora el estado de origen es explícito y cualquier otro estado de origen cae en FR-03b.

**FR-03** — WHEN un técnico intenta registrar la ejecución de una orden que no está asignada a él THE sistema SHALL rechazar la operación con `403 Forbidden`.

**FR-03b (nuevo — cubre E-09/C-02)** — WHEN un técnico envía ejecución de una orden que sí le fue asignada pero cuyo estado actual (verificado atómicamente en escritura, no en lectura previa) no es `asignada` ni `rechazada` THE sistema SHALL rechazar con `409 Conflict`, incluyendo el caso de reasignación concurrente a otro técnico (C-02) y el de aprobación previa (E-09).

**FR-04** — WHEN un dispatcher autenticado reasigna una orden en estado `asignada`, `pendiente_revision` o `rechazada` a otro técnico activo THE sistema SHALL actualizar el campo técnico-asignado y registrar el cambio con id del dispatcher, técnico anterior, técnico nuevo y timestamp.
**[corrección]** Se explicita en qué estados se permite reasignar (resuelve Pregunta Abierta #3 / E-03) y se añade validación de técnico destino activo (E-10).

**FR-04b (nuevo — cubre E-10)** — WHEN el técnico destino de una reasignación no existe o está inactivo THE sistema SHALL rechazar con `400 Bad Request`.

**FR-05** — WHEN un dispatcher intenta reasignar una orden en estado `aprobada` THE sistema SHALL rechazar la reasignación con `422 Unprocessable Entity`, con verificación de estado atómica al momento de escritura (no solo en lectura previa) para evitar la carrera descrita en C-04.

**FR-06** — WHEN un supervisor autenticado aprueba una orden en estado `pendiente_revision` (verificado atómicamente) THE sistema SHALL cambiar el estado a `aprobada` y registrar id del supervisor y timestamp. Si el estado ya no es `pendiente_revision` al momento de escritura (doble aprobación concurrente, C-01, o doble click, E-02) THE sistema SHALL rechazar con `409 Conflict` sin reescribir timestamp/id.

**FR-07** — WHEN un supervisor autenticado rechaza una orden en estado `pendiente_revision` sin proporcionar un motivo de rechazo no vacío (tras trim/normalización) THE sistema SHALL rechazar la operación con `400 Bad Request` y exigir motivo obligatorio.
**[corrección]** Añadido "no vacío tras trim/normalización" — E-07 mostraba que `"   "` pasaría una validación de "campo presente" ingenua.

**FR-08** — WHEN un supervisor autenticado rechaza una orden en estado `pendiente_revision` (verificado atómicamente) con motivo válido THE sistema SHALL cambiar el estado a `rechazada` y registrar motivo, id del supervisor y timestamp. Si el estado ya no es `pendiente_revision` al momento de escritura THE sistema SHALL rechazar con `409 Conflict` (E-01).

**FR-09** — WHEN un usuario autenticado con rol "cliente" solicita el listado de sus órdenes THE sistema SHALL devolver únicamente las órdenes donde ese usuario es el propietario/cliente asociado.

**FR-09b (nuevo — cubre Pregunta Abierta #5)** — Alcance de listado por rol:
- Técnico: solo órdenes donde es el técnico actualmente asignado.
- Dispatcher: todas las órdenes (sin filtro de equipo/región — no existe ese modelo de datos en el brief; si se requiere, es una pregunta de producto nueva, no asumible).
- Supervisor: todas las órdenes en estado `pendiente_revision`, `aprobada` o `rechazada` (no ve `creada`/`asignada` sin ejecución, no le compete revisar aún).

**[SPEC THEATER corregido]** FR-09 original solo cubría "cliente" y dejaba sin definir 3 de los 4 roles del sistema (NFR-03 los menciona: técnico, dispatcher, supervisor, usuario) — un requisito de autorización que no cubre todos los roles que dice autorizar es teatro.

**FR-10** *(opcional, fase 2 — sin cambios de fondo, degradación añadida)* — WHEN un supervisor abre una orden con notas de técnico registradas THE sistema SHALL intentar generar un resumen automático en ≤5s (P95). Si el servicio de resumen falla o excede el timeout (X-03) THE sistema SHALL mostrar la orden sin resumen con indicador "resumen no disponible", sin bloquear la vista.
**[corrección]** Original definía SLA (P95 ≤5s) sin definir qué pasa si se incumple — un SLA sin comportamiento de fallback es teatro de precisión: parece riguroso pero no es implementable tal cual.

**FR-10b (nuevo)** — Depende de captura de "notas de técnico" como campo del registro de ejecución, actualmente no definido en ningún FR (Pregunta Abierta #4). Se añade: el registro de ejecución (FR-02) SHALL aceptar un campo `notas` de texto libre, **opcional**. FR-10 solo aplica si `notas` no está vacío; si está vacío, no se genera resumen (no hay insumo).

### Fuera de alcance (sin cambios)
- Dashboard de métricas de productividad.
- Notificaciones push a técnicos.

---

## 2. Non-Functional Requirements (corregidos)

**NFR-01 (Seguridad — transporte)** — Sin cambios. TLS ≥1.2 obligatorio, tráfico sin TLS rechazado.

**NFR-02 (Seguridad — datos en reposo)** — Datos de cliente (nombre, dirección, contacto) **y fotos de evidencia** almacenados SHALL estar cifrados en reposo con AES-256.
**[corrección]** Original no incluía fotos explícitamente (Pregunta Abierta #6). Fotos son evidencia asociada a una dirección/incidente de cliente — mismo nivel de sensibilidad, se incluyen explícitamente para no dejar vacío de cifrado.

**NFR-02b (nuevo — cubre X-02)** — WHEN el servicio de cifrado (KMS) falla al persistir datos de cliente o fotos THE sistema SHALL fallar la escritura completa con `503 Service Unavailable`, nunca persistir sin cifrar como fallback.

**NFR-03 (Seguridad — autorización)** — Sin cambios de fondo. Se añade: ante `orderId` inexistente, la respuesta (404 vs 403) SHALL ser consistente independientemente de si el usuario tendría o no permiso sobre una orden hipotética con ese id, para evitar oráculo de enumeración (E-08). Recomendado: `404 Not Found` uniforme para "no existe o no tienes acceso", sin distinguir los dos casos en el cuerpo de respuesta.

**NFR-04 (Auditoría)** — Todo cambio de estado de una orden (creación, asignación, envío, reasignación, aprobación, rechazo) SHALL quedar registrado en log de auditoría con actor, acción y timestamp, con retención mínima de 12 meses. La escritura del cambio de estado y su registro de auditoría SHALL ser atómicas: si el log de auditoría falla, el cambio de estado SHALL revertirse (`503 Service Unavailable`) — no existe cambio de estado sin traza.
**[corrección]** Original no decía si auditoría y cambio de estado son atómicos (X-05) — para un requisito regulatorio (retención 12 meses) dejar esto sin definir es teatro: aparenta cumplimiento sin garantizarlo ante fallos.

**NFR-04b (nuevo — cubre Pregunta Abierta #7 parcialmente)** — Retención de fotos de evidencia: mínimo 12 meses (alineado con audit log), sujeto a política de retención de datos de cliente vigente. **Pendiente de decisión de producto** si excede 12 meses; se fija el mínimo para no dejar el sistema sin ninguna garantía.

**NFR-05 (Rendimiento — API)** — Sin cambios. P95 ≤300ms, P99 ≤800ms, 100 req/s.

**NFR-05b (nuevo — cubre C-01 a C-06, X-07)** — Toda transición de estado de orden (aprobar, rechazar, reasignar, enviar ejecución) SHALL verificar el estado actual de forma atómica en el momento de la escritura (optimistic lock por versión o equivalente transaccional), no basarse en una lectura previa. Ante conflicto de escritura concurrente, la operación perdedora SHALL responder `409 Conflict` sin aplicar cambios parciales.
**[SPEC THEATER corregido]** El spec original no tenía **ningún** requisito de concurrencia — 6 edge cases (C-01 a C-06) identificaron condiciones de carrera reales sobre transiciones de estado. Un sistema con máquina de estados y múltiples roles concurrentes sin garantía de atomicidad no es implementable de forma segura; esto no era un detalle, era un vacío de spec.

**NFR-06 (Rendimiento — subida de evidencia)** — Sin cambios de fondo. Subida de hasta 10MB en P95 ≤3s. Se añade: timeout explícito configurado para el servicio de storage subyacente (no espera indefinida) — cubre X-07.

**NFR-06b (nuevo — cubre X-01)** — WHEN el servicio de almacenamiento de fotos falla o excede timeout durante la subida THE sistema SHALL responder `503 Service Unavailable`/`502 Bad Gateway` y NO SHALL marcar la ejecución como `pendiente_revision` con una referencia a foto no persistida (evita estado inconsistente orden↔evidencia).

**NFR-07 (Disponibilidad)** — Sin cambios. ≥99.5% mensual.

**NFR-08 (Integridad de evidencia)** — El sistema SHALL validar que cada archivo adjunto sea imagen (jpg/png/heic) verificando **contenido real (magic bytes), no solo extensión**, y rechazar cualquier archivo que no cumpla con `415 Unsupported Media Type`.
**[corrección]** Original decía "validar que sea imagen" sin especificar método — E-06 muestra que validar solo por extensión es insuficiente (`.jpg` corrupto/vacío pasaría). "Validar" sin decir cómo es teatro: cualquier implementación que solo mire la extensión cumpliría la letra del FR original sin cumplir su intención.

**NFR-08b (nuevo — cubre E-05)** — En un envío con múltiples fotos donde alguna es inválida: el sistema SHALL rechazar únicamente los archivos inválidos con `415`, y solo continuar si quedan ≥1 fotos válidas tras el filtrado (alineado con FR-01 corregido). Si la operación no es atómica a nivel de archivo individual, SHALL aplicar rollback all-or-nothing de las fotos ya subidas antes de marcar `pendiente_revision` (cubre C-06).

**NFR-08c (nuevo — cubre X-06)** — Si la validación de tipo de archivo delega en un servicio externo (antivirus/escaneo) y este falla o hace timeout, el sistema SHALL rechazar el archivo (`503 Service Unavailable`), nunca aceptar por fallback inseguro ante fallo del validador.

**NFR-09 (nuevo — cubre X-04)** — Ante fallo o timeout del servicio externo de validación de token (IdP), el sistema SHALL responder `503 Service Unavailable`, distinguiéndolo explícitamente de `401 Unauthorized` (token inválido real). No SHALL exponer un fallo de infraestructura como si fuera un rechazo de acceso legítimo.

---

## 3. Preguntas Abiertas — estado tras esta unificación

| # | Pregunta original | Estado |
|---|---|---|
| 1 | Asignación inicial de orden | **Resuelta** — FR-00 |
| 2 | ¿"rechazada" es terminal? | **Resuelta (default adoptado)** — no terminal, ver §0. Requiere confirmación de producto. |
| 3 | Reasignación en otros estados | **Resuelta** — FR-04 explícito |
| 4 | Notas del técnico — ¿campo definido? | **Resuelta** — FR-10b, campo opcional |
| 5 | Alcance "sus órdenes" por rol | **Resuelta** — FR-09b |
| 6 | ¿Fotos entran en cifrado en reposo? | **Resuelta (default adoptado)** — sí, NFR-02 |
| 7 | Retención de fotos | **Parcial** — mínimo 12 meses fijado (NFR-04b), tope máximo pendiente de decisión de producto |

**Pendiente real de decisión de negocio (no bloquea implementación, pero requiere confirmación antes de ir a producción):**
- Confirmar que "rechazada → reenviable" es el comportamiento de negocio deseado (no solo el default técnico adoptado aquí).
- Confirmar tope de retención de fotos si difiere de 12 meses.
- Confirmar si dispatcher/supervisor requieren filtro por región/equipo (no había modelo de datos para esto en el brief — si se requiere, es un FR nuevo, no un edge case).
