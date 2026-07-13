<!-- SYNC IMPACT REPORT
Version change: 1.2.0 → 2.0.0 (MAJOR — ver ADR-003; razonamiento explícito: ningún
  Core Principle I-VI se elimina/redefine, pero el mandato de TypeScript retroactivo
  invalida la conformidad de TODO el código ya entregado (001/002/003, construido
  conforme a la constitution vigente en su momento bajo stack JS/JSX) hasta completar
  la migración. Se prefiere sobre-señalizar el impacto (MAJOR) a subestimarlo (MINOR).
Modified principles: Ninguno modificado
Added sections: Ninguna nueva sección
Modified sections:
  - Stack y Restricciones Técnicas: Backend y Frontend pasan a exigir TypeScript
    obligatorio (antes JS/JSX); migración retroactiva completa de 001/002/003 ordenada
    (ver docs/adr/003-typescript-obligatorio.md)
Removed sections: N/A
Templates reviewed:
  - .specify/templates/plan-template.md ✅ compatible (Technical Context ya permite declarar lenguaje/versión)
  - .specify/templates/spec-template.md ✅ compatible (no referencia stack)
  - .specify/templates/tasks-template.md ✅ compatible (no referencia stack)
Follow-up TODOs:
  - Migración mecánica de backend/ y frontend/ de JS/JSX a TS/TSX (ver ADR-003,
    sección Consecuencias) — pendiente de ejecución inmediata, bloquea nuevo trabajo
    de features hasta completarse.
-->

# FieldOps Constitution

## Core Principles

### I. RBAC en Doble Capa (NON-NEGOTIABLE)

La protección de acceso por rol DEBE existir en el backend. Ocultar un elemento de UI
no constituye control de acceso.

- Todo endpoint protegido DEBE devolver **401** cuando el token es ausente o inválido.
- Todo endpoint protegido DEBE devolver **403** cuando el token es válido pero el rol
  no tiene permiso para la operación.
- La UI PUEDE ocultar controles irrelevantes por rol, pero NUNCA como única línea de
  defensa.
- Los tests DEBEN verificar que forzar una petición HTTP directa con el rol incorrecto
  devuelve 403, independientemente del estado de la UI.

### II. Contrato Antes que Código

El contrato de la API DEBE definirse y revisarse antes de escribir cualquier
implementación de endpoint.

- El contrato se expresa en OpenAPI 3.x y se almacena en `/contracts/openapi.yaml`.
- Los tests de contrato DEBEN verificar el contrato, no la implementación interna.
- Ningún endpoint puede considerarse "listo" si no tiene al menos un test de contrato
  en verde.
- Cambios al contrato requieren actualización del OpenAPI antes de modificar el código.

### III. Trazabilidad Requisito → Test

Cada acceptance criteria de la especificación DEBE poder rastrearse hasta una prueba
concreta en el repositorio.

- La matriz de trazabilidad se mantiene en `/docs/traceability.md` con formato:
  `FR-ID → AC-ID → test file:test name`.
- Un requisito sin prueba trazable NO está terminado, aunque el código funcione.
- Los tests se escriben referenciando el ID del AC que verifican (comentario o
  nombre del test).

### IV. IA con Fallback Explícito — No Invención

El componente de resumen de incidencia DEBE especificarse como contrato formal antes
de implementarse: entradas, salidas esperadas y comportamiento ante evidencia
insuficiente.

- Si las notas del técnico están vacías, son menores a 20 palabras o carecen de
  descripción del problema, el componente DEBE responder con un mensaje de fallback
  explícito (ej. `"Evidencia insuficiente para generar resumen"`).
- Está **prohibido** generar resúmenes especulativos o rellenar huecos con
  suposiciones.
- El componente DEBE acompañarse de evals en `/evals/` con golden cases y umbrales
  de aceptación definidos antes de la primera ejecución en producción.
- Los golden cases DEBEN cubrir: caso nominal, caso de evidencia insuficiente y caso
  de notas ambiguas.

### V. Slice Pequeño y Completo

Un slice no está terminado hasta que frontend, backend y tests están en verde a la vez.

- Está prohibido entregar UI sin el backend correspondiente.
- Está prohibido entregar backend sin los tests de contrato e integración
  correspondientes.
- El scope del slice se mantiene deliberadamente pequeño: es preferible una feature
  bien hecha a tres features incompletas.
- Las funcionalidades fuera de alcance DEBEN declararse explícitamente en la
  constitution y en la spec con justificación.

### VI. Spec Antes que Código

El historial de git DEBE demostrar que los artefactos de especificación preceden al
primer commit de implementación.

- El orden de commits DEBE seguir:
  `constitution` → `spec` → `clarify` → `checklist` → `plan` → `tasks` → `analyze`
  → implementación.
- Ningún commit de código de producción (`src/`) puede aparecer antes del commit de
  `tasks.md` en la rama principal.
- El agente solo avanza a la siguiente fase con confirmación explícita del autor.

## Alcance del Sistema

### Dentro del slice

| # | Funcionalidad | Rol responsable |
|---|---|---|
| 1 | Reasignación de orden de trabajo | Dispatcher |
| 2 | Registro de ejecución con evidencia fotográfica (≥1 foto) | Technician |
| 3 | Aprobación / rechazo de orden en estado `pending_review` | Supervisor |
| 4 | RBAC en doble capa para las tres acciones anteriores | Sistema |
| 5 | Resumen IA de incidencia a partir de notas del técnico | Sistema / Supervisor |
| 6 | Login (email/password) conectado a verificación RBAC | Sistema |
| 7 | Gestión de clientes: alta, edición (nombre/email), baja lógica (`activo=false`, nunca borrado físico) | Dispatcher |
| 8 | Gestión ampliada de técnicos: alta y edición (nombre/email), sumado al activar/desactivar ya existente | Dispatcher |
| 9 | Búsqueda de clientes existentes por cualquier campo (nombre/email/id) al crear una orden | Dispatcher |
| 10 | Edición del cliente asociado a una orden mientras esté en estado no terminal | Dispatcher |
| 11 | Cancelación de orden en estado no terminal → nuevo estado terminal `cancelada`, con motivo obligatorio y auditoría | Dispatcher |

### Fuera del slice (declarado explícitamente)

| Funcionalidad | Motivo de exclusión |
|---|---|
| Dashboard de métricas de productividad | Requiere capa analítica separada; fuera del brief prioritario |
| Notificaciones push a técnicos | Dependencia de infraestructura externa; aumenta riesgo sin aportar al slice |
| Estados de ciclo de vida adicionales a `sin_asignar \| pendiente_de_revision \| aprobada \| rechazada \| cancelada` (ej. `draft` explícito, reapertura de una orden `cancelada`, archivado) | Ver ADR-002; acota la exclusión previa "gestión completa del ciclo de vida" ahora que `cancelada` está dentro del slice (fila 11) |
| Registro de nuevas cuentas / self-service signup | Ver ADR-001; fuera del slice |
| Recuperación de contraseña | Ver ADR-001; fuera del slice |
| Gestión de activos (equipos/inventario asociados a la orden) | Ver ADR-002; acota la exclusión previa "gestión de clientes y activos" ahora que la gestión de clientes está dentro del slice (filas 7, 9, 10) |
| Borrado físico de cliente o técnico | Ver ADR-002 / clarify ronda 2 de `003-dispatcher-orders-ui`; siempre baja lógica, sin excepción, incluso sin historial de órdenes |

## Stack y Restricciones Técnicas

**Backend**: Node.js 20+ con Express o NestJS (a elección del autor). **TypeScript
obligatorio** (`strict: true`) — no se admite JavaScript nuevo ni remanente
(ver ADR-003). Prisma Client ya genera tipos; se reutilizan como base de los
tipos de dominio.

**Frontend**: React 18+ con framework de routing ligero. **TypeScript obligatorio**
(`.tsx` para componentes, `.ts` para servicios/utilidades) — no se admite JS/JSX
nuevo ni remanente (ver ADR-003). Estilos con Tailwind CSS en todo el proyecto
(obligatorio, no mezclar con otro sistema de estilos).

**Migración retroactiva (ADR-003, NON-NEGOTIABLE)**: `001-work-order-management`,
`002-login-rbac` y `003-dispatcher-orders-ui`, implementados originalmente en
JS/JSX, DEBEN migrarse íntegramente a TypeScript — es una migración mecánica
(tipos + extensión de archivo), no un cambio de comportamiento, contrato ni
test. No se admite código JS/JSX remanente tras completar la migración.

**Contrato API**: OpenAPI 3.x — definido en `/contracts/openapi.yaml` antes de
implementar cualquier endpoint.

**Base de datos**: PostgreSQL (o SQLite para entorno de test en memoria).

**Tests**: Jest + Supertest (con soporte TypeScript, `ts-jest` o `babel-jest` +
preset TS) para backend; React Testing Library para frontend (tests en `.tsx`/`.ts`).
Cobertura mínima: todos los acceptance criteria del slice deben tener prueba trazable.

**Evals IA**: Golden cases en `/evals/` con umbrales de aceptación definidos
explícitamente antes de la primera ejecución en producción.

**Arranque**: El proyecto DEBE instalarse y testearse con un único comando cada uno,
documentados exactamente en `README.md`.

**Seguridad mínima**:
- Los tokens de autenticación NUNCA se almacenan en `localStorage`.
- Las fotos de evidencia DEBEN validarse en tipo MIME y tamaño en el backend.
- Los errores del backend NUNCA exponen stack traces en respuestas de producción.

## Governance

Esta constitution supersede cualquier decisión local de implementación o preferencia
de herramienta.

**Procedimiento de enmienda**:
1. Documentar la motivación en un ADR en `/docs/adr/`.
2. Describir el principio afectado y las alternativas consideradas.
3. Actualizar este archivo incrementando la versión según semver.
4. Propagar los cambios a los templates afectados.

**Política de versioning**:
- MAJOR: eliminación o redefinición incompatible de un principio.
- MINOR: adición de nuevo principio o sección con impacto material.
- PATCH: clarificaciones o correcciones de redacción.

**Compliance**: Cada PR de implementación DEBE referenciar los principios que verifica
o los ACs que cierra. Los revisores DEBEN comprobar que no se introduce código de
producción sin prueba trazable (Principio III).

**Version**: 2.0.0 | **Ratified**: 2026-07-09 | **Last Amended**: 2026-07-13
