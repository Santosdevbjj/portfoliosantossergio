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
 * Alias semântico opcional (evita erro de import errado)
 * Compatível com generateStaticParams
 */
export const locales = SUPPORTED_LOCALES;

/**
 * Tipo derivado automaticamente da constante.
 * ✔ 100% seguro
 * ✔ Compatível com TS 6 strict
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Locale padrão do sistema.
 */
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

/**
 * Type guard seguro.
 * Sem cast.
 * 100% compatível com TS 6 strict.
 */
export function isValidLocale(
  locale: string,
): locale is SupportedLocale {
  return SUPPORTED_LOCALES.some(
    (supported) => supported === locale,
  );
}

/**
 * Normaliza qualquer entrada (URL, cookie, header)
 * para um locale suportado.
 *
 * ✔ Case insensitive
 * ✔ Trata ISO base (pt, en, es)
 * ✔ Trata formato pt-br
 * ✔ Nunca retorna null
 * ✔ Sempre retorna SupportedLocale
 */
export function normalizeLocale(
  input?: string | null,
): SupportedLocale {
  if (!input) return DEFAULT_LOCALE;

  const value = input.trim();

  // Normalização case-insensitive
  const formatted =
    value.length === 5
      ? `${value.slice(0, 2).toLowerCase()}-${value
          .slice(3)
          .toUpperCase()}`
      : value.toLowerCase();

  // ISO base
  if (formatted === "pt") return "pt-BR";
  if (formatted === "en") return "en-US";
  if (formatted === "es") return "es-ES";

  // Se já for válido
  if (isValidLocale(formatted)) {
    return formatted;
  }

  return DEFAULT_LOCALE;
}
