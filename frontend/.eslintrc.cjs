module.exports = {
  root: true,
  env: { browser: true, es2022: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // ADR-003: la capa de cliente API (services/api.ts, authClient.ts) y algunos
    // cuerpos de respuesta de red usan `any` deliberadamente (JSON de forma variable
    // por endpoint) — ver docs/adr/003-typescript-obligatorio.md.
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
