# Variables de entorno por entorno (dev / pre / prod)

Referencia derivada de lo que los 8 workflows (`.github/workflows/*.yml`) y
`scripts/deploy.sh` ya consumen vía `vars.*`/`secrets.*`, más lo que el
backend lee de `process.env` en runtime (Render). Ningún valor real va aquí
— son nombres + dónde configurarlos.

## 1. GitHub Actions — repo-level Variables (Settings → Secrets and variables → Actions → Variables)

`dev` y `pre` no usan un GitHub Environment protegido (ningún job les pone
`environment:`), así que sus vars viven a nivel de repo:

| Variable | Usada en |
|---|---|
| `DEV_BACKEND_RENDER_SERVICE_ID` | `ci-develop-back.yml` (deploy) |
| `DEV_BACKEND_URL` | `ci-develop-back.yml` (health-check) |
| `DEV_FRONTEND_RENDER_SERVICE_ID` | `ci-develop-front.yml` (deploy) |
| `DEV_FRONTEND_URL` | `ci-develop-front.yml` (health-check) |
| `PRE_BACKEND_RENDER_SERVICE_ID` | `ci-main-back.yml` (deploy a pre) |
| `PRE_BACKEND_URL` | `ci-main-back.yml` (health-check) |
| `PRE_FRONTEND_RENDER_SERVICE_ID` | `ci-main-front.yml` (deploy a pre) |
| `PRE_FRONTEND_URL` | `ci-main-front.yml` (health-check) |

```bash
gh variable set DEV_BACKEND_RENDER_SERVICE_ID --body "srv-xxxxxxxx"
gh variable set DEV_BACKEND_URL              --body "https://fieldops-backend-dev.onrender.com"
gh variable set DEV_FRONTEND_RENDER_SERVICE_ID --body "srv-xxxxxxxx"
gh variable set DEV_FRONTEND_URL              --body "https://fieldops-frontend-dev.onrender.com"
gh variable set PRE_BACKEND_RENDER_SERVICE_ID  --body "srv-xxxxxxxx"
gh variable set PRE_BACKEND_URL               --body "https://fieldops-backend-pre.onrender.com"
gh variable set PRE_FRONTEND_RENDER_SERVICE_ID --body "srv-xxxxxxxx"
gh variable set PRE_FRONTEND_URL              --body "https://fieldops-frontend-pre.onrender.com"
```

## 2. GitHub Actions — Environment `prod` (protegido, reviewer manual)

`promote-prod.yml` y `rollback.yml` ponen `environment: prod`/`${{ inputs.environment }}`
a nivel de job (Principio VII — promoción explícita). Estas vars deben vivir
**dentro** del Environment `prod`, no a nivel de repo, para que el reviewer
gate aplique también a su lectura:

| Variable | Usada en |
|---|---|
| `PROD_BACKEND_RENDER_SERVICE_ID` | `promote-prod.yml`, `rollback.yml` |
| `PROD_BACKEND_URL` | `promote-prod.yml`, `rollback.yml` (health-check) |
| `PROD_FRONTEND_RENDER_SERVICE_ID` | `promote-prod.yml`, `rollback.yml` |
| `PROD_FRONTEND_URL` | `promote-prod.yml`, `rollback.yml` (health-check) |

```bash
gh api repos/:owner/:repo/environments/prod -X PUT \
  -f reviewers[][type]=User -F reviewers[][id]=<tu_user_id>

gh variable set PROD_BACKEND_RENDER_SERVICE_ID  --env prod --body "srv-xxxxxxxx"
gh variable set PROD_BACKEND_URL               --env prod --body "https://fieldops-backend.onrender.com"
gh variable set PROD_FRONTEND_RENDER_SERVICE_ID --env prod --body "srv-xxxxxxxx"
gh variable set PROD_FRONTEND_URL              --env prod --body "https://fieldops-frontend.onrender.com"
```

## 3. GitHub Actions — Secrets (repo-level, compartidos entre entornos)

