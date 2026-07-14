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

- **Decision**: `scripts/bump-version.sh <componente>/VERSION` se ejecuta de
  forma automatizada (no manual) antes/como parte del flujo hacia `main`,
  leyendo la versión actual (a taggear) y dejando el archivo `VERSION`
  bumpeado a la siguiente minor.
- **Rationale**: el script ya existe en el repo con este contrato exacto
  (imprime la versión actual pre-bump por stdout, reescribe el archivo con
  la siguiente). Automatizarlo evita que un desarrollador olvide crear el
  tag o lo cree con formato incorrecto.
- **Alternatives considered**: tag manual por el desarrollador (rechazado —
  mayor riesgo de error humano/formato); herramientas de release semántico
  automático tipo `semantic-release` (rechazado — over-engineering para 2
  componentes con `VERSION` ya presente).

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

## 5. Guardián de Constitución (Claude Code Action)

- **Decision**: job independiente en cada `pr-validation-*.yml` que invoca
  la Action vía variable de entorno `CONSTITUTION_GUARDIAN_API_URL`
  (ver `docs/ci-cd-environment-setup.md`), fail-closed ante timeout/error.
- **Rationale**: consistente con Edge Case de spec.md (fail-closed evita que
  un fallo de red se interprete como aprobación implícita).
- **Alternatives considered**: fail-open con reintento (rechazado — viola el
  principio de que ninguna gate debe aprobar por defecto ante error).

## 6. Plataforma CD (Capa 2)

- **Decision**: no fijada en este plan — `scripts/deploy.sh` queda como stub
  agnóstico de plataforma (Railway/Render/Fly.io/K8s/ECS/SSH+compose), a
  decidir solo si se aborda la Capa 2.
- **Rationale**: RETO-M12.md §4 marca esta decisión como libre y no
  bloqueante para la Capa 1; fijarla prematuramente añadiría alcance no
  solicitado.
- **Alternatives considered**: N/A — explícitamente diferido.
