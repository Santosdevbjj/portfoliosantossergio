// src/i18n-config.ts

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

// Este tipo garante que você nunca use um idioma não suportado no código
export type Locale = (typeof i18n)['locales'][number];

interface LocaleDetail {
  name: string;
  region: string;
  flag: string;
  label: string;
}

// Metadados centralizados para SEO, Acessibilidade e Componentes de UI
export const localeMetadata: Record<Locale, LocaleDetail> = {
  pt: { 
    name: 'Português', 
    region: 'pt-BR', 
    flag: '🇧🇷',
    label: 'PT'
  },
  en: { 
    name: 'English', 
    region: 'en-US', 
    flag: '🇺🇸',
    label: 'EN'
  },
  es: { 
    name: 'Español', 
    region: 'es-ES', 
    flag: '🇪🇸',
    label: 'ES'
  },
};

/**
 * Função utilitária para validar se um locale é suportado.
 * Útil para verificações de segurança no Middleware ou Server Components.
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}
