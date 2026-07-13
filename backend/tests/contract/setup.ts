export {};
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const app = require('../../src/api/app');

const OPENAPI_PATH = path.join(__dirname, '..', '..', '..', 'contracts', 'openapi.yaml');

function loadOpenApiDoc(): any {
  const raw = fs.readFileSync(OPENAPI_PATH, 'utf8');
  return yaml.load(raw);
}

/**
 * Verifica que `status` esté documentado como posible respuesta de `operationId`
 * en contracts/openapi.yaml — falla el test de contrato si el código de estado
 * devuelto por la implementación no está en el contrato (Principio II).
 */
function expectDocumentedStatus(doc: any, operationId: string, status: number): void {
  for (const pathItem of Object.values(doc.paths as Record<string, any>)) {
    for (const operation of Object.values(pathItem as Record<string, any>)) {
      if (operation.operationId === operationId) {
        const documented = Object.keys(operation.responses).includes(String(status));
        if (!documented) {
          throw new Error(
            `operationId '${operationId}' no documenta el status ${status} en contracts/openapi.yaml (responses: ${Object.keys(operation.responses)})`,
          );
        }
        return;
      }
    }
  }
  throw new Error(`operationId '${operationId}' no encontrado en contracts/openapi.yaml`);
}

module.exports = { app, loadOpenApiDoc, expectDocumentedStatus };
