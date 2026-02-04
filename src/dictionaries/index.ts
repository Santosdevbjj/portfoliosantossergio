// src/dictionaries/index.ts

import type { Dictionary, Locale } from "@/types/dictionary";
import { validateDictionary } from "./validator";

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": ptBR as Dictionary,
  "en-US": enUS as Dictionary,
  "es-ES": esES as Dictionary,
  "es-AR": esAR as Dictionary,
  "es-MX": esMX as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  // 1. Tentativa de busca direta (ex: es-AR)
  let dictionary = dictionaries[locale];

  // 2. Lógica de Fallback Regional para a família "es"
  if (!dictionary && locale.startsWith("es")) {
    // Se pedir "es" ou "es-CL", tenta entregar o es-ES como base da família
    dictionary = dictionaries["es-ES"];
  }

  // 3. Fallback Global (Padrão do sistema)
  if (!dictionary) {
    dictionary = dictionaries["pt-BR"];
  }

  // Validação em tempo de desenvolvimento
  const { valid, errors } = validateDictionary(dictionary);

  if (!valid && process.env.NODE_ENV !== "production") {
    console.error(`[i18n] Invalid dictionary for locale ${locale}`, errors);
  }

  return dictionary;
}
