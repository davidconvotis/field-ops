<!-- SYNC IMPACT REPORT
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: N/A (new document)
Added sections: Core Principles (I-VI), Governance
Removed sections: N/A
Templates reviewed:
  - .specify/templates/plan-template.md ✅ compatible (no referencia CI/CD)
  - .specify/templates/spec-template.md ✅ compatible (no referencia CI/CD)
  - .specify/templates/tasks-template.md ✅ compatible (no referencia CI/CD)
Follow-up TODOs:
  - Ninguno. RATIFICATION_DATE = LAST_AMENDED_DATE porque es la ratificación inicial.
-->

# FieldOps Pipeline Constitution

Rige el diseño e implementación de CI/CD (GitHub Actions) para FieldOps. Es
complementaria a `.specify/memory/constitution.md` (que rige el producto); esta
constitution rige exclusivamente los flujos de integración y despliegue.

## Core Principles

### I. Pin por SHA (NON-NEGOTIABLE)

Toda Action externa DEBE fijarse por SHA de commit completo, nunca por tag mutable.

- Prohibido `uses: owner/action@v4` o cualquier referencia a tag/branch.
- Correcto: `uses: owner/action@<sha-completo> # v4.x.x` (comentario con versión
  humana permitido, no como referencia funcional).
- Razón: un tag mutable puede reapuntar a código distinto sin aviso — riesgo de
  supply-chain. El SHA es inmutable y auditable.

### II. Permisos Mínimos por Job

Cada job DEBE declarar explícitamente sus propios `permissions`, con el mínimo
necesario para su tarea.

- Prohibido `permissions: write-all` o heredar permisos amplios a nivel de workflow
  cuando un job no los necesita.
- `packages: write` SOLO en el job que efectivamente publica a GHCR.
- Todo job que no escribe DEBE declarar `contents: read` (o menos) explícitamente,
  no depender del default.

### III. No Rebuild en CD

El pipeline de despliegue (CD) DEBE consumir una imagen ya construida y publicada
en GHCR por el pipeline de CI. Nunca reconstruye desde código fuente.

- CD referencia la imagen por digest o tag inmutable ya publicado, no por `latest`
  mutable de forma implícita.
- Razón: garantiza que lo desplegado es bit-a-bit lo mismo que pasó CI — elimina
  divergencia build-time entre entornos.

### IV. Spec Antes que YAML

Ningún workflow de GitHub Actions se escribe sin spec previa aprobada.

- El historial de git DEBE mostrar el commit de spec/constitution/plan antes que
  el primer commit de `.github/workflows/*.yml` para ese flujo.
- Regla de proceso verificable: `git log --follow` sobre el YAML no debe mostrar
  un primer commit anterior al de la spec correspondiente.

### V. Flujos Separados por Componente

Frontend y backend tienen workflows independientes, sin disparo cruzado.

- Un cambio solo en `backend/` NUNCA dispara el workflow de frontend, y viceversa.
- Cada workflow usa `paths:` (o equivalente) acotado a su componente.
- Prohibido un workflow monolítico que decida internamente qué componente construir.

### VI. OIDC / Secrets Mínimos

Autenticación contra GHCR usa el `GITHUB_TOKEN` inyectado automáticamente por
GitHub Actions. No se añaden secrets adicionales para esta autenticación.

- Prohibido crear un PAT (Personal Access Token) o secret manual para login en
  GHCR cuando `GITHUB_TOKEN` con los `permissions` correctos (Principio II) basta.
- Cualquier secret adicional fuera de `GITHUB_TOKEN` requiere justificación
  explícita documentada en la spec del flujo correspondiente.

## Governance

Esta constitution supersede cualquier decisión local de implementación de CI/CD.

**Procedimiento de enmienda**:
1. Documentar la motivación (ADR en `/docs/adr/` si afecta a más de un flujo).
2. Actualizar este archivo incrementando la versión según semver.
3. Propagar cambios a specs y workflows YAML afectados.

**Política de versioning**:
- MAJOR: eliminación o redefinición incompatible de un principio.
- MINOR: adición de nuevo principio o sección con impacto material.
- PATCH: clarificaciones o correcciones de redacción.

**Compliance**: Ningún PR que modifique `.github/workflows/` se aprueba sin
verificar los seis principios anteriores. Spec previa (Principio IV) es
bloqueante, no opcional.

**Version**: 1.0.0 | **Ratified**: 2026-07-13 | **Last Amended**: 2026-07-13
