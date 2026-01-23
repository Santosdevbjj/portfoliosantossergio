/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS - NEXT.JS 16 / 2026
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
 * Design focado em acessibilidade e suporte multilingue completo.
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
 * Segurança em tempo de execução para rotas, middleware e componentes.
 */
export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && (i18n.locales as readonly string[]).includes(locale);
}

/**
 * ESTRATÉGIA DE FALLBACK
 * Garante que o sistema sempre retorne um idioma válido.
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * CARREGAMENTO DINÂMICO DE DICIONÁRIOS (Lazy Loading / Code Splitting)
 * AJUSTE: Usando caminhos relativos para compatibilidade com o Runtime da Vercel.
 * Isso resolve o erro "Cannot find module" identificado nos logs de execução.
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

/**
 * OBTÉM O DICIONÁRIO
 * Função assíncrona para Server e Client Components com tratamento de erro robusto.
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
    console.error(`[i18n-error] Falha ao carregar idioma (${safeLocale}):`, error);
    
    // Fallback de última instância para o idioma padrão (PT)
    if (safeLocale !== i18n.defaultLocale) {
      try {
        const fallback = dictionaries[i18n.defaultLocale];
        return await fallback();
      } catch (fallbackError) {
        console.error(`[i18n-critical] Falha total no fallback:`, fallbackError);
      }
    }
    
    // Retorna objeto vazio para evitar o "Erro de Execução" na tela do usuário
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
