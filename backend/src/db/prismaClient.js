let PrismaClient;

if (process.env.NODE_ENV === 'test') {
  // Datasource alterno SQLite en memoria (backend/prisma/schema.test.prisma) — Research §2.
  ({ PrismaClient } = require('../generated/prisma-test-client'));
} else {
  ({ PrismaClient } = require('@prisma/client'));
}

const prisma = new PrismaClient();

module.exports = { prisma };
