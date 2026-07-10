module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/test_*.js', '**/tests/performance/*.js'],
  setupFiles: ['<rootDir>/tests/env.setup.js'],
  testTimeout: 15000,
};
