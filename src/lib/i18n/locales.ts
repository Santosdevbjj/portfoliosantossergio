/**
 * i18n Locales Configuration - Versão 2026
 * -----------------------------------------------------------------------------
 * ✔ Suporte: Next.js 16, React 19, TS 6.0, Node 24
 * ✔ Este arquivo é a única "Fonte da Verdade" para idiomas no sistema.
 */

/**
 * Lista oficial de locales suportados no sistema.
 * Baseado nos seus dicionários e arquivos PDF existentes.
 */
export const SUPPORTED_LOCALES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

/**
 * Alias para exportação simplificada, mantendo compatibilidade 
 * com os tipos de dicionário.
 */
export const locales = SUPPORTED_LOCALES;

/**
 * Tipo derivado da lista de locales. 
 * Garante que o TypeScript aponte erro se tentarmos usar um idioma não mapeado.
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Atalho de tipo para uso em rotas e parâmetros.
 */
export type Locale = SupportedLocale;

/**
 * Idioma padrão utilizado em caso de falha de detecção ou rota raiz.
 */
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

/**
 * Verifica se uma string qualquer é um locale válido dentro do sistema.
 * Utiliza o Type Guard 'locale is SupportedLocale' para segurança de tipo no TS 6.0.
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

/**
 * Normaliza qualquer entrada (URL, Header, State) para um locale suportado.
 * * ✔ Case insensitive (PT-BR -> pt-BR)
 * ✔ Corrige separadores (en_US -> en-US)
 * ✔ Fallback inteligente para a base da língua (es -> es-ES)
 * ✔ Garante retorno de um SupportedLocale válido
 */
export function normalizeLocale(input?: string | null): SupportedLocale {
  if (!input) return DEFAULT_LOCALE;

  // Limpa espaços, troca underscores e normaliza para o formato xx-yy
  const cleaned = input.trim().replace(/_/g, "-");
  
  // Busca exata (Case Insensitive)
  const exactMatch = SUPPORTED_LOCALES.find(
    (l) => l.toLowerCase() === cleaned.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Normalização de abreviações comuns
  const base = cleaned.toLowerCase().split("-")[0];
  switch (base) {
    case "pt": return "pt-BR";
    case "en": return "en-US";
    case "es": return "es-ES"; // Padrão Espanha para entrada genérica 'es'
    default: return DEFAULT_LOCALE;
  }
}

/**
 * Helper para metadados SEO e acessibilidade (HTML lang attribute).
 * Retorna apenas a parte da língua (ex: "pt", "en", "es").
 */
export function getLanguageCode(locale: SupportedLocale): string {
  return locale.split("-")[0];
}
