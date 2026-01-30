/**
 * I18N CONFIG — ESTRUTURA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * Fonte única de verdade para internacionalização (Locales e Metadata).
 * Alinhado com Next.js 16 e os dicionários PT, EN, ES.
 */

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n.locales)[number];

/**
 * Metadados dos Locales:
 * Utilizados pelo componente LanguageSwitcher e para SEO (hreflang).
 */
export const localeMetadata = {
  pt: { 
    name: 'Português', 
    region: 'pt-BR', 
    flag: '🇧🇷', 
    label: 'PT',
    hrefLang: 'pt-BR' 
  },
  en: { 
    name: 'English', 
    region: 'en-US', 
    flag: '🇺🇸', 
    label: 'EN',
    hrefLang: 'en-US' 
  },
  es: { 
    name: 'Español', 
    region: 'es-ES', 
    flag: '🇪🇸', 
    label: 'ES',
    hrefLang: 'es-ES' 
  },
} as const;

/**
 * Carregamento Dinâmico de Dicionários (Server-Side).
 * Otimizado para o App Router do Next.js.
 */
export async function getDictionary(locale: Locale) {
  const dictionaries = {
    pt: () => import('./dictionaries/pt.json').then((module) => module.default),
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    es: () => import('./dictionaries/es.json').then((module) => module.default),
  };

  // Garante que, se o locale for inválido, o sistema não quebre (fallback para PT)
  const isValidLocale = i18n.locales.includes(locale);
  const loader = dictionaries[isValidLocale ? locale : i18n.defaultLocale];
  
  return await loader();
}

/**
 * Helper para validar se um locale é suportado.
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}
