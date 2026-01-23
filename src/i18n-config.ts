/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS - NEXT.JS 16 / 2026
 * Centraliza a lógica de internacionalização (i18n) para PT, EN e ES.
 */

export const i18n = {
  defaultLocale: 'pt' as const,
  locales: ['pt', 'en', 'es'] as const,
};

export type Locale = (typeof i18n)['locales'][number];

/**
 * METADADOS DE IDIOMA
 * Utilizado por LanguageSwitcher, Metadados de SEO e Acessibilidade.
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
    ariaLabel: 'Alterar idioma para Português (Brasil)'
  },
  en: { 
    name: 'English', 
    region: 'en-US', 
    flag: '🇺🇸',
    label: 'EN',
    ariaLabel: 'Change language to English (US)'
  },
  es: { 
    name: 'Español', 
    region: 'es-ES', 
    flag: '🇪🇸',
    label: 'ES',
    ariaLabel: 'Cambiar idioma a Español (España)'
  },
};

/**
 * VALIDADORES E HELPERS DE SEGURANÇA
 */
export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && (i18n.locales as readonly string[]).includes(locale);
}

export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * CARREGAMENTO DINÂMICO DOS DICIONÁRIOS
 * Otimizado para Server Components com Code Splitting.
 */
const dictionaries: Record<Locale, () => Promise<Record<string, any>>> = {
  pt: () => import('./dictionaries/pt.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  es: () => import('./dictionaries/es.json').then((m) => m.default),
};



/**
 * OBTÉM O DICIONÁRIO (SERVER-SIDE)
 * Função central para recuperar os textos traduzidos.
 */
export const getDictionary = async (locale: Locale) => {
  const targetLocale = getSafeLocale(locale);
  
  try {
    const loadFn = dictionaries[targetLocale];
    if (!loadFn) throw new Error(`Dicionário ausente: ${targetLocale}`);
    
    return await loadFn();
  } catch (error) {
    console.error(`[i18n-critical] Erro ao carregar: ${targetLocale}. Tentando fallback.`, error);
    
    // Tenta carregar o idioma padrão (PT) caso o outro falhe
    if (targetLocale !== i18n.defaultLocale) {
      try {
        return await dictionaries[i18n.defaultLocale]();
      } catch (fatal) {
        console.error(`[i18n-panic] Sistema de tradução offline.`, fatal);
      }
    }
    
    // Fallback de segurança para evitar erro de runtime no componente
    return {};
  }
};

/**
 * AUXILIARES DE SEO E ROTEAMENTO
 */
export const getRegion = (locale: Locale): string => {
  return localeMetadata[locale]?.region || 'pt-BR';
};

export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};
