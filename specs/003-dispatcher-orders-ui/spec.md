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

### Session 2026-07-13 (ronda 2 — ampliación CRUD)

- Q: FR-025/FR-026 (cancelación de órdenes) contradice la exclusión ya documentada en `001-work-order-management` y en la constitution ("Gestión completa del ciclo de vida" fuera del slice) → A: Se mantiene en el spec, pero queda BLOQUEADO para `/speckit-plan` hasta resolver vía ADR + amend de constitution (no se planifica esta parte sin eso). **Resuelto 2026-07-13**: ver ADR-002 y constitution v1.2.0 — desbloqueado.
- Q: ¿"Eliminar" cliente/técnico es siempre baja lógica, o se permite borrado físico cuando no tiene ninguna orden asociada? → A: Siempre baja lógica (`activo=false`), sin excepción, incluso sin historial.

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

### User Story 5 - Dispatcher busca cliente existente por cualquier campo al crear una orden (Priority: P1)

Al crear una nueva orden, el dispatcher escribe texto libre y el sistema busca entre los clientes existentes por cualquier campo (nombre, email o id), mostrando coincidencias parciales para seleccionar el cliente correcto sin conocer su id de memoria.

**Why this priority**: Sustituye el campo "Cliente ID" de texto libre (propenso a error, requiere conocer el uuid) que ya existe en el flujo de creación de orden — es P1 porque toda creación de orden pasa por aquí.

**Independent Test**: Con varios clientes creados, tipear un fragmento de nombre o email en el buscador y verificar que aparecen solo los clientes que coinciden; seleccionar uno y crear la orden verifica que queda asociada al cliente correcto.

**Acceptance Scenarios**:

1. **Given** clientes existentes con nombres/emails distintos, **When** el dispatcher tipea un fragmento que coincide con el nombre de uno o más, **Then** el sistema muestra esas coincidencias (parcial, no distingue mayúsculas/minúsculas).
2. **Given** el buscador de clientes, **When** el dispatcher tipea un fragmento que coincide con el email o el id de un cliente, **Then** también aparece en los resultados (búsqueda por cualquier campo, no solo nombre).
3. **Given** resultados de búsqueda visibles, **When** el dispatcher selecciona un cliente, **Then** el formulario de creación de orden queda asociado a ese `clientId` y ya no acepta texto libre como id.
4. **Given** un texto buscado sin ninguna coincidencia, **When** el dispatcher lo confirma, **Then** el sistema ofrece la opción de crear un cliente nuevo (US6) con ese dato como punto de partida, en vez de permitir crear la orden con un cliente inexistente.

---

### User Story 6 - Dispatcher gestiona clientes (CRUD) (Priority: P2)

Un dispatcher crea, edita y da de baja clientes desde una vista dedicada, análoga a la de técnicos.

**Why this priority**: Necesaria para que la búsqueda de US5 tenga clientes para encontrar y para corregir datos, pero no bloquea la creación de órdenes si el cliente ya existe — por eso P2 y no P1.

**Independent Test**: Crear un cliente nuevo con nombre/email, verificar que aparece en la búsqueda de US5; editarlo y verificar que el cambio se refleja; darlo de baja y verificar que ya no aparece en la búsqueda pero sus órdenes históricas siguen visibles.

**Acceptance Scenarios**:

1. **Given** un dispatcher en la vista de clientes, **When** crea un cliente con nombre y email válidos, **Then** el sistema lo persiste y queda disponible para búsqueda (US5) inmediatamente.
2. **Given** un cliente existente, **When** el dispatcher edita su nombre o email, **Then** el sistema persiste el cambio y las órdenes ya creadas muestran el nombre actualizado.
3. **Given** un cliente existente, **When** el dispatcher lo da de baja, **Then** el sistema lo marca inactivo (baja lógica, nunca borrado físico — ver Assumptions), lo excluye de nuevas búsquedas (US5), y conserva intactas sus órdenes históricas.
4. **Given** un email ya usado por otro usuario, **When** el dispatcher intenta crear/editar un cliente con ese email, **Then** el sistema rechaza la operación (conflicto de unicidad).

---

### User Story 7 - Dispatcher gestiona técnicos (CRUD ampliado) (Priority: P2)

Además de activar/desactivar (ya existente), un dispatcher crea nuevos técnicos y edita nombre/email de los existentes desde la vista de Técnicos.

**Why this priority**: Completa el ciclo de vida de técnicos, pero el sistema ya es operable con técnicos precargados — no bloquea el flujo core de asignación.

**Independent Test**: Crear un técnico nuevo, verificar que aparece (activo por defecto) en el listado de técnicos (US4) y en el desplegable de asignación (US2); editar su nombre y verificar el cambio reflejado en ambos lugares.

**Acceptance Scenarios**:

