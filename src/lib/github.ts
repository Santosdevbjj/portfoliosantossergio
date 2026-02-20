// src/lib/github.ts

import type { Locale } from '@/types/dictionary';
import {
  ProjectCoreTag,
  resolveProjectFlags,
  resolveProjectTechnology,
} from '@/domain/projects';
import type { Project } from '@/domain/projects';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
}

const GITHUB_USERNAME = 'Santosdevbjj';
const REVALIDATE_TIME = 3600; // 1h
const REQUEST_TIMEOUT = 4000;

function resolveDescriptionByLocale(
  description: string | null,
  locale: Locale
): string {
  if (!description) return '';

  /**
   * Formato esperado no GitHub:
   * pt | en | es
   */
  const parts = description.split('|').map((p) => p.trim());

  const localeMap: Record<string, number> = {
    'pt-BR': 0,
    'en-US': 1,
    'es-ES': 2,
    'es-AR': 2,
    'es-MX': 2,
  };

  const index = localeMap[locale] ?? 0;

  return parts[index] ?? parts[0] ?? '';
}

export async function getGitHubProjects(
  locale: Locale
): Promise<Project[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token && { Authorization: `Bearer ${token}` }),
          'User-Agent': 'portfolio-sergio-santos',
        },
        next: { revalidate: REVALIDATE_TIME },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[GitHub API] Status:', response.status);
      return [];
    }

    const repos: unknown = await response.json();

    if (!Array.isArray(repos)) {
      console.error('[GitHub API] Unexpected response format.');
      return [];
    }

    const typedRepos = repos as GitHubRepo[];

    return typedRepos
      .filter(
        (repo) =>
          !repo.fork &&
          Array.isArray(repo.topics) &&
          repo.topics.includes(ProjectCoreTag.PORTFOLIO)
      )
      .map((repo) => {
        const technology = resolveProjectTechnology(repo.topics);

        if (!technology) return null;

        return {
          id: String(repo.id),
          name: repo.name.replace(/[-_]/g, ' '),
          description: resolveDescriptionByLocale(
            repo.description,
            locale
          ),
          htmlUrl: repo.html_url,
          homepage: repo.homepage ?? undefined,
          topics: repo.topics,
          technology,
          ...resolveProjectFlags(repo.topics),
        } satisfies Project;
      })
      .filter((project): project is Project => project !== null);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[GitHub API] Request timeout.');
    } else {
      console.error('[GitHub API] Unexpected error:', error);
    }

    return [];
  }
}
