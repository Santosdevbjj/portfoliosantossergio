// src/dictionaries/locales.ts

export const SUPPORTED_LOCALES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Locale padrão do sistema
 */
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

/**
 * Normaliza qualquer entrada (URL, cookie, header)
 * para um locale suportado.
 */
export const normalizeLocale = (
  locale?: string,
): SupportedLocale => {
  if (!locale) return DEFAULT_LOCALE;

  export const isValidLocale = (locale?: string): locale is SupportedLocale => {
  if (!locale) return false;
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
};

  // pt -> pt-BR
  if (locale === "pt") return "pt-BR";
  if (locale === "en") return "en-US";
  if (locale === "es") return "es-ES";

  if (SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    return locale as SupportedLocale;
  }

  return DEFAULT_LOCALE;
};
