// src/services/githubService.ts

import { Octokit, RequestError } from "octokit"

import { processRepositories } from "@/lib/github-service"

import type {
  GitHubRepo,
  ProcessedProject,
} from "@/types/github"

/**
 * SERVIÇO UNIFICADO GITHUB
 */

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,

  userAgent:
    "sergio-santos-portfolio/1.0",

  request: {
    timeout: 7000,
  },
})

const DEFAULT_USERNAME =
  "Santosdevbjj"

export async function getGitHubProjects(
  username: string = DEFAULT_USERNAME
): Promise<ProcessedProject[]> {
  if (!username) {
    console.warn(
      "GitHub Service: username não definido"
    )
    return []
  }

  try {
    const reposList: GitHubRepo[] = []

    const iterator =
      octokit.paginate.iterator(
        octokit.rest.repos.listForUser,
        {
          username,

          per_page: 100,

          sort: "updated",

          type: "owner",

          headers: {
            "X-GitHub-Api-Version":
              "2022-11-28",

            Accept:
              "application/vnd.github+json",
          },
        }
      )

    for await (const {
      data: repos,
    } of iterator) {
      const normalized =
        repos.map((repo) => ({
          ...repo,

          topics: (
            repo.topics ?? []
          ).map((t) =>
            t.toLowerCase()
          ),
        })) as unknown as GitHubRepo[]

      reposList.push(...normalized)
    }

    return processRepositories(
      reposList,
      username
    )
  } catch (error) {
    if (error instanceof RequestError) {
      console.error(
        `GitHub API Error [${error.status}]`,
        error.message
      )

      if (error.status === 403) {
        console.error(
          "Rate limit atingido. Configure GITHUB_TOKEN."
        )
      }
    } else {
      console.error(
        "Erro inesperado GitHub:",
        error
      )
    }

    return []
  }
}

/**
 * Aliases
 */

export {
  getGitHubProjects as getProjects,
  getGitHubProjects as fetchUserRepos,
}
