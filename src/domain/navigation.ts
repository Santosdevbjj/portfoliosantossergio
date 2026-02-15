// src/domain/navigation.ts

/**
 * Seções lógicas da navegação.
 * NÃO dependem de idioma.
 */
export enum NavSection {
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
  ARTICLES = 'articles',
  CONTACT = 'contact',
}

/**
 * Ordem canônica das seções.
 * Usada por Navbar, ScrollSpy e PageWrapper.
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  NavSection.ABOUT,
  NavSection.EXPERIENCE,
  NavSection.PROJECTS,
  NavSection.ARTICLES,
  NavSection.CONTACT,
] as const;

/**
 * Mapeia cada seção para um hash HTML estável.
 * ❗ Nunca deve ser traduzido.
 * ❗ Nunca depende de i18n.
 */
export const NAV_HASH_MAP: Readonly<
  Record<NavSection, `#${NavSection}`>
> = {
  [NavSection.ABOUT]: '#about',
  [NavSection.EXPERIENCE]: '#experience',
  [NavSection.PROJECTS]: '#projects',
  [NavSection.ARTICLES]: '#articles',
  [NavSection.CONTACT]: '#contact',
} as const;

/**
 * Retorna o hash (#section)
 */
export const getNavHash = (
  section: NavSection,
): `#${NavSection}` => NAV_HASH_MAP[section];

/**
 * Retorna o ID puro da seção (sem #)
 * Usado em <section id="..." />
 */
export const getSectionId = (
  section: NavSection,
): NavSection => section;
