// src/i18n-config.ts

/**
 * Configuração centralizada de internacionalização.
 * Define os idiomas suportados e o padrão do sistema.
 */
export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

/**
 * Tipo derivado para garantir segurança em todo o projeto.
 * Impede o uso de strings de idioma inválidas.
 */
export type Locale = (typeof i18n)['locales'][number];

/**
 * Estrutura de metadados para SEO, Acessibilidade e Componentes.
 */
interface LocaleDetail {
  name: string;   // Nome completo (ex: English)
  region: string; // Formato BCP 47 (ex: en-US) para SEO/HTML Lang
  flag: string;   // Emoji ou referência de ícone
  label: string;  // Sigla curta para o Switcher
}

/**
 * Metadados centralizados. 
 * Se você mudar algo aqui, reflete no Switcher e nos metadados da página.
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
 * VALIDADO E SEGURO:
 * Função para verificar se o idioma na URL é suportado pelo nosso sistema.
 * Essencial para o Middleware e para rotas dinâmicas [lang].
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as any);
}

/**
 * HELPER DE REGIONALIZAÇÃO:
 * Retorna o código de região (ex: pt-BR) para ser usado na tag <html lang="...">
 */
export function getRegion(locale: Locale): string {
  return localeMetadata[locale].region;
}
