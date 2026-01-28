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
  PROGRAMMING_LOGIC = 'programming-logic',
  HTML = 'html',
  NODE_REACT = 'node-react',
}

export const PROJECT_TECHNOLOGY_ORDER: readonly ProjectTechnology[] = Object.values(ProjectTechnology);

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly htmlUrl: string;
  readonly homepage?: string | null;
  readonly topics: readonly string[];
  readonly technology: {
    id: ProjectTechnology;
    labelKey: string; // Deve bater com as chaves em dictionary.projects.categories
  };
  readonly isPortfolio: boolean;
  readonly isFeatured: boolean;
  readonly isFirst: boolean;
}

export const resolveProjectTechnology = (topics: readonly string[]) => {
  if (!topics || topics.length === 0) return { id: ProjectTechnology.DATA_SCIENCE, labelKey: 'dataScience' };

  const techId = PROJECT_TECHNOLOGY_ORDER.find((tech) => topics.includes(tech));
  
  // Mapping direcionado para as chaves do seu JSON de tradução
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

  const selectedTechId = techId || ProjectTechnology.DATA_SCIENCE;
  return { id: selectedTechId, labelKey: mapping[selectedTechId] };
};

export const resolveProjectFlags = (topics: readonly string[]) => ({
  isPortfolio: topics.includes(ProjectCoreTag.PORTFOLIO),
  isFeatured: topics.includes(ProjectCoreTag.FEATURED) || topics.includes(ProjectCoreTag.DESTAQUE),
  isFirst: topics.includes(ProjectCoreTag.PRIMEIRO),
});
