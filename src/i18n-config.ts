// src/i18n-config.ts

/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS
 * Define a espinha dorsal do sistema multilíngue para Next.js 15.
 */
export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

/**
 * TIPO LOCALE
 * Extrai os valores 'pt' | 'en' | 'es' para uso em todo o projeto via TypeScript.
 */
export type Locale = (typeof i18n)['locales'][number];

/**
 * INTERFACE DE METADADOS
 * Atributos necessários para SEO, LanguageSwitcher e tags HTML.
 */
interface LocaleDetail {
  readonly name: string;   // Ex: English
  readonly region: string; // Ex: en-US (Crucial para hreflang no SEO)
  readonly flag: string;   // Emoji ou ícone da bandeira
  readonly label: string;  // Sigla curta (PT, EN, ES)
}

/**
 * DICIONÁRIO DE METADADOS DOS IDIOMAS
 * Centraliza as informações que alimentam os componentes de interface e o Middleware.
 */
export const localeMetadata: Record<Locale, LocaleDetail> = {
  pt: { 
    name: 'Português', 
    region: 'pt-BR', 
    flag: '🇧🇷',
    label: 'PT'
  },
  en: { 
    name: 'English', 
    region: 'en-US', 
    flag: '🇺🇸',
    label: 'EN'
  },
  es: { 
    name: 'Español', 
    region: 'es-ES', 
    flag: '🇪🇸',
    label: 'ES'
  },
};

/**
 * SEGURANÇA DE ROTA (Type Guard)
 * Valida se a string da URL é um idioma suportado pelo sistema.
 */
export function isValidLocale(locale: string | undefined | null): locale is Locale {
  if (!locale) return false;
  return (i18n.locales as readonly string[]).includes(locale);
}

/**
 * HELPER DE REGIONALIZAÇÃO
 * Retorna o código de região exato para a tag <html lang="...">.
 */
export function getRegion(locale: Locale): string {
  return localeMetadata[locale]?.region ?? localeMetadata[i18n.defaultLocale].region;
}

/**
 * HELPER DE FALLBACK
 * Garante que a aplicação nunca quebre se uma URL malformada for acessada.
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * HELPER PARA SEO (Alternates)
 * Utilizado para gerar as tags link rel="alternate" no sitemap.xml
 */
export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};
