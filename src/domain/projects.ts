// src/domain/projects.ts

export enum ProjectCoreTag {
  PORTFOLIO = 'portfolio',
  FEATURED = 'featured',
  DESTAQUE = 'destaque',
  PRIMEIRO = 'primeiro',
}

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
  SECURITY = 'security',
  PROGRAMMING_LOGIC = 'programming-logic',
  HTML = 'html',
  NODE_REACT = 'node-react',
}

export const PROJECT_TECHNOLOGY_ORDER: readonly ProjectTechnology[] = Object.values(ProjectTechnology);

export interface ProjectDomain {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly htmlUrl: string;
  readonly homepage?: string | null;
  readonly topics: readonly string[];
  readonly technology: {
    id: ProjectTechnology;
    labelKey: string; // DEVE bater com projects.categories no JSON
  };
  readonly isPortfolio: boolean;
  readonly isFeatured: boolean;
  readonly isFirst: boolean;
}

/**
 * Resolve a tecnologia principal baseada nas tags do GitHub (topics).
 * O labelKey retornado é usado para buscar a tradução correta.
 */
export const resolveProjectTechnology = (topics: readonly string[]) => {
  const normalizedTopics = topics.map(t => t.toLowerCase());
  
  const techId = PROJECT_TECHNOLOGY_ORDER.find((tech) => normalizedTopics.includes(tech));

  // Mapeamento rigoroso para as chaves em dictionary.projects.categories
  const mapping: Record<ProjectTechnology, string> = {
    [ProjectTechnology.DATA_SCIENCE]: 'dataScience',
    [ProjectTechnology.AZURE_DATABRICKS]: 'cloud',
    [ProjectTechnology.NEO4J]: 'graphs',
    [ProjectTechnology.POWER_BI]: 'analysis',
    [ProjectTechnology.EXCEL]: 'excel',
    [ProjectTechnology.DATABASE]: 'database',
    [ProjectTechnology.PYTHON]: 'dev',
    [ProjectTechnology.DOTNET]: 'dev',
    [ProjectTechnology.JAVA]: 'dev',
    [ProjectTechnology.MACHINE_LEARNING]: 'dataScience',
    [ProjectTechnology.ARTIFICIAL_INTELLIGENCE]: 'dataScience',
    [ProjectTechnology.AWS]: 'cloud',
    [ProjectTechnology.CYBERSECURITY]: 'security',
    [ProjectTechnology.SECURITY]: 'security',
    [ProjectTechnology.PROGRAMMING_LOGIC]: 'dev',
    [ProjectTechnology.HTML]: 'dev',
    [ProjectTechnology.NODE_REACT]: 'dev',
  };

  const selectedTechId = techId || ProjectTechnology.DATA_SCIENCE;
  
  return { 
    id: selectedTechId, 
    labelKey: mapping[selectedTechId] || 'dataScience' 
  };
};

export const resolveProjectFlags = (topics: readonly string[]) => {
  const normalized = topics.map(t => t.toLowerCase());
  return {
    isPortfolio: normalized.includes(ProjectCoreTag.PORTFOLIO),
    isFeatured: normalized.includes(ProjectCoreTag.FEATURED) || normalized.includes(ProjectCoreTag.DESTAQUE),
    isFirst: normalized.includes(ProjectCoreTag.PRIMEIRO),
  };
};
