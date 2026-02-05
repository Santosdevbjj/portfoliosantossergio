/**
 * I18N CONFIG — FONTE ÚNICA DE VERDADE
 * -----------------------------------------------------------------------------
 * Sincronizado com: src/types/dictionary.ts e src/dictionaries/index.ts
 */

import type { Locale } from '@/types/dictionary';

export const i18n = {
  defaultLocale: 'pt-BR',
  // Lista exaustiva baseada nos seus arquivos JSON e no tipo Locale
  locales: ['pt-BR', 'en-US', 'es-ES', 'es-AR', 'es-MX'],
} as const;

// Removemos a função getDictionary daqui para evitar duplicidade, 
// pois você já a possui em src/dictionaries/index.ts e src/lib/getServerDictionary.ts

/**
 * Metadata por idioma para SEO e UI
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
  'pt-BR': {
    name: 'Português',
    label: 'PT',
    region: 'pt-BR',
    flag: '🇧🇷',
    hrefLang: 'pt-BR',
    description: 'Engenharia de Dados, Ciência de Dados, IA e Sistemas de Missão Crítica.',
  },
  'en-US': {
    name: 'English',
    label: 'EN',
    region: 'en-US',
    flag: '🇺🇸',
    hrefLang: 'en-US',
    description: 'Data Engineering, Data Science, AI, and Mission-Critical Systems.',
  },
  'es-ES': {
    name: 'Español (España)',
    label: 'ES',
    region: 'es-ES',
    flag: '🇪🇸',
    hrefLang: 'es-ES',
    description: 'Ingeniería de Datos, Ciencia de Datos, IA y Sistemas de Misión Crítica.',
  },
  'es-AR': {
    name: 'Español (Argentina)',
    label: 'AR',
    region: 'es-AR',
    flag: '🇦🇷',
    hrefLang: 'es-AR',
    description: 'Ingeniería de Datos, Ciencia de Datos, IA y Sistemas de Misión Crítica.',
  },
  'es-MX': {
    name: 'Español (México)',
    label: 'MX',
    region: 'es-MX',
    flag: '🇲🇽',
    hrefLang: 'es-MX',
    description: 'Ingeniería de Datos, Ciencia de Dados, IA y Sistemas de Misión Crítica.',
  },
};

export const DEFAULT_HREFLANG = 'x-default';

/**
 * Validação segura de locale
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return (i18n.locales as readonly string[]).includes(locale);
}
