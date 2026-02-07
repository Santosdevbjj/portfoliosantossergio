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

  // 2. Lógica de Fallback Regional para a família "es" (Espanhol)
  // Se pedir um dialeto que não temos (ex: es-CL), entrega o es-ES
  if (!dictionary && locale.startsWith("es")) {
    dictionary = dictionaries["es-ES"];
  }

  // 3. Fallback Global (Padrão do sistema se tudo falhar)
  if (!dictionary) {
    dictionary = dictionaries["pt-BR"];
  }

  // Validação em tempo de desenvolvimento para evitar campos vazios na UI
  const { valid, errors } = validateDictionary(dictionary);

  if (!valid && process.env.NODE_ENV !== "production") {
    console.error(`[i18n] Invalid dictionary for locale: ${locale}`, errors);
  }

  return dictionary;
}
