// src/mappers/projectMapper.ts
import type { GitHubRepo } from "@/services/githubService";
import type { ProjectDomain } from "@/domain/projects";
import {
  resolveProjectTechnology,
  resolveProjectFlags,
} from "@/domain/projects";

export function mapGitHubRepoToProject(
  repo: GitHubRepo,
): ProjectDomain {
  const technology = resolveProjectTechnology(repo.topics ?? []);
  const flags = resolveProjectFlags(repo.topics ?? []);

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description ?? "",
    htmlUrl: repo.html_url,
    homepage: repo.homepage ?? null,
    topics: repo.topics ?? [],
    technology,
    ...flags,
  };
}
