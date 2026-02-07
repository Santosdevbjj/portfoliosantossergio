// src/services/githubService.ts

import { ProjectDomain } from "@/domain/projects";
import { GitHubRepoResponse, mapGitHubListToDomain } from "@/mappers/projectMapper";

const GITHUB_API_URL = "https://api.github.com";
const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;

/**
 * Serviço especializado em buscar dados do GitHub.
 * Utiliza o modelo de cache do Next.js 16.
 */
export async function getGitHubProjects(): Promise<ProjectDomain[]> {
  if (!USERNAME) {
    console.error("[GitHub Service] Username not found in environment variables.");
    return [];
  }

  try {
    const response = await fetch(`${GITHUB_API_URL}/users/${USERNAME}/repos?sort=updated&per_page=100`, {
      headers: {
        // O uso do Token aumenta o limite de requisições e permite ver repositórios privados se necessário
        ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      // Next.js 16 Cache: Revalida os dados a cada 24 horas (86400 segundos)
      next: { 
        revalidate: 86400,
        tags: ['github-projects'] 
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    const data: GitHubRepoResponse[] = await response.json();

    // Transforma os dados brutos em Objetos de Domínio via Mapper
    const domainProjects = mapGitHubListToDomain(data);

    // Filtra apenas o que for relevante para o portfólio (opcional, já que o mapper também filtra)
    return domainProjects.filter(p => p.isPortfolio || p.isFeatured);

  } catch (error) {
    console.error("[GitHub Service] Failed to fetch projects:", error);
    return []; // Retorna lista vazia em caso de falha para não quebrar a UI
  }
}
