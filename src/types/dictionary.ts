/**
 * Dictionary — Contrato único e tipado de i18n do projeto
 * * Unifica a versão original com as métricas de autoridade (Bradesco/Data Science).
 */

export interface Dictionary {
  /**
   * Textos globais e reutilizáveis
   */
  common: {
    navigation: string
    openMenu: string
    closeMenu: string
    role: string
    footer: string
    rights: string
    builtWith: string
    loading?: string
    error?: string
  }

  /**
   * Navbar / Header
   */
  nav: {
    about: string
    experience: string
    articles: string
    projects: string
    contact: string
  }

  /**
   * Seção Hero / Home
   */
  hero: {
    greeting: string     // Novo
    role: string         // Novo
    title: string
    subtitle: string
    headline: string     // Novo
    description: string
    ctaPrimary: string
    ctaSecondary?: string
  }

  /**
   * Seção Sobre
   */
  about: {
    title: string
    description: string
    differentialTitle: string    // Novo
    differentialContent: string  // Novo
    highlights: string[]
    stats: {                     // Novo: Métricas Bradesco
      experience: string
      availability: string
      automation: string
    }
  }

  /**
   * Experiência profissional
   */
  experience: {
    title: string
    items: Array<{
      company: string
      role: string
      period: string
      description: string
    }>
  }

  /**
   * Projetos
   */
  projects: {
    title: string
    featured: string
    featuredLabel: string // Novo
    firstLabel: string    // Novo
    viewProject: string   // Novo
    viewAll: string
    repoLink: string      // Novo
    categories: {
      data: string
      dataScience: string // Novo
      cloud: string       // Novo
      graphs: string      // Novo
      analysis: string    // Novo
      dev: string         // Novo
      backend: string
      frontend: string
      devops: string
      security: string
    }
  }

  /**
   * Artigos / Conteúdo
   */
  articles: {
    title: string
    awardWinner: string  // Novo (DIO)
    bestOfMonth: string  // Novo
    readMore: string
    publishedAt: string
    mediumProfile: string // Novo
    emptyState?: string
  }

  /**
   * Contato
   */
  contact: {
    title: string
    subtitle: string
    emailLabel: string
    linkedinLabel: string // Novo
    cvLabel: string       // Novo
    cta: string
    successMessage?: string
  }

  /**
   * SEO global e por página (Mantido conforme original)
   */
  seo: {
    siteName: string       // Simplificado para bater com os JSONs revisados
    description: string
    keywords: string[]
    site: {                // Mantido para compatibilidade legado
      siteName: string
      description: string
      keywords: string[]
    }
    pages?: {
      home?: {
        title?: string
        description?: string
      }
      projects?: {
        title?: string
        description?: string
      }
      articles?: {
        title?: string
        description?: string
      }
      contact?: {
        title?: string
        description?: string
      }
    }
  }
}
