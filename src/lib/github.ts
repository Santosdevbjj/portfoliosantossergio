import type { Locale } from '@/i18n-config';
import { ProjectCoreTag, resolveProjectFlags, resolveProjectTechnology } from '@/domain/projects';
import type { Project } from '@/domain/projects';

const TECH_ORDER = [
  'data-science', 
  'azure-databricks', 
  'neo4j', 
  'power-bi', 
  'excel', 
  'database', 
  'python', 
  'dotnet', 
  'java', 
  'machine-learning', 
  'artificial-intelligence', 
  'aws', 
  'cybersecurity', 
  'programming-logic', 
  'html', 
  'node-react'
];

export async function getGitHubProjects(lang: Locale): Promise<Project[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const url = `https://api.github.com/users/Santosdevbjj/repos?per_page=100&sort=updated`;

  try {
    const res = await fetch(url, {
      headers: { 
        Accept: 'application/vnd.github+json', 
        ...(token && { Authorization: `Bearer ${token}` }) 
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) return [];
    const repos = await res.json();

    return repos
      .filter((r: any) => !r.fork && r.topics?.includes(ProjectCoreTag.PORTFOLIO))
      .map((repo: any) => {
        const topics = repo.topics || [];
        const tech = resolveProjectTechnology(topics);
        if (!tech) return null;

        // Lógica de descrição baseada no Locale
        const langIndex = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2;
        const description = repo.description?.split('|')[langIndex]?.trim() || '';

        const flags = resolveProjectFlags(topics);

        return {
          id: String(repo.id),
          name: repo.name.replace(/[-_]/g, ' '),
          description,
          htmlUrl: repo.html_url,
          homepage: repo.homepage,
          topics,
          technology: tech,
          ...flags
        } as Project;
      })
      .filter((p: Project | null): p is Project => p !== null)
      .sort((a: Project, b: Project) => {
        // Tipagem explícita dos parâmetros e das propriedades estendidas
        const aAny = a as any;
        const bAny = b as any;

        const featA = aAny.isFirst ? -1 : aAny.isFeatured ? -0.5 : 0;
        const featB = bAny.isFirst ? -1 : bAny.isFeatured ? -0.5 : 0;

        if (featA !== featB) return featA - featB;
        
        const indexA = TECH_ORDER.indexOf(a.technology.id);
        const indexB = TECH_ORDER.indexOf(b.technology.id);
        
        return indexA - indexB;
      });
  } catch (e) {
    console.error('[GitHub] Error fetching projects:', e);
    return [];
  }
}
