/**
 * LIB: GitHub Integration
 * -----------------------------------------------------------------------------
 * Camada de acesso ao GitHub.
 * Responsável apenas por:
 * - Buscar dados
 * - Normalizar para o domínio
 * - Aplicar regras canônicas (projects.ts)
 *
 * NÃO renderiza UI
 * NÃO contém textos hardcoded
 */

import type { Locale } from '@/app/[lang]/dictionaries';
import {
  Project,
  ProjectCoreTag,
  ProjectTechnology,
  resolveProjectFlags,
  resolveProjectTechnology,
  sortProjects,
} from '@/domain/projects';

/* -------------------------------------------------------------------------- */
/* RAW GITHUB MODELS                                                          */
/* -------------------------------------------------------------------------- */

interface RawGitHubRepo {
  id: number;
  name: string;
  fork: boolean;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  updated_at: string;
  stargazers_count: number;
}

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

const GITHUB_USERNAME = 'Santosdevbjj';
const REVALIDATE_SECONDS = 3600;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Extrai descrição conforme idioma.
 * Padrão obrigatório:
 * PT | EN | ES
 */
function resolveDescription(
  raw: string | null,
  lang: Locale,
): string {
  if (!raw) return '';

  if (!raw.includes('|')) return raw;

  const [pt, en, es] = raw.split('|').map((p) => p.trim());

  switch (lang) {
    case 'en':
      return en || pt;
    case 'es':
      return es || pt;
    case 'pt':
    default:
      return pt;
  }
}

/**
 * Normaliza nome do repositório
 */
function normalizeName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* -------------------------------------------------------------------------- */
/* MAIN SERVICE                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Retorna projetos do portfólio normalizados e tipados
 */
export async function getGitHubProjects(
  lang: Locale,
): Promise<Project[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;

  const url = token
    ? 'https://api.github.com/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner'
    : `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-sergio-santos',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(
        `[GitHub] Erro ${response.status} ao buscar repositórios`,
      );
      return [];
    }

    const repos = (await response.json()) as RawGitHubRepo[];
    if (!Array.isArray(repos)) return [];

    const projects: Project[] = repos
      .filter(
        (repo) =>
          !repo.fork &&
          repo.topics?.includes(ProjectCoreTag.PORTFOLIO),
      )
      .map((repo) => {
        const topics = repo.topics ?? [];

        const technology = resolveProjectTechnology(topics);

        if (!technology) {
          throw new Error(
            `[GitHub] Repositório sem tecnologia mapeada: ${repo.name}`,
          );
        }

        const flags = resolveProjectFlags(topics);

        return {
          id: String(repo.id),
          name: normalizeName(repo.name),
          description: resolveDescription(repo.description, lang),
          htmlUrl: repo.html_url,
          homepage: repo.homepage,
          topics,

          technology,
          ...flags,
        };
      })
      .sort(sortProjects);

    return projects;
  } catch (error) {
    console.error('[GitHub] Falha crítica na integração', error);
    return [];
  }
}
