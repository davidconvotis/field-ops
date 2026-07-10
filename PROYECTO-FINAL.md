# Proyecto Integrador · FieldOps — Slice de reasignación y ejecución de órdenes
---

## 1. De qué va esto

Es tu proyecto de cierre: pones en práctica **todo el flujo Spec-Driven Development de
principio a fin, con autonomía**. Construyes un *slice* pequeño y completo de una
aplicación real dejando que **la especificación gobierne el código**.

El objetivo no es escribir mucho código, sino **demostrar que dominas el flujo Spec
Kit**: que sabes partir de un brief ambiguo de negocio y convertirlo, fase a fase, en
artefactos verificables (constitution, spec, plan, tasks) de los que sale una
implementación coherente y trazable.

> Filosofía del curso: *"mejor una feature bien especificada y a medio implementar que
> cinco mal pensadas y a medio codificar"*.

Mantén el *slice* **pequeño y bien hecho**. La disciplina del proceso importa más que
la cantidad de funcionalidad.

---

## 2. El escenario (léelo como te llega de negocio)

Trabajas en **FieldOps**, una plataforma de gestión de órdenes de trabajo para
técnicos de campo. Una orden pasa por estos estados:

```
draft → assigned → in_progress → pending_review → closed
```

Intervienen tres tipos de usuario:

- **Dispatcher:** organiza el trabajo y **reasigna órdenes** entre técnicos.
- **Technician:** ejecuta la orden en campo y **registra la ejecución** (con evidencia
  fotográfica).
- **Supervisor:** revisa el trabajo en `pending_review` y puede **aprobar o rechazar**.

El *product owner* te pasa estas notas, tal cual, en una reunión rápida:

> *"Necesitamos que el técnico pueda registrar la ejecución de una orden y que el
> dispatcher pueda reasignarla si hace falta. Cuando el técnico envía la ejecución,
> debe adjuntar al menos una foto de evidencia. Luego el supervisor revisa y aprueba o
> rechaza. El usuario puede ver sus órdenes. Ah, y esto tiene que ser rápido y seguro,
> que manejamos datos de clientes. Sería ideal también tener un pequeño asistente que
> resuma la incidencia de cada orden a partir de las notas del técnico, para que el
> supervisor no tenga que leérselo todo. Y ya puestos, estaría genial un dashboard de
> métricas de productividad y notificaciones push a los técnicos… pero bueno, eso lo
> vemos."*

Ese es tu punto de partida. **Parte de tu trabajo es convertir ese brief informal y
ambiguo en artefactos verificables** — decidir qué entra, qué no, y qué significa
exactamente cada frase. No implementes a ciegas lo que te han dicho: **especifícalo
primero.**

---

## 3. Alcance funcional que debes cubrir

El *slice* mínimo (mantenlo pequeño y bien hecho, no grande y a medias):

1. **Reasignación de orden** por parte del dispatcher.
2. **Registro de ejecución** por parte del técnico, con al menos una foto de evidencia.
3. **Aprobación / rechazo** por parte del supervisor en `pending_review`.
4. **Control de acceso por rol (RBAC):** cada acción solo la puede hacer el rol
   correcto; el resto recibe un rechazo explícito.
5. **Un componente con IA:** un asistente o *tool* que **resume la incidencia** de una
   orden a partir de sus notas. Regla dura: **si no hay evidencia/nota suficiente, debe
   decirlo y no inventar** el resumen.

Lo que quede fuera del *slice*, decláralo explícitamente como fuera de alcance (y por
qué). Acotar bien es parte del ejercicio.

---

## 4. El flujo Spec Kit que debes seguir

Este es el corazón del proyecto. Recorre las fases **en orden**, cada una con su
artefacto, y **deja rastro en commits separados**: tu historial de git debe demostrar
que la spec fue antes que el código. El agente solo avanza con tu "luz verde" en cada
gate.

