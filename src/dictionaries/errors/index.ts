import type { ErrorDictionary } from "@/types/error-dictionary";
import type { SupportedLocale } from "@/lib/i18n/locale";

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

export const errorDictionaries = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "es-AR": esAR,
  "es-MX": esMX,
} as const satisfies Record<
  SupportedLocale,
  ErrorDictionary
>;

export function getErrorDictionary(
  locale: SupportedLocale
): ErrorDictionary {
  return errorDictionaries[locale];
}
