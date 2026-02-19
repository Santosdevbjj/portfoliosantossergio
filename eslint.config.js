import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import { fixupConfigRules } from '@eslint/compat'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
})

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  /**
   * 1️⃣ Ignorar arquivos gerados e infraestrutura
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'public/**',
      '**/*.d.ts',
      'next.config.ts',
    ],
  },

  /**
   * 2️⃣ Parser e ambiente TypeScript
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2023,
      },
    },
  },

  /**
   * 3️⃣ Compatibilidade Next 16 + TypeScript
   */
  ...fixupConfigRules(
    compat.extends(
      'plugin:@next/next/core-web-vitals',
      'plugin:@typescript-eslint/recommended-type-checked'
    )
  ),

  /**
   * 4️⃣ Regras customizadas
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* --- Performance & Next.js (App Router) --- */
      '@next/next/no-img-element': 'error',

      /* --- TypeScript --- */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      '@typescript-eslint/no-deprecated': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-floating-promises': 'error',

      /* --- Flexibilidade controlada --- */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      /* --- Clean Code --- */
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
    },
  },

  /**
   * 5️⃣ Prettier (deve ser o último)
   */
  prettier,
]
