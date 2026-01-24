// eslint.config.mjs
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import globals from "globals";

/**
 * ESLint Flat Config - Next.js 16 + TypeScript + React 19
 * Revisado para máxima compatibilidade com App Router e Vercel
 */
export default [
  /**
   * 1️⃣ Ambiente global
   * Flat Config não assume automaticamente browser/node
   */
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  /**
   * 2️⃣ Next.js Core Web Vitals
   * Inclui:
   * - React e Hooks
   * - Regras críticas de performance
   */
  ...nextVitals,

  /**
   * 3️⃣ Next.js + TypeScript
   * Configura App Router com TS
   */
  ...nextTs,

  /**
   * 4️⃣ Regras específicas do projeto
   */
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Next.js
      "@next/next/no-img-element": "warn",

      // React
      "react/no-unescaped-entities": "off",

      // TypeScript — relaxamentos conscientes
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/restrict-template-expressions": "off",

      // Bibliotecas modernas (lucide-react, framer-motion, clsx, tailwind-merge)
      "@typescript-eslint/no-deprecated": "off",

      // Regras adicionais que ajudam a manter padronização
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "react/react-in-jsx-scope": "off", // Next 16+ não precisa importar React
    },
  },

  /**
   * 5️⃣ Prettier
   * Sempre por último — desativa conflitos de formatação
   */
  prettier,

  /**
   * 6️⃣ Ignora arquivos/pastas desnecessárias
   */
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**", // assets estáticos
      "coverage/**", // relatórios de teste
      ".turbo/**", // cache TurboRepo, se existir
    ],
  },
];
