# Reto M12 · FieldOps — Pipeline CI/CD desde la spec

---

## 1. De qué va esto

Este reto cierra el ciclo SDD con la capa que faltaba: **el pipeline**. Ya tienes el
código, la spec y los tests. Ahora especificas cómo ese código viaja desde un commit
hasta producción de forma reproducible, segura y trazable.

La regla es la misma que en todo el programa: **la spec va antes que el YAML**. El
historial de git debe demostrar que especificaste el pipeline antes de implementarlo.

El objetivo no es el pipeline más sofisticado, sino **demostrar que dominas el flujo**:
que sabes convertir un brief de entrega en una spec verificable, y esa spec en un
pipeline que la ejecuta.

> Filosofía del módulo: *"mejor un pipeline de tres jobs bien especificado que diez
> jobs escritos a ojo"*.

---

## 2. El punto de partida

Llegas a este módulo con todo esto ya hecho:

- **Repo de FieldOps** con frontend React + backend NestJS + componente IA funcionando.
- **Artefactos SDD completos:** `constitution.md`, `spec.md`, `openapi.yaml`,
  `traceability.md`.
- **Tests en verde:** `install` + `test` pasan en una máquina limpia.
- **Lo que aprendiste en M9:** cómo conectar artefactos SDD a gates de un pipeline
  (Spectral, oasdiff, Gitleaks, verificador de ACs, guardián de Constitución).

Lo que **no hay** en tu repo: ningún workflow de CI/CD, ninguna estrategia de ramas,
ningún entorno desplegado. Ese es tu trabajo.

---

## 3. El escenario empresarial (léelo como te llega del equipo de ingeniería)

> *"Necesitamos ordenar cómo fluye el código de FieldOps desde el desarrollo hasta
> producción. Ahora mismo cada uno hace lo que quiere y nunca sabemos qué hay desplegado
> en cada sitio.*
>
> *Queremos trabajar con tres tipos de ramas: las ramas de feature para el trabajo del
> día a día, una rama develop que sea nuestra línea de integración continua, y main para
> lo que va a producción. Nada más.*
>
> *Frontend y backend son componentes independientes: cada uno tiene su propio flujo de
> CI/CD. Si solo cambia el frontend, no quiero que se lance nada del backend, y
> viceversa. Los pipelines tienen que detectar qué ha cambiado y ejecutar solo lo que
> corresponde.*
>
> *Cuando abres una pull request de tu feature a develop, tiene que pasar una batería
> completa de validaciones automáticas para el componente que hayas tocado — todo lo que
> vimos en el módulo 9: lint, tests, validación del contrato OpenAPI con Spectral,
> detección de breaking changes con oasdiff, escaneo de secrets con Gitleaks,
> verificación de acceptance criteria contra la API, y análisis de vulnerabilidades en
> la imagen con Trivy. Además, en cada PR quiero que el agente revise que se cumplen las
> reglas de la constitución del sistema — eso lo montamos en M9 con la llamada a la API
> del agente. Si falla cualquier gate, no se puede mergear.*
>
> *Cuando el merge a develop se produce, quiero que se construya automáticamente una
> versión snapshot del componente que ha cambiado y que se despliegue sola en el entorno
> de dev. Solo en dev, no quiero sorpresas en otros entornos.*
>
> *Cuando algo llega a main, eso es una versión final. Se construye con su versión semver
> limpia, se publica como release en GitHub con los artefactos de build, y se despliega
> automáticamente en pre. Para pasar a producción necesito que alguien del equipo lo
> autorice manualmente — no quiero que nadie pueda hacer un deploy a prod sin aprobación.*
>
> *Las imágenes Docker tienen que estar en un registro centralizado. Una vez que una
> imagen pasa CI y se publica en el registro, el job de deploy la usa directamente — no
> la reconstruye. Lo que pasó CI es lo que llega a producción, punto.*
>
> *Lo que no quiero es tener que decirle a la gente qué YAML escribir. Necesito que
> quien monte esto entienda el requisito y lo convierta en algo verificable antes de
> escribir una línea de configuración."*

Ese es tu punto de partida. **Convierte este brief en una spec verificable** antes de
abrir ningún fichero `.yml`.

---

## 4. Lo que define el escenario (resumen estructurado)

### Estrategia de ramas

| Rama | Propósito |
|------|-----------|
| `feature/*` | Trabajo en curso. Nunca se despliega directamente. |
| `develop` | Línea de integración. Toda feature pasa por aquí antes de main. |
| `main` | Versiones finales. Solo recibe merges desde develop. |

### Flujos por componente

Cada componente (frontend, backend) tiene sus propios workflows. Un workflow de frontend
**no se ejecuta** si el PR o el push no contiene cambios en `frontend/`. Ídem para
backend. Esto se implementa con filtros de ruta (`paths:`) en los triggers.

### Triggers y comportamiento esperado

