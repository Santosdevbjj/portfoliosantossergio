import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { fixupConfigRules } from '@eslint/compat';
import tseslint from 'typescript-eslint'; // Importação direta recomendada no v10

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  /**
   * 1️⃣ Ignorar arquivos gerados e de infraestrutura
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
      'next.config.ts', // Configs de infra costumam ter regras próprias
    ],
  },

  /**
   * 2️⃣ Configuração de Parser para TS 6.0
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Habilita o novo motor de performance do TS 6.0
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024, // Atualizado para 2024 (Node 24)
      },
    },
  },

  /**
   * 3️⃣ Compatibilidade Next.js 16 & Plugins v10
   */
  ...fixupConfigRules(
    compat.extends(
      'plugin:@next/next/core-web-vitals',
      'plugin:@typescript-eslint/recommended-type-checked' // Versão mais segura para Ciência de Dados
    )
  ),

  /**
   * 4️⃣ Regras Customizadas e Refinamento
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* --- Performance & Next.js 16 (RSC) --- */
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',

      /* --- TypeScript 6.0 Engine --- */
      // Obriga o uso de 'type' no import, reduzindo o bundle final (Tree-shaking)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Regra de ouro para 2026: detectar código depreciado do ecossistema
      '@typescript-eslint/no-deprecated': 'warn',

      // Tratamento inteligente de variáveis não usadas
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true 
        },
      ],

      /* --- Flexibilidade (Ideal para manipulação de objetos dinâmicos/JSON) --- */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      /* --- React & Clean Code --- */
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      
      // Garante que o build falhe se houver promessas flutuantes (Importante para o Dictionary async)
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },

  /**
   * 5️⃣ Formatação
   */
  prettier,
];
