// src/types/project.ts

import type { SupportedLocale } from "@/dictionaries/locales";

/**
 * Categorias oficiais do sistema.
 * Deve estar 100% alinhado com:
 * dictionaries -> projects.categories
 */
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

/**
 * Tipo derivado automaticamente das categorias
 */
export type ProjectCategory =
  (typeof PROJECT_CATEGORIES)[number];

/**
 * Status permitido
 */
export const PROJECT_STATUS = [
  "active",
  "archived",
  "draft",
] as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[number];

/**
 * Conteúdo textual localizado
 */
export interface ProjectLocaleContent {
  title: string;
  description: string;
  summary?: string;
}

/**
 * SEO localizado
 */
export interface ProjectSEO {
  title: string;
  description: string;
  keywords?: string[];
}

/**
 * Links externos do projeto
 */
export interface ProjectLinks {
  repository?: string;
  demo?: string;
  article?: string;
}

/**
 * Estrutura base multilíngue:
 * pt-BR obrigatório
 * demais opcionais
 */
type LocalizedContent<T> = {
  "pt-BR": T;
} & Partial<
  Record<
    Exclude<SupportedLocale, "pt-BR">,
    T
  >
>;

/**
 * Interface principal do Projeto
 */
export interface Project {
  id: string;
  slug: string;

  /**
   * Categoria obrigatoriamente tipada
   */
  category: ProjectCategory;

  featured: boolean;
  order: number;
  status: ProjectStatus;

  /**
   * Conteúdo localizado
   */
  content: LocalizedContent<ProjectLocaleContent>;

  /**
   * SEO localizado
   */
  seo: LocalizedContent<ProjectSEO>;

  /**
   * Stack tecnológica
   * Mantido string[] para evitar erro com github.ts
   */
  stack: string[];

  links?: ProjectLinks;

  /**
   * Datas ISO string
   */
  createdAt: string;
  updatedAt?: string;
}
