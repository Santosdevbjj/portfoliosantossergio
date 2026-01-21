import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals.js'; // Ajuste crítico: Adicionado .js
import nextTs from 'eslint-config-next/typescript.js';       // Ajuste crítico: Adicionado .js
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * FLAT CONFIG - RIGOR TÉCNICO E GOVERNANÇA (2026)
 * Versão otimizada para resolver o erro de resolução de módulo na Vercel.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
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
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          'vars': 'all',
          'varsIgnorePattern': '^_',
          'args': 'after-used',
          'argsIgnorePattern': '^_'
        }
      ],

      // --- COMPATIBILIDADE E TRANSIÇÃO ---
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'react/no-unescaped-entities': 'off',
      
      // --- REGRAS NEXT.JS ESPECÍFICAS ---
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
      
      // --- ORGANIZAÇÃO ---
      'import/order': 'off', 
    },
  },
  {
    // Overrides para arquivos que seguem padrões específicos do Next.js
    files: ['src/app/**/layout.tsx', 'src/app/**/page.tsx', 'src/middleware.ts'],
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
    '*.config.mjs',
    '*.config.js'
  ]),
]);

export default eslintConfig;
