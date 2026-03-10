// src/services/githubService.ts

import { Octokit } from "octokit";
import { RequestError } from "octokit";

import { processRepositories } from "@/lib/github-service";

import type { ProcessedProject, GitHubRepo } from "@/types/github";

/**
 * SERVIÇO UNIFICADO GITHUB
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16
 * ✔ Node 24
 * ✔ Octokit
 * ✔ Paginação automática
 * ✔ Resiliência a erros
 */

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    timeout: 7000,
  },
});

const DEFAULT_USERNAME = "Santosdevbjj";

export async function getGitHubProjects(
  username: string = DEFAULT_USERNAME
): Promise<ProcessedProject[]> {

  if (!username) {
    console.warn("⚠️ GitHub Service: Username não definido.");
    return [];
  }

  try {
    const reposList: GitHubRepo[] = [];

    const iterator = octokit.paginate.iterator(
      octokit.rest.repos.listForUser,
      {
        username,
        per_page: 100,
        sort: "updated",
        type: "owner",

        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
        },
      }
    );

    for await (const { data: repos } of iterator) {

      const normalizedRepos = (repos as unknown as GitHubRepo[]).map(repo => ({
        ...repo,
        topics: (repo.topics ?? []).map(t => t.toLowerCase())
      }));

      reposList.push(...normalizedRepos);
    }

    return processRepositories(reposList, username);

  } catch (error: unknown) {

    if (error instanceof RequestError) {

      console.error(
        `❌ GitHub API Error [${error.status}]: ${error.message}`
      );

      if (error.status === 403) {
        console.error(
          "🛑 Rate limit atingido. Configure GITHUB_TOKEN na Vercel."
        );
      }

    } else {
      console.error(
        "❌ Erro inesperado ao buscar repositórios:",
        error
      );
    }

    return [];
  }
}

/**
 * Aliases de compatibilidade
 */
export {
  getGitHubProjects as getProjects,
  getGitHubProjects as fetchUserRepos
};
