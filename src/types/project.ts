// src/types/project.ts

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

  content: {
    "pt-BR": ProjectLocaleContent;
    "en-US"?: ProjectLocaleContent;
    "es-ES"?: ProjectLocaleContent;
  };

  seo: {
    "pt-BR": ProjectSEO;
    "en-US"?: ProjectSEO;
    "es-ES"?: ProjectSEO;
  };

  stack: string[];
  links?: ProjectLinks;
  createdAt: string;
  updatedAt?: string;
}
