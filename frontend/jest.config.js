export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/tests/**/*.test.tsx', '**/tests/**/*.test.ts'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
};
