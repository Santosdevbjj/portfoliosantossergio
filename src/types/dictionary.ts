// src/types/dictionary.ts

import type { SupportedLocale } from "@/dictionaries/locales";

export type Locale = SupportedLocale;

/* ================= META ================= */
export interface DictionaryMeta {
  version: string;
  locale: Locale;
  direction: "ltr" | "rtl";
  lastUpdated: string;
  author: string;
  source?: string;
  contentVersion?: string;
  contentHash?: string;
  sourceType?: string;
  description: string;
}

/* ================= HERO ================= */
export interface HeroDictionary {
  greeting: string;
  title: string;
  subtitle: string;
  headline: string;
  ctaPrimary: string;
}

/* ================= CONSTRUCTION ================= */
export interface ConstructionDictionary {
  badge: string;
  title: string;
  description: string;
  techStack: string[];
  viewProject: string;
  metrics: {
    accuracy: string;
    label: string;
  };
}

/* ================= ABOUT ================= */
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

/* ================= CONTACT ================= */
export interface ContactDictionary {
  title: string;
  subtitle: string;
  cta: string;
  emailLabel: string;
  cvLabel: string;
  linkedinLabel: string;
  ctaTitle?: string;
  buttonText?: string;
}

/* ================= EXPERIENCE ================= */
export interface ExperienceItem {
  company: string;
  period: string;
  role: string;
  description: string;
}

export interface ExperienceDictionary {
  title: string;
  items: ExperienceItem[];
  emptyLabel: string;
}

/* ================= ARTICLES ================= */
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

/* ================= PROJECTS ================= */
export interface CategoryDetail {
  labelKey: string;
}

/**
 * 🔥 MANTIDO + FLEXÍVEL (SEM QUEBRAR O ANTIGO)
 */
export interface ProjectCategories {
  "Data Engineering": CategoryDetail;
  "Cloud & Infrastructure": CategoryDetail;
  "Data Science": CategoryDetail;
  "Data Analytics": CategoryDetail;
  "Outros": CategoryDetail;

  dataScience: CategoryDetail;
  cloud: CategoryDetail;
  graphs: CategoryDetail;
  analysis: CategoryDetail;
  excel: CategoryDetail;
  database: CategoryDetail;
  dev: CategoryDetail;
  security: CategoryDetail;

  html: CategoryDetail;
  css: CategoryDetail;
  javascript: CategoryDetail;
  typescript: CategoryDetail;
  next: CategoryDetail;
  node: CategoryDetail;
  react: CategoryDetail;

  articles: CategoryDetail;

  /**
   * 🔥 mantém compatibilidade com ES-ES
   */
  [key: string]: CategoryDetail;
}

export interface ProjectItem {
  id: string | number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  github?: string;
  homepage?: string;
}

export interface ProjectsSectionDictionary {
  title: string;
  featuredLabel: string;
  firstLabel: string;
  impactLabel: string;
  problem: string;
  solution: string;
  viewProject: string;
  viewDemo: string;
  viewAll: string;
  portfolio: {
    all: string;
    viewProject: string;
  };
  categories: ProjectCategories;
  featuredProjects: ProjectItem[];
}

/* ================= COMMON ================= */
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
  email: string;

  nav: {
    about: string;
    experience: string;
    projects: string;
    articles: string;
    contact: string;
  };

  theme: {
    light: string;
    dark: string;
    system: string;
  };

  /**
   * 🔥 VOLTOU A SER OBRIGATÓRIO (como era antes)
   */
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

  /**
   * 🔥 CRÍTICO — obrigatório
   */
  menu: {
    open: string;
    close: string;
    aria: {
      open: string;
      close: string;
    };
  };
}

/* ================= STATES ================= */
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

/* ================= INTL ================= */
export interface IntlDictionary {
  locale: Locale;
  fallbackLocale: string;
  currency: string;
  timezone: string;
  unitDisplay: string;
  numberFormat: string;
}

/* ================= COOKIE ================= */
export interface CookieDictionary {
  title: string;
  description: string;
  necessary: string;
  alwaysActive: string;
  analytics: string;
  acceptAll: string;
  savePreferences: string;
}

/* ================= SEO ================= */
export interface SeoDictionary {
  siteName: string;
  title: string;
  description: string;
  keywords: string[];

  /**
   * 🔥 voltou a ser obrigatório
   */
  pages: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
}

/* ================= METRICS ================= */
export interface MetricsDictionary {
  availability: string;
  availabilityNormalized: {
    value: number;
    unit: string;
  };
}

/* ================= RESUME ================= */
export interface ResumeDictionary {
  selectLanguage: string;
  languages: Record<string, string>;
}

/* ================= ROOT ================= */
export interface Dictionary {
  meta: DictionaryMeta;
  hero: HeroDictionary;

  /**
   * 🔥 NOVO - Seção de Projetos de Construção Civil / IA
   */
  construction: ConstructionDictionary;

  about: AboutDictionary;
  contact: ContactDictionary;
  experience: ExperienceDictionary;
  articles: ArticlesSectionDictionary;
  projects: ProjectsSectionDictionary;
  common: CommonDictionary;
  intl: IntlDictionary;
  states: StateDictionary;
  cookie: CookieDictionary;
  seo: SeoDictionary;
  metrics: MetricsDictionary;

  /**
   * 🔥 NOVO (não quebra nada)
   */
  resume: ResumeDictionary;
}
