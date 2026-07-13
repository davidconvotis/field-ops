module.exports = {
  root: true,
  env: { node: true, es2022: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', project: './tsconfig.json' },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // ADR-003: migración retroactiva a TS deliberadamente mantiene require()/module.exports
    // (CommonJS) en vez de reescribir a import/export ESM — cambio mecánico de tipos, no de
    // módulo. Ver docs/adr/003-typescript-obligatorio.md.
    '@typescript-eslint/no-require-imports': 'off',
  },
};
