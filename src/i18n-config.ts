/**
 * I18N CONFIG — FONTE ÚNICA DE VERDADE
 * -----------------------------------------------------------------------------
 * Centraliza:
 * - Locales
 * - Metadata internacional (SEO, hreflang, manifest)
 * - Loader tipado de dicionários
 *
 * Compatível com Next.js 16 (App Router)
 */

import type { Dictionary } from '@/types/dictionary';

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n.locales)[number];

/**
 * Metadata por idioma
 * Usado por:
 * - metadata.ts
 * - manifest.ts
 * - LanguageSwitcher
 * - hreflang
 */
export const localeMetadata: Record<
  Locale,
  {
    name: string;
    label: string;
    region: string;
    flag: string;
    hrefLang: string;
    description: string;
  }
> = {
  pt: {
    name: 'Português',
    label: 'PT',
    region: 'pt-BR',
    flag: '🇧🇷',
    hrefLang: 'pt-BR',
    description:
      'Engenharia de Dados, Ciência de Dados, Inteligência Artificial e Sistemas de Missão Crítica.',
  },
  en: {
    name: 'English',
    label: 'EN',
    region: 'en-US',
    flag: '🇺🇸',
    hrefLang: 'en-US',
    description:
      'Data Engineering, Data Science, Artificial Intelligence, and Mission-Critical Systems.',
  },
  es: {
    name: 'Español',
    label: 'ES',
    region: 'es-ES',
    flag: '🇪🇸',
    hrefLang: 'es-ES',
    description:
      'Ingeniería de Datos, Ciencia de Datos, Inteligencia Artificial y Sistemas de Misión Crítica.',
  },
};

/**
 * Locale padrão para SEO internacional
 * hreflang="x-default"
 */
export const DEFAULT_HREFLANG = 'x-default';

/**
 * Loader dinâmico de dicionários (Server Components)
 * Fallback seguro para PT
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loaders: Record<Locale, () => Promise<Dictionary>> = {
    pt: () => import('./dictionaries/pt.json').then((m) => m.default),
    en: () => import('./dictionaries/en.json').then((m) => m.default),
    es: () => import('./dictionaries/es.json').then((m) => m.default),
  };

  const loader = loaders[locale] ?? loaders[i18n.defaultLocale];
  return loader();
}

/**
 * Validação segura de locale (URL, params, middleware)
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}
