// src/types/project.ts

import { Locale } from "./dictionary";

/**
 * Categorias válidas de projeto
 */

// export const PROJECT_CATEGORIES = [
//  "data-analysis",
//  "machine-learning",
//  "data-engineering",
// ] as const;

export const PROJECT_CATEGORIES = [
  "dataScience",
  "cloud",
  "graphs",
  "analysis",
  "excel",
  "database",
  "dev",
  "security",
] as const;


export type ProjectCategory =
  (typeof PROJECT_CATEGORIES)[number];

export type ProjectLocaleContent = {
  title: string;
  description: string;
  summary?: string;
};

export interface ProjectSEO {
  title: string;
  description: string;
  keywords?: string[];
}

export interface ProjectLinks {
  repository?: string;
  demo?: string;
  article?: string;
}

export interface Project {
  id: string;
  slug: string;

  /**
   * Agora tipado corretamente
   */
  category: ProjectCategory;

  featured: boolean;
  order: number;
  status: "active" | "archived" | "draft";

  content: {
    "pt-BR": ProjectLocaleContent;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectLocaleContent>>;

  seo: {
    "pt-BR": ProjectSEO;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectSEO>>;

  stack: string[];
  links?: ProjectLinks;
  createdAt: string;
  updatedAt?: string;
}