| Evento | Componente afectado | Qué debe ocurrir |
|--------|--------------------|--------------------|
| PR `feature/*` → `develop` | Front y/o back (solo el que tiene cambios) | Todas las gates de M9 + llamada a la API del agente (guardián de Constitución). Bloquea el merge si falla. |
| Merge a `develop` | Front y/o back (solo el que tiene cambios) | CI completo + imagen snapshot + publicación en registro + CD automático a **dev**. |
| Merge a `main` | Front y/o back (solo el que tiene cambios) | CI completo + imagen versión final + GitHub Release con artefactos + CD automático a **pre** + CD a **prod** con aprobación manual. |

### Gates de validación (lo que significa "validación completa")

En este escenario, "validaciones" significa exactamente lo que se vio en el M9, aplicado
al componente correspondiente:

| Gate | Herramienta | Componente |
|------|------------|------------|
| Lint y test unitarios | `npm test` | Front + Back |
| Validación del contrato OpenAPI | Spectral | Back |
| Detección de breaking changes | oasdiff | Back |
| Escaneo de secrets | Gitleaks | Front + Back |
| Verificación de ACs contra la API | `check-acceptance.js` | Back |
| Análisis de vulnerabilidades en imagen | Trivy | Back |
| Revisión de Constitución del sistema | Claude Code Action (API del agente) | Front + Back |
| Code review registrado | Job dummy (stage que certifica el paso) | Front + Back |

### Versioning (semver)

- Rama `develop`: versión snapshot → `x.y.z-snapshot.{short-sha}` (ej: `1.0.0-snapshot.abc1f3e`).
- Rama `main`: versión final → `x.y.z` (ej: `1.0.0`). La versión la define el tag de git que el desarrollador crea antes del merge.

### Registro de imágenes Docker

Usamos **GHCR** (GitHub Container Registry). No requiere secrets adicionales — el
workflow se autentica con el `GITHUB_TOKEN` que GitHub inyecta automáticamente.

Formato de la imagen: `ghcr.io/<org-o-usuario>/<repo>/fieldops-back:<version>`

El job de push requiere el permiso `packages: write` en el bloque `permissions:` del
workflow.

### Artefactos de build

El build compilado (dist comprimido) se publica en GitHub en cada rama:

| Rama | Mecanismo | Cuándo expira |
|------|-----------|---------------|
| `develop` | `actions/upload-artifact` (workflow artifact) | 90 días desde la ejecución |
| `main` | `softprops/action-gh-release` (asset del Release) | Permanente, enlazable desde la pestaña Releases |

La imagen Docker en GHCR y el artefacto dist deben corresponder al mismo commit. El dist
certifica que la imagen contiene exactamente el código que se compiló, sin ambigüedad.

### Entornos

| Entorno | Trigger | Autorización |
|---------|---------|--------------|
| `dev` | Merge a `develop` | Automática |
| `pre` | Merge a `main` | Automática |
| `prod` | Tras despliegue en `pre` | **Aprobación manual** (GitHub Environment + reviewer) |

---

## 5. Las dos capas del reto

### Capa 1 — Mínima (obligatoria)

1. **Spec del pipeline** (`pipeline-spec.md` + `pipeline-constitution.md`) con FRs en
   EARS, NFRs, ACs y reglas no negociables. Committed antes que cualquier `.yml`.

2. **Workflows de validación de PR** (`pr-validation-front.yml` +
   `pr-validation-back.yml`): se activan en PR `feature/*` → `develop`, cada uno con
   filtro de ruta para su componente. Ejecutan todas las gates de M9 y el guardián de
   Constitución (llamada a la API del agente). Bloquean el merge si falla cualquier
   gate.

3. **Workflows CI de develop** (`ci-develop-front.yml` + `ci-develop-back.yml`): se
   activan en merge a `develop` con filtro de ruta. CI completo + imagen snapshot
   etiquetada como `x.y.z-snapshot.{sha}` + push a GHCR + **dist comprimido publicado
   como workflow artifact** (`actions/upload-artifact`, 90 días).

4. **Workflows CI de main** (`ci-main-front.yml` + `ci-main-back.yml`): se activan en
   merge a `main` con filtro de ruta. CI completo + imagen con versión semver final +
   **GitHub Release con el dist comprimido como asset** (`softprops/action-gh-release`).

5. **No rebuild en CD:** el job de deploy usa directamente la imagen publicada en el
   registro por el CI. Nunca reconstruye desde el fuente. Esta regla es no negociable y
   debe estar en `pipeline-constitution.md`.

6. **Historial de git verificable:** `pipeline-spec.md` committed antes que el primer
   `.yml`. El instructor lo comprueba.

### Capa 2 — Opcional (para quien llegue)

- **CD a dev** (en `ci-develop-*.yml`): deploy automático al entorno dev tras publicar
  la imagen snapshot.
- **CD a pre y prod** (en `ci-main-*.yml`): deploy automático a pre + GitHub Environment
  `production` con reviewer para prod.

