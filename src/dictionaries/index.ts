// src/dictionaries/index.ts

import "server-only";
// import { cache } from "react";
import type { Dictionary } from "@/types/dictionary";
import {
  DEFAULT_LOCALE,
  normalizeLocale,
  type SupportedLocale,
} from "./locales";

/**
 * Loader tipado explicitamente.
 * ✔ Compatível com TS 6 strict
 * ✔ Compatível com Next.js 16 (App Router)
 * ✔ Evita erro de union literal em JSON
 */
type DictionaryLoader = () => Promise<Dictionary>;

const loaders: Record<SupportedLocale, DictionaryLoader> = {
  "pt-BR": async () =>
    (await import("./pt-BR.json")).default as Dictionary,

  "en-US": async () =>
    (await import("./en-US.json")).default as Dictionary,

  "es-ES": async () =>
    (await import("./es-ES.json")).default as Dictionary,

  "es-AR": async () =>
    (await import("./es-AR.json")).default as Dictionary,

  "es-MX": async () =>
    (await import("./es-MX.json")).default as Dictionary,
};

/**
 * Retorna sempre um Dictionary válido.
 *
 * ✔ Nunca retorna null
 * ✔ Sempre resolve para SupportedLocale
 * ✔ Seguro para uso em Server Components
 */

export async function getDictionary(
  locale?: string | null,
): Promise<Dictionary> {
  const normalized = normalizeLocale(locale);

  const loader =
    loaders[normalized] ?? loaders[DEFAULT_LOCALE];

  return loader();
}
