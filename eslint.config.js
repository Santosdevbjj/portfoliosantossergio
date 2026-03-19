import nextConfig from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

/**
 * ESLint Flat Config - Portfólio Sérgio Santos (v16.2.0 Ready)
 * -----------------------------------------------------------------------------
 * ✔ Suporte a ESLint 9+ e Flat Config nativo
 * ✔ Regras de Proteção para Next.js 16 (Async Context)
 * ✔ TypeScript 6.0 Strict Mode
 */
export default tseslint.config(
  // 1. Ignorar arquivos de build e assets estáticos (PDFs/OG/Icons/Images)
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'public/**', // Ignora PDFs e OG Images para performance do linter
      '**/*.d.ts',
      'next-env.d.ts',
      '.github/**',
    ],
  },

  // 2. Base do Next.js e TypeScript
  ...tseslint.configs.recommended,
  ...nextConfig,
  ...nextTs,

  // 3. Regras customizadas para o ecossistema Next.js 16.2
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      /* --- PROTEÇÃO NEXT.JS 16.2 (CRÍTICO) --- */
      // Impede o uso de params/searchParams sem await (Mudança obrigatória da v16)
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@next/next/no-async-client-component': 'error',
      '@next/next/no-img-element': 'error', // Força o uso de next/image para sua foto e troféus

      /* --- TYPESCRIPT 6.0 & REGRAS DE IA --- */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_', 
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_' 
        }
      ],
      '@typescript-eslint/no-deprecated': 'warn', // Alerta sobre APIs obsoletas do React 19
      
      /* --- RESILIÊNCIA & QUALIDADE --- */
      'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      'no-debugger': 'error',

      /* --- AJUSTES DE FLEXIBILIDADE --- */
      // Permitido para lidar com dicionários multilingues complexos (Dicionários de tradução)
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // 4. Prettier (Sempre por último para evitar conflitos de formatação)
  prettier
);
