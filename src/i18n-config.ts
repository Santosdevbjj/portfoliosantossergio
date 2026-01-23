/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS - NEXT.JS 16 / 2026
 * Centraliza a lógica de internacionalização (i18n) para PT, EN e ES.
 * Este arquivo alimenta o Proxy, o SEO e os Dicionários.
 */

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

/**
 * METADADOS DE IDIOMA
 * Estrutura imutável para LanguageSwitcher e tags de SEO (hreflang).
 */
export interface LocaleDetail {
  readonly name: string;   
  readonly region: string; 
  readonly flag: string;   
  readonly label: string;
  readonly ariaLabel: string;
}

export const localeMetadata: Readonly<Record<Locale, LocaleDetail>> = {
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
 * VALIDADOR DE LOCALE (Type Guard)
 */
export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && (i18n.locales as readonly string[]).includes(locale);
}

/**
 * ESTRATÉGIA DE FALLBACK
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * CARREGAMENTO DINÂMICO (Code Splitting)
 * Gerencia o carregamento sob demanda dos arquivos JSON.
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};



/**
 * OBTÉM O DICIONÁRIO
 * Centralizado aqui para uso em Server Components.
 */
export const getDictionary = async (locale: Locale) => {
  const safeLocale = getSafeLocale(locale);
  
  try {
    const loadDictionary = dictionaries[safeLocale];
    
    if (!loadDictionary) {
      throw new Error(`Dicionário não encontrado para: ${safeLocale}`);
    }
    
    return await loadDictionary();
  } catch (error) {
    console.error(`[i18n-critical] Falha ao carregar idioma (${safeLocale}):`, error);
    
    // Fallback para o idioma padrão se o solicitado falhar
    if (safeLocale !== i18n.defaultLocale) {
      try {
        return await dictionaries[i18n.defaultLocale]();
      } catch (fallbackError) {
        console.error(`[i18n-panic] Falha total no sistema de idiomas.`, fallbackError);
      }
    }
    
    // Retorna objeto vazio para manter a aplicação estável
    return {};
  }
};

/**
 * HELPERS PARA SEO E ACESSIBILIDADE
 */
export const getRegion = (locale: Locale): string => {
  return localeMetadata[locale]?.region || 'pt-BR';
};

export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};
