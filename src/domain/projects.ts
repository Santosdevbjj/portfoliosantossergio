// src/domain/projects.ts

import type { ProjectCategories } from "@/types/dictionary";

/**
 * Core flags usados para lógica de portfólio
 */
export enum ProjectCoreTag {
  PORTFOLIO = "portfolio",
  FEATURED = "featured",
  DESTAQUE = "destaque",
  PRIMEIRO = "primeiro",
}

/**
 * Tecnologias principais detectadas nos topics do GitHub
 * A ORDEM DEFINE PRIORIDADE
 */
export enum ProjectTechnology {
  DATA_SCIENCE = "data-science",
  AZURE_DATABRICKS = "azure-databricks",
  NEO4J = "neo4j",
  POWER_BI = "power-bi",
  EXCEL = "excel",
  DATABASE = "database",
  PYTHON = "python",
  DOTNET = "dotnet",
  JAVA = "java",
  MACHINE_LEARNING = "machine-learning",
  ARTIFICIAL_INTELLIGENCE = "artificial-intelligence",
  AWS = "aws",
  CYBERSECURITY = "cybersecurity",
  PROGRAMMING_LOGIC = "programming-logic",
  HTML = "html",
  CSS = "css",
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  NEXT = "next",
  NODE = "node",
  REACT = "react",
  ARTICLES = "articles",
}

/**
 * Ordem oficial de tecnologias
 */
export const PROJECT_TECHNOLOGY_ORDER: readonly ProjectTechnology[] = [
  ProjectTechnology.DATA_SCIENCE,
  ProjectTechnology.AZURE_DATABRICKS,
  ProjectTechnology.NEO4J,
  ProjectTechnology.POWER_BI,
  ProjectTechnology.EXCEL,
  ProjectTechnology.DATABASE,
  ProjectTechnology.PYTHON,
  ProjectTechnology.DOTNET,
  ProjectTechnology.JAVA,
  ProjectTechnology.MACHINE_LEARNING,
  ProjectTechnology.ARTIFICIAL_INTELLIGENCE,
  ProjectTechnology.AWS,
  ProjectTechnology.CYBERSECURITY,
  ProjectTechnology.PROGRAMMING_LOGIC,
  ProjectTechnology.HTML,
  ProjectTechnology.CSS,
  ProjectTechnology.JAVASCRIPT,
  ProjectTechnology.TYPESCRIPT,
  ProjectTechnology.NEXT,
  ProjectTechnology.NODE,
  ProjectTechnology.REACT,
  ProjectTechnology.ARTICLES,
];

/**
 * Estrutura de domínio
 */
export interface ProjectDomain {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly htmlUrl: string;
  readonly homepage?: string | null;
  readonly topics: readonly string[];

  readonly technology: {
    id: ProjectTechnology;
    labelKey: keyof ProjectCategories;
  };

  readonly isPortfolio: boolean;
  readonly isFeatured: boolean;
  readonly isFirst: boolean;
}

/**
 * Mapeia tecnologia -> chave do dictionary
 */
const TECHNOLOGY_CATEGORY_MAP: Record<
  ProjectTechnology,
  keyof ProjectCategories
> = {
  [ProjectTechnology.DATA_SCIENCE]: "dataScience",
  [ProjectTechnology.AZURE_DATABRICKS]: "azureDatabricks",
  [ProjectTechnology.NEO4J]: "graphs",
  [ProjectTechnology.POWER_BI]: "analysis",
  [ProjectTechnology.EXCEL]: "excel",
  [ProjectTechnology.DATABASE]: "database",
  [ProjectTechnology.PYTHON]: "python",
  [ProjectTechnology.DOTNET]: "dotnet",
  [ProjectTechnology.JAVA]: "java",
  [ProjectTechnology.MACHINE_LEARNING]: "machineLearning",
  [ProjectTechnology.ARTIFICIAL_INTELLIGENCE]: "ai",
  [ProjectTechnology.AWS]: "aws",
  [ProjectTechnology.CYBERSECURITY]: "security",
  [ProjectTechnology.PROGRAMMING_LOGIC]: "logic",
  [ProjectTechnology.HTML]: "html",
  [ProjectTechnology.CSS]: "css",
  [ProjectTechnology.JAVASCRIPT]: "javascript",
  [ProjectTechnology.TYPESCRIPT]: "typescript",
  [ProjectTechnology.NEXT]: "next",
  [ProjectTechnology.NODE]: "node",
  [ProjectTechnology.REACT]: "react",
  [ProjectTechnology.ARTICLES]: "articles",
};

