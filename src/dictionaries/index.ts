// src/dictionaries/index.ts
import "server-only";

import type { Dictionary, CommonDictionary } from "@/types/dictionary";
import {
  DEFAULT_LOCALE,
  normalizeLocale,
  type SupportedLocale,
} from "./locales";

/**
 * Normaliza COMMON
 */
function normalizeCommon(common: any): CommonDictionary {
  return {
    navigation: common?.navigation ?? "",
    role: common?.role ?? "",
    footer: common?.footer ?? "",
    rights: common?.rights ?? "",
    builtWith: common?.builtWith ?? "",
    loading: common?.loading ?? "Loading...",
    error: common?.error ?? "Error",
    socialLinks: common?.socialLinks ?? "",
    skipToContent: common?.skipToContent ?? "",
    languageSwitcher: common?.languageSwitcher ?? "",
    email: common?.email ?? "",

    nav: common?.nav ?? {
      about: "",
      experience: "",
      projects: "",
      articles: "",
      contact: "",
    },

    theme: common?.theme ?? {
      light: "Light",
      dark: "Dark",
      system: "System",
    },

    externalLinks: common?.externalLinks ?? {},

    errorBoundary: common?.errorBoundary ?? {
      title: "Error",
      description: "Unexpected error",
      actions: {
        retry: "Retry",
        home: "Home",
      },
    },

    notFound: common?.notFound ?? {
      title: "Page not found",
      description: "The requested page does not exist.",
      button: "Back",
    },

    menu: common?.menu ?? {
      open: "Open menu",
      close: "Close menu",
      aria: {
        open: "Open navigation menu",
        close: "Close navigation menu",
      },
    },
  };
}

/**
 * Normaliza SEO (diferença entre idiomas)
 */
function normalizeSEO(seo: any) {
  return {
    siteName: seo?.siteName ?? "",
    title: seo?.title ?? "",
    description: seo?.description ?? "",
    keywords: seo?.keywords ?? [],
    pages: seo?.pages ?? {
      home: { title: "", description: "" },
      projects: { title: "", description: "" },
      articles: { title: "", description: "" },
    },
  };
}

/**
 * Normaliza ARTICLES
 */
function normalizeArticles(articles: any) {
  return {
    title: articles?.title ?? "",
    mediumProfile: articles?.mediumProfile ?? "",
    readMore: articles?.readMore ?? "",
    publishedAt: articles?.publishedAt ?? "",
    bestOfMonth: articles?.bestOfMonth ?? "",
    awardWinner: articles?.awardWinner ?? "",
    items: articles?.items ?? [],
  };
}

/**
 * Normaliza PROJECTS
 */
function normalizeProjects(projects: any) {
  return {
    title: projects?.title ?? "",
    featuredLabel: projects?.featuredLabel ?? "",
    firstLabel: projects?.firstLabel ?? "",
    impactLabel: projects?.impactLabel ?? "",
    problem: projects?.problem ?? "",
    solution: projects?.solution ?? "",
    viewProject: projects?.viewProject ?? "",
    viewDemo: projects?.viewDemo ?? "",
    viewAll: projects?.viewAll ?? "",
    portfolio: projects?.portfolio ?? {
      all: "",
      viewProject: "",
    },
    categories: projects?.categories ?? {},
    featuredProjects: projects?.featuredProjects ?? [],
  };
}

/**
 * Normaliza RESUME (novo campo crítico)
 */
function normalizeResume(resume: any) {
  return {
    selectLanguage: resume?.selectLanguage ?? "",
    languages: resume?.languages ?? {},
  };
}

/**
 * Normaliza o dicionário completo
 */
function normalizeDictionary(raw: any): Dictionary {
  return {
    ...raw,

    hero: raw?.hero ?? {},
    about: raw?.about ?? {},
    contact: raw?.contact ?? {},
    experience: raw?.experience ?? { items: [] },

    articles: normalizeArticles(raw?.articles),
    projects: normalizeProjects(raw?.projects),
    seo: normalizeSEO(raw?.seo),
    resume: normalizeResume(raw?.resume),

    common: normalizeCommon(raw?.common),
    states: raw?.states ?? {},
    cookie: raw?.cookie ?? {},
    intl: raw?.intl ?? {},
    metrics: raw?.metrics ?? {},
  } as Dictionary;
}

/**
 * Loader tipado
 */
type DictionaryLoader = () => Promise<Dictionary>;

const loaders: Record<SupportedLocale, DictionaryLoader> = {
  "pt-BR": async () =>
    normalizeDictionary((await import("./pt-BR.json")).default),

  "en-US": async () =>
    normalizeDictionary((await import("./en-US.json")).default),

  "es-ES": async () =>
    normalizeDictionary((await import("./es-ES.json")).default),

  "es-AR": async () =>
    normalizeDictionary((await import("./es-AR.json")).default),

  "es-MX": async () =>
    normalizeDictionary((await import("./es-MX.json")).default),
};

/**
 * API principal
 */
export async function getDictionary(
  locale?: string | null,
): Promise<Dictionary> {
  const normalized = normalizeLocale(locale);

  const loader =
    loaders[normalized] ?? loaders[DEFAULT_LOCALE];

  return loader();
}
