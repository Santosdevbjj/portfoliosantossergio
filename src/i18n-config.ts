/**
 * I18N CONFIG
 * -----------------------------------------------------------------------------
 * Fonte única de verdade para internacionalização.
 */
import type { Dictionary } from '@/types/dictionary';

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n.locales)[number];

export const localeMetadata = {
  pt: { name: 'Português', region: 'pt-BR', flag: '🇧🇷', label: 'PT' },
  en: { name: 'English', region: 'en-US', flag: '🇺🇸', label: 'EN' },
  es: { name: 'Español', region: 'es-ES', flag: '🇪🇸', label: 'ES' },
} as const;

/**
 * Função otimizada para buscar dicionários.
 * Usa importação dinâmica para reduzir o tamanho do bundle inicial.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionaries: Record<Locale, () => Promise<any>> = {
    pt: () => import('./dictionaries/pt.json').then((m) => m.default),
    en: () => import('./dictionaries/en.json').then((m) => m.default),
    es: () => import('./dictionaries/es.json').then((m) => m.default),
  };

  // Garante o fallback para o idioma padrão caso o locale seja inválido
  const loader = dictionaries[locale] ?? dictionaries[i18n.defaultLocale];
  return (await loader()) as Dictionary;
}