1. **Given** un dispatcher en la vista de técnicos, **When** crea un técnico con nombre y email válidos, **Then** el sistema lo persiste como activo por defecto.
2. **Given** un técnico existente, **When** el dispatcher edita su nombre o email, **Then** el sistema persiste el cambio.
3. **Given** un email ya usado por otro usuario, **When** el dispatcher intenta crear/editar un técnico con ese email, **Then** el sistema rechaza la operación (conflicto de unicidad).
4. La baja de técnico (activo=false) reutiliza el mecanismo ya existente (`001-work-order-management` FR-004d) — no se agrega comportamiento nuevo aquí.

---

### User Story 8 - Dispatcher edita y cancela órdenes (CRUD ampliado de órdenes) (Priority: P2)

Un dispatcher corrige el cliente asociado a una orden creada por error, y puede cancelar una orden en estado no terminal indicando un motivo.

**Why this priority**: Cubre casos de corrección/arrepentimiento; el ciclo de vida core (crear/asignar/ejecutar/aprobar-rechazar) ya funciona sin esto — es un complemento, no un bloqueante.

**Independent Test**: Crear una orden con un cliente equivocado, editarla para asociarla al cliente correcto, verificar el cambio; luego cancelar una orden no terminal con motivo y verificar que queda en estado `cancelada` (terminal) con motivo y timestamp auditados.

**Acceptance Scenarios**:

1. **Given** una orden en estado no terminal, **When** el dispatcher edita el cliente asociado, **Then** el sistema persiste el nuevo `clientId` y registra el cambio en auditoría.
2. **Given** una orden en estado terminal (`aprobada`, `rechazada` o `cancelada`), **When** el dispatcher intenta editar su cliente, **Then** el sistema rechaza la operación (422).
3. **Given** una orden en estado no terminal, **When** el dispatcher la cancela indicando un motivo no vacío, **Then** el sistema transiciona la orden a `cancelada` (nuevo estado terminal) y registra motivo, dispatcher y timestamp.
4. **Given** una orden en estado no terminal, **When** el dispatcher intenta cancelarla sin motivo, **Then** el sistema rechaza la operación (400) exigiendo motivo obligatorio.
5. **Given** una orden ya `cancelada`, **When** cualquier rol intenta asignarla, editarla o volver a cancelarla, **Then** el sistema la trata como cualquier otro estado terminal (rechazo 422/409 según corresponda).

---

### Edge Cases

- ¿Qué ocurre si el dispatcher intenta asignar una orden que otro dispatcher acaba de mover a estado terminal (carrera)? El sistema debe rechazar la asignación (409/422 según corresponda) y reflejar el estado real tras refrescar.
- ¿Qué ocurre si un técnico pasa a inactivo mientras el desplegable de asignación está abierto con ese técnico listado? El sistema debe rechazar la asignación si se intenta confirmar contra un técnico ya inactivo, según la regla existente en 001-work-order-management.
- ¿Cómo maneja el sistema un listado de órdenes o técnicos muy extenso? Se pagina con controles de página y tamaño fijo (FR-014) para mantener tiempos de respuesta aceptables (ver SC-002).
- ¿Qué ocurre si la búsqueda de clientes (US5) no encuentra coincidencias? El sistema ofrece crear un cliente nuevo inline (US6) en vez de bloquear la creación de la orden.
- ¿Qué ocurre si dos dispatchers editan/cancelan la misma orden casi simultáneamente? Se reutiliza el mismo chequeo atómico (optimistic lock por `version`) ya definido en `001-work-order-management` FR-05b — la segunda operación recibe 409 con el estado real.
- ¿Qué ocurre si se intenta dar de baja (desactivar) un cliente que tiene órdenes en curso (no terminales)? A diferencia de los técnicos (que se reasignan automáticamente, FR-004d), las órdenes de un cliente dado de baja NO cambian de estado ni de cliente — la baja de cliente solo afecta si aparece en búsquedas futuras (US5), nunca altera órdenes existentes.

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
- **FR-015**: El sistema MUST permitir al dispatcher crear un nuevo cliente (nombre, email) desde una vista dedicada.
- **FR-016**: El sistema MUST permitir al dispatcher editar nombre/email de un cliente existente.
- **FR-017**: El sistema MUST permitir al dispatcher dar de baja (baja lógica, `activo=false`) a un cliente existente; un cliente inactivo se excluye de la búsqueda de US5 pero sus órdenes históricas permanecen intactas y visibles.
- **FR-018**: El sistema MUST rechazar la creación/edición de un cliente o técnico con un email ya usado por otro usuario (conflicto de unicidad).
- **FR-019**: El sistema MUST permitir al dispatcher crear un nuevo técnico (nombre, email) desde la vista de técnicos, activo por defecto.
- **FR-020**: El sistema MUST permitir al dispatcher editar nombre/email de un técnico existente.
- **FR-021**: El sistema MUST permitir buscar clientes existentes por cualquier campo (nombre, email o id) mediante texto libre con coincidencia parcial, al crear una nueva orden.
- **FR-022**: El sistema MUST exigir que una nueva orden se asocie a un cliente existente seleccionado de los resultados de búsqueda (FR-021) — nunca a un `clientId` arbitrario no verificado; si no hay coincidencias, el sistema ofrece crear el cliente primero (FR-015).
- **FR-023**: El sistema MUST permitir al dispatcher editar el cliente asociado a una orden mientras esté en un estado no terminal, registrando el cambio en auditoría.
- **FR-024**: El sistema MUST rechazar la edición de cliente/asignación/cancelación sobre una orden en estado terminal (`aprobada`, `rechazada` o el nuevo `cancelada`).
- **FR-025**: El sistema MUST permitir al dispatcher cancelar una orden en estado no terminal indicando un motivo obligatorio no vacío, transicionándola a un nuevo estado terminal `cancelada` con motivo, dispatcher y timestamp registrados.
- **FR-026**: El estado `cancelada` MUST comportarse como cualquier otro estado terminal a todo efecto (no reasignable, no editable, visible en listados/histórico).

