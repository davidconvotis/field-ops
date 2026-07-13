# Roadmap M12 — Pipeline CI/CD vía Spec-Kit

Orden ejecución. Spec-kit primero, YAML último. Git history debe reflejar mismo orden (commits spec antes que `.yml`).

---

## Fase 0 — Prep

- [ ] Crear carpeta `specs/004-pipeline-cicd/` (nueva feature slice, sigue convención `00N-nombre` del repo).
- [ ] Confirmar artefactos previos ya existen: `constitution.md` (raíz proyecto), specs M9 gates (Spectral/oasdiff/Gitleaks/check-acceptance/Trivy), Docker backend/frontend ya funcionando (`docker-build` skill disponible).

## Fase 1 — Constitution del pipeline

Comando: `/speckit.constitution`

Contenido a fijar (no negociable):
- Pin por SHA en toda Action externa (no `@v4`).
- Permisos mínimos por job (`packages: write` solo donde toque).
- No rebuild en CD — deploy usa imagen ya publicada en GHCR.
- Spec siempre antes que YAML (regla de proceso, verificable en git log).
- Flujos separados por componente (front/back), sin cross-trigger.
- OIDC / secrets — usar `GITHUB_TOKEN` inyectado, sin secrets extra para GHCR.

Output → `pipeline-constitution.md`. Commit **antes** de tocar `/speckit.specify`.

## Fase 2 — Specify

Comando: `/speckit.specify`

Produce `pipeline-spec.md` con:
- FRs en EARS para los 6 workflows (`pr-validation-front/back`, `ci-develop-front/back`, `ci-main-front/back`).
- NFRs: tiempo CI < 10 min, etc.
- ACs verificables por workflow (qué gate corre, cuándo bloquea merge, qué se publica).
- Tabla ramas (`feature/*`, `develop`, `main`) y tabla entornos (`dev`/`pre`/`prod`) del RETO-M12.md sección 4, trasladada a requisitos formales.

Commit `pipeline-spec.md` — checkpoint clave para verificación de orden git.

## Fase 3 — Clarify

Comando: `/speckit.clarify`

Preguntas objetivo a resolver (ya anticipadas en RETO-M12.md §6):
1. ¿Cómo se detectan cambios por ruta (`paths:` filter exacto, qué patrones)?
2. ¿Cómo se calcula versión semver — snapshot (`x.y.z-snapshot.{sha}`) vs final (`x.y.z` desde tag git)?
3. ¿Cómo se diferencia artefacto dist develop (workflow artifact, 90 días) vs main (Release asset, permanente)?
4. ¿Quién crea el tag semver antes del merge a main — dev manual o automatizado?

Respuestas se codifican de vuelta en `pipeline-spec.md`.

## Fase 4 — Plan

Comando: `/speckit.plan`

Define:
- Orden y paralelismo de jobs dentro de cada workflow (lint/test → gates específicas → build imagen → push → publish dist).
- Dependencias entre los 6 workflows (ninguna cruzada — son independientes por diseño).
- Mapeo gate → tool → componente (tabla RETO-M12.md §4 "Gates de validación").
- Decisión de plataforma CD para capa opcional (Railway/Render/Fly.io/etc) — libre, no bloqueante para capa mínima.

## Fase 5 — Tasks

Comando: `/speckit.tasks`

Descompón en tareas por workflow, cada una con criterio "hecho":
- `pr-validation-back.yml`: lint+test, Spectral, oasdiff, Gitleaks, check-acceptance, Trivy, guardián constitución (Claude Code Action), job dummy code-review.
- `pr-validation-front.yml`: lint+test, Gitleaks, guardián constitución.
- `ci-develop-back.yml` / `ci-develop-front.yml`: CI completo + build imagen snapshot + push GHCR + upload-artifact dist (90d) + [opcional CD dev].
- `ci-main-back.yml` / `ci-main-front.yml`: CI completo + build imagen semver final + GitHub Release + gh-release asset dist + [opcional CD pre + prod con approval gate].

Opcional: `speckit-taskstoissues` si se quiere trackear en GitHub Issues.

## Fase 6 — Implement

Comando: `/speckit.implement`

Genera los 6 `.yml` en `.github/workflows/` desde tasks. Verificar tras generar:
- [ ] Pin SHA en cada `uses:`.
- [ ] `paths:` filter correcto por componente.
- [ ] Permisos mínimos declarados (`packages: write` solo en job push imagen).
- [ ] Tag semver / snapshot correcto en cada rama.
- [ ] No rebuild en jobs deploy (opcional/capa 2).

## Fase 7 — Verificación

- [ ] `speckit-analyze` — consistencia cross-artefacto spec/plan/tasks antes de dar por cerrado.
- [ ] Abrir PR de prueba `feature/*` → `develop` tocando solo backend → confirmar que `pr-validation-back.yml` corre y `*-front.yml` no.
- [ ] Merge a `develop` → confirmar imagen snapshot en GHCR + artifact dist.
- [ ] Merge a `main` → confirmar Release GitHub + imagen semver + (opcional) CD pre/prod con aprobación manual.
- [ ] `git log` confirma orden: `pipeline-spec.md` commit anterior a primer `.yml`.
- [ ] README actualizado: branching strategy, cómo abrir PR de prueba, cómo verificar snapshot en registro.

## Entregable final

- Tag `m12-pipeline` (o PR indicado).
- Checklist capa mínima (§5 RETO-M12.md, items 1-6) completa antes de capa opcional (CD dev/pre/prod).
