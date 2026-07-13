# Quickstart: Login con verificación RBAC

Prerrequisitos: entorno de `001-work-order-management` ya instalado y funcionando
(ver su propio quickstart/README para `npm install` + `.env` en `backend/` y
`frontend/`). Este feature no cambia el arranque, solo añade variables/tablas.

## Setup adicional

```bash
cd backend
npm install bcrypt cookie-parser
npx prisma migrate dev --name add_login_rbac
```

```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Variables de entorno nuevas en `backend/.env`:

```
JWT_DEV_SECRET=...            # ya existente (001), reutilizado para access+refresh
REFRESH_TOKEN_TTL_DAYS=7
ACCESS_TOKEN_TTL_MINUTES=15
```

## Validación end-to-end (manual)

1. Arrancar backend (`npm run dev` en `backend/`) y frontend (`npm run dev` en
   `frontend/`), como en `001`.
2. Abrir la vista de login (Tailwind CSS) en el navegador.
3. **Login válido (US1)**: introducir credenciales de un usuario seed con rol
   `dispatcher` → debe redirigir a `DispatcherBoard`. Repetir para `tecnico` →
   `TechnicianExecutionForm`, y `supervisor` → `SupervisorReview`.
4. **Login inválido (US2)**: probar email inexistente y password incorrecta por
   separado → mismo mensaje genérico "Credenciales inválidas" en ambos casos, 401
   en la petición de red (DevTools).
5. **Rate limit (US2, FR-010)**: 6 intentos fallidos consecutivos con el mismo email
   en <15min → el 6º responde 429.
6. **RBAC de doble capa (US3)**: con sesión de `tecnico` activa, usar `curl`/Postman
   para invocar directamente `POST /api/v1/orders/{id}/approve` (reservado a
   `supervisor`) reenviando la cookie `access_token` capturada del navegador →
   esperar 403, sin pasar por la UI.
7. **Sesión persiste tras reload**: con sesión activa, recargar la página (F5) →
   debe seguir autenticado (no debe redirigir a login), verificando que no se usó
   `localStorage` (inspeccionar Application tab del navegador — debe estar vacío).
8. **Logout + revocación real**: hacer logout, luego reintentar `POST /auth/refresh`
   reenviando manualmente la cookie `refresh_token` capturada antes del logout →
   esperar 401 (confirma que la denylist realmente revocó el token, no solo se
   borró la cookie del lado cliente).

## Referencias

- Contrato: [`/contracts/openapi.yaml`](../../contracts/openapi.yaml) — paths
  `/auth/login`, `/auth/refresh`, `/auth/logout`.
- Modelo de datos: [`data-model.md`](./data-model.md).
- Decisiones de arquitectura: [`research.md`](./research.md).
