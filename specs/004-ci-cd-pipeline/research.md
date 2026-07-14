# Research: Pipeline CI/CD FieldOps

Sin `[NEEDS CLARIFICATION]` pendientes tras `/speckit-clarify` (ver
`spec.md` → Clarifications). Este documento registra las decisiones técnicas
de plan.md y sus alternativas descartadas.

## 1. Cálculo de versión snapshot

- **Decision**: leer `x.y.z` de `<componente>/VERSION` y componer
  `x.y.z-snapshot.{short-sha}` en el job de build de `ci-develop-*.yml`.
- **Rationale**: `VERSION` ya existe en el repo como fuente de verdad simple,
  sin depender de convenciones de commit (conventional commits) ni de un
  registro externo de versiones.
- **Alternatives considered**: `package.json` `version` (rechazado — duplica
  la fuente de verdad si difiere de `VERSION`); fecha+sha (rechazado — pierde
  trazabilidad semántica de la versión base).

## 2. Creación de tag semver para main

- **Decision**: `scripts/release-tag.sh <back|front>` (nuevo) se ejecuta de
  forma automatizada (no manual) antes del merge/push hacia `main`. Internamente
  invoca `scripts/bump-version.sh <componente>/VERSION` (bump de archivo +
  lectura de la versión actual a taggear) y añade el paso que ese script no
  realiza: `git tag -a <componente>-v<version>` + `git push origin <tag>`.
  El tag lleva prefijo de componente (`back-`/`front-`) para que
  `ci-main-back.yml`/`ci-main-front.yml`, disparados independientemente por
  el mismo push, resuelvan cada uno su propia versión sin ambigüedad
  (hallazgo C2 de `/speckit-analyze`).
- **Rationale**: `bump-version.sh` ya existe en el repo pero, por diseño,
  solo toca el archivo `VERSION` local — nunca crea ni empuja el tag de git
  (hallazgo C1 de `/speckit-analyze`: la spec original asumía que sí lo
  hacía). El wrapper cierra ese hueco sin modificar el script existente ni
  su contrato (sigue imprimiendo la versión pre-bump por stdout).
- **Alternatives considered**: tag manual por el desarrollador tras correr
  `bump-version.sh` (rechazado — mayor riesgo de error humano/formato, y
  reintroduce el paso manual que el clarify explícitamente descartó);
  herramientas de release semántico automático tipo `semantic-release`
  (rechazado — over-engineering para 2 componentes con `VERSION` ya
  presente); un único tag compartido sin prefijo de componente (rechazado —
  ambiguo cuando backend y frontend versionan de forma independiente).

## 3. Alcance del artefacto dist

- **Decision**: comprimir solo el output de build (`dist/` backend tras
  `tsc`, `dist/` o `build/` frontend tras `vite build`), sin `node_modules`
  ni fuente.
- **Rationale**: minimiza tamaño del artifact/asset y evita filtrar
  dependencias con posibles vulnerabilidades ya cubiertas por Trivy en la
  imagen; el dist certifica exactamente el código compilado (spec.md,
  sección Artefactos de build de RETO-M12.md §4).
- **Alternatives considered**: incluir Dockerfile + manifest.json (rechazado
  por ahora — no aporta valor verificable adicional para la Capa 1 mínima;
  puede añadirse en iteración futura sin romper compatibilidad).

## 4. Trivy scan de imagen en PR de backend

- **Decision**: construir la imagen backend localmente (`docker build
  --load`, sin push) dentro de `pr-validation-back.yml` y escanearla con
  Trivy antes de aprobar el PR.
- **Rationale**: detecta vulnerabilidades antes de que la imagen llegue a
  `develop`/GHCR — más barato bloquear en PR que revertir un push a GHCR.
- **Alternatives considered**: escanear solo en `ci-develop-back.yml` tras
  push (rechazado — permite que una imagen vulnerable llegue a existir en
  GHCR, aunque sea snapshot).

## 5. Guardián de Constitución (Cursor Agent CLI)

- **Decision**: job independiente en cada `pr-validation-*.yml` que instala
  el CLI oficial de Cursor (`curl -fsS https://cursor.com/install | bash`,
  aprobado explícitamente por el autor) e invoca
  `cursor-agent --print --mode ask --trust` con `secrets.CURSOR_API_KEY`.
  El veredicto se evalúa por texto (`CONSTITUTION_VIOLATION:` /
  `CONSTITUTION_OK`), fail-closed ante exit-code no cero, violación
  detectada, o respuesta ambigua/vacía.
- **Rationale**: consistente con Edge Case de spec.md (fail-closed evita que
  un fallo de red o un veredicto ambiguo se interprete como aprobación
  implícita). Se usa el CLI oficial directamente (no una GitHub Action de
  terceros) para que el secret `CURSOR_API_KEY` nunca pase por código no
  auditado de un tercero — solo por el binario oficial de Cursor.
- **Alternatives considered**: `anthropics/claude-code-action` (diseño
  inicial de este pipeline — sustituido a petición explícita del autor por
  Cursor Agent); GitHub Action de terceros `PunGrumpy/cursor-action`
  (rechazada — no es oficial de Cursor/Anysphere, delegaría el secret a
  código de un desarrollador individual sin aprobación explícita); fail-open
  con reintento (rechazado — viola el principio de que ninguna gate debe
  aprobar por defecto ante error).

## 6. Plataforma CD (Capa 2)

- **Decision**: no fijada en este plan — `scripts/deploy.sh` queda como stub
  agnóstico de plataforma (Railway/Render/Fly.io/K8s/ECS/SSH+compose), a
  decidir solo si se aborda la Capa 2.
- **Rationale**: RETO-M12.md §4 marca esta decisión como libre y no
  bloqueante para la Capa 1; fijarla prematuramente añadiría alcance no
  solicitado.
- **Alternatives considered**: N/A — explícitamente diferido.
