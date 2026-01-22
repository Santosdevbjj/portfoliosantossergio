// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  /**
   * 1. Regras oficiais do Next.js
   * - React
   * - React Hooks
   * - @next/eslint-plugin-next
   * - Core Web Vitals (warnings viram errors)
   */
  ...nextVitals,

  /**
   * 2. Regras TypeScript (typescript-eslint)
   * Mantém tipagem forte sem travar build em dados dinâmicos
   */
  ...nextTs,

  /**
   * 3. Prettier
   * Desativa regras de formatação conflitantes
   */
  prettier,

  /**
   * 4. Overrides específicos do projeto
   */
  {
    rules: {
      // Next.js
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",

      // React
      "react/no-unescaped-entities": "off",

      // TypeScript — relaxamentos conscientes (build-safe)
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/restrict-template-expressions": "off",

      // Icons / libs modernas (lucide-react, etc.)
      "@typescript-eslint/no-deprecated": "off",

      // Hooks e padrões do App Router
      "react-hooks/set-state-in-effect": "off",
    },
  },

  /**
   * 5. Ignorar arquivos e pastas que não devem ser analisados
   */
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
  ]),
]);
