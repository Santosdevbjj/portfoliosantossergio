import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/types/dictionary";

export async function getServerDictionary(locale: Locale) {
  return await getDictionary(locale);
}
