// eslint.config.mjs
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

/**
 * ESLint Flat Config
 * Next.js 16 (App Router) + TypeScript + React 18+
 * Produção-ready para Vercel
 */
export default [
  /**
   * 0️⃣ Arquivos ignorados
   * Evita ruído e melhora performance do lint
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'coverage/**',
      '.turbo/**',

      // Next.js gerados
      'next-env.d.ts',

      // Assets estáticos
      'public/**',

      // App Router arquivos especiais
      'app/**/layout.tsx',
      'app/**/loading.tsx',
      'app/**/error.tsx',
    ],
  },

  /**
   * 1️⃣ Ambiente global
   * Flat Config não assume browser/node automaticamente
   */
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  /**
   * 2️⃣ Next.js Core Web Vitals
   * Inclui regras críticas de:
   * - Performance
   * - React
   * - Hooks
   */
  ...nextVitals,

  /**
   * 3️⃣ Next.js + TypeScript
   * Compatível com App Router e RSC
   */
  ...nextTs,

  /**
   * 4️⃣ Regras específicas do projeto
   */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /* ---------------- Next.js ---------------- */
      '@next/next/no-img-element': 'warn',

      /* ---------------- React ---------------- */
      'react/react-in-jsx-scope': 'off', // Next 13+
      'react/no-unescaped-entities': 'off',

      /* ---------------- TypeScript ---------------- */
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // Relaxamentos conscientes (arquitetura sênior)
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-deprecated': 'off',

      /* ---------------- Qualidade ---------------- */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
    },
  },

  /**
   * 5️⃣ Prettier
   * SEMPRE por último — desativa conflitos de formatação
   */
  prettier,
]
