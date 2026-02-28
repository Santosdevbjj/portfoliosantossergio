// src/types/project.ts

import { ProcessedProject } from "./github";

/**
 * Este arquivo agora serve como um alias para os tipos processados do GitHub.
 * Isso evita que você precise alterar os imports em todos os componentes.
 */

export type Project = ProcessedProject;

/**
 * Status para controle de exibição na UI
 */
export type ProjectStatus = "active" | "archived" | "draft";

// Você pode manter as interfaces de SEO se o seu componente de Metadata ainda as usar
export interface ProjectSEO {
  title: string;
  description: string;
  keywords?: string[];
}
