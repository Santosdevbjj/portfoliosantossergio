// src/i18n-config.ts

/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS - NEXT.JS 15
 * Define a espinha dorsal do sistema multilingue.
 */
export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

/**
 * TIPO LOCALE
 * Extrai ('pt' | 'en' | 'es') para garantir que o TypeScript aponte erros
 * caso você tente usar um idioma não configurado.
 */
export type Locale = (typeof i18n)['locales'][number];

/**
 * METADADOS DE IDIOMA
 * Utilizado pelo LanguageSwitcher para renderizar bandeiras e labels.
 */
export interface LocaleDetail {
  readonly name: string;   
  readonly region: string; 
  readonly flag: string;   
  readonly label: string;
  readonly ariaLabel: string; // Para acessibilidade (Screen Readers)
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
 * Verifica se uma string de URL é um idioma suportado.
 */
export function isValidLocale(locale: string | undefined | null): locale is Locale {
  if (!locale) return false;
  return (i18n.locales as readonly string[]).includes(locale);
}

/**
 * GARANTE UM IDIOMA SEGURO (Fallback)
 * Se o usuário digitar /fr na URL, o sistema redireciona silenciosamente para /pt.
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * REGISTRO DE DICIONÁRIOS
 * Usa Dynamic Imports para não sobrecarregar o navegador com textos que não serão usados.
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * BUSCA O DICIONÁRIO TRADUZIDO
 * Função central usada nos Server Components (page.tsx) e Client Components.
 */
export const getDictionary = async (locale: Locale) => {
  try {
    const safeLocale = getSafeLocale(locale);
    return await dictionaries[safeLocale]();
  } catch (error) {
    console.error(`Erro ao carregar dicionário para: ${locale}`, error);
    // Fallback crítico: se o dicionário falhar, tenta carregar o padrão (PT)
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
