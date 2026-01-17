// src/i18n-config.ts

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

// Metadados amigáveis para SEO e acessibilidade
export const localeMetadata = {
  pt: { name: 'Português', region: 'pt-BR', flag: '🇧🇷' },
  en: { name: 'English', region: 'en-US', flag: '🇺🇸' },
  es: { name: 'Español', region: 'es-ES', flag: '🇪🇸' },
};
