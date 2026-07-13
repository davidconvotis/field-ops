# Feature Specification: Panel de Dispatcher — Órdenes y Técnicos

**Feature Branch**: `003-dispatcher-orders-ui`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "el sistema debe permitir ver las ordenes creadas, mostrar listado de tecnicos para asignar una orden en el desplegable, menu lateral en dispacher para visualizar ordenes, tecnicos"

## Clarifications

### Session 2026-07-13

- Q: ¿El listado de órdenes debe incluir filtro por estado y por técnico asignado, o solo listado completo sin filtros en esta versión? → A: Sí, incluir filtro por estado y técnico.
- Q: ¿El refresco del listado de órdenes es una acción explícita (botón "Refrescar") o un refetch automático al navegar/montar la vista? → A: Botón/acción explícita de "Refrescar".
- Q: ¿Reasignar una orden que ya tiene técnico asignado a otro técnico requiere un paso de confirmación adicional (modal), o basta con seleccionar en el desplegable? → A: Requiere modal de confirmación adicional.
- Q: ¿Los listados extensos (órdenes/técnicos) usan paginación con controles de página, carga completa, o scroll infinito? → A: Paginación con controles de página, tamaño fijo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dispatcher visualiza listado de órdenes (Priority: P1)

Un dispatcher autenticado accede a su panel y ve el listado completo de órdenes creadas en el sistema (todas, sin restricción de equipo/región, según FR-018 de 001-work-order-management), con su estado y técnico asignado (si tiene).

**Why this priority**: Es el punto de entrada del dispatcher — sin visibilidad de las órdenes no puede decidir qué asignar ni a quién. Es prerequisito de las demás historias.

**Independent Test**: Puede probarse de forma aislada con varias órdenes en distintos estados (`sin_asignar`, `pendiente_de_revision`, `aprobada`, `rechazada`) y verificando que el dispatcher ve todas, con estado y técnico asignado visibles en el listado.

**Acceptance Scenarios**:

1. **Given** un dispatcher autenticado con órdenes existentes en el sistema, **When** accede al panel de órdenes, **Then** el sistema muestra el listado completo con id, estado, cliente, técnico asignado (o "sin asignar") y fecha de creación.
2. **Given** un dispatcher autenticado sin órdenes creadas aún, **When** accede al panel de órdenes, **Then** el sistema muestra un estado vacío indicando que no hay órdenes.
3. **Given** el listado de órdenes cargado, **When** una orden cambia de estado (ej. técnico registra ejecución) mientras el dispatcher tiene el panel abierto, **Then** el dispatcher puede refrescar el listado y ver el estado actualizado (no se exige actualización en tiempo real).
4. **Given** el listado de órdenes cargado, **When** el dispatcher aplica un filtro por estado y/o por técnico asignado, **Then** el sistema muestra únicamente las órdenes que cumplen el filtro seleccionado, pudiendo combinarse ambos filtros a la vez.
5. **Given** un filtro aplicado, **When** el dispatcher lo limpia, **Then** el sistema vuelve a mostrar el listado completo sin restricciones.

---

### User Story 2 - Dispatcher asigna orden a técnico desde desplegable (Priority: P1)

Un dispatcher, sobre una orden en estado asignable (`sin_asignar` o `pendiente_de_revision`), abre un desplegable que lista los técnicos disponibles (activos) y selecciona uno para asignar o reasignar la orden.

**Why this priority**: Es la acción central que el dispatcher realiza sobre cada orden; sin el listado de técnicos en el desplegable no puede completar la asignación (US2 de 001-work-order-management ya define el backend, esta historia cubre la UI que lo consume).

**Independent Test**: Puede probarse de forma aislada abriendo el desplegable de asignación sobre una orden asignable, verificando que solo aparecen técnicos activos, seleccionando uno y confirmando que la orden queda asignada a ese técnico.

**Acceptance Scenarios**:

