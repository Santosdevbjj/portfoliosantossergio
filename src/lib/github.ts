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
  const username = "Santosdevbjj";
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

  try {
    const res = await fetch(url, {
      headers: { 
        'Accept': 'application/vnd.github+json', 
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'User-Agent': 'portfolio-santos-sergio'
      },
      next: { revalidate: 3600 }
    });

    // Se a resposta não for 200 OK, retorna vazio em vez de estourar erro
    if (!res.ok) {
      console.error(`[GitHub API] Falha na requisição: ${res.status}`);
      return [];
    }

    const repos = await res.json();

    // Blindagem Crítica: Se 'repos' não for um array (ex: erro de quota), aborta graciosamente
    if (!Array.isArray(repos)) {
      console.error('[GitHub API] A resposta retornada não é um array de repositórios.');
      return [];
    }

    return repos
      .filter((r: any) => r && !r.fork && Array.isArray(r.topics) && r.topics.includes(ProjectCoreTag.PORTFOLIO))
      .map((repo: any) => {
        try {
          const topics = repo.topics || [];
          const tech = resolveProjectTechnology(topics);
          
          if (!tech) return null;

          // Lógica de descrição segura contra valores nulos ou curtos
          const langIndex = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2;
          const descriptionParts = repo.description?.split('|') || [];
          const description = descriptionParts[langIndex]?.trim() || repo.description || '';

          const flags = resolveProjectFlags(topics);

          return {
            id: String(repo.id),
            name: repo.name ? repo.name.replace(/[-_]/g, ' ') : 'Unnamed Project',
            description,
            htmlUrl: repo.html_url || '#',
            homepage: repo.homepage || null,
            topics,
            technology: tech,
            ...flags
          } as Project;
        } catch (mapError) {
          console.error(`[GitHub] Erro ao processar repositório individual:`, mapError);
          return null;
        }
      })
      .filter((p: Project | null): p is Project => p !== null)
      .sort((a: Project, b: Project) => {
        const aAny = a as any;
        const bAny = b as any;

        // Ordenação prioritária: isFirst > isFeatured > TECH_ORDER
        const weightA = aAny.isFirst ? -2 : aAny.isFeatured ? -1 : 0;
        const weightB = bAny.isFirst ? -2 : bAny.isFeatured ? -1 : 0;

        if (weightA !== weightB) return weightA - weightB;
        
        const indexA = TECH_ORDER.indexOf(a.technology.id);
        const indexB = TECH_ORDER.indexOf(b.technology.id);
        
        // Se a tecnologia não estiver na lista, joga para o final (99)
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      });
  } catch (e) {
    console.error('[GitHub] Erro crítico de rede ou processamento:', e);
    return [];
  }
}
