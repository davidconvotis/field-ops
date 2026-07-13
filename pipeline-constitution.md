<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0 (MINOR — adición de principios de pipeline de despliegue)
Modified principles: Ninguno modificado
Added sections:
  - VII. Promoción Explícita entre Entornos
  - VIII. Rollback Inmediato y Verificable
  - IX. Gate de Salud Post-Despliegue
Removed sections: N/A
Templates reviewed:
  - .specify/templates/plan-template.md ✅ compatible (no referencia CI/CD)
  - .specify/templates/spec-template.md ✅ compatible (no referencia CI/CD)
  - .specify/templates/tasks-template.md ✅ compatible (no referencia CI/CD)
Follow-up TODOs:
  - Ninguno.
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

### VII. Promoción Explícita entre Entornos

El despliegue a cada entorno (staging, producción) DEBE ser un paso explícito y
distinguible en el pipeline, nunca implícito por el mero hecho de mergear a `main`.

- La misma imagen (mismo digest, Principio III) DEBE ser la que se promueve de
  staging a producción — nunca se reconstruye para producción.
- El disparo a producción DEBE requerir una acción deliberada: tag de release,
  aprobación manual (`environment` protection rule) o workflow_dispatch explícito.
- Prohibido desplegar a producción automáticamente en cada push a `main` sin gate
  de aprobación.

### VIII. Rollback Inmediato y Verificable

Todo pipeline de despliegue DEBE soportar volver a la versión previa sin reconstruir.

- El mecanismo de rollback DEBE reutilizar una imagen ya publicada en GHCR
  (digest anterior conocido), consistente con el Principio III.
- El procedimiento de rollback DEBE estar documentado y ser ejecutable en un solo
  comando o un solo disparo de workflow, no un proceso manual ad-hoc.
- Razón: un incidente en producción no puede depender de que CI vuelva a construir
  bajo presión.

### IX. Gate de Salud Post-Despliegue

Ningún despliegue se considera exitoso hasta que un health check automatizado lo
confirma.

- El workflow de CD DEBE incluir un paso de verificación (health endpoint, smoke
  test) después de desplegar y antes de marcar el job como exitoso.
- Si el health check falla, el pipeline DEBE fallar visiblemente (no continuar en
  verde) y dejar registro del fallo para disparar rollback (Principio VIII).

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
verificar los nueve principios anteriores. Spec previa (Principio IV) es
bloqueante, no opcional.

**Version**: 1.1.0 | **Ratified**: 2026-07-13 | **Last Amended**: 2026-07-13
