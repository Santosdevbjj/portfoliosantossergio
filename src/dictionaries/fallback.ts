import pt from "./pt.json";
import en from "./en.json";
import es from "./es.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

const DICTIONARIES: Record<string, any> = {
  "pt-BR": pt,
  "en-US": en,
  "es-ES": es,
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

export function getDictionary(locale: string) {
  const chain = FALLBACK_CHAIN[locale] || ["pt-BR"];

  for (const lang of chain) {
    if (DICTIONARIES[lang]) {
      return DICTIONARIES[lang];
    }
  }

  return pt;
}