1. **Given** una orden en estado `sin_asignar`, **When** el dispatcher abre el desplegable de asignación, **Then** el sistema muestra únicamente los técnicos con estado activo.
2. **Given** una orden `sin_asignar` (sin técnico previo) y el desplegable de técnicos abierto, **When** el dispatcher selecciona un técnico y confirma, **Then** el sistema asigna la orden a ese técnico y el listado de órdenes refleja el nuevo técnico asignado, sin paso de confirmación adicional.
3. **Given** una orden ya asignada a un técnico y el desplegable de técnicos abierto, **When** el dispatcher selecciona un técnico distinto, **Then** el sistema muestra un modal de confirmación indicando el técnico anterior y el nuevo antes de aplicar el cambio.
4. **Given** el modal de confirmación de reasignación visible, **When** el dispatcher confirma, **Then** el sistema reasigna la orden al nuevo técnico; **When** el dispatcher cancela, **Then** el sistema no aplica ningún cambio y la orden conserva el técnico anterior.
5. **Given** una orden en estado terminal (`aprobada` o `rechazada`), **When** el dispatcher intenta abrir el desplegable de asignación, **Then** el sistema no permite la acción (control deshabilitado o mensaje de estado inválido).
6. **Given** el desplegable de técnicos abierto, **When** no existe ningún técnico activo en el sistema, **Then** el sistema muestra un mensaje indicando que no hay técnicos disponibles, sin permitir confirmar la asignación.

---

### User Story 3 - Menú lateral de navegación en panel de dispatcher (Priority: P2)

Un dispatcher autenticado ve un menú lateral persistente con accesos directos a las secciones "Órdenes" y "Técnicos", pudiendo navegar entre ellas sin perder el contexto de sesión.

**Why this priority**: Mejora la usabilidad y organiza el acceso a las dos vistas principales, pero el sistema es funcional (aunque menos cómodo) si ambas vistas existen sin un menú dedicado — por eso es P2 y no P1.

**Independent Test**: Puede probarse de forma aislada iniciando sesión como dispatcher y verificando que el menú lateral está visible en todas las páginas del panel, que resalta la sección activa, y que cada opción navega a la vista correspondiente.

**Acceptance Scenarios**:

1. **Given** un dispatcher autenticado, **When** accede a su panel, **Then** el sistema muestra un menú lateral con al menos las opciones "Órdenes" y "Técnicos".
2. **Given** el menú lateral visible, **When** el dispatcher selecciona "Técnicos", **Then** el sistema navega a la vista de listado de técnicos y resalta esa opción como activa en el menú.
3. **Given** el menú lateral visible, **When** el dispatcher selecciona "Órdenes", **Then** el sistema navega al listado de órdenes (US1) y resalta esa opción como activa.
4. **Given** un usuario autenticado con rol distinto de dispatcher, **When** intenta acceder a las rutas del panel de dispatcher, **Then** el sistema rechaza el acceso según las reglas de control de acceso por rol ya definidas (login-rbac).

---

### User Story 4 - Dispatcher visualiza listado de técnicos (Priority: P2)

Un dispatcher accede a una vista dedicada de técnicos donde ve el listado completo de técnicos registrados, su estado (activo/inactivo) y, opcionalmente, cuántas órdenes tiene asignadas cada uno.

**Why this priority**: Da contexto adicional para decidir asignaciones (por ejemplo, evitar sobrecargar a un técnico), pero no bloquea el flujo mínimo de asignación (US2) que puede operar solo con el desplegable.

**Independent Test**: Puede probarse de forma aislada con varios técnicos activos e inactivos, verificando que el listado muestra todos con su estado correcto y, si aplica, el conteo de órdenes activas asignadas.

**Acceptance Scenarios**:

1. **Given** técnicos activos e inactivos registrados en el sistema, **When** el dispatcher accede a la vista de técnicos, **Then** el sistema muestra el listado completo indicando el estado de cada uno.
2. **Given** un técnico con órdenes asignadas en estados no terminales, **When** el dispatcher lo consulta en el listado, **Then** el sistema muestra la cantidad de órdenes activas asignadas a ese técnico.

---

### Edge Cases

