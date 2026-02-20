// src/components/featured/projects.data.ts

import type { SupportedLocale } from "@/dictionaries/locales";
import type { ProjectCategory } from "@/types/project";

/**
 * Modelo de projeto destacado (Featured).
 * - Ordem fixa
 * - Independente da API do GitHub
 * - Multilíngue
 * - TS 6 strict compliant
 */
export interface FeaturedProject {
  readonly id: string;
  readonly name: string;
  readonly repoUrl: string;
  readonly priority: 1 | 2 | 3;
  readonly categories: readonly ProjectCategory[];
  readonly description: Record<SupportedLocale, string>;
}

/**
 * Lista oficial dos 3 projetos destacados.
 * A ordem visual é controlada por `priority`.
 */
export const featuredProjects = [
  {
    id: "analise-riscos-atraso-obras",
    name: "Análise de Riscos de Atraso em Obras",
    repoUrl:
      "https://github.com/Santosdevbjj/analiseRiscosAtrasoObras",
    priority: 1,
    categories: ["dataScience", "analysis"],
    description: {
      "pt-BR":
        "Projeto de ciência de dados para análise preditiva de riscos de atraso em obras.",
      "en-US":
        "Data science project focused on predictive risk analysis for construction delays.",
      "es-ES":
        "Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.",
      "es-AR":
        "Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.",
      "es-MX":
        "Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.",
    },
  },
  {
    id: "analise-dados-na-pratica",
    name: "Análise de Dados na Prática",
    repoUrl:
      "https://github.com/Santosdevbjj/analiseDadosNaPratica",
    priority: 2,
    categories: ["dataScience", "graphs"],
    description: {
      "pt-BR":
        "Projeto prático focado em análise exploratória de dados e geração de insights.",
      "en-US":
        "Hands-on project focused on exploratory data analysis and insight generation.",
      "es-ES":
        "Proyecto práctico centrado en análisis exploratorio de datos y generación de insights.",
      "es-AR":
        "Proyecto práctico centrado en análisis exploratorio de datos y generación de insights.",
      "es-MX":
        "Proyecto práctico centrado en análisis exploratorio de datos y generación de insights.",
    },
  },
  {
    id: "genai-pipeline-etl-python",
    name: "GenAI Pipeline ETL em Python",
    repoUrl:
      "https://github.com/Santosdevbjj/genAIpipeETLPython",
    priority: 3,
    categories: ["dataScience", "cloud"],
    description: {
      "pt-BR":
        "Pipeline ETL moderno em Python com integração de IA generativa.",
      "en-US":
        "Modern Python ETL pipeline with generative AI integration.",
      "es-ES":
        "Pipeline ETL moderno en Python con integración de IA generativa.",
      "es-AR":
        "Pipeline ETL moderno en Python con integración de IA generativa.",
      "es-MX":
        "Pipeline ETL moderno en Python con integración de IA generativa.",
    },
  },
] as const satisfies readonly FeaturedProject[];

/**
 * Tipo derivado automaticamente.
 * Seguro, imutável e alinhado com TS 6.
 */
export type FeaturedProjectId =
  (typeof featuredProjects)[number]["id"];
