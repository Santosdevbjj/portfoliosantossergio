import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/types/dictionary";

/**
 * Server-only dictionary resolver
 * - Centraliza i18n para Server Components
 * - Utiliza a lógica do index.ts (fallback regional e global)
 * - Garante type safety através do tipo Locale
 */
export function getServerDictionary(locale: Locale) {
  return getDictionary(locale);
}
