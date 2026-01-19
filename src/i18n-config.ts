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
 * Informações cruciais para o LanguageSwitcher (Interface) e SEO (Metadados).
 */
interface LocaleDetail {
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
 * Garante que a aplicação não quebre se alguém digitar algo como /fr na URL.
 */
export function isValidLocale(locale: string | undefined | null): locale is Locale {
  if (!locale) return false;
  return (i18n.locales as readonly string[]).includes(locale);
}

/**
 * RETORNA A REGIÃO (SEO)
 */
export function getRegion(locale: Locale): string {
  return localeMetadata[locale]?.region ?? 'pt-BR';
}

/**
 * GARANTE UM IDIOMA SEGURO
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * BUSCA IDIOMAS ALTERNATIVOS (SEO Hreflang)
 */
export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};

/**
 * CARREGAMENTO DINÂMICO DE DICIONÁRIOS
 * Importante: O caminho '@/' aponta para a pasta 'src' configurada no seu tsconfig.json.
 */
export const dictionaries = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * HELPER PARA ACESSAR OS TEXTOS TRADUZIDOS
 */
export const getDictionary = async (locale: Locale) => {
  const safeLocale = getSafeLocale(locale);
  return dictionaries[safeLocale]();
};