### Key Entities

- **Orden**: entidad ya existente (001-work-order-management); en esta feature se consume su listado, estado, cliente y técnico asignado, y se amplía con la transición a un nuevo estado terminal `cancelada` (FR-025/FR-026) y la edición de su `clientId` en estado no terminal (FR-023).
- **Técnico (Usuario con rol técnico)**: entidad ya existente; en esta feature se consume su estado `activo`/`inactivo` y, de forma derivada, el conteo de órdenes no terminales asignadas; se amplía con creación/edición (FR-019/FR-020).
- **Cliente (Usuario con rol cliente)**: entidad ya existente (`001-work-order-management`); en esta feature se amplía con creación/edición/baja lógica (FR-015..FR-017) y se vuelve buscable por cualquier campo al crear una orden (FR-021).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un dispatcher puede localizar el estado de cualquier orden creada en menos de 10 segundos desde que accede al panel.
- **SC-002**: El listado de órdenes y el listado de técnicos cargan en menos de 2 segundos con hasta 500 registros.
- **SC-003**: Un dispatcher puede completar la asignación inicial de una orden `sin_asignar` a un técnico (abrir desplegable, seleccionar, confirmar) en 3 interacciones o menos; una reasignación sobre orden ya asignada requiere una interacción adicional (confirmar modal).
- **SC-004**: 100% de los intentos de asignación sobre técnicos inactivos u órdenes en estado terminal son rechazados sin generar asignaciones inconsistentes.
- **SC-005**: El menú lateral está presente y funcional en el 100% de las páginas del panel de dispatcher.
- **SC-006**: Un dispatcher encuentra y selecciona un cliente existente en menos de 10 segundos tipeando un fragmento de nombre, email o id.
- **SC-007**: 100% de las órdenes canceladas quedan auditadas (motivo, dispatcher, timestamp) con la misma trazabilidad que aprobación/rechazo.
- **SC-008**: 100% de los intentos de crear/editar cliente o técnico con email duplicado son rechazados sin crear registros inconsistentes.

## Assumptions

- El backend de gestión de órdenes (creación, asignación, estados) ya existe según `001-work-order-management` y expone los datos necesarios (listado de órdenes, listado de usuarios con rol técnico y su estado `activo`).
- El control de acceso por rol (autenticación, sesión, permisos) ya existe según `002-login-rbac` y se reutiliza sin cambios para restringir el panel de dispatcher.
- No se requiere actualización en tiempo real (websockets/polling) del listado de órdenes; refrescar manualmente es suficiente para esta versión.
- El conteo de "órdenes activas asignadas" por técnico se calcula sobre estados no terminales (`sin_asignar` no aplica a técnico, se cuenta `pendiente_de_revision` y cualquier otro estado no terminal que exista).
- El tamaño de página exacto (ej. 50 o 100 registros) se define en la fase de planning; el requisito aquí es que exista paginación con controles de página, priorizando el cumplimiento de SC-002.
- **[RESUELTO 2026-07-13]** La cancelación de órdenes (FR-025/FR-026, estado `cancelada`) y el CRUD de clientes/técnicos (FR-015..FR-021, FR-023) quedaron formalmente dentro del slice vía `docs/adr/002-crud-clientes-tecnicos-y-cancelacion-de-orden.md` y la constitution v1.2.0 (filas 7-11 de "Dentro del slice"). Ya no hay bloqueo para `/speckit-plan`.
- "Eliminar" cliente o técnico se implementa SIEMPRE como baja lógica (`activo=false`), sin excepción — incluso si el registro no tiene ninguna orden asociada. Nunca hay borrado físico, por integridad referencial y trazabilidad (Principio III de la constitution) y para mantener un único camino de código (clarify ronda 2).
- La baja de un cliente (FR-017) NO dispara reasignación ni cambio de estado en sus órdenes existentes (a diferencia de la baja de técnico, FR-004d de `001`) — solo lo excluye de futuras búsquedas (US5).
- La búsqueda de clientes (FR-021) se resuelve del lado servidor (coincidencia parcial sobre nombre/email/id), no cargando todo el dataset de clientes al frontend.
- Los campos editables de cliente/técnico se limitan a `nombre`/`email` (mismos campos usados en `001`); no se agregan campos nuevos a la entidad `User`.
