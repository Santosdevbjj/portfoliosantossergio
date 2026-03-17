/**
 * i18n Locales Configuration - Versão 2026
 * -----------------------------------------------------------------------------
 * ✔ Suporte: Next.js 16.1.7, React 19, TS 6.0, Node 24
 * ✔ Correção de Build: Tipagem estrita para o split de locale
 */

/**
 * Lista oficial de locales suportados no sistema.
 */
export const SUPPORTED_LOCALES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

export const locales = SUPPORTED_LOCALES;

/**
 * Tipagens baseadas na lista imutável acima.
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type Locale = SupportedLocale;

/**
 * Idioma padrão.
 */
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

/**
 * Type Guard para validação de locale.
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

/**
 * Normaliza qualquer entrada para um locale suportado.
 */
export function normalizeLocale(input?: string | null): SupportedLocale {
  if (!input) return DEFAULT_LOCALE;

  const cleaned = input.trim().replace(/_/g, "-");
  
  const exactMatch = SUPPORTED_LOCALES.find(
    (l) => l.toLowerCase() === cleaned.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  const base = cleaned.toLowerCase().split("-")[0] || "";
  
  switch (base) {
    case "pt": return "pt-BR";
    case "en": return "en-US";
    case "es": return "es-ES";
    default: return DEFAULT_LOCALE;
  }
}

/**
 * Helper para metadados SEO e acessibilidade (HTML lang attribute).
 * Retorna apenas a parte da língua (ex: "pt", "en", "es").
 * * FIX: Adicionado fallback e verificação para satisfazer o TS 6.0 Strict Mode.
 */
export function getLanguageCode(locale: SupportedLocale): string {
  // Garantimos que se o split falhar por algum motivo bizarro, 
  // ele retorna o primeiro segmento ou a string inteira.
  const code = locale.split("-")[0];
  return code ?? locale;
}
