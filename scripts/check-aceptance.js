#!/usr/bin/env node
// Post-deploy acceptance check (specs/004-ci-cd-pipeline/spec.md FR-008b/FR-011c).
// Exercises acceptance scenarios from the product specs (001-work-order-management,
// 002-login-rbac, 003-dispatcher-orders-ui) against the real deployed backend API —
// not a rebuild, not a mock, the actual running service in dev/pre.
//
// Usage: node scripts/check-aceptance.js --base-url https://dev.api.example.com
//
// Exit code 0 = all checks passed. Exit code 1 = at least one check failed
// (ci-develop-back/ci-main-back treat this the same as a failed health check —
// the deployment is flagged unhealthy, per FR-008b/FR-011c).

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--base-url") {
      args.baseUrl = argv[i + 1];
      i++;
    }
  }
  return args;
}

const { baseUrl } = parseArgs(process.argv.slice(2));

if (!baseUrl) {
  console.error("Usage: node scripts/check-aceptance.js --base-url <url>");
  process.exit(1);
}

const base = baseUrl.replace(/\/+$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    ...options,
    signal: AbortSignal.timeout(10_000),
  });
  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

// Each check: a concrete acceptance scenario, expressed as an HTTP expectation.
const checks = [
  {
    name: "health endpoint reports ok (FR-018)",
    run: async () => {
      const { status, body } = await request("/health");
      if (status !== 200) return `expected HTTP 200, got ${status}`;
      if (!body || body.status !== "ok") return `expected {status:"ok"}, got ${JSON.stringify(body)}`;
      return null;
    },
  },
  {
    name: "RBAC double layer: GET /orders with no token returns 401 (constitution Principle I)",
    run: async () => {
      const { status } = await request("/orders");
      if (status !== 401) return `expected HTTP 401, got ${status}`;
      return null;
    },
  },
  {
    name: "RBAC double layer: GET /orders with a malformed token returns 401 (constitution Principle I)",
    run: async () => {
      const { status } = await request("/orders", {
        headers: { Authorization: "Bearer not-a-real-token" },
      });
      if (status !== 401) return `expected HTTP 401, got ${status}`;
      return null;
    },
  },
  {
    name: "RBAC double layer: GET /clients with no token returns 401 (003-dispatcher-orders-ui)",
    run: async () => {
      const { status } = await request("/clients");
      if (status !== 401) return `expected HTTP 401, got ${status}`;
      return null;
    },
  },
  {
    name: "login endpoint live: POST /auth/login with bad credentials returns 401, not 5xx (002-login-rbac)",
    run: async () => {
      const { status } = await request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "no-such-user@example.com", password: "wrong" }),
      });
      if (status !== 401) return `expected HTTP 401, got ${status}`;
      return null;
    },
  },
];

async function main() {
  let failures = 0;

  for (const check of checks) {
    try {
      const error = await check.run();
      if (error) {
        console.error(`FAIL - ${check.name}: ${error}`);
        failures++;
      } else {
        console.log(`PASS - ${check.name}`);
      }
    } catch (err) {
      console.error(`FAIL - ${check.name}: ${err.message}`);
      failures++;
    }
  }

  console.log(`\n${checks.length - failures}/${checks.length} acceptance checks passed`);

  if (failures > 0) {
    process.exit(1);
  }
}

main();
