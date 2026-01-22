// eslint.config.mjs
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  /**
   * 1. Ambiente global
   * Flat Config NÃO assume browser/node automaticamente
   */
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  /**
   * 2. Next.js Core Web Vitals
   * Inclui:
   * - React
   * - React Hooks
   * - @next/eslint-plugin-next
   * - Regras críticas de performance
   */
  ...nextVitals,

  /**
   * 3. Next.js + TypeScript (App Router ready)
   */
  ...nextTs,

  /**
   * 4. Overrides específicos do projeto
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

      // Bibliotecas modernas (lucide-react, framer-motion, etc.)
      "@typescript-eslint/no-deprecated": "off"
    }
  },

  /**
   * 5. Prettier
   * SEMPRE por último — desativa regras de formatação conflitantes
   */
  prettier,

  /**
   * 6. Arquivos e pastas ignoradas
   */
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**" // assets estáticos, decisão consciente
    ]
  }
];
