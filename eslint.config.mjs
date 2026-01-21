// @ts-check

import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * FLAT CONFIG - RIGOR TÉCNICO MÁXIMO (PROJETO SÉRGIO SANTOS 2026)
 * Alinhado com a migração oficial Next.js 16.0.0+
 */
export default defineConfig([
  // 1. Ignorar pastas (Usando globalIgnores conforme a nova documentação)
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'node_modules/**',
    '*.config.mjs',
    'tailwind.config.ts'
  ]),

  // 2. Base do ESLint
  eslint.configs.recommended,

  // 3. Presets do Next.js (Core Web Vitals + TypeScript oficial)
  ...nextVitals,
  ...nextTs,

  // 4. Presets TYPE-CHECKED (Segurança máxima para análise de dados e sistemas críticos)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // 5. React Hooks 7.0.1 (Nativo para Flat Config)
  reactHooks.configs.flat.recommended,

  // 6. Configuração Customizada e Plugins Adicionais
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        // Ativa o Project Service 2026 para análise profunda de tipos
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // --- REGRAS DO NEXT.JS (SOBREPOSIÇÃO DA DOC) ---
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'error', // Rigor para LCP: usar sempre next/image
      '@next/next/no-html-link-for-pages': 'error',

      // --- SEGURANÇA E INTEGRIDADE (Typed-Aware) ---
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-return': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      
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

      // --- PADRONIZAÇÃO SÊNIOR ---
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // 7. Prettier (Sempre por último para desativar conflitos de formatação)
  prettier,
]);
