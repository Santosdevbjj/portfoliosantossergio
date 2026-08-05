import { describe, it, expect } from "vitest"; // Se usar Jest, altere para "jest"
import type { Dictionary } from "../src/types/dictionary";

import ptBR from "../src/dictionaries/pt-BR.json";
import enUS from "../src/dictionaries/en-US.json";
import esES from "../src/dictionaries/es-ES.json";
import esAR from "../src/dictionaries/es-AR.json";
import esMX from "../src/dictionaries/es-MX.json";

/**
 * Locale base usado como referência
 */
const baseLocale = "pt-BR";

/**
 * Asserção dupla (as unknown as Dictionary) para evitar o erro TS2352
 * no TypeScript 7.0.2 com JSONs
 */
const dictionaries: Record<string, Dictionary> = {
  "pt-BR": ptBR as unknown as Dictionary,
  "en-US": enUS as unknown as Dictionary,
  "es-ES": esES as unknown as Dictionary,
  "es-AR": esAR as unknown as Dictionary,
  "es-MX": esMX as unknown as Dictionary,
};

/**
 * Regex para detectar placeholders
 * Ex: {name}, {count}, {articleId}
 */
const PLACEHOLDER_REGEX = /\{(.*?)\}/g;

/**
 * Extrai placeholders de uma string (Tratado contra 'undefined' - TS2322)
 */
function extractPlaceholders(text: string): string[] {
  const matches = [...text.matchAll(PLACEHOLDER_REGEX)];
  return matches
    .map((m) => m[1])
    .filter((m): m is string => Boolean(m))
    .sort();
}

/**
 * Percorre o dicionário recursivamente e coleta todas as strings
 */
function walkDictionary(
  obj: unknown,
  path: string[] = [],
  collector: Record<string, string> = {}
): Record<string, string> {
  if (typeof obj === "string") {
    collector[path.join(".")] = obj;
    return collector;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      walkDictionary(item, [...path, String(index)], collector);
    });
    return collector;
  }

  if (typeof obj === "object" && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      walkDictionary(value, [...path, key], collector);
    });
  }

  return collector;
}

/**
 * Compara placeholders entre dois idiomas
 */
function comparePlaceholders(
  base: Record<string, string>,
  target: Record<string, string>,
  baseLocaleName: string,
  targetLocaleName: string
): string[] {
  const errors: string[] = [];

  Object.entries(base).forEach(([key, baseValue]) => {
    const targetValue = target[key];

    if (!targetValue) return;

    const baseVars = extractPlaceholders(baseValue);
    const targetVars = extractPlaceholders(targetValue);

    if (baseVars.join(",") !== targetVars.join(",")) {
      errors.push(
        `[${targetLocaleName}] placeholder mismatch at "${key}" → ${baseLocaleName}: {${baseVars.join(
          ", "
        )}} vs ${targetLocaleName}: {${targetVars.join(", ")}}`
      );
    }
  });

  return errors;
}

describe("i18n placeholder validation", () => {
  const baseDict = dictionaries[baseLocale];
  if (!baseDict) {
    throw new Error(`Dicionário base "${baseLocale}" não encontrado.`);
  }

  const baseDictionary = walkDictionary(baseDict);

  Object.entries(dictionaries).forEach(([locale, dictionary]) => {
    if (locale === baseLocale) return;

    it(`${locale} placeholders must match ${baseLocale}`, () => {
      const targetDictionary = walkDictionary(dictionary);

      const errors = comparePlaceholders(
        baseDictionary,
        targetDictionary,
        baseLocale,
        locale
      );

      if (errors.length > 0) {
        console.error(`\n❌ Placeholder mismatch ${baseLocale} vs ${locale}\n`);
        errors.forEach((err) => console.error(err));
      }

      expect(errors).toHaveLength(0);
    });
  });
});
