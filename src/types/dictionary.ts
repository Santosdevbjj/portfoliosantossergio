/**
 * Dictionary — Contrato único de i18n do projeto
 *
 * Este arquivo define a estrutura exata que TODOS os
 * arquivos JSON de idioma DEVEM seguir.
 *
 * Qualquer divergência será erro de TypeScript em build-time.
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
    title: string
    subtitle: string
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
    highlights: string[]
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
    viewAll: string
    categories: {
      data: string
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
    readMore: string
    publishedAt: string
  }

  /**
   * Contato
   */
  contact: {
    title: string
    subtitle: string
    emailLabel: string
    cta: string
  }

  /**
   * SEO (por página ou global)
   */
  seo: {
    siteName: string
    description: string
    keywords: string[]
  }
}
