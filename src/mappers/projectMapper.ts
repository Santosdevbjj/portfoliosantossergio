// src/mappers/projectMapper.ts

import { 
  ProjectDomain, 
  resolveProjectTechnology, 
  resolveProjectFlags 
} from "@/domain/projects";

/**
 * Interface que representa o formato bruto retornado pela API do GitHub.
 * Baseado no esquema oficial da REST API v3.
 */
export interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  created_at: string;
  // Outros campos podem ser adicionados se necessário
}

/**
 * Transforma um repositório bruto da API do GitHub no modelo de domínio da aplicação.
 * * @param repo - O objeto retornado pela API do GitHub
 * @returns ProjectDomain - O objeto formatado e pronto para ser usado na UI
 */
export const mapGitHubToDomain = (repo: GitHubRepoResponse): ProjectDomain => {
  const topics = repo.topics || [];
  
  // Resolve a tecnologia principal e a chave de tradução baseada nos topics
  const { id: techId, labelKey } = resolveProjectTechnology(topics);
  
  // Resolve flags de destaque (Portfolio, Featured, First)
  const { isPortfolio, isFeatured, isFirst } = resolveProjectFlags(topics);

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description || "",
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    topics: topics,
    technology: {
      id: techId,
      labelKey: labelKey, // Esta chave buscará o texto correto em dictionary.projects.categories
    },
    isPortfolio,
    isFeatured,
    isFirst,
  };
};

/**
 * Mapeia uma lista de repositórios do GitHub.
 */
export const mapGitHubListToDomain = (repos: GitHubRepoResponse[]): ProjectDomain[] => {
  if (!Array.isArray(repos)) return [];
  
  return repos
    .map(mapGitHubToDomain)
    // Exemplo de regra de negócio: Só mostrar se for marcado como portfolio ou se tiver descrição
    .filter(project => project.isPortfolio || project.description !== "")
    .sort((a, b) => (a.isFirst === b.isFirst ? 0 : a.isFirst ? -1 : 1));
};
