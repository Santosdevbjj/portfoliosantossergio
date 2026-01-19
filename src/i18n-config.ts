// src/i18n-config.ts

/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS
 * Define a espinha dorsal do sistema multilíngue para Next.js 15.
 * O uso de 'as const' garante que o TypeScript trate os valores como literais.
 */
export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

/**
 * TIPO LOCALE
 * Extrai os valores 'pt' | 'en' | 'es' para garantir segurança de tipos em todo o código.
 */
export type Locale = (typeof i18n)['locales'][number];

/**
 * INTERFACE DE METADADOS DE IDIOMA
 * Estrutura que alimenta o seletor de idiomas (LanguageSwitcher) e as tags de SEO.
 */
interface LocaleDetail {
  readonly name: string;   // Nome completo (Ex: English)
  readonly region: string; // Código de região (Crucial para a tag <html lang="..."> e hreflang)
  readonly flag: string;   // Emoji da bandeira para a UI
  readonly label: string;  // Sigla curta para botões de troca rápida
}

/**
 * DICIONÁRIO DE METADADOS DOS IDIOMAS
 * Centraliza as informações que alimentam os componentes de interface e o Middleware.
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
 * Valida se uma string qualquer é um idioma suportado pelo sistema.
 * Útil para proteger rotas dinâmicas [lang].
 */
export function isValidLocale(locale: string | undefined | null): locale is Locale {
  if (!locale) return false;
  return (i18n.locales as readonly string[]).includes(locale);
}

/**
 * HELPER DE REGIONALIZAÇÃO
 * Retorna o código de região exato para a tag <html lang="..."> no Layout principal.
 */
export function getRegion(locale: Locale): string {
  return localeMetadata[locale]?.region ?? 'pt-BR';
}

/**
 * HELPER DE FALLBACK
 * Garante que a aplicação sempre retorne um idioma válido, evitando erros de renderização.
 */
export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/**
 * HELPER PARA SEO (Alternates)
 * Utilizado para gerar metadados de cabeçalho, informando ao Google as versões traduzidas da página.
 */
export const getAlternateLocales = (currentLocale: Locale) => {
  return i18n.locales.filter((locale) => locale !== currentLocale);
};

/**
 * CONFIGURAÇÃO DE DICTIONARY (Utility)
 * Mapeia os idiomas para as importações dinâmicas dos arquivos JSON.
 */
export const dictionaries = {
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
