import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals.js';
import nextTs from 'eslint-config-next/typescript.js';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * FLAT CONFIG - RIGOR TÉCNICO E GOVERNANÇA (2026)
 * Solução definitiva para "Plugin '' not found" via espalhamento de config e mapping.
 */
const eslintConfig = defineConfig([
  // Injeção via spread para garantir que o array de objetos do Next seja achatado corretamente
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    // Mapeamento explícito: O motor do ESLint 9 exige que o plugin tenha um nome de namespace
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // --- SEGURANÇA E INTEGRIDADE ---
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',

      // --- GESTÃO DE VARIÁVEIS E CLEAN CODE ---
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

      // --- COMPATIBILIDADE ---
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'react/no-unescaped-entities': 'off',
      
      // --- REGRAS NEXT.JS ---
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
      'import/order': 'off', 
    },
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'node_modules/**',
    'eslint.config.mjs'
  ]),
]);

export default eslintConfig;
