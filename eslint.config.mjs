// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * ESLint v9 Flat Config - Janeiro 2026
 * Next.js 16 (App Router) + React 19
 */
export default [
  /**
   * 0️⃣ Arquivos ignorados
   * Reduzido para focar na segurança: agora validamos layouts e erros.
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
    ],
  },

  /**
   * 1️⃣ Ambiente e Parser
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
   * 2️⃣ Next.js & TypeScript
   * Usando FlatCompat para garantir que o plugin do Next.js 16
   * carregue corretamente no ESLint v9.
   */
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  /**
   * 3️⃣ Regras de Blindagem do Projeto
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* ---------------- Next.js 16 ---------------- */
      // Obriga o uso do componente Image para Web Vitals
      '@next/next/no-img-element': 'error', 
      
      /* ---------------- React 19 ---------------- */
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',

      /* ---------------- TypeScript Rigoroso ---------------- */
      // Garante que não esqueçamos de tratar as Promises do Next 16
      '@typescript-eslint/no-floating-promises': 'error',
      
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // Flexibilidade necessária para Data Specialist (tratamento de APIs dinâmicas)
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-deprecated': 'off',

      /* ---------------- Qualidade & Segurança ---------------- */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  /**
   * 4️⃣ Prettier (Sempre por último)
   */
  prettier,
];
