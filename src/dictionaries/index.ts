// src/dictionaries/index.ts
import "server-only";

import type { Dictionary } from "@/types/dictionary";
import type { CommonDictionary } from "@/types/dictionary";

import {
  DEFAULT_LOCALE,
  normalizeLocale,
  type SupportedLocale,
} from "./locales";

/**
 * Default fallback para campos que
 * ainda não existem nos JSONs.
 *
 * Isso resolve incompatibilidades
 * com TypeScript strict no Next.js 16.
 */
function normalizeCommon(common: any): CommonDictionary {
  return {
    ...common,

    errorBoundary: common?.errorBoundary ?? {
      title: "Error",
      description: "Unexpected error",
      actions: {
        retry: "Retry",
        home: "Home",
      },
    },

    notFound: common?.notFound ?? {
      title: "Page not found",
      description: "The requested page does not exist.",
      button: "Back",
    },

    menu: common?.menu ?? {
      open: "Open menu",
      close: "Close menu",
      aria: {
        open: "Open navigation menu",
        close: "Close navigation menu",
      },
    },
  };
}

/**
 * Normaliza o dicionário carregado
 * garantindo compatibilidade com os types.
 */
function normalizeDictionary(raw: any): Dictionary {
  return {
    ...raw,
    common: normalizeCommon(raw.common),
  } as Dictionary;
}

/**
 * Loader tipado explicitamente.
 * ✔ Compatível com TS strict
 * ✔ Compatível com Next.js 16
 * ✔ Evita erro de union literal em JSON
 */
type DictionaryLoader = () => Promise<Dictionary>;

const loaders: Record<SupportedLocale, DictionaryLoader> = {
  "pt-BR": async () =>
    normalizeDictionary((await import("./pt-BR.json")).default),

  "en-US": async () =>
    normalizeDictionary((await import("./en-US.json")).default),

  "es-ES": async () =>
    normalizeDictionary((await import("./es-ES.json")).default),

  "es-AR": async () =>
    normalizeDictionary((await import("./es-AR.json")).default),

  "es-MX": async () =>
    normalizeDictionary((await import("./es-MX.json")).default),
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
