/**
 * DOMAIN: Projects
 * -----------------------------------------------------------------------------
 * Fonte única de verdade (SSOT) para categorização, ordenação e destaque
 * dos projetos vindos do GitHub.
 *
 * Integra:
 * - GitHub Topics
 * - Portfólio
 * - UI/UX (badges, destaque, primeiro)
 * - Filtros por tecnologia
 * - Testes automatizados
 *
 * ⚠️ Este arquivo NÃO contém textos visíveis (i18n via dictionaries)
 */

/* -------------------------------------------------------------------------- */
/* CORE TAGS (GitHub Topics)                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Tags estruturais usadas no GitHub (topics)
 */
export enum ProjectCoreTag {
  PORTFOLIO = 'portfolio',
  FEATURED = 'featured',
  DESTAQUE = 'destaque',
  PRIMEIRO = 'primeiro',
}

/* -------------------------------------------------------------------------- */
/* TECHNOLOGIES (GitHub Topics)                                                */
/* -------------------------------------------------------------------------- */

/**
 * Tecnologias suportadas no portfólio
 * Todas devem existir como topic no GitHub (lowercase)
 */
export enum ProjectTechnology {
  DATA_SCIENCE = 'data-science',
  AZURE_DATABRICKS = 'azure-databricks',
  NEO4J = 'neo4j',
  POWER_BI = 'power-bi',
  EXCEL = 'excel',
  DATABASE = 'database',
  PYTHON = 'python',
  DOTNET = 'dotnet',
  JAVA = 'java',
  MACHINE_LEARNING = 'machine-learning',
  ARTIFICIAL_INTELLIGENCE = 'artificial-intelligence',
  AWS = 'aws',
  CYBERSECURITY = 'cybersecurity',
  PROGRAMMING_LOGIC = 'programming-logic',
  HTML = 'html',
  NODE_REACT = 'node-react',
  ARTICLES = 'articles',
}

/* -------------------------------------------------------------------------- */
/* ORDERING (UI / UX CANÔNICA)                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Ordem oficial de exibição das tecnologias no portfólio
 * UI, SEO e testes dependem dessa ordem
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
  ProjectTechnology.NODE_REACT,
  ProjectTechnology.ARTICLES,
] as const;

/* -------------------------------------------------------------------------- */
/* DOMAIN MODELS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Modelo normalizado de projeto após parsing do GitHub
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  htmlUrl: string;
  homepage?: string | null;

  topics: readonly string[];

  technology: ProjectTechnology;
  isPortfolio: boolean;
  isFeatured: boolean;
  isHighlighted: boolean;
  isFirst: boolean;
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Extrai a tecnologia principal de um projeto baseado nos topics
 */
export const resolveProjectTechnology = (
  topics: readonly string[],
): ProjectTechnology | null => {
  return (
    PROJECT_TECHNOLOGY_ORDER.find((tech) => topics.includes(tech)) ?? null
  );
};

/**
 * Normaliza flags estruturais a partir dos topics
 */
export const resolveProjectFlags = (topics: readonly string[]) => ({
  isPortfolio: topics.includes(ProjectCoreTag.PORTFOLIO),
  isFeatured: topics.includes(ProjectCoreTag.FEATURED),
  isHighlighted: topics.includes(ProjectCoreTag.DESTAQUE),
  isFirst: topics.includes(ProjectCoreTag.PRIMEIRO),
});

/**
 * Comparator para ordenação final de projetos
 * 1️⃣ primeiro
 * 2️⃣ destaque
 * 3️⃣ featured
 * 4️⃣ ordem alfabética
 */
export const sortProjects = (a: Project, b: Project): number => {
  if (a.isFirst !== b.isFirst) return a.isFirst ? -1 : 1;
  if (a.isHighlighted !== b.isHighlighted)
    return a.isHighlighted ? -1 : 1;
  if (a.isFeatured !== b.isFeatured)
    return a.isFeatured ? -1 : 1;

  return a.name.localeCompare(b.name);
};

/* -------------------------------------------------------------------------- */
/* I18N CONTRACT                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Contrato de categorias para dicionário
 * Garante que PT / EN / ES tenham todas as tecnologias
 */
export type ProjectCategoryDictionary = Record<ProjectTechnology, string>;
