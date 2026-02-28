// src/types/project.ts

import type { ProcessedProject } from "./github";

/**
 * Este arquivo agora serve como um alias para os tipos processados do GitHub.
 * Isso evita que você precise alterar os imports em todos os componentes.
 * * ✔ Corrigido: 'import type' para compatibilidade com verbatimModuleSyntax
 * ✔ TS 6 Strict Compliant
 */

export type Project = ProcessedProject;

/**
 * Status para controle de exibição na UI
 */
export type ProjectStatus = "active" | "archived" | "draft";

/**
 * SEO localizado
 */
export interface ProjectSEO {
  title: string;
  description: string;
  keywords?: string[];
}
