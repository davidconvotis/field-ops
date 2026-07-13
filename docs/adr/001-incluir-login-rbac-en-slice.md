# ADR-001: Incluir vista de login y verificación RBAC en el slice

**Fecha**: 2026-07-10
**Estado**: Aceptado

## Contexto

La constitution v1.0.0 declaraba "Registro / autenticación de usuarios" fuera del
slice, asumiendo un sistema de identidad existente. El autor solicitó una vista de
login (Tailwind CSS) conectada al backend para verificar RBAC, necesaria para probar
de extremo a extremo el Principio I (RBAC en Doble Capa) sin depender de un sistema
externo no disponible.

## Decisión

Se incluye en el slice:

- Vista de login (formulario email/password) con Tailwind CSS.
- Endpoint de autenticación en el backend que emite el token usado por las
  verificaciones RBAC ya definidas (401/403).
- Persistencia de sesión sin usar `localStorage` (Principio de seguridad mínima ya
  vigente).

Se excluye explícitamente (permanece fuera de scope):

- Registro de nuevas cuentas / self-service signup.
- Recuperación de contraseña.
- Gestión de perfil de usuario más allá del login.

## Alternativas consideradas

- Mantener el login fuera de scope y simular auth con token fijo en tests: rechazado,
  no permite verificar RBAC de extremo a extremo con un flujo real de usuario.
- Integrar un proveedor de identidad externo (OAuth2/SSO): rechazado por aumentar
  alcance y dependencias externas, contradice Principio V (Slice Pequeño y Completo).

## Consecuencias

- Se actualiza la tabla "Fuera del slice" en `constitution.md`, retirando la fila de
  autenticación y añadiendo la nueva fila a "Dentro del slice".
- Versión de constitution sube a 1.1.0 (MINOR: nueva funcionalidad en scope, sin
  romper principios existentes).
- Tailwind CSS se añade como restricción de stack de frontend.
