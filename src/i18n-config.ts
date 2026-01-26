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
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionaries = {
    pt: () => import('./dictionaries/pt.json').then((m) => m.default),
    en: () => import('./dictionaries/en.json').then((m) => m.default),
    es: () => import('./dictionaries/es.json').then((m) => m.default),
  };
  return (dictionaries[locale] || dictionaries.pt)() as unknown as Dictionary;
}
