/**
 * I18N CONFIG — ESTRUTURA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * Fonte única de verdade para internacionalização (Locales, Metadata e Loader).
 * Alinhado com Next.js 16, App Router e dicionários PT, EN e ES.
 */

import type { Dictionary } from '@/types/dictionary';

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n.locales)[number];

/**
 * Metadados dos Locales
 * Utilizados para LanguageSwitcher, SEO (hreflang) e acessibilidade.
 */
export const localeMetadata: Record<
  Locale,
  {
    name: string;
    region: string;
    flag: string;
    label: string;
    hrefLang: string;
  }
> = {
  pt: {
    name: 'Português',
    region: 'pt-BR',
    flag: '🇧🇷',
    label: 'PT',
    hrefLang: 'pt-BR',
  },
  en: {
    name: 'English',
    region: 'en-US',
    flag: '🇺🇸',
    label: 'EN',
    hrefLang: 'en-US',
  },
  es: {
    name: 'Español',
    region: 'es-ES',
    flag: '🇪🇸',
    label: 'ES',
    hrefLang: 'es-ES',
  },
};

/**
 * Locale padrão para SEO internacional (hreflang="x-default")
 * Recomendado pelo Google para sites multilíngues.
 */
export const DEFAULT_HREFLANG = 'x-default';

/**
 * Carregamento Dinâmico de Dicionários (Server-Side)
 * Tipado e seguro — fallback automático para PT.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    pt: () => import('./dictionaries/pt.json').then((m) => m.default),
    en: () => import('./dictionaries/en.json').then((m) => m.default),
    es: () => import('./dictionaries/es.json').then((m) => m.default),
  };

  const loader = dictionaries[locale] ?? dictionaries[i18n.defaultLocale];
  return loader();
}

/**
 * Helper para validação segura de locale (URL, params, middleware)
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}
