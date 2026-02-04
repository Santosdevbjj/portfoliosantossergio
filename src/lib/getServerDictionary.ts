import { getDictionary } from "@/dictionaries/fallback";
import type { Locale } from "@/types/dictionary";

/**
 * Server-only dictionary resolver
 * - Centraliza i18n
 * - Aplica fallback regional (ex: es-AR → es)
 * - Garante type safety
 */
export function getServerDictionary(locale: Locale) {
  return getDictionary(locale);
}
