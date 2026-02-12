import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // No v10, garantir que o resolvePluginsRelativeTo esteja correto é vital
  resolvePluginsRelativeTo: __dirname, 
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  /**
   * 1️⃣ Global Ignores
   * No v10, o primeiro objeto de configuração com 'ignores' define o escopo do projeto.
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
      'eslint.config.mjs', // auto-ignore
    ],
  },

  /**
   * 2️⃣ Base Configuration & Globals
   */
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021, // Adicionado para garantir APIs modernas de JS
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Importante para o novo rastreamento de JSX do v10
        },
      },
    },
  },

  /**
   * 3️⃣ Next.js & TypeScript Compatibility
   * Aplicamos o fixup para garantir que os plugins antigos não quebrem no core do v10.
   */
  ...fixupConfigRules(
    compat.extends(
      'plugin:@next/next/core-web-vitals',
      'plugin:@typescript-eslint/recommended'
    )
  ),

  /**
   * 4️⃣ Regras Customizadas (TS e React 19)
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* --- Performance & Next.js 16 --- */
      '@next/next/no-img-element': 'error',
      
      /* --- React 19 & JSX (v10 improvement) --- */
      // Com o rastreamento de JSX do ESLint v10, 'no-unused-vars' 
      // agora entende melhor componentes React sem precisar de hacks.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      /* --- TypeScript & Clean Code --- */
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true 
        },
      ],

      // Desativando regras restritivas para facilitar manipulação de dados
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      
      // Nova regra de deprecation recomendada para migrações em 2026
      '@typescript-eslint/no-deprecated': 'warn',

      /* --- Qualidade de Código --- */
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
    },
  },

  /**
   * 5️⃣ Prettier (Sempre por último para sobrescrever conflitos)
   */
  prettier,
];
