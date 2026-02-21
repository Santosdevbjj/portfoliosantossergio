// src/lib/github.ts

import type { Locale } from '@/types/dictionary';
import {
  ProjectCoreTag,
  resolveProjectFlags,
  resolveProjectTechnology,
} from '@/domain/projects';

import type {
  Project,
  ProjectCategory,
  ProjectLocaleContent,
  ProjectSEO,
} from '@/types/project';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  created_at?: string;
  updated_at?: string;
}

const GITHUB_USERNAME = 'Santosdevbjj';
const REVALIDATE_TIME = 3600;
const REQUEST_TIMEOUT = 4000;

/**
 * Resolve descrição multilíngue baseada no locale.
 * Formato esperado:
 * "pt | en | es"
 */
function resolveDescriptionByLocale(
  description: string | null,
  locale: Locale
): string {
  if (!description) return '';

  const parts = description.split('|').map((p) => p.trim());

  const localeMap: Record<Locale, number> = {
    'pt-BR': 0,
    'en-US': 1,
    'es-ES': 2,
    'es-AR': 2,
    'es-MX': 2,
  };

  const index = localeMap[locale] ?? 0;

  return parts[index] ?? parts[0] ?? '';
}

/**
 * Resolve categoria baseada nos tópicos.
 * Deve bater com projects.categories do dicionário.
 */
function resolveProjectCategory(topics: string[]): ProjectCategory {
  const categories: readonly ProjectCategory[] = [
    'dataScience',
    'cloud',
    'graphs',
    'analysis',
    'excel',
    'database',
    'dev',
    'security',
  ];

  for (const cat of categories) {
    if (topics.includes(cat)) {
      return cat;
    }
  }

  return 'dev';
}

/**
 * Garante que "pt-BR" sempre exista,
 * respeitando o contrato de LocalizedContent<T>
 */
function buildLocalizedContent<T>(
  locale: Locale,
  value: T
): { 'pt-BR': T } & Partial<Record<Exclude<Locale, 'pt-BR'>, T>> {
  return {
    'pt-BR': value,
    ...(locale !== 'pt-BR' && { [locale]: value }),
  };
}

/**
 * Busca projetos do GitHub
 * Compatível com:
 * - Next.js 16
 * - TypeScript 6 strict
 */
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      console.error('[GitHub API] Unexpected response format.');
      return [];
    }

    const projects: Project[] = [];

    for (const repo of data as GitHubRepo[]) {
      if (
        repo.fork ||
        !Array.isArray(repo.topics) ||
        !repo.topics.includes(ProjectCoreTag.PORTFOLIO)
      ) {
        continue;
      }

      const technology = resolveProjectTechnology(repo.topics);
      if (!technology) continue;

      const normalizedTitle = repo.name.replace(/[-_]/g, ' ');
      const localizedDescription = resolveDescriptionByLocale(
        repo.description,
        locale
      );

      const category = resolveProjectCategory(repo.topics);

      const localeContent: ProjectLocaleContent = {
        title: normalizedTitle,
        description: localizedDescription,
      };

      const localeSEO: ProjectSEO = {
        title: normalizedTitle,
        description: localizedDescription,
        keywords: repo.topics,
      };

      const content = buildLocalizedContent(locale, localeContent);
      const seo = buildLocalizedContent(locale, localeSEO);

      const project: Project = {
        id: String(repo.id),
        slug: repo.name,
        category,
        featured: false,
        order: 0,
        status: 'active',
        content,
        seo,
        stack: [technology.id],
        links: {
          repository: repo.html_url,
          demo: repo.homepage ?? undefined,
        },
        createdAt: repo.created_at ?? new Date().toISOString(),
        updatedAt: repo.updated_at ?? undefined,
        ...resolveProjectFlags(repo.topics),
      };

      projects.push(project);
    }

    return projects;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[GitHub API] Request timeout.');
    } else {
      console.error('[GitHub API] Unexpected error:', error);
    }

    return [];
  }
}
