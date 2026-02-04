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
   * Mapeado dinamicamente usando o tipo Locale global.
   * 'pt-BR' é obrigatório como fallback principal.
   */
  content: {
    "pt-BR": ProjectLocaleContent;
  } & {
    [K in Extract<Locale, "en-US" | "es-ES" | "es-AR" | "es-MX">]?: ProjectLocaleContent;
  };

  /**
   * SEO localizado do projeto.
   */
  seo: {
    "pt-BR": ProjectSEO;
  } & {
    [K in Extract<Locale, "en-US" | "es-ES" | "es-AR" | "es-MX">]?: ProjectSEO;
  };

  stack: string[];
  links?: ProjectLinks;
  createdAt: string;
  updatedAt?: string;
}