## 6. El flujo SDD que debes seguir

| # | Fase | Comando | Qué produces |
|---|------|---------|--------------|
| 1 | **Constitution** | `/speckit.constitution` | Reglas no negociables del pipeline (pin SHA, OIDC, permisos mínimos, no rebuild en CD, spec antes que YAML, flujos separados por componente) |
| 2 | **Specify** | `/speckit.specify` | FRs en EARS de los seis workflows, NFRs (tiempo CI < 10 min), ACs verificables |
| 3 | **Clarify** | `/speckit.clarify` | Ambigüedades: ¿cómo se detectan los cambios por ruta? ¿cómo se obtiene la versión semver? ¿cómo se diferencia el artefacto dist de develop vs main? |
| 4 | **Plan** | `/speckit.plan` | Qué jobs van en paralelo, dependencias entre stages, orden de los seis workflows |
| 5 | **Tasks** | `/speckit.tasks` | Descomposición: cada job es una tarea con criterio de "hecho" |
| 6 | **Implement** | `/speckit.implement` | Los workflows YAML generados desde la spec |

> El pipeline no está terminado hasta que el historial de commits refleja el orden
> correcto: **spec → implementación**. Escribir el YAML primero y la spec después no
> cuenta.

---

## 7. Entregables (estructura del repositorio)

```
/.github/
  workflows/
    pr-validation-front.yml   ← PR con cambios en frontend/: gates M9 + guardián
    pr-validation-back.yml    ← PR con cambios en backend/: gates M9 + guardián
    ci-develop-front.yml      ← merge develop + cambios front: CI + snapshot + push
    ci-develop-back.yml       ← merge develop + cambios back: CI + snapshot + push
    ci-main-front.yml         ← merge main + cambios front: CI + versión final + release
    ci-main-back.yml          ← merge main + cambios back: CI + versión final + release
/.specify/  (o /specs/)
  pipeline-spec.md            ← FRs en EARS, NFRs, ACs del pipeline
  pipeline-constitution.md    ← reglas no negociables del pipeline
README.md                     ← branching strategy + cómo verificar el pipeline
```

---

## 8. Requisitos técnicos

- **Spec antes que YAML:** el commit de `pipeline-spec.md` debe ser anterior al primer
  workflow `.yml`. El instructor verifica el historial de git.
- **Flujos separados por componente:** seis workflows independientes con filtros de ruta
  (`paths:`). Un cambio solo en `frontend/` no ejecuta los workflows de backend.
- **Todas las gates de M9:** Spectral, oasdiff, Gitleaks, verificador de ACs, Trivy y
  guardián de Constitución (Claude Code Action). Aplicadas a tu código real, no a una
  app de ejemplo.
- **Guardián de Constitución en cada PR:** llamada a la API del agente para verificar
  que los artefactos SDD del repo cumplen la constitución. Mismo mecanismo que en M9.
- **Pin por SHA en todas las Actions externas:** ningún `@v4` sin SHA. Regla de
  `pipeline-constitution.md`.
- **Semver en las imágenes:** `x.y.z-snapshot.{sha}` en develop, `x.y.z` en main. La
  etiqueta `latest` sola no es un identificador de versión.
- **No rebuild en CD:** el job de deploy usa la imagen ya publicada en GHCR — la misma
  que pasó el CI. Nunca reconstruye desde el fuente. Sin excepción.
- **Artefacto dist publicado:** cada CI publica el build comprimido en GitHub (workflow
  artifact en develop, Release asset en main). El cloud de CD es libre — Railway, Render,
  Fly.io, Azure Container Apps, AWS App Runner, o cualquier plataforma que consuma la
  imagen de GHCR. El job de deploy no depende de ningún proveedor concreto.

---

## 9. Tiempos orientativos

| Jornada | Objetivo de cierre |
|---------|--------------------|
| **J1** | `pipeline-spec.md` + `pipeline-constitution.md` committed. `pr-validation-back.yml` verde en una PR de prueba. `ci-develop-back.yml` verde en develop con imagen snapshot publicada. |
| **J2** | `pr-validation-front.yml` + `ci-develop-front.yml` verdes. `ci-main-*.yml` con release en GitHub. [Opcional] CD a dev, pre y prod con aprobación manual. |

---

## 10. Entrega

- Trabaja en **tu propio repositorio de FieldOps**.
- El tag de entrega es `m12-pipeline` (o el PR indicado por el instructor).
- El `README` debe explicar la branching strategy, cómo abrir una PR de prueba para
  disparar la validación, y cómo verificar que la imagen snapshot llegó al registro.

**Consejo final:** antes de abrir el editor de YAML, responde por escrito tres
preguntas: ¿qué significa que el PR está listo para mergear? ¿qué significa que el
snapshot de develop está publicado? ¿qué significa que el deploy a prod está autorizado?
Si tienes esas tres respuestas en la spec, el YAML es consecuencia. Si no las tienes, el
YAML es una suposición.