- ¿Qué ocurre si el dispatcher intenta asignar una orden que otro dispatcher acaba de mover a estado terminal (carrera)? El sistema debe rechazar la asignación (409/422 según corresponda) y reflejar el estado real tras refrescar.
- ¿Qué ocurre si un técnico pasa a inactivo mientras el desplegable de asignación está abierto con ese técnico listado? El sistema debe rechazar la asignación si se intenta confirmar contra un técnico ya inactivo, según la regla existente en 001-work-order-management.
- ¿Cómo maneja el sistema un listado de órdenes o técnicos muy extenso? Se pagina con controles de página y tamaño fijo (FR-014) para mantener tiempos de respuesta aceptables (ver SC-002).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar al dispatcher un listado de todas las órdenes creadas, incluyendo id, estado, cliente, técnico asignado y fecha de creación.
- **FR-002**: El sistema MUST permitir al dispatcher refrescar el listado de órdenes mediante una acción explícita (botón "Refrescar") para ver el estado más reciente; el sistema NO recarga automáticamente al navegar o montar la vista.
- **FR-002a**: El sistema MUST permitir al dispatcher filtrar el listado de órdenes por estado y por técnico asignado, de forma combinable, y limpiar el filtro para volver al listado completo.
- **FR-003**: El sistema MUST mostrar, en el flujo de asignación de una orden, un desplegable con el listado de técnicos activos disponibles para asignar.
- **FR-004**: El sistema MUST excluir del desplegable de asignación a los técnicos inactivos.
- **FR-005**: El sistema MUST permitir al dispatcher asignar o reasignar una orden a un técnico seleccionado desde el desplegable, únicamente cuando la orden esté en un estado no terminal (`sin_asignar` o `pendiente_de_revision`).
- **FR-005a**: El sistema MUST mostrar un modal de confirmación (indicando técnico anterior y nuevo) antes de aplicar una reasignación sobre una orden que ya tiene técnico asignado; una asignación inicial (orden `sin_asignar`) no requiere este modal.
- **FR-006**: El sistema MUST deshabilitar o impedir la acción de asignación sobre órdenes en estado terminal (`aprobada` o `rechazada`).
- **FR-007**: El sistema MUST mostrar un mensaje claro cuando no existan técnicos activos disponibles para asignar.
- **FR-008**: El sistema MUST mostrar al dispatcher un menú lateral de navegación persistente con, como mínimo, accesos a "Órdenes" y "Técnicos".
- **FR-009**: El sistema MUST resaltar en el menú lateral la sección actualmente activa.
- **FR-010**: El sistema MUST restringir el acceso al panel de dispatcher (listado de órdenes, listado de técnicos, menú lateral) a usuarios autenticados con rol dispatcher, reutilizando el control de acceso por rol ya definido en 002-login-rbac.
- **FR-011**: El sistema MUST mostrar una vista dedicada de listado de técnicos con su estado (activo/inactivo).
- **FR-012**: El sistema MUST mostrar en el listado de técnicos la cantidad de órdenes en estado no terminal asignadas a cada técnico.
- **FR-013**: El sistema MUST mostrar un estado vacío distinguible cuando no existan órdenes o no existan técnicos registrados.
- **FR-014**: El sistema MUST paginar el listado de órdenes y el listado de técnicos mediante controles de página con tamaño de página fijo, cuando el número de registros exceda el tamaño de página.

### Key Entities

- **Orden**: entidad ya existente (001-work-order-management); en esta feature se consume su listado, estado, cliente y técnico asignado — sin nuevos atributos.
- **Técnico (Usuario con rol técnico)**: entidad ya existente; en esta feature se consume su estado `activo`/`inactivo` y, de forma derivada, el conteo de órdenes no terminales asignadas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un dispatcher puede localizar el estado de cualquier orden creada en menos de 10 segundos desde que accede al panel.
- **SC-002**: El listado de órdenes y el listado de técnicos cargan en menos de 2 segundos con hasta 500 registros.
- **SC-003**: Un dispatcher puede completar la asignación inicial de una orden `sin_asignar` a un técnico (abrir desplegable, seleccionar, confirmar) en 3 interacciones o menos; una reasignación sobre orden ya asignada requiere una interacción adicional (confirmar modal).
- **SC-004**: 100% de los intentos de asignación sobre técnicos inactivos u órdenes en estado terminal son rechazados sin generar asignaciones inconsistentes.
- **SC-005**: El menú lateral está presente y funcional en el 100% de las páginas del panel de dispatcher.

## Assumptions

- El backend de gestión de órdenes (creación, asignación, estados) ya existe según `001-work-order-management` y expone los datos necesarios (listado de órdenes, listado de usuarios con rol técnico y su estado `activo`).
- El control de acceso por rol (autenticación, sesión, permisos) ya existe según `002-login-rbac` y se reutiliza sin cambios para restringir el panel de dispatcher.
- No se requiere actualización en tiempo real (websockets/polling) del listado de órdenes; refrescar manualmente es suficiente para esta versión.
- El conteo de "órdenes activas asignadas" por técnico se calcula sobre estados no terminales (`sin_asignar` no aplica a técnico, se cuenta `pendiente_de_revision` y cualquier otro estado no terminal que exista).
- El tamaño de página exacto (ej. 50 o 100 registros) se define en la fase de planning; el requisito aquí es que exista paginación con controles de página, priorizando el cumplimiento de SC-002.
