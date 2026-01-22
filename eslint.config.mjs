// eslint.config.mjs
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default [
  /**
   * 1. Next.js Core Web Vitals
   * Inclui:
   * - React
   * - React Hooks
   * - @next/eslint-plugin-next
   * - Regras críticas de performance
   */
  ...nextVitals,

  /**
   * 2. Next.js + TypeScript
   * Integra @typescript-eslint com o App Router
   */
  ...nextTs,

  /**
   * 3. Overrides específicos do projeto
   */
  {
    rules: {
      // Next.js
      "@next/next/no-img-element": "warn",

      // React
      "react/no-unescaped-entities": "off",

      // TypeScript — relaxamentos conscientes (dados dinâmicos / APIs)
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/restrict-template-expressions": "off",

      // Bibliotecas modernas (lucide-react, etc.)
      "@typescript-eslint/no-deprecated": "off"
    }
  },

  /**
   * 4. Prettier (SEMPRE POR ÚLTIMO)
   * Desativa regras conflitantes de formatação
   */
  prettier,

  /**
   * 5. Arquivos e pastas ignoradas
   */
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**"
    ]
  }
];
