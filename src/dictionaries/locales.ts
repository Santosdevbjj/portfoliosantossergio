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
 * ✔ Aceita pt-br, pt_BR, pt
 * ✔ Aceita en, es
 * ✔ Nunca retorna null
 * ✔ Sempre retorna SupportedLocale
 */
export function normalizeLocale(
  input?: string | null,
): SupportedLocale {
  if (!input) return DEFAULT_LOCALE;

  const raw = input.trim();

  // Substitui underscore por hífen
  const cleaned = raw.replace("_", "-");

  const lower = cleaned.toLowerCase();

  // ISO base
  if (lower === "pt") return "pt-BR";
  if (lower === "en") return "en-US";
  if (lower === "es") return "es-ES";

  // Formato xx-YY
  if (lower.length === 5 && lower.includes("-")) {
    const [lang, region] = lower.split("-");
    const formatted = `${lang}-${region.toUpperCase()}`;

    if (isValidLocale(formatted)) {
      return formatted;
    }
  }

  return DEFAULT_LOCALE;
}
