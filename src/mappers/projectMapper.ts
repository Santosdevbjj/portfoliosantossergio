// src/mappers/projectMapper.ts
import type { GitHubRepo, ProcessedProject } from "@/types/github";
import { processRepositories } from "@/lib/github-service";

/**
 * Este mapper agora é simplificado pois a lógica pesada 
 * está no github-service.ts
 */
export function mapGitHubReposToProjects(
  repos: GitHubRepo[],
  username: string
): ProcessedProject[] {
  return processRepositories(repos, username);
}
