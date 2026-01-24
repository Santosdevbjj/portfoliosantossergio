/**

DOMAIN: Navigation


---

Fonte única de verdade (SSOT) para seções de navegação do site.

Usado por Navbar, Footer, SEO, ScrollSpy, Sitemap e testes. */


/**

Seções oficiais de navegação */ export enum NavSection { ABOUT = 'about', EXPERIENCE = 'experience', ARTICLES = 'articles', PROJECTS = 'projects', CONTACT = 'contact', }


/**

Ordem canônica de exibição das seções */ export const NAV_SECTIONS: readonly NavSection[] = [ NavSection.ABOUT, NavSection.EXPERIENCE, NavSection.PROJECTS, NavSection.ARTICLES, NavSection.CONTACT, ];


/**

Hash (âncoras) associados a cada seção */ export const NAV_HASH_MAP: Record<NavSection, #${string}> = { [NavSection.ABOUT]: '#about', [NavSection.EXPERIENCE]: '#experience', [NavSection.ARTICLES]: '#articles', [NavSection.PROJECTS]: '#projects', [NavSection.CONTACT]: '#contact', };


/**

Tipo auxiliar para dicionários de navegação (i18n)

Garante que todo idioma tenha todas as seções */ export type NavDictionary = Record<NavSection, string>;
