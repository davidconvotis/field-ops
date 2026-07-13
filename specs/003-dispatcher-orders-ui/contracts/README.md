# Contrato OpenAPI

El contrato canónico de esta feature vive en la ruta fija exigida por la constitución
(Principio II): [`/contracts/openapi.yaml`](../../../contracts/openapi.yaml)
(`GET /orders` extendido con `status`, `technicianId`, `page`, `pageSize`; nuevo
path `GET /technicians`).

No se duplica aquí para evitar que las dos copias diverjan — cualquier cambio de contrato
se hace únicamente en `/contracts/openapi.yaml` y se referencia desde `tasks.md`.
