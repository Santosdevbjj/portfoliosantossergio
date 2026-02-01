import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { fixupConfigRules } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * ESLint v9/v10 Flat Config — Baseline Fevereiro 2026
 * Otimizado para Next.js 16, React 19 e TypeScript 5.7+
 */
export default [
  /**
   * 1️⃣ Global Ignores
   * No ESLint v9+, um objeto contendo apenas 'ignores' age como um .eslintignore global.
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
      'eslint.config.mjs',
    ],
  },

  /**
   * 2️⃣ Ambiente e Parser
   */
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  /**
   * 3️⃣ Next.js & React 19 Compatibility
   * Usamos o fixupConfigRules para "sanitizar" as regras do Next.js para o modo Flat Config.
   */
  ...fixupConfigRules(compat.extends('next/core-web-vitals', 'next/typescript')),

  /**
   * 4️⃣ Regras de Engenharia de Dados e UI
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* --- Next.js & Performance --- */
      '@next/next/no-img-element': 'error', // Foco em Web Vitals (LCP)
      
      /* --- React 19 (Compiler-Ready) --- */
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',

      /* --- TypeScript & Async (Next 16) --- */
      // O Next 16 usa muitas Promises em Layouts e Metadata
      '@typescript-eslint/no-floating-promises': 'warn',
      
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true 
        },
      ],

      // Flexibilidade para manipulação de payloads de dados complexos
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-deprecated': 'warn',

      /* --- Qualidade de Código & Clean Code --- */
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
    },
  },

  /**
   * 5️⃣ Prettier (Finalizador)
   */
  prettier,
];
