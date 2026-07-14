# Data Model: Pipeline CI/CD FieldOps

No hay modelo de datos de aplicación (esta feature es CI/CD, no persiste
datos de negocio). Las "entidades" son artefactos de pipeline:

## Workflow de validación de PR

- **Campos**: `componente` (front|back), `trigger` (pull_request →
  `develop`, `paths:` acotado), `gates[]`, `estado` (pending/success/failure).
- **Relaciones**: produce un `resultado de gate` por cada gate ejecutada;
  bloquea `Merge de PR` si algún resultado es `failure`.

## Resultado de gate

- **Campos**: `nombre` (lint-test|spectral|oasdiff|gitleaks|
  check-acceptance|trivy|constitution-guardian|code-review), `estado`
  (success|failure), `componente`.
- **Relaciones**: pertenece a un `Workflow de validación de PR`.

## Imagen Docker (GHCR)

- **Campos**: `repositorio` (`ghcr.io/<org>/<repo>/fieldops-{back,front}`),
  `tag` (`x.y.z-snapshot.{short-sha}` | `x.y.z`), `digest`, `commit_sha`.
- **Relaciones**: producida por `Workflow CI de develop` o `Workflow CI de
  main`; referenciada por `Deploy (Capa 2)` sin reconstrucción (Principio III).
- **Reglas**: `commit_sha` DEBE coincidir con el del `Artefacto dist`
  publicado en el mismo evento (FR-015).

## Artefacto dist

- **Campos**: `componente`, `commit_sha`, `mecanismo`
  (workflow-artifact|release-asset), `expiracion` (90 días | permanente).
- **Relaciones**: corresponde 1:1 a una `Imagen Docker` del mismo evento y
  commit.

## GitHub Release

- **Campos**: `tag` (`x.y.z`), `assets[]` (dist comprimido), `componente`.
- **Relaciones**: producido solo por `Workflow CI de main`; contiene el
  `Artefacto dist` como asset permanente.

## Deploy (Capa 2, opcional)

- **Campos**: `entorno` (dev|pre|prod), `imagen_referenciada` (digest de
  `Imagen Docker` ya publicada), `aprobacion` (automática|manual).
- **Relaciones**: consume una `Imagen Docker` existente; `entorno = prod`
  DEBE tener `aprobacion = manual` (Principio VII).
- **Reglas**: nunca reconstruye la imagen (Principio III); no existe sin una
  `Imagen Docker` previamente publicada por CI.
