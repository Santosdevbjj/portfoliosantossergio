/**
 * TYPES: Dictionary Contract
 * -----------------------------------------------------------------------------
 * Contrato soberano de internacionalização (i18n).
 * * ⚠️ REGRA DE OURO: 
 * Se uma propriedade for alterada aqui, ela DEVE ser atualizada em:
 * 1. src/dictionaries/pt.json
 * 2. src/dictionaries/en.json
 * 3. src/dictionaries/es.json
 */

export interface Dictionary {
  /**
   * Navbar / Header - Links de navegação
   */
  nav: {
    about: string;
    experience: string;
    articles: string;
    projects: string;
    contact: string;
  };

  /**
   * Seção Hero - Primeira impressão e CTA
   */
  hero: {
    greeting: string;
    role: string;
    title: string;
    subtitle: string;
    headline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };

  /**
   * Seção Sobre - Narrativa e Métricas de Impacto
   */
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

  /**
   * Experiência - Trajetória profissional (Bradesco / Consultoria)
   */
  experience: {
    title: string;
    items: Array<{
      company: string;
      role: string;
      period: string;
      description: string;
    }>;
  };

  /**
   * Projetos - Vitrine de repositórios do GitHub
   */
  projects: {
    title: string;
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
    };
  };

  /**
   * Artigos - Conteúdo técnico e premiações (DIO / Medium)
   */
  articles: {
    title: string;
    awardWinner: string;
    bestOfMonth: string;
    readMore: string;
    publishedAt: string;
    mediumProfile: string;
  };

  /**
   * Contato - Conversão e links sociais
   */
  contact: {
    title: string;
    subtitle: string;
    emailLabel: string;
    linkedinLabel: string;
    cvLabel: string;
    cta: string;
  };

  /**
   * Common - Elementos reutilizáveis de UI e Footer
   */
  common: {
    navigation: string;
    openMenu: string;
    closeMenu: string;
    role: string;
    footer: string;
    rights: string;
    builtWith: string;
  };

  /**
   * SEO - Metadados para robôs de busca e redes sociais
   */
  seo: {
    siteName: string;
    description: string;
    keywords: string[];
  };
}
