// src/dictionaries/fallback.ts

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json"; 
import esMX from "./es-MX.json";

import type { Dictionary, Locale } from "@/types/dictionary";

// Usando o tipo Locale para garantir que as chaves principais estejam corretas
const DICTIONARIES: Record<string, any> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "es-AR": esAR,
  "es-MX": esMX
};

const FALLBACK_CHAIN: Record<string, string[]> = {
  "es-AR": ["es-AR", "es-ES", "pt-BR"],
  "es-MX": ["es-MX", "es-ES", "pt-BR"],
  "es-ES": ["es-ES", "pt-BR"],
  "en-US": ["en-US", "pt-BR"],
  "pt-BR": ["pt-BR"]
};

export function getDictionary(locale: string): Dictionary {
  const chain = FALLBACK_CHAIN[locale] || ["pt-BR"];

  for (const lang of chain) {
    if (DICTIONARIES[lang]) {
      return DICTIONARIES[lang] as Dictionary;
    }
  }

  // Fallback definitivo caso nada na corrente seja encontrado
  return ptBR as Dictionary;
}
