// src/types/project.ts

import { Locale } from "./dictionary";

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
  category: string;
  featured: boolean;
  order: number;
  status: "active" | "archived" | "draft";

  /**
   * Conteúdo localizado do projeto.
   * 'pt-BR' é obrigatório, os demais são opcionais.
   */
  content: {
    "pt-BR": ProjectLocaleContent;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectLocaleContent>>;

  /**
   * SEO localizado do projeto.
   */
  seo: {
    "pt-BR": ProjectSEO;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectSEO>>;

  stack: string[];
  links?: ProjectLinks;
  createdAt: string;
  updatedAt?: string;
}
