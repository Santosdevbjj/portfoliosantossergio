/**
 * CONFIGURAÇÃO GLOBAL DE IDIOMAS — NEXT.JS 16+
 * Centraliza i18n, contratos de dicionário e helpers de SEO.
 * * ⚠️ REGRA DE OURO: 
 * Este arquivo é o contrato soberano. Se uma chave for definida aqui,
 * ela DEVE existir em pt.json, en.json e es.json.
 */

/* -------------------------------------------------------------------------- */
/* LOCALES                                                                    */
/* -------------------------------------------------------------------------- */

export const i18n = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es'],
} as const;

export type Locale = (typeof i18n.locales)[number];

/* -------------------------------------------------------------------------- */
/* METADADOS DE IDIOMA                                                        */
/* -------------------------------------------------------------------------- */

export interface LocaleDetail {
  readonly name: string;
  readonly region: string;
  readonly flag: string;
  readonly label: string;
  readonly ariaLabel: string;
}

export const localeMetadata: Readonly<Record<Locale, LocaleDetail>> = {
  pt: {
    name: 'Português',
    region: 'pt-BR',
    flag: '🇧🇷',
    label: 'PT',
    ariaLabel: 'Alterar idioma para Português (Brasil)',
  },
  en: {
    name: 'English',
    region: 'en-US',
    flag: '🇺🇸',
    label: 'EN',
    ariaLabel: 'Change language to English (US)',
  },
  es: {
    name: 'Español',
    region: 'es-ES',
    flag: '🇪🇸',
    label: 'ES',
    ariaLabel: 'Cambiar idioma a Español (España)',
  },
};

/* -------------------------------------------------------------------------- */
/* CONTRATO CANÔNICO DO DICIONÁRIO (BLINDAGEM ENTERPRISE)                     */
/* -------------------------------------------------------------------------- */

export interface Dictionary {
  nav: {
    about: string;
    experience: string;
    articles: string;
    projects: string;
    contact: string;
  };
  hero: {
    greeting: string;
    role: string;
    headline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    title: string;
    description: string;
    differentialTitle: string;
    differentialContent: string;
    stats: {
      experience: string;
      availability: string;
      automation: string;
    };
  };
  projects: {
    title: string;
    featuredLabel: string;
    firstLabel: string; // Para o projeto "Primeiro"
    viewProject: string;
    repoLink: string;
    categories: {
      dataScience: string;
      cloud: string;
      graphs: string;
      analysis: string;
      dev: string;
    };
  };
  articles: {
    title: string;
    awardWinner: string;
    bestOfMonth: string;
    readMore: string;
    mediumProfile: string;
  };
  contact: {
    title: string;
    description: string;
    emailLabel: string;
    linkedinLabel: string;
    cvLabel: string;
  };
  common: {
    navigation: string;
    openMenu: string;
    closeMenu: string;
    footer: string;
    rights: string;
    builtWith: string;
  };
}

/* -------------------------------------------------------------------------- */
/* VALIDADORES                                                                */
/* -------------------------------------------------------------------------- */

export function isValidLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' &&
    (i18n.locales as readonly string[]).includes(value)
  );
}

export function getSafeLocale(locale: string | undefined | null): Locale {
  return isValidLocale(locale) ? locale : i18n.defaultLocale;
}

/* -------------------------------------------------------------------------- */
/* LOADER DINÂMICO DE DICIONÁRIOS                                             */
/* -------------------------------------------------------------------------- */

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import('./dictionaries/pt.json').then((module) => module.default as Dictionary),
  en: () => import('./dictionaries/en.json').then((module) => module.default as Dictionary),
  es: () => import('./dictionaries/es.json').then((module) => module.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const safeLocale = getSafeLocale(locale);

  try {
    return await dictionaries[safeLocale]();
  } catch (error) {
    console.error(`[i18n-critical] Erro ao carregar dicionário: ${safeLocale}`, error);

    // Fallback para o idioma padrão (PT) caso o idioma solicitado falhe
    if (safeLocale !== i18n.defaultLocale) {
      return await dictionaries[i18n.defaultLocale]();
    }

    throw new Error('[i18n-fatal] Dicionário padrão não encontrado ou corrompido.');
  }
}

/* -------------------------------------------------------------------------- */
/* HELPERS DE SEO & ROTEAMENTO                                                */
/* -------------------------------------------------------------------------- */

export function getRegion(locale: Locale): string {
  return localeMetadata[locale].region;
}

export function getAlternateLocales(currentLocale: Locale): Locale[] {
  return i18n.locales.filter((locale) => locale !== currentLocale);
}

/**
 * Nota Técnica:
 * Responsividade é controlada via CSS/Tailwind nos componentes.
 * Este arquivo garante a integridade dos dados multilingues.
 */