/**
 * Aliases usados nos topics do GitHub
 */
const TECHNOLOGY_TOPIC_ALIASES: Record<ProjectTechnology, string[]> = {
  [ProjectTechnology.DATA_SCIENCE]: [
    "data-science",
    "ciencia-de-dados",
  ],

  [ProjectTechnology.AZURE_DATABRICKS]: [
    "databricks",
    "azure-databricks",
    "azure",
    "azure-cloud",
  ],

  [ProjectTechnology.NEO4J]: [
    "neo4j",
    "graph-analysis",
    "analise-de-grafos",
  ],

  [ProjectTechnology.POWER_BI]: [
    "power-bi",
    "data-analysis",
    "analise-de-dados",
  ],

  [ProjectTechnology.EXCEL]: ["excel"],

  [ProjectTechnology.DATABASE]: [
    "database",
    "banco-de-dados",
    "sql",
  ],

  [ProjectTechnology.PYTHON]: ["python"],

  [ProjectTechnology.DOTNET]: [
    "dotnet",
    "csharp",
  ],

  [ProjectTechnology.JAVA]: ["java"],

  [ProjectTechnology.MACHINE_LEARNING]: [
    "machine-learning",
  ],

  [ProjectTechnology.ARTIFICIAL_INTELLIGENCE]: [
    "artificial-intelligence",
    "inteligencia-artificial",
    "ia",
    "ai",
  ],

  [ProjectTechnology.AWS]: [
    "aws",
    "amazon-aws",
  ],

  [ProjectTechnology.CYBERSECURITY]: [
    "cybersecurity",
    "ciberseguranca",
  ],

  [ProjectTechnology.PROGRAMMING_LOGIC]: [
    "programming-logic",
    "logica-de-programacao",
  ],

  [ProjectTechnology.HTML]: ["html"],
  [ProjectTechnology.CSS]: ["css"],
  [ProjectTechnology.JAVASCRIPT]: ["javascript"],
  [ProjectTechnology.TYPESCRIPT]: ["typescript"],

  [ProjectTechnology.NEXT]: [
    "next",
    "nextjs",
    "next.js",
  ],

  [ProjectTechnology.NODE]: [
    "node",
    "nodejs",
  ],

  [ProjectTechnology.REACT]: ["react"],

  [ProjectTechnology.ARTICLES]: [
    "articles",
    "artigos",
    "artigos-tecnicos",
  ],
};

/**
 * Normaliza topics
 */
const normalizeTopics = (topics: readonly string[]) =>
  topics.map(t => t.toLowerCase().trim());

/**
 * Resolve tecnologia
 */
export const resolveProjectTechnology = (
  topics: readonly string[],
): ProjectDomain["technology"] => {

  const normalized = normalizeTopics(topics);

  const tech =
    PROJECT_TECHNOLOGY_ORDER.find(technology =>
      TECHNOLOGY_TOPIC_ALIASES[technology]?.some(alias =>
        normalized.includes(alias),
      ),
    ) ?? ProjectTechnology.DATA_SCIENCE;

  return {
    id: tech,
    labelKey:
      TECHNOLOGY_CATEGORY_MAP[tech] ?? "dataScience",
  };
};

/**
 * Resolve flags
 */
export const resolveProjectFlags = (
  topics: readonly string[],
) => {

  const normalized = normalizeTopics(topics);

  return {
    isPortfolio: normalized.includes(
      ProjectCoreTag.PORTFOLIO,
    ),

    isFeatured:
      normalized.includes(ProjectCoreTag.FEATURED) ||
      normalized.includes(ProjectCoreTag.DESTAQUE),

    isFirst: normalized.includes(
      ProjectCoreTag.PRIMEIRO,
    ),
  };
};
