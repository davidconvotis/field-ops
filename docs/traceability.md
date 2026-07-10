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

## Notas

- SC-001..SC-008: ver mapeo indirecto vía los FR/NFR que las sustentan (no se listan como filas separadas para evitar duplicación).
- Este documento se genera y mantiene manualmente en cada fase de implementación; revisar tras cualquier cambio de tasks.md o spec.md.
