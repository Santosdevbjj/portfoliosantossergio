// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * FLAT CONFIG - RIGOR TÉCNICO MÁXIMO (2026)
 * Configuração: Next.js 16.1.4 + React Hooks 7.0.1 + Typed Linting (Strict)
 */
export default defineConfig([
  // 1. Base do ESLint
  eslint.configs.recommended,

  // 2. Presets TYPE-CHECKED (O nível máximo de segurança do typescript-eslint)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // 3. Configurações do Next.js 16.1.4 (Spread obrigatório)
  ...nextVitals,

  // 4. React Hooks 7.0.1 (Nativo para Flat Config)
  reactHooks.configs.flat.recommended,

  // 5. Prettier (Sempre por último para evitar conflitos de estilo)
  prettier,

  {
    // 6. Configuração do Parser para Typed Linting (Project Service 2026)
    languageOptions: {
      parserOptions: {
        // Ativa o serviço de tipos do TypeScript para análise profunda
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // --- SEGURANÇA E INTEGRIDADE (Typed-Aware) ---
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-return': 'error', // Resolve o erro de caminhos de retorno
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',

      // --- GESTÃO DE VARIÁVEIS (CLEAN CODE) ---
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error', 
      'unused-imports/no-unused-vars': [
        'warn',
        {
          'vars': 'all',
          'varsIgnorePattern': '^_',
          'args': 'after-used',
          'argsIgnorePattern': '^_'
        }
      ],

      // --- COMPATIBILIDADE REACT 19 / NEXT 16 ---
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'error',

      // --- AJUSTES DE ESTILO ---
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  {
    // 7. Definições Globais de Exclusão
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/**',
      'node_modules/**',
      'eslint.config.mjs',
      'next.config.mjs',
      'tailwind.config.ts',
      'package.json'
    ],
  },
]);
