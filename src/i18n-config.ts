/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS - NEXT.JS 15.5.9 / 2026
 * Centraliza a lógica de internacionalização (i18n) para PT, EN e ES.
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
 * VALIDADO DE LOCALE (Type Guard)
 * Segurança em tempo de execução para rotas e middleware.
 */
export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && (i18n.locales as readonly string[]).includes(locale);
}

/**
 * ESTRATÉGIA DE FALLBACK
 * Garante que o usuário nunca caia em uma página quebrada.
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * CARREGAMENTO DINÂMICO DE DICIONÁRIOS (Lazy Loading)
 * Reduz o bundle size inicial carregando apenas o idioma necessário.
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * OBTÉM O DICIONÁRIO
 * Função otimizada para Server Components com tratamento de erro resiliente.
 */
export const getDictionary = async (locale: Locale) => {
  const safeLocale = getSafeLocale(locale);
  
  try {
    const loadDictionary = dictionaries[safeLocale];
    return await loadDictionary();
  } catch (error) {
    console.error(`[i18n] Falha crítica ao carregar dicionário (${safeLocale}):`, error);
    // Fallback de segurança para o idioma padrão
    const fallbackLoad = dictionaries[i18n.defaultLocale];
    return await fallbackLoad();
  }
};

/**
 * HELPERS PARA SEO E ACESSIBILIDADE
 */
export const getRegion = (locale: Locale): string => localeMetadata[locale].region;

export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};
