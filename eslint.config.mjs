import { defineConfig } from 'eslint-define-config';

const baseConfig = defineConfig({
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
    jest: true,
    es2020: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
});

import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    plugins: ['@typescript-eslint'],
    rules: {
      ...(await import('@typescript-eslint/eslint-plugin')).configs.recommended
        .rules,
    },
  },
  {
    rules: {
      ...(await import('eslint-config-prettier')).rules,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  {
    ...baseConfig,
  },
];
