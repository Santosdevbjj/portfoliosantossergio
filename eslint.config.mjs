import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * FLAT CONFIG - NEXT.JS 16.1.4 (LATEST 2026)
 * Ajustado para a remoção do 'next lint' e uso direto da CLI.
 */
const eslintConfig = defineConfig([
  // No Next.js 16, essas configs são arrays de objetos. 
  // O spread (...) é obrigatório para achatar a estrutura no defineConfig.
  ...nextVitals,
  ...nextTs,
  prettier,
  
  {
    // Registro nomeado do plugin para evitar "Plugin '' not found"
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // --- SEGURANÇA E GOVERNANÇA ---
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',

      // --- CLEAN CODE (Configuração de 2026) ---
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

      // --- COMPATIBILIDADE REACT/NEXT 16 ---
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
    },
  },

  // Overrides de arquivos
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Ignores Globais atualizados para Next.js 16
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
