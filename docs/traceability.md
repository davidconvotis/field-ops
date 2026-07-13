# Matriz de trazabilidad: Requisito → Test

Principio III de la constitución: cada FR/NFR debe rastrearse hasta una prueba concreta.
Formato: `FR-ID/NFR-ID → test file:test name`.

| Requisito | Test |
|---|---|
| FR-000 | `backend/tests/integration/test_rbac_matrix.js` (matriz completa) |
| FR-001 | `backend/tests/contract/test_orders_post.js`, `backend/tests/integration/test_us2_assign.js` (escenario 1) |
| FR-002 | `backend/tests/contract/test_orders_assign.js`, `test_us2_assign.js` (escenario 2) |
| FR-003 | `test_us2_assign.js` (escenarios 3, 3b) |
| FR-004 | `test_us2_assign.js` (escenarios 4, 4b) |
| FR-004d | `backend/tests/integration/test_us2_deactivate_reassign.js` |
| FR-005 | `backend/tests/contract/test_executions_post.js`, `test_us1_submit_execution.js` |
| FR-006 | `test_us1_edge_cases.js` (escenario 2) |
| FR-007 | `test_us1_edge_cases.js` (escenario 4) |
| FR-008 / NFR-08 | `test_us1_edge_cases.js` (escenario 3) |
| FR-009 | `test_us1_edge_cases.js` (escenario 3, todo-o-nada) |
| FR-010 | `test_us1_edge_cases.js` (escenario 6) |
| FR-011 | `test_us1_edge_cases.js` (escenario 5) |
| FR-012 | `test_us1_edge_cases.js` (escenario 7a) |
| FR-012b | `test_us1_edge_cases.js` (escenario 7b) |
| FR-013 | `backend/tests/contract/test_orders_approve.js`, `test_us3_review.js` (escenario 1) |
| FR-014 | `backend/tests/contract/test_orders_reject.js`, `test_us3_review.js` (escenario 3a) |
| FR-015 | `test_us3_review.js` (escenario 2) |
| FR-016 | `test_us3_review.js` (escenario 3b) |
| FR-016b | `backend/tests/integration/test_us3_concurrent_conflict.js` |
| FR-017 / FR-018 | `backend/tests/integration/test_us4_listing.js` (escenarios 1-3) |
| FR-019 | `backend/tests/contract/test_orders_get.js`, `test_us4_listing.js` (escenarios 4, 4b) |
| FR-020 | `backend/tests/integration/test_us5_summary.js`, `evals/summary/golden_cases.json` |
| NFR-01 | `backend/tests/unit/test_tls_enforce.js` |
| NFR-02 / NFR-02b / SC-007 | `backend/tests/integration/test_us1_encryption_failure.js` |
| NFR-03 | `test_rbac_matrix.js` (sin token) |
| NFR-03b | `backend/tests/integration/test_idp_failure.js` |
| NFR-04 / NFR-04b | `backend/tests/integration/test_audit_failure.js` |
| NFR-04c | `backend/src/adapters/retentionJob.js` (implementado; test manual vía quickstart — ver nota) |
| NFR-05 / NFR-06 | `backend/tests/performance/load_check.js` |
| NFR-06b | `backend/tests/integration/test_us1_storage_failure.js` |
| NFR-07 | Fuera de alcance de test unitario — SLA operacional de disponibilidad, se mide en producción/monitoreo, no en CI |
| NFR-08b | No aplica en esta implementación — la validación de tipo (NFR-08) se hace en proceso por magic bytes (`fileValidation.js`), sin delegar en un servicio externo de antivirus. Ver research.md §item pendiente de decisión formal (hallazgo U2 de `/speckit-analyze`, aún abierto). |

## 002-login-rbac

Los FR-ID de este feature son propios y colisionan numéricamente con los de
`001-work-order-management` de arriba — se referencian aquí con prefijo `002-` para
evitar ambigüedad.

