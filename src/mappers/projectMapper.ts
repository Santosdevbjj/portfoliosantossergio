import type { GitHubRepo } from '@/services/githubService'
import type { Project } from '@/domain/project'
import { resolveProjectTechnology } from '@/domain/technology'
 
export function mapGitHubRepoToProject(
  repo: GitHubRepo,
): Project {
  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description ?? '',
    url: repo.html_url,
    homepage: repo.homepage ?? null,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language ?? null,
    updatedAt: repo.updated_at,
    technology: resolveProjectTechnology(repo),
  }
}
