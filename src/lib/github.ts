import type { Locale } from '@/i18n-config';
import { ProjectCoreTag, resolveProjectFlags, resolveProjectTechnology } from '@/domain/projects';
import type { Project } from '@/domain/projects';

export async function getGitHubProjects(lang: Locale): Promise<Project[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const url = `https://api.github.com/users/Santosdevbjj/repos?per_page=100&sort=updated`;

  // Criamos um controle de interrupção (Timeout manual de 4 segundos)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      headers: { 
        'Accept': 'application/vnd.github+json', 
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'User-Agent': 'Portfolio-Vercel'
      },
      next: { revalidate: 3600 },
      signal: controller.signal // Conecta o timeout à requisição
    });

    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const repos = await res.json();
    if (!Array.isArray(repos)) return [];

    return repos
      .filter((r: any) => !r.fork && r.topics?.includes(ProjectCoreTag.PORTFOLIO))
      .map((repo: any) => {
        const topics = repo.topics || [];
        const tech = resolveProjectTechnology(topics);
        if (!tech) return null;

        const langIndex = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2;
        const parts = repo.description?.split('|') || [];
        const description = parts[langIndex]?.trim() || repo.description || '';

        return {
          id: String(repo.id),
          name: repo.name.replace(/[-_]/g, ' '),
          description,
          htmlUrl: repo.html_url,
          homepage: repo.homepage,
          topics,
          technology: tech,
          ...resolveProjectFlags(topics)
        } as Project;
      })
      .filter((p): p is Project => p !== null);

  } catch (e: any) {
    if (e.name === 'AbortError') {
      console.error('[GitHub] Timeout: API demorou demais para responder.');
    } else {
      console.error('[GitHub] Erro na busca:', e);
    }
    return []; // Retorna vazio mas NÃO deixa a função da Vercel estourar o tempo
  }
}
