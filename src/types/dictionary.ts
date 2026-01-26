/**
 * Dictionary — Contrato único e tipado de i18n do projeto
 * Unifica a versão original com as métricas de autoridade (Bradesco/Data Science).
 */

export interface Dictionary {
  common: {
    navigation: string;
    openMenu: string;
    closeMenu: string;
    role: string;
    footer: string;
    rights: string;
    builtWith: string;
    loading?: string;
    error?: string;
  };

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
    title: string;
    subtitle: string;
    headline: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary?: string;
  };

  about: {
    title: string;
    description: string;
    differentialTitle: string;
    differentialContent: string;
    highlights: string[];
    stats: {
      experience: string;
      availability: string;
      automation: string;
    };
  };

  experience: {
    title: string;
    items: Array<{
      company: string;
      role: string;
      period: string;
      description: string;
    }>;
  };

  projects: {
    title: string;
    featured: string;
    featuredLabel: string;
    firstLabel: string;
    viewProject: string;
    viewAll: string;
    repoLink: string;
    categories: {
      dataScience: string;
      cloud: string;
      graphs: string;
      analysis: string;
      dev: string;
      security: string;
      // Mantendo chaves legadas para compatibilidade
      data: string;
      backend: string;
      frontend: string;
      devops: string;
    };
  };

  articles: {
    title: string;
    awardWinner: string;
    bestOfMonth: string;
    readMore: string;
    publishedAt: string;
    mediumProfile: string;
    emptyState?: string;
  };

  contact: {
    title: string;
    subtitle: string;
    emailLabel: string;
    linkedinLabel: string;
    cvLabel: string;
    cta: string;
    successMessage?: string;
  };

  seo: {
    siteName: string;
    description: string;
    keywords: string[];
    site: {
      siteName: string;
      description: string;
      keywords: string[];
    };
    pages?: {
      home?: { title?: string; description?: string };
      projects?: { title?: string; description?: string };
      articles?: { title?: string; description?: string };
      contact?: { title?: string; description?: string };
    };
  };
}
