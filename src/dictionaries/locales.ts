// src/dictionaries/locales.ts

/**
 * Lista oficial de locales suportados.
 * Usado por:
 * - getDictionary
 * - generateStaticParams
 * - validação de rota
 */
export const SUPPORTED_LOCALES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

/**
 * Tipo derivado automaticamente da constante.
 * ✔ 100% seguro
 * ✔ Compatível com TS 6
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Locale padrão do sistema.
 */
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

/**
 * Verifica se um valor é um locale suportado.
 * Type guard seguro para TS 6.
 */
export function isValidLocale(
  locale?: string,
): locale is SupportedLocale {
  if (!locale) return false;
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Normaliza qualquer entrada (URL, cookie, header)
 * para um locale suportado.
 *
 * Exemplos:
 *  pt   -> pt-BR
 *  en   -> en-US
 *  es   -> es-ES
 *  null -> DEFAULT_LOCALE
 */
export function normalizeLocale(
  locale?: string,
): SupportedLocale {
  if (!locale) return DEFAULT_LOCALE;

  // Normalização curta (ISO base)
  if (locale === "pt") return "pt-BR";
  if (locale === "en") return "en-US";
  if (locale === "es") return "es-ES";

  // Se já for suportado
  if (isValidLocale(locale)) {
    return locale;
  }

  return DEFAULT_LOCALE;
}