| # | Fase | Comando | Qué produces |
|---|---|---|---|
| 1 | **Constitution** | `/speckit.constitution` | Reglas no negociables del sistema y **alcance** (qué entra y qué no) |
| 2 | **Specify** | `/speckit.specify` | FRs en **EARS**, NFRs **cuantificados**, edge cases y acceptance criteria |
| 3 | **Clarify** | `/speckit.clarify` | Ambigüedades detectadas en el brief y **cómo las resolviste** |
| 4 | **Checklist** | `/speckit.checklist` | Lista de verificación de que la spec está lista para planificar |
| 5 | **Plan** | `/speckit.plan` | Plan técnico con dependencias explícitas y qué va en paralelo |
| 6 | **Tasks** | `/speckit.tasks` | Descomposición en tareas con paralelismo razonado |
| 7 | **Analyze** | `/speckit.analyze` | Análisis de consistencia entre artefactos antes de implementar |
| 8 | **Implement** | `/speckit.implement` | Frontend + backend + tests **juntos** |

> Un *slice* no está terminado hasta que **frontend, backend y tests están en verde a
> la vez**. Separar "la pantalla" de "el API" de "los tests" es la forma más rápida de
> acumular deuda técnica.

---

## 5. Entregables (estructura del repositorio)

```
/
  README.md              ← cómo arrancar la app y cómo verificarla (comandos exactos)
  /.specify (o /specs)
    constitution.md       ← reglas no negociables + alcance (qué queda fuera)
    spec.md               ← FRs (EARS), NFRs cuantificados, edge cases, acceptance criteria
    clarify.md            ← ambigüedades detectadas y decisiones tomadas
    checklist.md          ← verificación de que la spec está lista
    plan.md               ← dependencias y paralelismo
    tasks.md              ← descomposición de tareas
    analyze.md            ← análisis de consistencia entre artefactos
  /contracts
    openapi.yaml          ← contrato de la API antes de implementar (o equivalente tipado)
  /docs
    traceability.md       ← matriz requisito → acceptance criteria → test
  /src                    ← frontend + backend + el componente de IA / tool
  /tests                  ← unit + contract + integration
  /evals                  ← golden cases + umbrales del componente de IA
```

> El *stack es libre* (Node/Express, NestJS, FastAPI, etc.). Lo importante es la
> disciplina del flujo, no la tecnología concreta. Mantén el proyecto **ejecutable con
> un solo comando de instalación y uno de test**.

---

## 6. Requisitos técnicos mínimos

- **RBAC en doble capa:** la protección no puede vivir solo en la UI. Ocultar un botón
  **no es seguridad**: el backend debe rechazar la operación aunque se fuerce la
  petición. Distingue correctamente **401** (no autenticado) de **403** (autenticado
  sin permiso).
- **Contrato antes de implementar:** define el contrato de la API (OpenAPI o tipos) y
  que los tests lo verifiquen.
- **Trazabilidad requisito → test:** cada acceptance criteria debe poder rastrearse
  hasta una prueba concreta. Si un requisito no se puede verificar, no está terminado.
- **Componente de IA especificado como contrato:** entradas, salidas y **qué hace
  cuando no tiene evidencia suficiente** (fallback, no invención). Acompáñalo de una
  **eval** mínima: golden cases con umbrales de aceptación.
- **Tests en verde:** `install` + `test` deben pasar en una máquina limpia.

---

## 7. Entrega

- Trabaja en **tu propio repositorio**.
- Asegúrate de que `install` + `test` funcionan en limpio y de que el `README` explica
  cómo arrancar y verificar.
- Marca la entrega con un tag `entrega-final` (o el PR indicado por el instructor).

**Consejo final:** no corras a implementar. La ambigüedad se paga dos veces —primero
en diseño y luego en integración—. Cada minuto que inviertas en una spec sin huecos te
lo devuelve el resto del ciclo.
