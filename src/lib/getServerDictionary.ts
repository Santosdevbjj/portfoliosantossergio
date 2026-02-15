// src/lib/getServerDictionary.ts
import { cache } from "react";

import { getDictionary } from "@/dictionaries";
import type { Locale, Dictionary } from "@/types/dictionary";

/**
 * Carrega e cacheia o dicionário por locale.
 * ✔ Server-only
 * ✔ Compatível com Next.js 16
 * ✔ TS 6 friendly (tipagem explícita)
 */
export const getServerDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => {
    return getDictionary(locale);
  }
);
