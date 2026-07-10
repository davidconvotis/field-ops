# Prompt-Pack: Reasignación de Órdenes (FieldOps)

Prepend this to every agent session touching order reassignment.

## Naming
- Use camelCase for all internal domain code (variables, functions, types): `assignedTechnicianId`, `reassignOrder`.
- Use snake_case only at the external contract boundary (HTTP request/response bodies): `assigned_technician_id`.
- Never mix cases within the same layer. Always map snake_case ↔ camelCase at the boundary (controller/DTO), never inside domain logic.
- Name the reassignment use case `reassignOrder`. Never reuse `updateOrder` for this action — it hides intent and breaks auditability.

## Error handling
- Always return errors as `{ code, message, details }`. Never throw raw strings or bare `Error` across module boundaries.
- Use stable, machine-readable `code` values (e.g. `ORDER_NOT_REASSIGNABLE`, `TECHNICIAN_UNAVAILABLE`). Never change existing codes without a migration note.
- Put human-readable context in `message`; put structured data (ids, field names) in `details`. Never put secrets or full customer PII in `details`.
- Always validate order state before reassigning (e.g. reject reassignment of already-closed orders) — never let invalid transitions succeed silently.
- Never swallow errors. Always propagate or log with full context before returning the standard error shape.

## Logging
- Always emit one JSON log line per invocation to stderr with exactly: `timestamp`, `invocation_id`, `tool`, `duration_ms`, `result`.
- Always generate `invocation_id` at the start of the operation and thread it through every log line for that call.
- Never log customer PII (names, addresses, phone numbers) or full request/response bodies. Log ids and codes only.
- Always log both success and failure outcomes with the same schema — never log only errors.

## Tests
- Always write tests with Vitest. Never skip tests for the reassignment use case, even for "trivial" edits.
- Always cover: valid reassignment, reassignment of non-existent order, reassignment of closed/terminal-state order, reassignment to unavailable technician, and snake_case↔camelCase boundary mapping.
- Always test the Zod schema separately from business logic — one test suite for input validation, one for domain rules.
- Never mock Zod validation in domain-logic tests; use real valid/invalid payloads.

## Validation
- Always validate all external input with Zod at the boundary before it reaches domain logic. Never trust incoming snake_case payloads directly.
- Always define one Zod schema per external contract shape; derive TypeScript types from the schema, never write them by hand separately.
- Never perform validation inside domain/business-logic functions — validation belongs only at the boundary.
- Always reject unknown/extra fields in reassignment payloads (`strict` schemas). Never silently ignore unexpected input.
