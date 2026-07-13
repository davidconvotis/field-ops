module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/tests/**/test_*.ts', '**/tests/performance/*.ts'],
  setupFiles: ['<rootDir>/tests/env.setup.ts'],
  testTimeout: 15000,
};
