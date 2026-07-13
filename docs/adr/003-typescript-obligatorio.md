# ADR-003: TypeScript obligatorio (backend + frontend), migración retroactiva de 001/002/003

**Fecha**: 2026-07-13
**Estado**: Aceptado

## Contexto

El autor solicitó "TypeScript obligatorio" para el proyecto. Al momento de esta
decisión, `001-work-order-management`, `002-login-rbac` y
`003-dispatcher-orders-ui` ya están implementados 100% en JavaScript (backend
`.js` con Express/Prisma) y JavaScript/JSX (frontend React con Vite). Se
consultó el alcance del mandato — el autor eligió migrar TODO el código
existente ahora, no solo aplicar TypeScript a partir de código nuevo.

## Decisión

Se declara TypeScript obligatorio, sin excepción, para:

- **Backend**: todo archivo bajo `backend/src/` y `backend/tests/` pasa a
  `.ts`, compilado con `tsc` (`strict: true`). Prisma ya genera tipos
  (`@prisma/client`), lo que se aprovecha en los tipos de dominio.
- **Frontend**: todo archivo bajo `frontend/src/` y `frontend/tests/` pasa a
  `.tsx` (componentes) / `.ts` (servicios, utilidades).

Se ordena la migración retroactiva de los tres features ya implementados
(`001`, `002`, `003`) — no queda código JS/JSX remanente tras esta ADR. La
migración es un esfuerzo de ingeniería separado de esta ADR (que solo fija la
regla); se ejecuta como tarea de implementación inmediatamente después de
amendar la constitution, sin nueva spec/plan/tasks formal por tratarse de un
cambio de tipo mecánico (no cambia comportamiento ni contratos).

## Alternativas consideradas

- TypeScript solo para código nuevo, `001`/`002`/`003` quedan como excepción
  documentada (legacy JS): rechazada explícitamente por el autor — prefiere
  una sola base de código consistente sobre minimizar el retrabajo inmediato.
- TypeScript solo en backend, frontend permanece JS/JSX: rechazada — el autor
  pidió el mandato para "el proyecto", sin acotar a un servicio.
- Migración incremental por feature (mezclar `.js`/`.ts` durante una
  transición): rechazada — la constitution ya prohíbe mezclar sistemas de
  estilos por la misma razón (Principio de consistencia de stack); permitir
  una mezcla JS/TS prolongada generaría el mismo tipo de deriva.

## Consecuencias

- **Stack y Restricciones Técnicas** en `constitution.md` se reescribe:
  Backend y Frontend pasan a exigir TypeScript; se agrega una nota de
  migración retroactiva completa.
- Versión de constitution sube a **2.0.0 (MAJOR)** — no porque se elimine o
  redefina un Core Principle (I-VI quedan intactos), sino porque esta ADR
  invalida retroactivamente la conformidad de TODO el código ya entregado
  (`001`/`002`/`003` fueron construidos "conformes" bajo la constitution
  vigente en su momento; esta ADR rompe esa conformidad hasta que se complete
  la migración). Se prefiere sobre-señalizar el impacto (MAJOR) a
  subestimarlo (MINOR).
- Migración retroactiva requerida (bloquea trabajo nuevo sobre `003` hasta
  completarse, para no mezclar JS nuevo con TS a mitad de migración):
  - `backend/`: convertir `src/**/*.js` → `.ts`, `tests/**/*.js` → `.ts`;
    agregar `tsconfig.json`, `@types/*` necesarios, ajustar `jest.config.js`
    (`ts-jest` o `babel-jest` + preset TS); Prisma Client ya tipado, sin
    cambios de schema.
  - `frontend/`: convertir `src/**/*.jsx` → `.tsx`, `src/**/*.js` → `.ts`,
    `tests/**/*.jsx` → `.tsx`; agregar `tsconfig.json`, tipos de props por
    componente; Vite soporta TS nativamente (sin plugin adicional más allá del
    ya presente `@vitejs/plugin-react`).
  - Ningún contrato de API (`contracts/openapi.yaml`), comportamiento de
    negocio, ni test aserción cambia — es una migración de tipo mecánico
    (agregar tipos, renombrar extensión), no una reescritura funcional.
  - Los archivos `backend/src/generated/prisma-test-client/*` (generados por
    Prisma) NO se migran manualmente — son artefactos generados, ya
    consistentes con el cliente TS de Prisma.
