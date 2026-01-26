/**
 * LIB: GitHub Integration
 * -----------------------------------------------------------------------------
 * Ajustada para respeitar as regras de:
 * 1. Projeto "Primeiro" (Cabeça absoluta)
 * 2. Projetos "Destaque" (Featured)
 * 3. Ordem rigorosa por tecnologia definida pelo usuário.
 */

import type { Locale } from '@/i18n-config'; // Ajustado para seu arquivo de config
import {
  Project,
  ProjectCoreTag,
  resolveProjectFlags,
  resolveProjectTechnology,
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
}

const GITHUB_USERNAME = 'Santosdevbjj';
const REVALIDATE_SECONDS = 3600; // 1 hora

/**
 * ORDEM DE TECNOLOGIAS (Soberana)
 * Definida por Sérgio Santos para o Repositório de Projetos
 */
const TECH_ORDER = [
  'ciencia-de-dados',
  'azure-databricks',
  'neo4j',
  'power-bi',
  'excel',
  'database',
  'python',
  'csharp',
  'dotnet',
  'java',
  'machine-learning',
  'artificial-intelligence',
  'amazon-aws',
  'cybersecurity',
  'logica-de-programacao',
  'html',
  'node',
  'react'
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function resolveDescription(raw: string | null, lang: Locale): string {
  if (!raw) return '';
  if (!raw.includes('|')) return raw.trim();
  const parts = raw.split('|').map((p) => p.trim());
  
  const dictionary: Record<string, string | undefined> = {
    pt: parts[0],
    en: parts[1],
    es: parts[2],
  };

  return dictionary[lang] || dictionary.pt || parts[0] || '';
}

function normalizeName(name: string): string {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * LÓGICA DE ORDENAÇÃO (Sérgio Santos Rules)
 */
function sortProjects(a: Project, b: Project): number {
  // 1. Regra de Ouro: Tag 'primeiro' sempre no topo
  if (a.topics.includes('primeiro')) return -1;
  if (b.topics.includes('primeiro')) return 1;

  // 2. Segunda Prioridade: Tag 'destaque' ou 'featured'
  const aIsFeatured = a.topics.includes('destaque') || a.topics.includes('featured');
  const bIsFeatured = b.topics.includes('destaque') || b.topics.includes('featured');
  if (aIsFeatured && !bIsFeatured) return -1;
  if (!aIsFeatured && bIsFeatured) return 1;

  // 3. Terceira Prioridade: Ordem por Tecnologia (TECH_ORDER)
  const indexA = TECH_ORDER.indexOf(a.technology.id);
  const indexB = TECH_ORDER.indexOf(b.technology.id);
  
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;

  return 0;
}

/* -------------------------------------------------------------------------- */
/* MAIN SERVICE                                                               */
/* -------------------------------------------------------------------------- */

export async function getGitHubProjects(lang: Locale): Promise<Project[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-sergio-santos',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return [];

    const repos = (await response.json()) as RawGitHubRepo[];
    
    return repos
      .filter(repo => !repo.fork && repo.topics?.includes(ProjectCoreTag.PORTFOLIO))
      .map(repo => {
        const topics = repo.topics ?? [];
        const technology = resolveProjectTechnology(topics);
        
        // Se não mapeamos a tecnologia, usamos 'outros' para não quebrar o build
        if (!technology) return null;

        return {
          id: String(repo.id),
          name: normalizeName(repo.name),
          description: resolveDescription(repo.description, lang),
          htmlUrl: repo.html_url,
          homepage: repo.homepage,
          topics,
          technology,
          ...resolveProjectFlags(topics),
        };
      })
      .filter((p): p is Project => p !== null)
      .sort(sortProjects);

  } catch (error) {
    console.error('[GitHub] Falha na integração', error);
    return [];
  }
}
