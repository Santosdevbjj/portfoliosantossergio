export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
}

const GITHUB_API_URL = 'https://api.github.com'

export async function fetchUserRepos(
  username: string,
): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}/repos`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
      },
      next: {
        revalidate: 3600,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status}`,
    )
  }

  const data = (await response.json()) as GitHubRepo[]

  return data
}
