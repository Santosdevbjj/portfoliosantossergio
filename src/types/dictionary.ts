// src/types/dictionary.ts

/**
 * Tipos de idiomas suportados pela aplicação.
 * Adicionado: es-AR e es-MX para suporte regional completo.
 */
export type Locale = "pt-BR" | "en-US" | "es-ES" | "es-AR" | "es-MX";


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

export interface HeroDictionary {
  greeting: string;
  title: string;
  subtitle: string;
  headline: string;
  ctaPrimary: string;
}

export interface ProjectCategories {
  cloud: string;
  dataScience: string;
  security: string;
}

export interface ProjectsSectionDictionary {
  categories: ProjectCategories;
}


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

export interface ErrorBoundaryDictionary {
  title: string;
  description: string;
  actions: {
    retry: string;
    home: string;
  };
}

export interface NotFoundDictionary {
  title: string;
  description: string;
  button: string;
}

export interface ExternalLinks {
  linkedin: string;
  github: string;
  medium: string;
  email: string;
}

export interface ExternalLinksNormalized {
  [key: string]: {
    url: string;
    platform: string;
  };
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
  errorBoundary: ErrorBoundaryDictionary;
  notFound: NotFoundDictionary;
  externalLinks: ExternalLinks;
  externalLinksNormalized?: ExternalLinksNormalized;
  menu: {
    open: string;
    close: string;
    aria: {
      open: string;
      close: string;
    };
  };
}

export interface IntlContract {
  requiredFields: string[];
  formattingResponsibility: string;
}

export interface IntlDictionary {
  locale: string;
  fallbackLocale: string;
  currency: string;
  timezone: string;
  unitDisplay: string;
  numberFormat: string;
  contract?: IntlContract;
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

export interface LabelsDictionary {
  home: string;
  back: string;
  retry: string;
  close: string;
  open: string;
}

export interface PluralizationDictionary {
  [key: string]: {
    legacy?: Record<string, string>;
    icu?: string;
  };
}

export interface SeoDictionary {
  [key: string]: {
    title: string;
    description: string;
  };
}

export interface CategoryExtended {
  label: string;
  seo: string;
  order: number;
}

export interface MetricsDictionary {
  availability: string;
  availabilityNormalized?: {
    value: number;
    unit: string;
  };
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


/**
 * Estrutura principal do Dicionário.
 * Representa a forma exata dos arquivos .json na pasta dictionaries.
 */
export interface Dictionary {
  meta: DictionaryMeta;
  common: CommonDictionary;
  intl: IntlDictionary;
  states: StateDictionary;
  cookie: CookieDictionary; 
  about: AboutDictionary;
  contact: ContactDictionary;
  experience: ExperienceDictionary; 
  hero: HeroDictionary;        
  projects: ProjectsSectionDictionary; 
  labels?: LabelsDictionary;
  pluralization?: PluralizationDictionary;
  seo?: SeoDictionary;
  categoriesExtended?: Record<string, CategoryExtended>;
  metrics?: MetricsDictionary;
}
