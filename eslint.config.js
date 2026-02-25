import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

/**
 * ESLint Flat Config - Portfólio Sérgio Santos
 * Alinhado com Next.js 16, TypeScript 6.0 e ESLint 9+
 */
export default tseslint.config(
  // 1. Configurações Globais e Ignorar arquivos
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    'public/**',
    '**/*.d.ts',
    'next-env.d.ts',
    'mcp-env.js'
  ]),

  // 2. Base do Next.js (Core Web Vitals)
  ...nextVitals,

  // 3. Regras de TypeScript 6.0 (Strict Type Checking)
  ...nextTs,

  // 4. Configuração Específica para arquivos TS/TSX
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
      /* --- PERFORMANCE & NEXT.JS 16 --- */
      '@next/next/no-img-element': 'error', // Força o uso de next/image
      '@next/next/no-async-client-component': 'error', // Proteção específica Next 16

      /* --- TYPESCRIPT 6.0 STRICTNESS --- */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-deprecated': 'warn', // Detecta APIs obsoletas no TS 6.0
      '@typescript-eslint/no-explicit-any': 'warn', // Melhor avisar do que desligar totalmente

      /* --- RESILIÊNCIA (Sistemas Críticos) --- */
      'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      'no-debugger': 'error',
      
      /* --- DESATIVAR REGRAS DE INTERFERÊNCIA --- */
      // Desativamos algumas regras "unsafe" se o projeto for muito dinâmico com dicionários
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // 5. Prettier (Sempre por último para sobrescrever conflitos)
  prettier
);
