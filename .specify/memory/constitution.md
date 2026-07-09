<!-- SYNC IMPACT REPORT
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: N/A (primera versión — sin historial previo)
Added sections:
  - Core Principles (6 principios)
  - Alcance del Sistema (dentro / fuera de scope)
  - Stack y Restricciones Técnicas
  - Governance
Removed sections: N/A
Templates reviewed:
  - .specify/templates/plan-template.md ✅ compatible
    (Constitution Check derivará gates de Principios I-VI)
  - .specify/templates/spec-template.md ✅ compatible
    (FRs en EARS, ACs y edge cases alinean con Principios II y III)
  - .specify/templates/tasks-template.md ✅ compatible
    (orden test-before-impl y paralelismo alinean con Principios III y V)
  - .specify/templates/commands/ ⚠ directorio no encontrado — sin acción requerida
Follow-up TODOs: Ninguno. Todos los placeholders resueltos.
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

### Fuera del slice (declarado explícitamente)

| Funcionalidad | Motivo de exclusión |
|---|---|
| Dashboard de métricas de productividad | Requiere capa analítica separada; fuera del brief prioritario |
| Notificaciones push a técnicos | Dependencia de infraestructura externa; aumenta riesgo sin aportar al slice |
| Gestión completa del ciclo de vida (draft → closed) | Solo las transiciones del slice son necesarias |
| Registro / autenticación de usuarios | Se asume sistema de identidad existente; fuera del slice |
| Gestión de clientes y activos | No requerido para las operaciones del slice |

## Stack y Restricciones Técnicas

**Backend**: Node.js 20+ con Express o NestJS (a elección del autor).

**Frontend**: React 18+ con framework de routing ligero.

**Contrato API**: OpenAPI 3.x — definido en `/contracts/openapi.yaml` antes de
implementar cualquier endpoint.

**Base de datos**: PostgreSQL (o SQLite para entorno de test en memoria).

**Tests**: Jest + Supertest para backend; React Testing Library para frontend.
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

**Version**: 1.0.0 | **Ratified**: 2026-07-09 | **Last Amended**: 2026-07-09
