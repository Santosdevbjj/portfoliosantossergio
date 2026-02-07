// src/domain/navigation.ts

export enum NavSection {
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
  ARTICLES = 'articles',
  CONTACT = 'contact',
}

export const NAV_SECTIONS: readonly NavSection[] = [
  NavSection.ABOUT,
  NavSection.EXPERIENCE,
  NavSection.PROJECTS,
  NavSection.ARTICLES,
  NavSection.CONTACT,
] as const;

/**
 * Mapeia a seção para o ID da âncora no HTML.
 * Útil para scroll suave e SEO.
 */
export const NAV_HASH_MAP: Readonly<Record<NavSection, `#${string}`>> = {
  [NavSection.ABOUT]: '#sobre',
  [NavSection.EXPERIENCE]: '#trajetoria',
  [NavSection.PROJECTS]: '#projetos',
  [NavSection.ARTICLES]: '#artigos',
  [NavSection.CONTACT]: '#contato',
} as const;

export const getNavHash = (section: NavSection): `#${string}` => NAV_HASH_MAP[section];
export const getSectionId = (section: NavSection): string => NAV_HASH_MAP[section].replace('#', '');
