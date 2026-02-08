export type Locale = "pt-BR" | "en-US" | "es-ES" | "es-AR" | "es-MX";

export interface DictionaryMeta {
  version: string;
  locale: Locale; // Uso do type restrito
  direction: "ltr" | "rtl";
  lastUpdated: string;
  author: string;
  source: string;
  contentVersion?: string;
  contentHash?: string;
  sourceType?: string;
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

export interface CommonDictionary {
  navigation: string;
  role: string;
  footer: string;
  rights: string;
  builtWith: string;
  loading: string;
  error: string;
  socialLinks: string;
  languageSwitcher: string;
  errorBoundary: {
    title: string;
    description: string;
    actions: { retry: string; home: string };
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
    aria: { open: string; close: string };
  };
}

export interface StateDictionary {
  loading: string;
  empty: string;
  error: string;
  emptyProjects: { title: string; description: string; cta: string };
  emptyExperience: string;
  errorArticles: string;
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
  intl: {
    locale: string;
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
    pages: Record<string, { title: string; description: string }>;
  };
  metrics: {
    availability: string;
    availabilityNormalized: { value: number; unit: string };
  };
}
