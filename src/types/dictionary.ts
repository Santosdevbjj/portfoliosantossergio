// src/types/dictionary.ts

import type { SupportedLocale } from "@/dictionaries/locales";

/**
 * Fonte única de verdade para Locale.
 * ✔ Elimina duplicação
 * ✔ Evita drift entre dicionários e domínio
 * ✔ TS 6 compliant
 */
export type Locale = SupportedLocale;

/* -------------------------------------------------------------------------- */
/*                                   META                                     */
/* -------------------------------------------------------------------------- */

export interface DictionaryMeta {
  version: string;
  locale: Locale;
  direction: "ltr" | "rtl";
  lastUpdated: string;
  author: string;
  source: string;
  contentVersion?: string;
  contentHash?: string;
  sourceType?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   HERO                                     */
/* -------------------------------------------------------------------------- */

export interface HeroDictionary {
  greeting: string;
  title: string;
  subtitle: string;
  headline: string;
  ctaPrimary: string;
}

/* -------------------------------------------------------------------------- */
/*                                   ABOUT                                    */
/* -------------------------------------------------------------------------- */

export interface AboutDictionary {
  title: string;
  differentialTitle: string;
  description: string;
  differentialContent: string;
  highlights: string[];
  stats: {
    experienceValue: string;
    experienceLabel: string;
    availabilityValue: string;
    availabilityLabel: string;
    automation: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                                  CONTACT                                   */
/* -------------------------------------------------------------------------- */

export interface ContactDictionary {
  title: string;
  subtitle: string;
  cta: string;
  emailLabel: string;
  cvLabel: string;
  linkedinLabel: string;
}

/* -------------------------------------------------------------------------- */
/*                                EXPERIENCE                                  */
/* -------------------------------------------------------------------------- */

export interface ExperienceItem {
  company: string;
  period: string;
  role: string;
  description: string;
}

export interface ExperienceDictionary {
  title: string;
  items: ExperienceItem[];
}

/* -------------------------------------------------------------------------- */
/*                                  ARTICLES                                  */
/* -------------------------------------------------------------------------- */

export interface ArticleItem {
  title: string;
  description: string;
  date: string;
  category: string;
  isAward: boolean;
  link: string;
}

export interface ArticlesSectionDictionary {
  title: string;
  mediumProfile: string;
  readMore: string;
  publishedAt: string;
  bestOfMonth: string;
  awardWinner: string;
  items: ArticleItem[];
}

/* -------------------------------------------------------------------------- */
/*                                  PROJECTS                                  */
/* -------------------------------------------------------------------------- */

export interface ProjectCategories {
  dataScience: string;
  cloud: string;
  graphs: string;
  analysis: string;
  excel: string;
  database: string;
  dev: string;
  security: string;
}

export interface ProjectsSectionDictionary {
  title: string;
  featuredLabel: string;
  firstLabel: string;
  impactLabel: string;
  viewProject: string;
  viewDemo: string;
  viewAll: string;
  categories: ProjectCategories;
}

/* -------------------------------------------------------------------------- */
/*                                   COMMON                                   */
/* -------------------------------------------------------------------------- */

export interface CommonDictionary {
  navigation: string;
  role: string;
  footer: string;
  rights: string;
  builtWith: string;
  loading: string;
  error: string;
  socialLinks: string;
  skipToContent: string;
  languageSwitcher: string;

  errorBoundary: {
    title: string;
    description: string;
    actions: {
      retry: string;
      home: string;
    };
  };

  notFound: {
    title: string;
    description: string;
    button: string;
  };

  externalLinks: {
    linkedin: string;
    github: string;
    medium: string;
    email: string;
  };

  menu: {
    open: string;
    close: string;
    aria: {
      open: string;
      close: string;
    };
  };
}

/* -------------------------------------------------------------------------- */
/*                                   STATES                                   */
/* -------------------------------------------------------------------------- */

export interface StateDictionary {
  loading: string;
  empty: string;
  error: string;
  emptyProjects: {
    title: string;
    description: string;
    cta: string;
  };
  emptyExperience: string;
  errorArticles: string;
}

/* -------------------------------------------------------------------------- */
/*                                 ROOT TYPE                                  */
/* -------------------------------------------------------------------------- */

export interface Dictionary {
  meta: DictionaryMeta;

  hero: HeroDictionary;
  about: AboutDictionary;
  contact: ContactDictionary;
  experience: ExperienceDictionary;
  articles: ArticlesSectionDictionary;
  projects: ProjectsSectionDictionary;
  common: CommonDictionary;

  intl: {
    locale: Locale;
    fallbackLocale: string;
    currency: string;
    timezone: string;
    unitDisplay: string;
    numberFormat: string;
  };

  states: StateDictionary;

  cookie: {
    title: string;
    description: string;
    necessary: string;
    alwaysActive: string;
    analytics: string;
    acceptAll: string;
    savePreferences: string;
  };

  seo: {
    siteName: string;
    description: string;
    keywords: string[];
    pages: Record<
      string,
      {
        title: string;
        description: string;
      }
    >;
  };

  metrics: {
    availability: string;
    availabilityNormalized: {
      value: number;
      unit: string;
    };
  };
}
