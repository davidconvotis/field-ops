# Matriz de trazabilidad: Requisito → Test

Principio III de la constitución: cada FR/NFR debe rastrearse hasta una prueba concreta.
Formato: `FR-ID/NFR-ID → test file:test name`.

| Requisito | Test |
|---|---|
| FR-000 | `backend/tests/integration/test_rbac_matrix.ts` (matriz completa) |
| FR-001 | `backend/tests/contract/test_orders_post.ts`, `backend/tests/integration/test_us2_assign.ts` (escenario 1) |
| FR-002 | `backend/tests/contract/test_orders_assign.ts`, `test_us2_assign.ts` (escenario 2) |
| FR-003 | `test_us2_assign.ts` (escenarios 3, 3b) |
| FR-004 | `test_us2_assign.ts` (escenarios 4, 4b) |
| FR-004d | `backend/tests/integration/test_us2_deactivate_reassign.ts` |
| FR-005 | `backend/tests/contract/test_executions_post.ts`, `test_us1_submit_execution.ts` |
| FR-006 | `test_us1_edge_cases.ts` (escenario 2) |
| FR-007 | `test_us1_edge_cases.ts` (escenario 4) |
| FR-008 / NFR-08 | `test_us1_edge_cases.ts` (escenario 3) |
| FR-009 | `test_us1_edge_cases.ts` (escenario 3, todo-o-nada) |
| FR-010 | `test_us1_edge_cases.ts` (escenario 6) |
| FR-011 | `test_us1_edge_cases.ts` (escenario 5) |
| FR-012 | `test_us1_edge_cases.ts` (escenario 7a) |
| FR-012b | `test_us1_edge_cases.ts` (escenario 7b) |
| FR-013 | `backend/tests/contract/test_orders_approve.ts`, `test_us3_review.ts` (escenario 1) |
| FR-014 | `backend/tests/contract/test_orders_reject.ts`, `test_us3_review.ts` (escenario 3a) |
| FR-015 | `test_us3_review.ts` (escenario 2) |
| FR-016 | `test_us3_review.ts` (escenario 3b) |
| FR-016b | `backend/tests/integration/test_us3_concurrent_conflict.ts` |
| FR-017 / FR-018 | `backend/tests/integration/test_us4_listing.ts` (escenarios 1-3) |
| FR-019 | `backend/tests/contract/test_orders_get.ts`, `test_us4_listing.ts` (escenarios 4, 4b) |
| FR-020 | `backend/tests/integration/test_us5_summary.ts`, `evals/summary/golden_cases.json` |
| NFR-01 | `backend/tests/unit/test_tls_enforce.ts` |
| NFR-02 / NFR-02b / SC-007 | `backend/tests/integration/test_us1_encryption_failure.ts` |
| NFR-03 | `test_rbac_matrix.ts` (sin token) |
| NFR-03b | `backend/tests/integration/test_idp_failure.ts` |
| NFR-04 / NFR-04b | `backend/tests/integration/test_audit_failure.ts` |
| NFR-04c | `backend/src/adapters/retentionJob.ts` (implementado; test manual vía quickstart — ver nota) |
| NFR-05 / NFR-06 | `backend/tests/performance/load_check.ts` |
| NFR-06b | `backend/tests/integration/test_us1_storage_failure.ts` |
| NFR-07 | Fuera de alcance de test unitario — SLA operacional de disponibilidad, se mide en producción/monitoreo, no en CI |
| NFR-08b | No aplica en esta implementación — la validación de tipo (NFR-08) se hace en proceso por magic bytes (`fileValidation.ts`), sin delegar en un servicio externo de antivirus. Ver research.md §item pendiente de decisión formal (hallazgo U2 de `/speckit-analyze`, aún abierto). |

## 002-login-rbac

Los FR-ID de este feature son propios y colisionan numéricamente con los de
`001-work-order-management` de arriba — se referencian aquí con prefijo `002-` para
evitar ambigüedad.

| Requisito | Test |
|---|---|
| 002-FR-001 (vista login Tailwind) | `frontend/tests/Login.test.tsx` |
| 002-FR-002 / 002-FR-004 (emisión access+refresh, rol en token) | `backend/tests/contract/test_auth_login.ts`, `backend/tests/integration/test_auth_login_roles.ts` |
| 002-FR-002a (refresh silencioso) | `backend/tests/integration/test_auth_refresh.ts` |
| 002-FR-003 (401 genérico) | `backend/tests/contract/test_auth_login.ts`, `backend/tests/unit/test_auth_service.ts` |
| 002-FR-005 (redirect por rol) | `frontend/src/App.tsx` (`ROLE_ROUTES` en `Login.tsx`) — cubierto indirectamente por `Login.test.tsx` |
| 002-FR-006 (ocultar UI por rol) | `frontend/tests/App.test.tsx` (`RequireRole` redirige fuera de rutas no permitidas) |
| 002-FR-007 (nunca localStorage) | `frontend/src/services/session.ts` (sessionStorage, sin token) + `authClient.ts`/`api.ts` (cookies httpOnly) — sin test dedicado, verificado por diseño |
| 002-FR-008 (401/403 backend) | `backend/tests/contract/test_auth_rbac_cookie.ts` |
| 002-FR-009 (logout + denylist) | `backend/tests/integration/test_auth_logout.ts`, `backend/tests/unit/test_auth_service.ts` |
| 002-FR-010 (rate limit 429) | `backend/tests/integration/test_auth_ratelimit.ts` |

## 003-dispatcher-orders-ui

