/**
 * DOMAIN: Projects
 * -----------------------------------------------------------------------------
 * Fonte única de verdade (SSOT) para categorização, ordenação e destaque.
 * Alinhado com as regras de Sérgio Santos: Rigor Bancário + Ciência de Dados.
 */

/* -------------------------------------------------------------------------- */
/* CORE TAGS (GitHub Topics)                                                   */
/* -------------------------------------------------------------------------- */

export enum ProjectCoreTag {
  PORTFOLIO = 'portfolio',
  FEATURED = 'featured',   // Tag padrão internacional
  DESTAQUE = 'destaque',   // Tag em português para redundância
  PRIMEIRO = 'primeiro',   // A tag soberana para o Head Project
}

/* -------------------------------------------------------------------------- */
/* TECHNOLOGIES (GitHub Topics)                                                */
/* -------------------------------------------------------------------------- */

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
}

/* -------------------------------------------------------------------------- */
/* ORDERING (UI / UX CANÔNICA)                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Ordem oficial de prioridade das tecnologias definida pelo Sérgio.
 * Determina qual categoria aparece primeiro no repositório de projetos.
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
] as const;

/* -------------------------------------------------------------------------- */
/* DOMAIN MODELS                                                              */
/* -------------------------------------------------------------------------- */

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly htmlUrl: string;
  readonly homepage?: string | null;
  readonly topics: readonly string[];
  readonly technology: {
    id: ProjectTechnology;
    labelKey: string; // Chave para tradução no dictionary.projects.categories
  };
  readonly isPortfolio: boolean;
  readonly isFeatured: boolean;    // featured ou destaque
  readonly isFirst: boolean;       // primeiro
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Resolve a tecnologia principal e mapeia para a chave de tradução do i18n
 */
export const resolveProjectTechnology = (
  topics: readonly string[],
): Project['technology'] | null => {
  if (!topics.length) return null;

  const techId = PROJECT_TECHNOLOGY_ORDER.find((tech) => topics.includes(tech));

  if (!techId) return null;

  // Mapeamento de camelCase para o contrato do JSON
  const mapping: Record<ProjectTechnology, string> = {
    [ProjectTechnology.DATA_SCIENCE]: 'dataScience',
    [ProjectTechnology.AZURE_DATABRICKS]: 'cloud',
    [ProjectTechnology.NEO4J]: 'graphs',
    [ProjectTechnology.POWER_BI]: 'analysis',
    [ProjectTechnology.EXCEL]: 'analysis',
    [ProjectTechnology.DATABASE]: 'analysis',
    [ProjectTechnology.PYTHON]: 'dev',
    [ProjectTechnology.DOTNET]: 'dev',
    [ProjectTechnology.JAVA]: 'dev',
    [ProjectTechnology.MACHINE_LEARNING]: 'dataScience',
    [ProjectTechnology.ARTIFICIAL_INTELLIGENCE]: 'dataScience',
    [ProjectTechnology.AWS]: 'cloud',
    [ProjectTechnology.CYBERSECURITY]: 'security',
    [ProjectTechnology.PROGRAMMING_LOGIC]: 'dev',
    [ProjectTechnology.HTML]: 'dev',
    [ProjectTechnology.NODE_REACT]: 'dev',
  };

  return {
    id: techId,
    labelKey: mapping[techId],
  };
};

export const resolveProjectFlags = (
  topics: readonly string[],
): Pick<Project, 'isPortfolio' | 'isFeatured' | 'isFirst'> => ({
  isPortfolio: topics.includes(ProjectCoreTag.PORTFOLIO),
  isFeatured: topics.includes(ProjectCoreTag.FEATURED) || topics.includes(ProjectCoreTag.DESTAQUE),
  isFirst: topics.includes(ProjectCoreTag.PRIMEIRO),
});

/**
 * Comparator soberano:
 * 1. Tag 'primeiro' sempre ganha.
 * 2. Tag 'featured' ou 'destaque' vem em segundo.
 * 3. Ordem de Tecnologia (PROJECT_TECHNOLOGY_ORDER).
 * 4. Ordem alfabética.
 */
export const sortProjects = (a: Project, b: Project): number => {
  if (a.isFirst !== b.isFirst) return a.isFirst ? -1 : 1;
  if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;

  const indexA = PROJECT_TECHNOLOGY_ORDER.indexOf(a.technology.id);
  const indexB = PROJECT_TECHNOLOGY_ORDER.indexOf(b.technology.id);

  if (indexA !== indexB) return indexA - indexB;

  return a.name.localeCompare(b.name, 'pt-BR');
};
