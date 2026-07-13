# Feature Specification: Login con verificación RBAC

**Feature Branch**: `002-login-rbac`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "usa el agente de frontend y crea una vista de login, usa tailwindcss para todo el proyecto, conectalo con el backend para el rbac"

## Clarifications

### Session 2026-07-10

- Q: Session mechanism for token issued at login? → A: Stateless JWT (httpOnly cookie, no server-side session store)
- Q: JWT expiration duration (session TTL)? → A: 15 min access JWT + silent refresh via refresh-token cookie
- Q: Password storage/policy requirement? → A: bcrypt hash (cost ≥10), minimum 8 characters
- Q: Logout revocation for refresh token (stateless JWT)? → A: Denylist table of revoked refresh-token IDs, checked on refresh
- Q: Rate limiting on login attempts — formalize as FR? → A: Yes, promote to FR-010

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar sesión con credenciales válidas (Priority: P1)

Un usuario (Dispatcher, Technician o Supervisor) abre la aplicación, introduce su
email y contraseña, y accede a la vista correspondiente a su rol.

**Why this priority**: Sin login funcional ningún otro flujo del slice (reasignación,
registro de ejecución, aprobación) puede probarse de extremo a extremo con RBAC real.

**Independent Test**: Puede probarse por completo enviando credenciales válidas de
cada rol contra el endpoint de login y verificando que la sesión resultante permite
acceder a las acciones permitidas para ese rol.

**Acceptance Scenarios**:

1. **Given** un usuario con credenciales válidas y rol Dispatcher, **When** envía el
   formulario de login, **Then** el sistema autentica y redirige a la vista de
   reasignación de órdenes.
2. **Given** un usuario con credenciales válidas y rol Technician, **When** envía el
   formulario de login, **Then** el sistema autentica y redirige a la vista de
   registro de ejecución.
3. **Given** un usuario con credenciales válidas y rol Supervisor, **When** envía el
   formulario de login, **Then** el sistema autentica y redirige a la vista de
   aprobación/rechazo.

---

### User Story 2 - Rechazo de credenciales inválidas (Priority: P1)

Un usuario introduce un email o contraseña incorrectos y el sistema le informa sin
revelar cuál de los dos campos falló.

**Why this priority**: Es la contraparte obligatoria del login exitoso; sin manejo de
error correcto el flujo no es seguro ni utilizable.

**Independent Test**: Enviar credenciales inválidas contra el endpoint de login y
verificar respuesta 401 y mensaje genérico en la UI.

**Acceptance Scenarios**:

1. **Given** un email no registrado, **When** el usuario envía el formulario,
   **Then** el sistema muestra "Credenciales inválidas" sin indicar que el email no
   existe.
2. **Given** un email registrado con contraseña incorrecta, **When** el usuario envía
   el formulario, **Then** el sistema muestra el mismo mensaje genérico
   "Credenciales inválidas".
3. **Given** 5 intentos fallidos consecutivos para el mismo email en 15 minutos,
   **When** el usuario intenta un 6º login, **Then** el sistema responde 429 con
   mensaje genérico, sin revelar si el email existe.

---

### User Story 3 - Bloqueo de acceso a rutas fuera del rol (Priority: P2)

Un usuario autenticado intenta acceder (vía UI o petición HTTP directa) a una acción
reservada a otro rol y el sistema lo bloquea en el backend.

**Why this priority**: Verifica el Principio I (RBAC en Doble Capa) del proyecto:
ocultar en UI no es suficiente, el backend debe rechazar también.

**Independent Test**: Con un token válido de rol Technician, invocar directamente el
endpoint de aprobación/rechazo (reservado a Supervisor) y verificar 403, sin pasar
por la UI.

**Acceptance Scenarios**:

1. **Given** un token válido de rol Technician, **When** se invoca el endpoint de
   aprobación reservado a Supervisor, **Then** el backend responde 403.
2. **Given** un token ausente o expirado, **When** se invoca cualquier endpoint
   protegido, **Then** el backend responde 401.
3. **Given** un usuario autenticado con rol Technician, **When** navega la UI,
   **Then** no ve controles de aprobación/rechazo (ocultos por rol), aunque esto no
   sustituye la verificación del backend.

---

### Edge Cases

- Qué pasa si el usuario envía el formulario de login vacío (campos requeridos)?
- Qué pasa si el access JWT (15 min) expira mientras el usuario está activo: el
  cliente DEBE intentar refresh silencioso vía el refresh token antes de forzar
  nuevo login; si el refresh también expiró/fue revocado, se fuerza nuevo login.
