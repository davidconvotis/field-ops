export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.jsx', '**/tests/**/*.test.js'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
};
