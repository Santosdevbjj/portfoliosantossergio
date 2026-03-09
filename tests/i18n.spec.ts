import type { Dictionary } from "../src/types/dictionary";

import { validateDictionary } from "../src/dictionaries/validator";
import { validateCrossLocale } from "../src/dictionaries/validateCrossLocale";

// Imports dos dicionários
import ptBR from "../src/dictionaries/pt-BR.json";
import enUS from "../src/dictionaries/en-US.json";
import esES from "../src/dictionaries/es-ES.json";
import esAR from "../src/dictionaries/es-AR.json";
import esMX from "../src/dictionaries/es-MX.json";

/**
 * Base locale
 * Usado como referência estrutural
 */
const baseLocale = "pt-BR";

const dictionaries: Record<string, Dictionary> = {
  "pt-BR": ptBR as Dictionary,
  "en-US": enUS as Dictionary,
  "es-ES": esES as Dictionary,
  "es-AR": esAR as Dictionary,
  "es-MX": esMX as Dictionary,
};

describe("i18n dictionaries validation", () => {
  /**
   * --------------------------------------------------------
   * 1. Validação estrutural individual
   * --------------------------------------------------------
   * Garante que cada dicionário possui as seções obrigatórias
   */
  describe("individual dictionary validation", () => {
    Object.entries(dictionaries).forEach(([locale, dictionary]) => {
      it(`${locale} should pass schema validation`, () => {
        const result = validateDictionary(dictionary);

        if (!result.valid) {
          console.error(`\n❌ Errors in ${locale} dictionary:\n`);
          result.errors.forEach((err) => console.error(err));
        }

        expect(result.errors).toHaveLength(0);
      });
    });
  });

  /**
   * --------------------------------------------------------
   * 2. Validação cross-locale
   * --------------------------------------------------------
   * Garante que todos os idiomas possuem a mesma estrutura
   */
  describe("cross-locale structure consistency", () => {
    const base = dictionaries[baseLocale];

    Object.entries(dictionaries).forEach(([locale, dictionary]) => {
      if (locale === baseLocale) return;

      it(`${baseLocale} ↔ ${locale} should have identical structure`, () => {
        const errors = validateCrossLocale(
          base,
          dictionary,
          baseLocale,
          locale
        );

        if (errors.length > 0) {
          console.error(`\n❌ Structure mismatch ${baseLocale} vs ${locale}\n`);
          errors.forEach((err) => console.error(err));
        }

        expect(errors).toHaveLength(0);
      });
    });
  });
});
