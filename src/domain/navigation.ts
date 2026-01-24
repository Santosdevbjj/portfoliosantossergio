/**
 * DOMAIN: Navigation
 * -----------------------------------------------------------------------------
 * Fonte única de verdade (SSOT) para seções de navegação do site.
 *
 * Usado por:
 * - Navbar
 * - Footer
 * - SEO
 * - ScrollSpy
 * - Sitemap
 * - Testes automatizados
 *
 * ⚠️ Este arquivo NÃO contém texto, UI ou idioma.
 * Ele define apenas estrutura e contratos.
 */

/* -------------------------------------------------------------------------- */
/* ENUMS                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Seções oficiais de navegação
 * Essas chaves DEVEM existir em todos os dicionários (pt / en / es)
 */
export enum NavSection {
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  ARTICLES = 'articles',
  PROJECTS = 'projects',
  CONTACT = 'contact',
}

/* -------------------------------------------------------------------------- */
/* ORDER                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Ordem canônica de exibição das seções
 * Usada por Navbar, Footer, Sitemap e ScrollSpy
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  NavSection.ABOUT,
  NavSection.EXPERIENCE,
  NavSection.PROJECTS,
  NavSection.ARTICLES,
  NavSection.CONTACT,
] as const;

/* -------------------------------------------------------------------------- */
/* HASH MAP                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Âncoras (hash) associadas a cada seção
 * Mantidas aqui para evitar strings mágicas nos componentes
 */
export const NAV_HASH_MAP: Readonly<Record<NavSection, `#${string}`>> = {
  [NavSection.ABOUT]: '#about',
  [NavSection.EXPERIENCE]: '#experience',
  [NavSection.ARTICLES]: '#articles',
  [NavSection.PROJECTS]: '#projects',
  [NavSection.CONTACT]: '#contact',
} as const;

/* -------------------------------------------------------------------------- */
/* I18N CONTRACT                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Contrato de dicionário para navegação
 *
 * Garante em tempo de build que:
 * - PT / EN / ES tenham TODAS as seções
 * - nenhuma chave seja esquecida
 */
export type NavDictionary = Record<NavSection, string>;
