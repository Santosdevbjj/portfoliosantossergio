// src/lib/getServerDictionary.ts

"use server";

import { cache } from "react";

import { getDictionary } from "@/dictionaries";
import {
  normalizeLocale,
  DEFAULT_LOCALE,
} from "@/dictionaries/locales";

import type {
  SupportedLocale,
} from "@/dictionaries/locales";
import type { Dictionary } from "@/types/dictionary";

/**
 * Carrega e cacheia o dicionário por locale.
 *
 * ✔ Server-only
 * ✔ Compatível com Next.js 16
 * ✔ Seguro contra runtime 500
 * ✔ Nunca retorna undefined
 */
export const getServerDictionary = cache(
  async (locale: string): Promise<Dictionary> => {
    const safeLocale: SupportedLocale =
      normalizeLocale(locale);

    try {
      return await getDictionary(safeLocale);
    } catch (error) {
      console.error(
        "[getServerDictionary] Failed for locale:",
        safeLocale,
        error,
      );

      // Fallback seguro para evitar erro 500
      if (safeLocale !== DEFAULT_LOCALE) {
        return await getDictionary(DEFAULT_LOCALE);
      }

      throw error;
    }
  },
);
