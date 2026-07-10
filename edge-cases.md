# Edge Cases — Gestión de Órdenes de Trabajo

Basado en SPEC.md. Cada caso: descripción, comportamiento esperado, código error recomendado.

## Concurrencia

### C-01 — Doble aprobación simultánea
Dos supervisores aprueban/rechazan misma orden "pendiente de revisión" en paralelo.
**Esperado**: solo primera transacción gana (optimistic lock / estado check atómico). Segunda ve estado ya cambiado, rechaza.
**Código**: `409 Conflict`

### C-02 — Reasignación concurrente con envío de ejecución
Dispatcher reasigna orden a técnico B justo cuando técnico A (asignado original) envía ejecución.
**Esperado**: validar asignación en momento de escritura (no solo lectura previa). Si técnico A ya no es asignado al confirmar, rechazar envío.
**Código**: `403 Forbidden` (mismo código que FR-03, motivo: "orden reasignada durante operación")

### C-03 — Reasignación simultánea por dos dispatchers
Dos dispatchers reasignan misma orden a técnicos distintos al mismo tiempo.
**Esperado**: última escritura consistente gana pero AMBOS cambios deben quedar en audit log (NFR-04); no perder registro de la transición perdedora si se detecta race.
**Código**: `200 OK` para la que gana el lock; `409 Conflict` si sistema usa lock optimista con versión.

### C-04 — Aprobación mientras reasignación en vuelo
Supervisor aprueba orden justo cuando dispatcher intenta reasignarla (FR-05 bloquea reasignación de "aprobada").
**Esperado**: check de estado atómico al momento de reasignar; si ya aprobada, rechazar reasignación aunque lectura previa mostrara "pendiente".
**Código**: `409 Conflict` o `422 Unprocessable Entity` (estado inválido, alineado con FR-05)

### C-05 — Doble envío de ejecución (retry de red del técnico)
Técnico envía ejecución, timeout de red, reintenta — orden ya pasó a "pendiente de revisión".
**Esperado**: operación idempotente (idempotency key) o rechazo claro de segundo envío por estado incorrecto, no duplicar registro.
**Código**: `409 Conflict` o `200 OK` si idempotency key detecta duplicado exacto

### C-06 — Subida concurrente de múltiples fotos, una falla
Técnico sube 3 fotos en paralelo para misma ejecución, 1 falla validación (NFR-08) tras que otras 2 ya persistieron.
**Esperado**: definir si ejecución exige "todo o nada" (rollback) o parcial con reporte de cuál falló. Spec no lo dice — recomendado: atomic all-or-nothing antes de marcar "pendiente de revisión".
**Código**: `415 Unsupported Media Type` (por FR-08) + rollback de fotos ya subidas, `207 Multi-Status` si se permite parcial

## Estados inválidos

### E-01 — Rechazo de orden en estado no "pendiente de revisión"
Supervisor intenta rechazar orden "aprobada" o "rechazada".
**Esperado**: rechazar operación, no transicionar (FR-08 exige origen "pendiente de revisión").
**Código**: `409 Conflict` (transición de estado inválida) — alternativa `422 Unprocessable Entity`

### E-02 — Aprobación de orden no en "pendiente de revisión"
Supervisor aprueba orden ya "aprobada" o "rechazada" (doble click, UI stale).
**Esperado**: no-op con error, no re-aplicar timestamp/id supervisor.
**Código**: `409 Conflict`

### E-03 — Reasignación de orden "rechazada"
FR-05 solo bloquea "aprobada" — pregunta abierta #3 del spec. Ambigüedad real.
**Esperado**: definir explícitamente antes de implementar. Recomendado: permitir (rechazada no es terminal si vuelve a técnico) pero requiere decisión de producto.
**Código**: pendiente definición — si se bloquea, `422 Unprocessable Entity`

### E-04 — Reenvío de ejecución tras rechazo
Pregunta abierta #2: ¿"rechazada" es terminal? Técnico intenta reenviar ejecución de orden rechazada.
**Esperado**: si no hay FR de reenvío definido, sistema debe rechazar explícitamente (no fallar silenciosamente ni aceptar ambiguamente).
**Código**: `409 Conflict` con mensaje "orden en estado terminal" (si se decide terminal) o habilitar flujo FR-09b (si no)

### E-05 — Foto adjunta pero de tipo no válido, mezclada con válidas
Ejecución con 2 fotos jpg válidas + 1 pdf.
**Esperado**: rechazar completa (FR-01 exige mínimo 1 foto válida — pdf no cuenta como foto), o rechazar solo el archivo inválido y validar que quedan ≥1 válidas.
**Código**: `415 Unsupported Media Type`

