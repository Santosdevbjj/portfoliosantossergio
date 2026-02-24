// src/dictionaries/locales.ts

/**
 * Lista oficial de locales suportados.
 */
export const SUPPORTED_LOCALES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

export const locales = SUPPORTED_LOCALES;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

/**
 * Verifica se a string é um locale suportado.
 */
export function isValidLocale(
  locale: string,
): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(
    locale as SupportedLocale,
  );
}

/**
 * Normaliza qualquer entrada para um locale suportado.
 *
 * ✔ Case insensitive
 * ✔ Aceita pt-br, pt_BR
 * ✔ Aceita pt, en, es
 * ✔ Nunca retorna null
 * ✔ Sempre retorna SupportedLocale
 */
export function normalizeLocale(
  input?: string | null,
): SupportedLocale {
  if (!input) return DEFAULT_LOCALE;

  const cleaned = input.trim().replace(/_/g, "-").toLowerCase();

  // ISO base
  if (cleaned === "pt") return "pt-BR";
  if (cleaned === "en") return "en-US";
  if (cleaned === "es") return "es-ES";

  // Formato xx-YY
  const dashIndex = cleaned.indexOf("-");

  if (dashIndex > 0) {
    const lang = cleaned.slice(0, dashIndex);
    const region = cleaned.slice(dashIndex + 1);

    if (lang.length === 2 && region.length === 2) {
      const formatted = `${lang}-${region.toUpperCase()}`;

      if (isValidLocale(formatted)) {
        return formatted;
      }
    }
  }

  return DEFAULT_LOCALE;
}
