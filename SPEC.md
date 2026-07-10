# Spec: Gestión de Órdenes de Trabajo

## Functional Requirements

**FR-01** — WHEN un técnico autenticado envía el registro de ejecución de una orden sin ninguna foto adjunta THE sistema SHALL rechazar el envío y devolver un error indicando que se requiere mínimo 1 foto de evidencia.

**FR-02** — WHEN un técnico autenticado envía el registro de ejecución de una orden asignada a él con al menos 1 foto adjunta THE sistema SHALL persistir la ejecución con estado "pendiente de revisión" y timestamp de envío.

**FR-03** — WHEN un técnico intenta registrar la ejecución de una orden que no está asignada a él THE sistema SHALL rechazar la operación con un error de autorización (403).

**FR-04** — WHEN un dispatcher autenticado reasigna una orden a otro técnico THE sistema SHALL actualizar el campo técnico-asignado de la orden y registrar el cambio con id del dispatcher, técnico anterior, técnico nuevo y timestamp.

**FR-05** — WHEN un dispatcher intenta reasignar una orden que ya está en estado "aprobada" THE sistema SHALL rechazar la reasignación con un error de estado inválido.

**FR-06** — WHEN un supervisor autenticado aprueba una orden en estado "pendiente de revisión" THE sistema SHALL cambiar el estado de la orden a "aprobada" y registrar id del supervisor y timestamp.

**FR-07** — WHEN un supervisor autenticado rechaza una orden en estado "pendiente de revisión" sin proporcionar un motivo de rechazo THE sistema SHALL rechazar la operación y exigir motivo obligatorio.

**FR-08** — WHEN un supervisor autenticado rechaza una orden en estado "pendiente de revisión" con motivo THE sistema SHALL cambiar el estado de la orden a "rechazada" y registrar motivo, id del supervisor y timestamp.

**FR-09** — WHEN un usuario autenticado solicita el listado de sus órdenes THE sistema SHALL devolver únicamente las órdenes donde ese usuario es el propietario/cliente asociado, sin incluir órdenes de otros usuarios.

**FR-10** *(opcional, fase 2 — brief usa "sería ideal")* — WHEN un supervisor abre una orden que tiene notas de técnico registradas THE sistema SHALL generar y mostrar un resumen automático de la incidencia basado en esas notas en menos de 5 s (P95).

### Fuera de alcance (explícitamente diferido por el brief: "eso lo vemos")
- Dashboard de métricas de productividad.
- Notificaciones push a técnicos.

## Non-Functional Requirements

**NFR-01 (Seguridad — transporte)** — Todo tráfico cliente-servidor SHALL usar TLS 1.2 o superior; conexiones sin TLS SHALL ser rechazadas.

**NFR-02 (Seguridad — datos en reposo)** — Los datos de cliente (nombre, dirección, contacto) almacenados SHALL estar cifrados en reposo con AES-256.

**NFR-03 (Seguridad — autorización)** — Cada endpoint SHALL requerir autenticación válida y aplicar control de acceso por rol (técnico, dispatcher, supervisor, usuario); el 100% de los endpoints sin excepción SHALL rechazar peticiones sin token válido con 401.

**NFR-04 (Auditoría)** — Todo cambio de estado de una orden (envío, reasignación, aprobación, rechazo) SHALL quedar registrado en log de auditoría con actor, acción y timestamp, con retención mínima de 12 meses.

**NFR-05 (Rendimiento — API)** — Las operaciones CRUD sobre órdenes (excluyendo subida de fotos) SHALL responder en P95 ≤ 300 ms y P99 ≤ 800 ms bajo carga nominal (100 req/s).

**NFR-06 (Rendimiento — subida de evidencia)** — La subida de una foto de evidencia de hasta 10 MB SHALL completarse en P95 ≤ 3 s con conexión de referencia de 10 Mbps.

**NFR-07 (Disponibilidad)** — El sistema SHALL mantener una disponibilidad mensual ≥ 99.5%.

**NFR-08 (Integridad de evidencia)** — El sistema SHALL validar que cada archivo adjunto sea imagen (jpg/png/heic) y rechazar cualquier archivo que no cumpla esa validación con error 415.


## Preguntas Abiertas
  1. Asignación inicial de orden — spec solo define reasignación (FR-04). ¿Quién crea la orden y asigna primer
  técnico? 
  - Se crea la orden por el dispacher sin asignacion .
  
  1. Flujo tras rechazo — FR-08 pone orden en "rechazada". ¿Es estado terminal o vuelve a técnico para reenviar
  ejecución? Sin esto no sé si hace falta un FR-09b de reenvío.
  1. Reasignación en otros estados — FR-05 bloquea solo si "aprobada". ¿Se puede reasignar orden "rechazada" o
  "pendiente de revisión"? Asumible pero no explícito.
  1. Notas del técnico — FR-10 depende de "notas de técnico registradas", pero ningún FR define captura de esas
  notas como campo del registro de ejecución (FR-02 solo habla de foto). ¿Notas son obligatorias u opcionales?
  1. Alcance de "sus órdenes" para técnico/dispatcher/supervisor — FR-09 cubre "usuario" (cliente). ¿Técnico ve
  solo sus asignadas, dispatcher/supervisor ven todas o por región/equipo? No definido.
  1. Cifrado de fotos — NFR-02 cifra "datos de cliente" en reposo. ¿Fotos de evidencia entran en ese alcance o
  no?
  1. Retención de fotos — NFR-04 define retención de audit log (12 meses). Sin retención definida para las fotos
  mismas (¿borran, cuánto tiempo?).