/**
 * I18N CONFIG
 * -----------------------------------------------------------------------------
 * Fonte única de verdade para internacionalização (Locales e Metadata).
 */

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n.locales)[number];

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
 * Função assíncrona para Server Components.
 * Utiliza o carregamento dinâmico para otimizar o Core Web Vitals.
 */
export async function getDictionary(locale: Locale) {
  const dictionaries = {
    pt: () => import('./dictionaries/pt.json').then((module) => module.default),
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    es: () => import('./dictionaries/es.json').then((module) => module.default),
  };

  // Fallback seguro caso o locale venha corrompido ou não suportado
  const loader = dictionaries[locale] || dictionaries[i18n.defaultLocale];
  return await loader();
}
