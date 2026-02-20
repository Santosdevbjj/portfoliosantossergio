// src/dictionaries/validateAllLocales.ts

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

import { validateCrossLocale } from "./validateCrossLocale";
import type { Dictionary } from "@/types/dictionary";

/**
 * Valida a consistência estrutural entre todos os dicionários.
 * Garante que todas as chaves do locale base (pt-BR)
 * existam nos demais idiomas suportados.
 *
 * ✔ Compatível com Next.js 16
 * ✔ Compatível com TypeScript 6 strict
 * ✔ Seguro para build no Vercel
 */
export function validateAllLocales(): void {
  const base = ptBR as Dictionary;

  const targets: Array<{
    data: Dictionary;
    code: string;
  }> = [
    { data: enUS as Dictionary, code: "en-US" },
    { data: esES as Dictionary, code: "es-ES" },
    { data: esAR as Dictionary, code: "es-AR" },
    { data: esMX as Dictionary, code: "es-MX" },
  ];

  const errors: string[] = [];

  for (const target of targets) {
    errors.push(
      ...validateCrossLocale(base, target.data, "pt-BR", target.code),
    );
  }

  if (errors.length > 0) {
    console.error("\n❌ i18n validation failed (Alignment Errors):\n");

    for (const err of errors) {
      console.error(`  - ${err}`);
    }

    // Em produção o build deve falhar
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "i18n validation failed: locale structure mismatch",
      );
    }
  } else {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "✅ i18n dictionaries are fully aligned (5 locales).",
      );
    }
  }
}
