/**
 * DOMAIN: Navigation
 * -----------------------------------------------------------------------------
 * Fonte Única de Verdade (SSOT) para a navegação do site.
 * * Este arquivo garante que a Navbar, o ScrollSpy e o SEO estejam 
 * sempre em sincronia, evitando links quebrados.
 */

/* -------------------------------------------------------------------------- */
/* SECTIONS (ENUM)                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Seções oficiais do site.
 * As chaves aqui devem ser idênticas às chaves do objeto 'nav' nos dicionários JSON.
 */
export enum NavSection {
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
  ARTICLES = 'articles',
  CONTACT = 'contact',
}

/* -------------------------------------------------------------------------- */
/* CANONICAL ORDER                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Ordem oficial de exibição. 
 * Alterar esta lista altera a ordem na Navbar e no Footer simultaneamente.
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  NavSection.ABOUT,
  NavSection.EXPERIENCE,
  NavSection.PROJECTS,
  NavSection.ARTICLES,
  NavSection.CONTACT,
] as const;

/* -------------------------------------------------------------------------- */
/* HASH MAP (ANCHORS)                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Mapeamento centralizado de IDs de âncoras para scroll suave.
 * O prefixo '#' é garantido pelo tipo literal.
 */
export const NAV_HASH_MAP: Readonly<Record<NavSection, `#${string}`>> = {
  [NavSection.ABOUT]: '#sobre',
  [NavSection.EXPERIENCE]: '#trajetoria',
  [NavSection.PROJECTS]: '#projetos',
  [NavSection.ARTICLES]: '#artigos',
  [NavSection.CONTACT]: '#contato',
} as const;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Retorna a âncora para uso em componentes de link.
 */
export const getNavHash = (section: NavSection): `#${string}` =>
  NAV_HASH_MAP[section];

/**
 * Retorna o ID (sem o #) para uso em atributos 'id' de seções HTML.
 */
export const getSectionId = (section: NavSection): string =>
  NAV_HASH_MAP[section].replace('#', '');

/* -------------------------------------------------------------------------- */
/* I18N CONTRACT                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Contrato que obriga os dicionários (pt/en/es) a terem traduções para todas as seções.
 */
export type NavDictionary = Record<NavSection, string>;
