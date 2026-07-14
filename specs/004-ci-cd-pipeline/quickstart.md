# Quickstart: Validar Pipeline CI/CD FieldOps

Prerrequisitos: repo con `.github/workflows/*.yml` generados (Fase 6),
`GITHUB_TOKEN` con permisos por defecto, environments `dev`/`pre`/`prod`
configurados si se prueba Capa 2 (ver `docs/ci-cd-environment-setup.md`).

## 1. Validar aislamiento por componente (User Story 1 / SC-001)

```bash
git checkout -b feature/prueba-back develop
echo "// cambio trivial" >> backend/src/api/app.ts
git commit -am "test: cambio solo backend"
git push origin feature/prueba-back
# Abrir PR feature/prueba-back → develop
```

**Resultado esperado**: `pr-validation-back` corre; `pr-validation-front` NO
aparece en los checks del PR. Ver `contracts/gates.md` para la lista de gates
que deben ejecutarse.

## 2. Validar bloqueo de merge (FR-004)

Repetir el paso 1 pero rompiendo un test unitario de backend
(`npm test` debe fallar). **Resultado esperado**: el botón de merge del PR
queda deshabilitado hasta corregir el test.

## 3. Validar snapshot en develop (User Story 2 / SC-003)

```bash
git checkout develop && git merge --no-ff feature/prueba-back
git push origin develop
```

**Resultado esperado**: en menos de 15 min, aparece en GHCR
`ghcr.io/<org>/<repo>/fieldops-back:x.y.z-snapshot.{short-sha}` y un
workflow artifact con el dist de backend, mismo `short-sha`.

## 4. Validar release en main (User Story 3 / SC-004)

```bash
CURRENT=$(scripts/bump-version.sh backend/VERSION)
git tag "v$CURRENT" && git push origin "v$CURRENT"
git checkout main && git merge --no-ff develop && git push origin main
```

**Resultado esperado**: GitHub Release visible en la pestaña Releases con
tag `v$CURRENT`, imagen `ghcr.io/<org>/<repo>/fieldops-back:$CURRENT` en
GHCR, dist adjunto como asset permanente.

## 5. Validar Capa 2 (opcional, si implementada)

Confirmar en Settings → Environments que `prod` requiere aprobación manual
antes de que el job de deploy a `prod` se ejecute tras el deploy a `pre`.

## Referencias

- `contracts/gates.md` — qué gate corre dónde.
- `data-model.md` — artefactos y sus relaciones.
- `../../pipeline-constitution.md` — reglas no negociables verificadas por
  cada paso anterior.
