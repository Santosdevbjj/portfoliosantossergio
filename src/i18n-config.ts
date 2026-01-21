/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS - NEXT.JS 15
 * Centraliza a lógica de internacionalização (i18n) para PT, EN e ES.
 */

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

/**
 * METADADOS DE IDIOMA
 * Utilizado pelo LanguageSwitcher e tags de SEO (hreflang).
 */
export interface LocaleDetail {
  readonly name: string;   
  readonly region: string; 
  readonly flag: string;   
  readonly label: string;
  readonly ariaLabel: string;
}

export const localeMetadata: Record<Locale, LocaleDetail> = {
  pt: { 
    name: 'Português', 
    region: 'pt-BR', 
    flag: '🇧🇷',
    label: 'PT',
    ariaLabel: 'Alterar idioma para Português'
  },
  en: { 
    name: 'English', 
    region: 'en-US', 
    flag: '🇺🇸',
    label: 'EN',
    ariaLabel: 'Change language to English'
  },
  es: { 
    name: 'Español', 
    region: 'es-ES', 
    flag: '🇪🇸',
    label: 'ES',
    ariaLabel: 'Cambiar idioma a Español'
  },
};

/**
 * VALIDADO DE LOCALE (Type Guard)
 * Garante segurança em tempo de execução contra URLs inválidas.
 */
export function isValidLocale(locale: string | undefined | null): locale is Locale {
  return !!locale && (i18n.locales as readonly string[]).includes(locale);
}

/**
 * ESTRATÉGIA DE FALLBACK
 * Retorna o idioma padrão se a entrada for inválida.
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * CARREGAMENTO DINÂMICO DE DICIONÁRIOS (Lazy Loading)
 * Implementa o carregamento sob demanda para reduzir o bundle inicial.
 */
const dictionaries = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * OBTÉM O DICIONÁRIO
 * Função otimizada para Server Components.
 */
export const getDictionary = async (locale: Locale) => {
  const safeLocale = getSafeLocale(locale);
  
  try {
    return await dictionaries[safeLocale]();
  } catch (error) {
    console.error(`[i18n] Erro ao carregar dicionário (${safeLocale}):`, error);
    // Fallback definitivo: sempre retorna o português se houver falha no arquivo
    return dictionaries[i18n.defaultLocale]();
  }
};

/**
 * HELPERS PARA SEO E ACESSIBILIDADE
 */
export const getRegion = (locale: Locale): string => localeMetadata[locale]?.region ?? 'pt-BR';

export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};
