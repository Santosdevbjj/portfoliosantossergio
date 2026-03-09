// src/dictionaries/validateAllLocales.ts

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

import { validateCrossLocale } from "./validateCrossLocale";

import type { Dictionary } from "@/types/dictionary";

/**
 * Estrutura mínima usada apenas para validação estrutural.
 * Não exige campos adicionados pelo normalizeDictionary.
 */
type RawDictionary = Partial<Dictionary> & {
  [key: string]: unknown;
};

/**
 * Valida a consistência estrutural entre todos os dicionários.
 *
 * ✔ Compatível com Next.js 16
 * ✔ Compatível com TypeScript strict
 * ✔ Não quebra build no Vercel
 * ✔ Valida apenas estrutura real do JSON
 */
export function validateAllLocales(): void {
  const base = ptBR as unknown as RawDictionary;

  const targets: Array<{
    data: RawDictionary;
    code: string;
  }> = [
    { data: enUS as unknown as RawDictionary, code: "en-US" },
    { data: esES as unknown as RawDictionary, code: "es-ES" },
    { data: esAR as unknown as RawDictionary, code: "es-AR" },
    { data: esMX as unknown as RawDictionary, code: "es-MX" },
  ];

  const errors: string[] = [];

  for (const target of targets) {
    errors.push(
      ...validateCrossLocale(
        base as Dictionary,
        target.data as Dictionary,
        "pt-BR",
        target.code,
      ),
    );
  }

  if (errors.length > 0) {
    console.error("\n❌ i18n validation failed (Alignment Errors):\n");

    for (const err of errors) {
      console.error(`  - ${err}`);
    }

    /**
     * Em produção o build deve falhar
     * para evitar deploy com dicionários inconsistentes
     */
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
