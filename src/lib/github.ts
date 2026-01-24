/**
 * Serviço central de integração com GitHub
 * Totalmente tipado, multilingue (PT/EN/ES) e resiliente
 */

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
}

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

/**
 * BUSCA REPOSITÓRIOS DO GITHUB
 * @param lang - Idioma ('pt' | 'en' | 'es')
 */
export async function getGitHubProjects(
  lang: 'pt' | 'en' | 'es' = 'pt'
): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = 'Santosdevbjj';

  const url = token
    ? `https://api.github.com/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner`
    : `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sergio-Santos-Data-Science',
      },
      next: { revalidate: 3600 }, // Cache 1 hora
    });

    if (!response.ok) {
      console.error(`[GitHub Service] Erro ${response.status} ao buscar repositórios`);
      return [];
    }

    const repos = (await response.json()) as RawGitHubRepo[];
    if (!Array.isArray(repos)) return [];

    // ---------------------------------------------------
    // FILTRAGEM E TRADUÇÃO MULTILINGUE
    // ---------------------------------------------------
    const processedRepos: GitHubRepo[] = repos
      .filter((repo) => !repo.fork && repo.topics?.includes('portfolio'))
      .map((repo) => {
        // MULTILÍNGUE: "Descrição PT | Descrição EN | Descrição ES"
        let description = repo.description ?? '';
        if (description.includes('|')) {
          const parts = description.split('|').map((p) => p.trim());
          if (lang === 'en') description = parts[1] || parts[0];
          else if (lang === 'es') description = parts[2] || parts[0];
          else description = parts[0];
        }

        return {
          id: repo.id,
          name: repo.name
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          description: description.length > 0 ? description : null,
          html_url: repo.html_url,
          homepage: repo.homepage ?? null,
          topics: repo.topics ?? [],
          updated_at: repo.updated_at,
          stargazers_count: repo.stargazers_count ?? 0,
        };
      });

    // ---------------------------------------------------
    // ORDENAÇÃO POR PESO / Destaque / Recência
    // ---------------------------------------------------
    return processedRepos.sort((a, b) => {
      const weight = (repo: GitHubRepo) => {
        let w = 0;
        const topics = repo.topics.map((t) => t.toLowerCase());
        if (topics.includes('featured') || topics.includes('destaque')) w += 100;
        if (topics.includes('data-science')) w += 50;
        if (topics.includes('python') || topics.includes('azure')) w += 20;
        return w;
      };

      const diff = weight(b) - weight(a);
      if (diff !== 0) return diff;

      // fallback por data de atualização
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  } catch (error) {
    console.error('[GitHub Service] Falha crítica na integração', error);
    return [];
  }
}