- Qué pasa si se realizan múltiples intentos fallidos consecutivos de login (ver
  FR-010 — límite 5/15min, respuesta 429)?
- Qué pasa si el usuario ya tiene sesión activa y recarga la página (debe mantener
  sesión sin re-solicitar login, sin usar `localStorage` para el token)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE proveer una vista de login con campos de email y
  contraseña, estilizada con Tailwind CSS.
- **FR-002**: El sistema DEBE autenticar contra un endpoint de backend que valida
  credenciales y emite un access JWT firmado (expiración 15 min) más un refresh
  token (cookie httpOnly separada), ambos stateless — sin almacenamiento de sesión
  en servidor.
- **FR-002a**: El sistema DEBE renovar silenciosamente el access JWT usando el
  refresh token mientras el usuario esté activo, sin requerir nuevo login, hasta que
  el refresh token expire o se revoque (logout).
- **FR-003**: El sistema DEBE rechazar credenciales inválidas devolviendo 401 y un
  mensaje genérico, sin indicar cuál campo fue incorrecto.
- **FR-004**: El sistema DEBE incluir el rol del usuario en el token/sesión emitido
  tras login exitoso, para uso en las verificaciones RBAC existentes.
- **FR-005**: El sistema DEBE redirigir al usuario autenticado a la vista
  correspondiente a su rol (Dispatcher, Technician, Supervisor) tras login exitoso.
- **FR-006**: El sistema DEBE ocultar en la UI los controles y rutas no permitidos
  para el rol del usuario autenticado, sin que esto sustituya la verificación 401/403
  del backend (Principio I).
- **FR-007**: El sistema NUNCA DEBE almacenar el token de sesión en `localStorage`
  (restricción de seguridad ya vigente en la constitution).
- **FR-008**: El sistema DEBE validar en el backend que toda petición a un endpoint
  protegido incluya un token válido, devolviendo 401 si es ausente/inválido y 403 si
  el rol no tiene permiso.
- **FR-009**: El sistema DEBE permitir cerrar sesión (logout), invalidando el
  refresh token del lado del servidor mediante una denylist de tokens revocados
  (verificada en cada intento de refresh) y borrando las cookies del lado del
  cliente.
- **FR-010**: El sistema DEBE limitar intentos de login a 5 por email cada 15
  minutos; al exceder el límite, DEBE responder 429 con mensaje genérico sin
  revelar si el email existe.

### Key Entities

- **Usuario**: representa a Dispatcher, Technician o Supervisor. Atributos clave:
  email, hash de contraseña (bcrypt, cost ≥10, contraseña de origen mínimo 8
  caracteres), rol. Ya existente conceptualmente en el sistema RBAC del slice previo;
  este feature agrega el flujo de autenticación sobre esos usuarios.
- **Sesión/Token**: access JWT stateless (15 min) + refresh token (cookie httpOnly
  separada), firmados por el backend, contienen el rol del usuario y expiración; no
  hay tabla de sesiones en servidor. Usado por el backend para las verificaciones
  401/403.
- **Refresh Token Denylist**: tabla mínima en servidor con IDs de refresh tokens
  revocados (por logout), consultada en cada intento de refresh para permitir
  revocación real sin sesión completa en servidor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario con credenciales válidas completa el login y llega a su
  vista de rol en menos de 5 segundos.
- **SC-002**: El 100% de peticiones a endpoints protegidos sin token válido son
  rechazadas (401), con rol incorrecto son rechazadas (403), y logins que exceden
  5 intentos/15min son rechazados (429), verificado por prueba automatizada.
- **SC-003**: Ningún mensaje de error de login revela si el email existe o no en el
  sistema.
- **SC-004**: Todas las vistas de la aplicación usan exclusivamente Tailwind CSS para
  estilos (sin CSS ad-hoc ni otra librería de estilos mezclada).

## Assumptions

- El sistema de usuarios y roles (Dispatcher, Technician, Supervisor) ya existe desde
  el slice de gestión de órdenes de trabajo (`001-work-order-management`); este
  feature agrega el login sobre esos usuarios, no crea gestión de usuarios nueva.
- Registro de cuentas nuevas y recuperación de contraseña quedan fuera de este
  feature (ver `docs/adr/001-incluir-login-rbac-en-slice.md`).
- La sesión se mantiene mediante cookie httpOnly (no `localStorage`), coherente con
  la restricción de seguridad mínima ya vigente.
