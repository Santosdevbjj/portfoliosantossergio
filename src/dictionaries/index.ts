// src/dictionaries/index.ts

import type { Dictionary, Locale } from "@/types/dictionary";
import { validateDictionary } from "./validator";

// Imports de todos os arquivos físicos
import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json"; // Novo
import esMX from "./es-MX.json"; // Novo

// Mapeamento completo para o TypeScript
const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": ptBR as Dictionary,
  "en-US": enUS as Dictionary,
  "es-ES": esES as Dictionary,
  "es-AR": esAR as Dictionary, // Adicionado
  "es-MX": esMX as Dictionary, // Adicionado
};

export function getDictionary(locale: Locale): Dictionary {
  // Busca o dicionário ou retorna o padrão (pt-BR)
  const dictionary = dictionaries[locale] ?? dictionaries["pt-BR"];

  // Validação em tempo de desenvolvimento
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
