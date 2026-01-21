import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * FLAT CONFIG - RIGOR TÉCNICO E GOVERNANÇA (2026)
 * Este arquivo unifica as regras de Core Web Vitals, TypeScript e Acessibilidade.
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
      'no-duplicate-imports': 'error', // Impede o erro fatal que vimos no seu log
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
      // Permitimos 'any' como 'warn' para não travar seu build agora, 
      // mas sinalizar onde precisamos de tipagem forte (Rigor Bancário).
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'react/no-unescaped-entities': 'off',
      
      // --- REGRAS NEXT.JS ESPECÍFICAS ---
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
      
      // --- ORGANIZAÇÃO (Ajustado conforme o log) ---
      // Desativamos a ordem rígida temporariamente para evitar erros de build
      // enquanto você organiza os componentes.
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
    '*.config.js'
  ]),
]);

export default eslintConfig;