### E-06 — Foto cero bytes / corrupta pasando extensión válida
Archivo `.jpg` con extensión correcta pero contenido corrupto o vacío.
**Esperado**: validar magic bytes/contenido real, no solo extensión (NFR-08 dice "validar que sea imagen").
**Código**: `415 Unsupported Media Type`

### E-07 — Motivo de rechazo vacío/whitespace
FR-07 exige motivo obligatorio — técnicamente envía string `"   "` o `""`.
**Esperado**: trim + validar no vacío tras normalizar, no solo "campo presente".
**Código**: `400 Bad Request`

### E-08 — Orden inexistente en cualquier operación
Cualquier operación (aprobar/rechazar/reasignar/ejecutar) sobre `orderId` que no existe.
**Esperado**: no filtrar existencia a usuarios sin permiso (evitar oráculo de enumeración) — verificar autorización y existencia de forma consistente.
**Código**: `404 Not Found` (si autorizado a la ruta) — considerar `403` uniforme si expone info sensible

### E-09 — Técnico ejecuta orden ya "aprobada" (reintento tardío)
Ejecución enviada después que supervisor ya aprobó por otra vía (edge de UI desincronizada).
**Esperado**: FR-02 asume origen implícito no "aprobada"/"rechazada" — debe rechazar, no reescribir estado post-aprobación.
**Código**: `409 Conflict`

### E-10 — Cero técnicos disponibles / técnico eliminado/inactivo en reasignación
Dispatcher reasigna a técnico que no existe o está desactivado.
**Esperado**: validar existencia y estado activo del técnico destino antes de persistir.
**Código**: `400 Bad Request` o `422 Unprocessable Entity`

## Fallos de servicios externos

### X-01 — Falla almacenamiento de fotos (S3/blob) durante subida
Servicio de storage externo no disponible o timeout durante subida de evidencia (NFR-06).
**Esperado**: no marcar ejecución como "pendiente de revisión" si foto no confirmó persistencia; no dejar orden en estado inconsistente (foto referenciada pero inexistente).
**Código**: `503 Service Unavailable` o `502 Bad Gateway`

### X-02 — Falla servicio de cifrado en reposo (NFR-02) al persistir datos cliente
KMS o servicio de cifrado no responde al guardar datos de cliente.
**Esperado**: fallar la escritura completa, nunca persistir en claro como fallback.
**Código**: `503 Service Unavailable`

### X-03 — Falla proveedor de resumen automático (FR-10, IA)
Servicio de generación de resumen (LLM/servicio externo) no responde dentro de 5s o cae.
**Esperado**: como es feature opcional (fase 2), degradar con gracia — mostrar orden sin resumen, no bloquear vista del supervisor.
**Código**: `200 OK` (orden) + indicador de resumen no disponible, o `504 Gateway Timeout` solo en endpoint específico de resumen

### X-04 — Falla servicio de autenticación/token (IdP externo) intermitente
Validación de token JWT contra servicio externo (si aplica) cae o da timeout.
**Esperado**: NFR-03 exige 401 ante token inválido — diferenciar "token inválido" real de "no se pudo validar por fallo externo" (no confundir con acceso legítimo denegado).
**Código**: `401 Unauthorized` si token inválido; `503 Service Unavailable` si fallo del validador (no exponer como 401 engañoso)

### X-05 — Falla en log de auditoría (NFR-04) durante cambio de estado
Sistema de auditoría (DB/servicio separado) no disponible al momento de aprobar/rechazar/reasignar.
**Esperado**: decidir si cambio de estado es atómico con el log (todo-o-nada) — dado requisito regulatorio de retención 12 meses, recomendado bloquear operación si audit log falla, no perder trazabilidad.
**Código**: `503 Service Unavailable` (rollback del cambio de estado)

### X-06 — Timeout de red durante validación de tipo de archivo (antivirus/escaneo externo)
Si validación de imagen (NFR-08) delega a servicio externo de escaneo/antivirus y este falla.
**Esperado**: no aceptar archivo sin validación completa por fallback inseguro; reintento acotado o rechazo explícito.
**Código**: `503 Service Unavailable`

### X-07 — Degradación de latencia de servicio externo afecta NFR-05/NFR-06
Storage o servicio dependiente responde lento (no cae, pero excede umbrales P95/P99).
**Esperado**: timeout explícito configurado, no esperar indefinidamente; métricas para detectar violación de NFR.
**Código**: `504 Gateway Timeout`

## Preguntas abiertas relevantes para estos edge cases
Varios casos (E-03, E-04) dependen de preguntas abiertas #2 y #3 del SPEC.md sin resolver — bloquean definición exacta de código/comportamiento hasta decisión de producto.
