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
 * Para LanguageSwitcher, SEO e acessibilidade.
 */
export interface LocaleDetail {
  readonly name: string;       // Nome do idioma
  readonly region: string;     // Código de região (ex: pt-BR)
  readonly flag: string;       // Emoji ou ícone
  readonly label: string;      // Sigla para UI (PT, EN, ES)
  readonly ariaLabel: string;  // Acessibilidade
}

export const localeMetadata: Readonly<Record<Locale, LocaleDetail>> = {
  pt: {
    name: 'Português',
    region: 'pt-BR',
    flag: '🇧🇷',
    label: 'PT',
    ariaLabel: 'Alterar idioma para Português (Brasil)',
  },
  en: {
    name: 'English',
    region: 'en-US',
    flag: '🇺🇸',
    label: 'EN',
    ariaLabel: 'Change language to English (US)',
  },
  es: {
    name: 'Español',
    region: 'es-ES',
    flag: '🇪🇸',
    label: 'ES',
    ariaLabel: 'Cambiar idioma a Español (España)',
  },
};

/**
 * VALIDAÇÃO DE LOCALE
 */
export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && (i18n.locales as readonly string[]).includes(locale);
}

export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? (locale as Locale) : i18n.defaultLocale;
}

/**
 * TIPAGEM DO DICIONÁRIO
 * Compatível com Navbar, PageWrapper e outros componentes
 */
export interface Dictionary {
  nav?: {
    about?: string;
    experience?: string;
    articles?: string;
    projects?: string;
    contact?: string;
  };
  common?: {
    navigation?: string;
    openMenu?: string;
    closeMenu?: string;
    role?: string;
    footer?: string;
  };
  [key: string]: any; // Permite outras traduções genéricas
}

/**
 * DICIONÁRIOS DINÂMICOS
 * Carregamento otimizado para Server Components com Code Splitting.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: async () => (await import('./dictionaries/pt.json')).default as Dictionary,
  en: async () => (await import('./dictionaries/en.json')).default as Dictionary,
  es: async () => (await import('./dictionaries/es.json')).default as Dictionary,
};

/**
 * OBTÉM DICIONÁRIO
 * Função principal para carregar traduções
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const targetLocale = getSafeLocale(locale);

  try {
    const loadFn = dictionaries[targetLocale];
    if (!loadFn) throw new Error(`Dicionário ausente para locale: ${targetLocale}`);
    return await loadFn();
  } catch (error) {
    console.error(`[i18n-critical] Falha ao carregar: ${targetLocale}`, error);

    // Fallback para idioma padrão
    if (targetLocale !== i18n.defaultLocale) {
      try {
        return await dictionaries[i18n.defaultLocale]();
      } catch (fatal) {
        console.error('[i18n-panic] Dicionário padrão indisponível', fatal);
      }
    }

    // Retorna objeto vazio para evitar crash
    return {};
  }
};

/**
 * AUXILIARES DE SEO E ROTEAMENTO
 */
export const getRegion = (locale: Locale): string => {
  return localeMetadata[locale]?.region ?? i18n.defaultLocale;
};

export const getAlternateLocales = (currentLocale: Locale): Locale[] => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};

/**
 * FLAG DE RESPONSIVIDADE
 * O próprio i18n-config não controla layout, mas pode ser usado para adaptar conteúdo.
 * - Responsividade depende de CSS/Tailwind (ver componentes)
 */
export const isResponsive = true;
