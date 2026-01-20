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
 * Define estritamente os idiomas aceitos pelo TypeScript.
 */
export type Locale = (typeof i18n)['locales'][number];

/**
 * METADADOS DE IDIOMA
 * Estrutura para SEO, LanguageSwitcher e Acessibilidade (Screen Readers).
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
 * Segurança: impede que strings arbitrárias quebrem o carregamento de dados.
 */
export function isValidLocale(locale: string | undefined | null): locale is Locale {
  if (!locale) return false;
  return (i18n.locales as readonly string[]).includes(locale);
}

/**
 * GARANTE UM IDIOMA SEGURO (Fallback Strategy)
 * Se o parâmetro for inválido, retorna o idioma padrão.
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * REGISTRO DE DICIONÁRIOS (Lazy Loading)
 * Os arquivos JSON só são baixados quando o usuário acessa o idioma correspondente.
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * BUSCA O DICIONÁRIO TRADUZIDO
 * Função central para Server e Client Components injetarem textos dinâmicos.
 */
export const getDictionary = async (locale: Locale) => {
  try {
    const safeLocale = getSafeLocale(locale);
    const dictionaryLoader = dictionaries[safeLocale];
    
    if (!dictionaryLoader) {
      throw new Error(`Dicionário não encontrado para: ${safeLocale}`);
    }

    return await dictionaryLoader();
  } catch (error) {
    console.error(`[i18n] Falha crítica ao carregar dicionário para: ${locale}`, error);
    // Fallback de segurança nível 2: tenta carregar o PT para o site não ficar em branco
    return dictionaries[i18n.defaultLocale]();
  }
};

/**
 * HELPERS PARA SEO
 */
export const getRegion = (locale: Locale): string => localeMetadata[locale]?.region ?? 'pt-BR';

/**
 * Retorna os idiomas que NÃO são o atual (útil para links hreflang)
 */
export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};
