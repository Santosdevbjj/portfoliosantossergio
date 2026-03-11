import { cache } from "react"

import type { GitHubRepo } from "@/types/github"

const GITHUB_API =
  "https://api.github.com"

export const getPortfolioRepos = cache(
  async (
    username: string
  ): Promise<GitHubRepo[]> => {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&type=owner&sort=updated`,
      {
        headers: {
          Accept:
            "application/vnd.github+json",
        },

        next: {
          revalidate: 3600,
        },
      }
    )

    if (!res.ok) {
      throw new Error(
        `GitHub API error: ${res.status}`
      )
    }

    return res.json()
  }
)