No hay secret por entorno — mismo Render account key y mismo Cursor key
sirven las 3 llamadas API (Render distingue el entorno por `RENDER_SERVICE_ID`,
no por credencial):

| Secret | Usado en |
|---|---|
| `RENDER_API_KEY` | `deploy.sh` (dev/pre/prod), `promote-prod.yml`, `rollback.yml` |
| `CURSOR_API_KEY` | `pr-validation-*.yml` (constitution-guardian) |
| `GITHUB_TOKEN` | auto-provisto por Actions, no configurar |

```bash
gh secret set RENDER_API_KEY --body "rnd_xxxxxxxx"
gh secret set CURSOR_API_KEY --body "cur_xxxxxxxx"
```

## 4. Render — env vars de runtime por servicio (Render dashboard, no GitHub)

Los 4 servicios Render (`fieldops-backend`/`fieldops-frontend` × dev/pre/prod
— prod y pre pueden compartir el mismo par si Render los provisiona por
entorno) leen esto de `process.env` (backend) — configurar en cada servicio,
**valores distintos por entorno**, nunca committed:

| Variable | dev | pre | prod | Notas |
|---|---|---|---|---|
| `NODE_ENV` | `production` | `production` | `production` | `render.yaml` ya lo fija — Render siempre corre en modo prod-like |
| `PORT` | `3000` | `3000` | `3000` | fijo, coincide con `render.yaml` y `Dockerfile` |
| `DATABASE_URL` | conn string Postgres dev | conn string Postgres pre | conn string Postgres prod | `prisma/schema.prisma:7` — instancias separadas por entorno |
| `JWT_DEV_SECRET` | secreto propio dev | secreto propio pre | secreto propio prod | pese al nombre, es el secreto de firma JWT real en todo entorno (`idpAdapter.ts`) — nunca reusar el default de test (`dev-secret-do-not-use-in-prod`) |
| `ENCRYPTION_DATA_KEY` | clave propia dev | clave propia pre | clave propia prod | clave de cifrado de datos en reposo |
| `ACCESS_TOKEN_TTL_MINUTES` | opcional, default en código | igual | igual | override solo si el negocio pide TTL distinto por entorno |
| `REFRESH_TOKEN_TTL_DAYS` | opcional | igual | igual | idem |
| `RETENTION_MONTHS` | opcional, default 12 | igual | igual | política de retención de evidencias |
| `STORAGE_TIMEOUT_MS` | opcional | igual | igual | timeout adapter de storage |
| `SUMMARY_TIMEOUT_MS` | opcional | igual | igual | timeout servicio de resumen |

No configurar en ningún entorno real — son flags de inyección de fallos solo
para tests (`tests/env.setup.ts` y compañía), su sola presencia simula caídas:
`AUDIT_SIMULATE_FAILURE`, `IDP_SIMULATE_UNAVAILABLE`, `KMS_SIMULATE_FAILURE`,
`STORAGE_SIMULATE_FAILURE`, `STORAGE_SIMULATE_TIMEOUT`,
`SUMMARY_SIMULATE_FAILURE`, `SUMMARY_SIMULATE_TIMEOUT`.

Frontend no tiene env vars propias — build estático servido por nginx
(`frontend/nginx.conf`), sin `import.meta.env.VITE_*` en el código actual.

## 5. Checklist de puesta en marcha

- [ ] Crear GitHub Environment `prod` con reviewer(s) obligatorios
- [ ] Setear 8 repo vars (`DEV_*`, `PRE_*`) — sección 1
- [ ] Setear 4 vars del Environment `prod` — sección 2
- [ ] Setear 2 repo secrets (`RENDER_API_KEY`, `CURSOR_API_KEY`) — sección 3
- [ ] Provisionar 2-4 servicios Render (`runtime: image`, ver `render.yaml`
      de cada componente) y cargar sus env vars de runtime — sección 4
- [ ] Confirmar que cada servicio Render es **image-backed** (no
      `runtime: node`/`static`) — si no, `deploy.sh` falla con
      `cannot deploy images for non-image backed service`
