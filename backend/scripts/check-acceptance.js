#!/usr/bin/env node
// Gate de pr-validation-back.yml (contracts/gates.md): verifica ACs del
// negocio contra una instancia en ejecución de la API. Stub — cubre el
// caso nominal (health check) y deja el patrón para añadir un check por
// AC de specs/00N-*/spec.md a medida que se trazan (constitution.md
// Principio III — Trazabilidad Requisito → Test).
//
// Usage: API_BASE_URL=http://localhost:3000 node scripts/check-acceptance.js
'use strict';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const checks = [
  {
    name: 'API responde (health check)',
    run: async () => {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) {
        throw new Error(`GET /health devolvió ${res.status}`);
      }
    },
  },
];

async function main() {
  let failures = 0;

  for (const check of checks) {
    try {
      await check.run();
      console.log(`✓ ${check.name}`);
    } catch (err) {
      failures += 1;
      console.error(`✗ ${check.name}: ${err.message}`);
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} AC(s) fallando.`);
    process.exit(1);
  }

  console.log(`\nTodos los ACs verificados (${checks.length}) en verde.`);
}

main().catch((err) => {
  console.error('check-acceptance.js falló de forma inesperada:', err);
  process.exit(1);
});
