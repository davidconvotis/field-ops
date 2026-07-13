# Phase 0 Research: Login con verificación RBAC

## 1. Transporte del JWT: cookie httpOnly vs header Authorization

**Decision**: Cambiar `authn.js` para leer el access JWT desde una cookie httpOnly
(`access_token`), manteniendo compatibilidad de lectura del header `Authorization:
Bearer` solo para llamadas de servicio-a-servicio internas si existieran (no es el
caso hoy — se elimina el soporte de header para simplificar, ya que el único
consumidor es el frontend propio).

**Rationale**: La constitution prohíbe `localStorage`. Un JWT en header requiere que
el frontend lo lea de algún storage accesible a JS (localStorage o memoria volátil,
que se pierde en refresh de página). La cookie httpOnly resuelve ambos problemas:
inaccesible a JS (mitiga XSS) y persiste entre recargas. Clarificación 2026-07-10
confirmó este mecanismo explícitamente.

**Alternatives considered**:
- Mantener header + guardar JWT en memoria de un store de React: se pierde la sesión
  al recargar la página (falla edge case de spec: "recarga la página... debe
  mantener sesión").
- Mantener header + sessionStorage: rechazado por la constitution (equivalente a
  localStorage en superficie de ataque XSS).

**Amendment (implementación)**: al implementar se descubrió que las ~74 pruebas de
`001-work-order-management` ya autentican vía `Authorization: Bearer` (fixtures
`issueDevToken`). Eliminar el header habría roto toda esa suite sin necesidad. Se
mantiene `authn.js` con **doble soporte**: cookie `access_token` primero, header
`Authorization: Bearer` como fallback — el frontend nuevo usa exclusivamente cookie
(nunca lee/escribe el token en JS), y las pruebas/tokens de dev de `001` siguen
funcionando sin cambios. No contradice FR-007 (el frontend nunca toca localStorage);
solo amplía qué acepta el backend.

## 2. Access + Refresh token (par de JWT) vs JWT único de larga duración

**Decision**: Access JWT de 15 min (payload: `sub`, `role`, `exp`) + refresh token
JWT de mayor duración (7 días, payload: `sub`, `jti`, `exp`), cada uno en su propia
cookie httpOnly (`access_token`, `refresh_token`). `idpAdapter.issueDevToken` (usado
hoy con expiración fija de 12h para tokens de desarrollo/seed) se mantiene intacto
para scripts de seed/test que no pasan por login real; se añade `issueTokenPair` como
función nueva para el flujo de login real.

**Rationale**: Clarificación 2026-07-10 fijó 15min+refresh silencioso. Reduce ventana
de exposición si el access token se filtra, sin forzar re-login cada 15 minutos.

**Alternatives considered**: JWT único de 8h (más simple, descartado por la
clarificación explícita del autor).

## 3. Revocación de refresh token sin sesión server-side completa

**Decision**: Tabla mínima `RevokedRefreshToken` (columnas: `jti` string único,
`revokedAt`, `expiresAt` para poder purgar filas vencidas). En `logout`, se inserta el
`jti` del refresh token activo. En `refresh`, antes de emitir un nuevo par se
verifica que el `jti` no esté en la tabla.

**Rationale**: Clarificación 2026-07-10 exigió revocación real, no solo borrado de
cookie en cliente. Una denylist de un solo campo es la extensión mínima sobre el
Prisma schema ya existente — no requiere una tabla de sesiones completa (que
reintroduciría estado server-side que la Clarificación #1 explícitamente rechazó).

**Alternatives considered**: Rotar un secreto de firma por usuario (invalidaría todos
los refresh tokens del usuario a la vez): rechazado, mucho más invasivo que una
denylist por `jti` y no permite revocar una sola sesión sin afectar otras.

## 4. Hashing de contraseña

**Decision**: `bcrypt` (paquete `bcrypt` npm), cost factor 10, aplicado sobre
`User.passwordHash` (columna nueva). Contraseña de origen mínimo 8 caracteres,
validado en el momento de creación de usuario (fuera de scope de este feature — se
asume seed/admin ya existente, ver Assumptions de spec.md).

**Rationale**: Clarificación 2026-07-10. `bcrypt` es el estándar de facto para
password hashing en Node.js, ya soporta salting automático.

**Alternatives considered**: `argon2` (más moderno, pero añade dependencia nativa
adicional sin necesidad justificada para este slice pequeño).

## 5. Rate limiting de intentos de login

**Decision**: Middleware en memoria (`Map<email, {count, windowStart}>`) para el
endpoint `/auth/login` únicamente, límite 5 intentos/15 min por email, respuesta 429
con mensaje genérico. No requiere Redis ni infraestructura adicional dado el scope
del slice (single-instance deployment, igual que `001`).

**Rationale**: FR-010 (formalizado en clarify). Un límite en memoria es suficiente
para el tamaño de este slice y consistente con el enfoque "adaptadores simples,
infra real fuera de alcance" ya usado en `001` (ej. `storageAdapter` local).

**Alternatives considered**: Rate limiting distribuido vía Redis: rechazado, over-
engineering para un slice de un solo proceso; se documenta como mejora futura si el
sistema escala a múltiples instancias.

## 6. Tailwind CSS — adopción en frontend existente

**Decision**: Instalar Tailwind CSS + PostCSS + Autoprefixer en `frontend/`,
configurar `content` apuntando a `src/**/*.{js,jsx}`, crear `src/index.css` con las
tres directivas `@tailwind base/components/utilities`, e importarlo en el entrypoint
de Vite. Las vistas ya existentes de `001` (`DispatcherBoard`, `TechnicianExecutionForm`,
`SupervisorReview`, `ClientOrders`) se migran a clases Tailwind de forma incremental
en las tasks de este feature, ya que la constitution v1.1.0 exige Tailwind "en todo
el proyecto".

**Rationale**: Mandato explícito del autor y de la constitution v1.1.0. Vite ya está
en uso — la integración de Tailwind con Vite es directa (plugin oficial
`@tailwindcss/vite` o PostCSS estándar).

**Alternatives considered**: Dejar las vistas de `001` sin migrar y solo aplicar
Tailwind a `Login.jsx`: rechazado, contradice el requisito explícito "usa
tailwindcss para todo el proyecto" y SC-004 del spec ("sin CSS ad-hoc ni otra
librería mezclada").
