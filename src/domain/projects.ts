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

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly htmlUrl: string;
  readonly homepage?: string | null;
  readonly topics: readonly string[];
  readonly technology: {
    id: ProjectTechnology;
    labelKey: string;
  };
  readonly isPortfolio: boolean;
  readonly isFeatured: boolean;
  readonly isFirst: boolean;
}

export const resolveProjectTechnology = (topics: readonly string[]) => {
  if (!topics.length) return null;
  const techId = PROJECT_TECHNOLOGY_ORDER.find((tech) => topics.includes(tech));
  if (!techId) return null;

  const mapping: Record<string, string> = {
    'data-science': 'dataScience',
    'azure-databricks': 'cloud',
    'neo4j': 'graphs',
    'power-bi': 'analysis',
    'excel': 'analysis',
    'database': 'analysis',
    'python': 'dev',
    'dotnet': 'dev',
    'java': 'dev',
    'machine-learning': 'dataScience',
    'artificial-intelligence': 'dataScience',
    'aws': 'cloud',
    'cybersecurity': 'security',
    'programming-logic': 'dev',
    'html': 'dev',
    'node-react': 'dev',
  };

  return { id: techId, labelKey: mapping[techId] };
};

export const resolveProjectFlags = (topics: readonly string[]) => ({
  isPortfolio: topics.includes(ProjectCoreTag.PORTFOLIO),
  isFeatured: topics.includes(ProjectCoreTag.FEATURED) || topics.includes(ProjectCoreTag.DESTAQUE),
  isFirst: topics.includes(ProjectCoreTag.PRIMEIRO),
});
