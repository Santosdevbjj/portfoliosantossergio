// src/services/githubService.ts
import { processRepositories } from "@/lib/github-service";
import type { GitHubRepo, ProcessedProject } from "@/types/github";

const GITHUB_API_URL = "https://api.github.com";

export async function getGitHubProjects(username: string): Promise<ProcessedProject[]> {
  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}/repos?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        // Adicione seu GITHUB_TOKEN no .env para evitar limites de taxa
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` })
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) return [];

  const rawRepos = (await response.json()) as GitHubRepo[];
  
  // Aqui aplicamos a lógica de filtro e mapeamento que criamos no lib
  return processRepositories(rawRepos, username);
}

// Para manter compatibilidade com códigos antigos que usavam outro nome
export { getGitHubProjects as fetchUserRepos };
