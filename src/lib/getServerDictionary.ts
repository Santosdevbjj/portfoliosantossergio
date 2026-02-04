import { getDictionary } from "@/dictionaries/fallback";
import type { Locale } from "@/types/dictionary";

export function getServerDictionary(locale: Locale) {
  return getDictionary(locale);
}
