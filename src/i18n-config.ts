// src/i18n-config.ts

/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS - NEXT.JS 15
 * Define os idiomas suportados e o padrão do sistema.
 */
export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

/**
 * TIPO LOCALE
 * Cria um tipo dinâmico ('pt' | 'en' | 'es') para segurança total com TypeScript.
 */
export type Locale = (typeof i18n)['locales'][number];

/**
 * METADADOS DE IDIOMA
 * Informações para LanguageSwitcher e SEO.
 */
export interface LocaleDetail {
  readonly name: string;   
  readonly region: string; 
  readonly flag: string;   
  readonly label: string;  
}

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
 * VALIDADO DE LOCALE (Type Guard)
 */
export function isValidLocale(locale: string | undefined | null): locale is Locale {
  if (!locale) return false;
  return (i18n.locales as readonly string[]).includes(locale);
}

/**
 * GARANTE UM IDIOMA SEGURO (Fallback)
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * CARREGAMENTO DINÂMICO DE DICIONÁRIOS
 * Implementação otimizada para Server Components do Next.js 15.
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * BUSCA O DICIONÁRIO TRADUZIDO
 * Função assíncrona para ser usada em Server e Client Components.
 */
export const getDictionary = async (locale: Locale) => {
  const safeLocale = getSafeLocale(locale);
  return dictionaries[safeLocale]();
};

/**
 * HELPERS PARA SEO
 */
export const getRegion = (locale: Locale): string => localeMetadata[locale]?.region ?? 'pt-BR';

export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};