| Requisito | Test |
|---|---|
| 002-FR-001 (vista login Tailwind) | `frontend/tests/Login.test.jsx` |
| 002-FR-002 / 002-FR-004 (emisión access+refresh, rol en token) | `backend/tests/contract/test_auth_login.js`, `backend/tests/integration/test_auth_login_roles.js` |
| 002-FR-002a (refresh silencioso) | `backend/tests/integration/test_auth_refresh.js` |
| 002-FR-003 (401 genérico) | `backend/tests/contract/test_auth_login.js`, `backend/tests/unit/test_auth_service.js` |
| 002-FR-005 (redirect por rol) | `frontend/src/App.jsx` (`ROLE_ROUTES` en `Login.jsx`) — cubierto indirectamente por `Login.test.jsx` |
| 002-FR-006 (ocultar UI por rol) | `frontend/tests/App.test.jsx` (`RequireRole` redirige fuera de rutas no permitidas) |
| 002-FR-007 (nunca localStorage) | `frontend/src/services/session.js` (sessionStorage, sin token) + `authClient.js`/`api.js` (cookies httpOnly) — sin test dedicado, verificado por diseño |
| 002-FR-008 (401/403 backend) | `backend/tests/contract/test_auth_rbac_cookie.js` |
| 002-FR-009 (logout + denylist) | `backend/tests/integration/test_auth_logout.js`, `backend/tests/unit/test_auth_service.js` |
| 002-FR-010 (rate limit 429) | `backend/tests/integration/test_auth_ratelimit.js` |

## 003-dispatcher-orders-ui

Los FR-ID de este feature son propios y colisionan numéricamente con los de
`001-work-order-management`/`002-login-rbac` de arriba — se referencian aquí con
prefijo `003-` para evitar ambigüedad.

| Requisito | Test |
|---|---|
| 003-FR-001 (listado de órdenes) | `backend/tests/contract/test_orders_list_filters.js`, `backend/tests/integration/test_orders_list_pagination.js`, `frontend/tests/DispatcherOrders.test.jsx` |
| 003-FR-002 (refresco manual, sin auto-refetch) | `frontend/tests/DispatcherOrders.test.jsx` (botón Refrescar) |
| 003-FR-002a (filtro combinable status/technicianId) | `backend/tests/contract/test_orders_list_filters.js`, `backend/tests/integration/test_orders_list_pagination.js` (combinado AND), `frontend/tests/DispatcherOrders.test.jsx` |
| 003-FR-003 / 003-FR-004 (desplegable solo técnicos activos) | `backend/tests/contract/test_technicians_list.js`, `backend/tests/integration/test_orders_assign_dropdown.js`, `frontend/tests/TechnicianAssignSelect.test.jsx` |
| 003-FR-005 / 003-FR-005a (asignar/reasignar + modal confirmación) | `frontend/tests/ReassignConfirmModal.test.jsx`, `frontend/src/pages/DispatcherOrders.jsx` (integración) |
| 003-FR-006 (bloqueo asignación en estado terminal) | `backend/tests/integration/test_orders_assign_dropdown.js` |
| 003-FR-007 (mensaje sin técnicos disponibles) | `frontend/tests/TechnicianAssignSelect.test.jsx` |
| 003-FR-008 / 003-FR-009 (sidebar + resaltado activo) | `frontend/tests/DispatcherSidebar.test.jsx` |
| 003-FR-010 (RBAC dispatcher) | `frontend/tests/App.test.jsx`, `backend/tests/contract/test_technicians_list.js` (403 no-dispatcher) |
| 003-FR-011 / 003-FR-012 (listado técnicos + activeOrderCount) | `backend/tests/integration/test_technicians_active_order_count.js`, `frontend/tests/DispatcherTechnicians.test.jsx` |
| 003-FR-013 (estados vacíos) | `frontend/tests/DispatcherOrders.test.jsx`, `frontend/tests/DispatcherTechnicians.test.jsx` |
| 003-FR-014 (paginación tamaño fijo) | `backend/tests/integration/test_orders_list_pagination.js` |

## Notas

- SC-001..SC-008: ver mapeo indirecto vía los FR/NFR que las sustentan (no se listan como filas separadas para evitar duplicación).
- Este documento se genera y mantiene manualmente en cada fase de implementación; revisar tras cualquier cambio de tasks.md o spec.md.
- 002-SC-001 (login <5s): sin test de performance dedicado (ver hallazgo E2 de `/speckit-analyze` de `002-login-rbac`, aceptado como deuda menor).
- 003-SC-003 (≤3 interacciones asignación) no tiene test dedicado que cuente interacciones — ver hallazgo G2 de `/speckit-analyze` de `003-dispatcher-orders-ui`, aceptado como deuda menor (cubierto implícitamente por el flujo de `DispatcherOrders.jsx`).