Los FR-ID de este feature son propios y colisionan numéricamente con los de
`001-work-order-management`/`002-login-rbac` de arriba — se referencian aquí con
prefijo `003-` para evitar ambigüedad.

| Requisito | Test |
|---|---|
| 003-FR-001 (listado de órdenes) | `backend/tests/contract/test_orders_list_filters.ts`, `backend/tests/integration/test_orders_list_pagination.ts`, `frontend/tests/DispatcherOrders.test.tsx` |
| 003-FR-002 (refresco manual, sin auto-refetch) | `frontend/tests/DispatcherOrders.test.tsx` (botón Refrescar) |
| 003-FR-002a (filtro combinable status/technicianId) | `backend/tests/contract/test_orders_list_filters.ts`, `backend/tests/integration/test_orders_list_pagination.ts` (combinado AND), `frontend/tests/DispatcherOrders.test.tsx` |
| 003-FR-003 / 003-FR-004 (desplegable solo técnicos activos) | `backend/tests/contract/test_technicians_list.ts`, `backend/tests/integration/test_orders_assign_dropdown.ts`, `frontend/tests/TechnicianAssignSelect.test.tsx` |
| 003-FR-005 / 003-FR-005a (asignar/reasignar + modal confirmación) | `frontend/tests/ReassignConfirmModal.test.tsx`, `frontend/src/pages/DispatcherOrders.tsx` (integración) |
| 003-FR-006 (bloqueo asignación en estado terminal) | `backend/tests/integration/test_orders_assign_dropdown.ts` |
| 003-FR-007 (mensaje sin técnicos disponibles) | `frontend/tests/TechnicianAssignSelect.test.tsx` |
| 003-FR-008 / 003-FR-009 (sidebar + resaltado activo) | `frontend/tests/DispatcherSidebar.test.tsx` |
| 003-FR-010 (RBAC dispatcher) | `frontend/tests/App.test.tsx`, `backend/tests/contract/test_technicians_list.ts` (403 no-dispatcher) |
| 003-FR-011 / 003-FR-012 (listado técnicos + activeOrderCount) | `backend/tests/integration/test_technicians_active_order_count.ts`, `frontend/tests/DispatcherTechnicians.test.tsx` |
| 003-FR-013 (estados vacíos) | `frontend/tests/DispatcherOrders.test.tsx`, `frontend/tests/DispatcherTechnicians.test.tsx` |
| 003-FR-014 (paginación tamaño fijo) | `backend/tests/integration/test_orders_list_pagination.ts` |
| 003-FR-015 / 003-FR-016 (crear/editar cliente) | `backend/tests/contract/test_clients_crud.ts`, `frontend/tests/DispatcherClients.test.tsx` |
| 003-FR-017 (baja lógica de cliente) | `backend/tests/contract/test_clients_crud.ts`, `backend/tests/integration/test_clients_crud.ts` (no altera órdenes existentes), `frontend/tests/DispatcherClients.test.tsx` |
| 003-FR-018 (email único, cliente/técnico) | `backend/tests/contract/test_clients_crud.ts`, `backend/tests/contract/test_technicians_create_update.ts`, `backend/tests/integration/test_clients_crud.ts` / `test_technicians_create_update.ts` (unicidad cruzada cliente↔técnico) |
| 003-FR-019 / 003-FR-020 (crear/editar técnico) | `backend/tests/contract/test_technicians_create_update.ts`, `backend/tests/integration/test_technicians_create_update.ts`, `frontend/tests/DispatcherTechnicians.test.tsx` |
| 003-FR-021 (búsqueda de clientes por cualquier campo) | `backend/tests/contract/test_clients_search.ts`, `backend/tests/integration/test_clients_search.ts`, `frontend/tests/ClientSearchSelect.test.tsx` |
| 003-FR-022 (exigir selección de búsqueda al crear orden) | `frontend/tests/ClientSearchSelect.test.tsx`, `frontend/src/pages/DispatcherOrders.tsx` (integración — submit deshabilitado sin selección) |
| 003-FR-023 (editar cliente de orden + auditoría) | `backend/tests/contract/test_orders_edit_client.ts`, `backend/tests/integration/test_orders_edit_cancel.ts`, `frontend/tests/DispatcherOrders.test.tsx` |
| 003-FR-024 (rechazo uniforme estado terminal, incl. cancelada) | `backend/tests/contract/test_orders_edit_client.ts`, `backend/tests/contract/test_orders_cancel.ts`, `backend/tests/integration/test_orders_edit_cancel.ts` |
| 003-FR-025 (cancelar orden con motivo) | `backend/tests/contract/test_orders_cancel.ts`, `backend/tests/integration/test_orders_edit_cancel.ts`, `frontend/tests/DispatcherOrders.test.tsx` |
| 003-FR-026 (cancelada = estado terminal) | `backend/tests/integration/test_orders_edit_cancel.ts` |

## Notas

- SC-001..SC-008: ver mapeo indirecto vía los FR/NFR que las sustentan (no se listan como filas separadas para evitar duplicación).
- Este documento se genera y mantiene manualmente en cada fase de implementación; revisar tras cualquier cambio de tasks.md o spec.md.
- 002-SC-001 (login <5s): sin test de performance dedicado (ver hallazgo E2 de `/speckit-analyze` de `002-login-rbac`, aceptado como deuda menor).
- 003-SC-003 (≤3 interacciones asignación) no tiene test dedicado que cuente interacciones — ver hallazgo G2 de `/speckit-analyze` de `003-dispatcher-orders-ui`, aceptado como deuda menor (cubierto implícitamente por el flujo de `DispatcherOrders.tsx`).
