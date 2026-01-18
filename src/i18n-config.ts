// src/i18n-config.ts

/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS
 * Define a espinha dorsal do sistema multilíngue.
 */
export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

/**
 * TIPO LOCALE
 * Garante que o TypeScript aceite apenas 'pt', 'en' ou 'es' em todo o projeto.
 */
export type Locale = (typeof i18n)['locales'][number];

/**
 * INTERFACE DE METADADOS
 * Atributos necessários para o LanguageSwitcher e tags HTML.
 */
interface LocaleDetail {
  readonly name: string;   // Ex: English
  readonly region: string; // Ex: en-US (Para SEO/Sitemap)
  readonly flag: string;   // Emoji da bandeira
  readonly label: string;  // Sigla exibida na UI
}

/**
 * DICIONÁRIO DE METADADOS DOS IDIOMAS
 * Centraliza as informações que alimentam os componentes de interface.
 */
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
 * SEGURANÇA DE ROTA (Type Guard)
 * Função essencial usada no Middleware e no layout para validar a URL.
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}

/**
 * HELPER DE REGIONALIZAÇÃO
 * Retorna o código de região para a tag <html lang="..."> no layout principal.
 */
export function getRegion(locale: Locale): string {
  // Se por algum erro o locale for inválido, retorna o padrão pt-BR
  return localeMetadata[locale]?.region || localeMetadata[i18n.defaultLocale].region;
}

/**
 * HELPER DE FALLBACK
 * Garante que sempre tenhamos um idioma válido para evitar erros de renderização.
 */
export function getSafeLocale(locale: string): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}
