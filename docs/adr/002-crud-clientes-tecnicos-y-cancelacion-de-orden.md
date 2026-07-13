# ADR-002: CRUD de clientes/técnicos, búsqueda de clientes y cancelación de orden

**Fecha**: 2026-07-13
**Estado**: Aceptado

## Contexto

La constitution v1.1.0 declaraba explícitamente fuera del slice:

- "Gestión completa del ciclo de vida (draft → closed)" — motivo: "Solo las
  transiciones del slice son necesarias".
- "Gestión de clientes y activos" — motivo: "No requerido para las operaciones
  del slice".

El autor solicitó ampliar `003-dispatcher-orders-ui` con:

1. CRUD de clientes (crear/editar/baja lógica) desde el panel de dispatcher.
2. CRUD ampliado de técnicos (crear/editar, además de activar/desactivar ya
   existente).
3. Búsqueda de clientes existentes por cualquier campo (nombre/email/id) al
   crear una orden, en vez de un `clientId` de texto libre.
4. Edición del cliente asociado a una orden en estado no terminal.
5. Cancelación de una orden en estado no terminal (nuevo estado terminal
   `cancelada`, con motivo obligatorio).

Los puntos 1, 2 y 3 contradicen la exclusión "Gestión de clientes y activos".
El punto 5 contradice la exclusión "Gestión completa del ciclo de vida" (una
nueva transición de estado no prevista en el slice original). Esto se detectó
en `/speckit-clarify` (ronda 2) de `003-dispatcher-orders-ui`, que dejó FR-025
(cancelación) explícitamente bloqueado para `/speckit-plan` hasta resolver esta
contradicción vía ADR + amend de constitution.

## Decisión

Se incluye en el slice (mueve de "Fuera del slice" a "Dentro del slice"):

- Gestión de clientes: alta, edición (nombre/email) y baja lógica
  (`activo=false`, nunca borrado físico) — rol Dispatcher.
- Gestión ampliada de técnicos: alta y edición (nombre/email), sumado al
  activar/desactivar ya existente — rol Dispatcher.
- Búsqueda de clientes existentes por cualquier campo al crear una orden — rol
  Dispatcher.
- Edición del cliente asociado a una orden mientras esté en estado no terminal
  — rol Dispatcher.
- Cancelación de orden: nueva transición desde cualquier estado no terminal
  (`sin_asignar`, `pendiente_de_revision`) al nuevo estado terminal
  `cancelada`, con motivo obligatorio, auditada igual que aprobación/rechazo —
  rol Dispatcher.

Se excluye explícitamente (permanece o queda fuera de scope, con alcance
acotado respecto a la redacción anterior):

- Gestión de activos (equipos/inventario asociados a la orden) — la exclusión
  "Gestión de clientes y activos" se estrecha: clientes ahora está dentro,
  activos sigue fuera.
- Cualquier estado de ciclo de vida adicional a
  `sin_asignar | pendiente_de_revision | aprobada | rechazada | cancelada`
  (ej. `draft` explícito, reapertura de una orden `cancelada`, archivado) — la
  exclusión "gestión completa del ciclo de vida" se estrecha a esto, en vez de
  cubrir toda transición no prevista.
- Borrado físico de cliente/técnico — siempre baja lógica, sin excepción
  (decisión de `/speckit-clarify` ronda 2 de `003`).

## Alternativas consideradas

- No amendar la constitution y dejar la cancelación/CRUD fuera del spec:
  rechazado — el autor pidió explícitamente esta funcionalidad; ocultarla no
  resuelve la necesidad, solo pospone la decisión.
- Permitir borrado físico de cliente/técnico cuando no tiene historial: rechazado
  en clarify ronda 2 — un único camino de código (baja lógica siempre) es más
  simple y evita una rama especial de bajo valor.
- Tratar la cancelación como parte de "rechazo" (reutilizar `rechazada` en vez
  de un estado nuevo): rechazado — mezclaría dos motivos semánticamente
  distintos (calidad de trabajo rechazada por supervisor vs. orden cancelada
  por decisión operativa del dispatcher) bajo el mismo estado, dificultando
  reportes/auditoría futuros.

## Consecuencias

- Se actualiza la tabla "Alcance del Sistema" en `constitution.md`: 5 filas
  nuevas en "Dentro del slice", 2 filas reemplazadas (acotadas) en "Fuera del
  slice".
- Versión de constitution sube a 1.2.0 (MINOR: nueva funcionalidad en scope,
  ningún principio existente se redefine ni se elimina).
- `003-dispatcher-orders-ui/spec.md` FR-025/FR-026 (cancelación) queda
  desbloqueado para `/speckit-plan`.
- `001-work-order-management/spec.md` no se modifica retroactivamente — su
  exclusión de cancelación seguía vigente en el momento en que se escribió;
  esta ADR documenta la ampliación posterior, no una corrección de aquel spec.
