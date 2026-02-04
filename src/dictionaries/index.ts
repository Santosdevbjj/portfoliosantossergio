// src/dictionaries/index.ts

import type { Dictionary, Locale } from "@/types/dictionary";
import { validateDictionary } from "./validator";

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";

const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": ptBR as Dictionary,
  "en-US": enUS as Dictionary,
  "es-ES": esES as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  const dictionary = dictionaries[locale] ?? dictionaries["pt-BR"];

  const { valid, errors } = validateDictionary(dictionary);

  if (!valid) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `[i18n] Invalid dictionary for locale ${locale}`,
        errors
      );
    }
  }

  return dictionary;
}
