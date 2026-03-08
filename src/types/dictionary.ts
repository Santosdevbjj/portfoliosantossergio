// src/types/dictionary.ts
import type { SupportedLocale } from "@/dictionaries/locales";

export type Locale = SupportedLocale;

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

export interface HeroDictionary {
  greeting: string;
  title: string;
  subtitle: string;
  headline: string;
  ctaPrimary: string;
}

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

export interface CategoryDetail {
  labelKey: string;
}

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

export interface IntlDictionary {
  locale: Locale;
  fallbackLocale: string;
  currency: string;
  timezone: string;
  unitDisplay: string;
  numberFormat: string;
}

export interface CookieDictionary {
  title: string;
  description: string;
  necessary: string;
  alwaysActive: string;
  analytics: string;
  acceptAll: string;
  savePreferences: string;
}

export interface SeoDictionary {
  siteName: string;
  title: string;
  description: string;
  keywords: string[];

  pages: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
}

export interface MetricsDictionary {
  availability: string;
  availabilityNormalized: {
    value: number;
    unit: string;
  };
}

export interface Dictionary {
  meta: DictionaryMeta;
  hero: HeroDictionary;
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
}
