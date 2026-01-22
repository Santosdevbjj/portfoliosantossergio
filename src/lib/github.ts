/**
 * Interface rigorosa para os dados do GitHub.
 * Sincronizada com ProjectCard para evitar erros de build.
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

/**
 * Interface para a resposta bruta da API do GitHub (Evita o erro de 'any')
 */
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
 * SERVIÇO DE INTEGRAÇÃO GITHUB (Server-Side Only)
 * Busca, filtra e ordena repositórios com lógica de prioridade.
 */
export async function getGitHubProjects(lang: string = 'pt'): Promise<GitHubRepo[]> {
  const token = process.env['GITHUB_ACCESS_TOKEN'];
  const username = "Santosdevbjj";
  
  const url = token 
    ? `https://api.github.com/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner`
    : `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sergio-Santos-Data-Science',
      },
      next: { revalidate: 3600 }, 
    });

    if (!response.ok) {
      console.error(`[GitHub Error] Status: ${response.status} para o usuário ${username}`);
      return []; 
    }

    const repos = (await response.json()) as RawGitHubRepo[];

    if (!Array.isArray(repos)) {
      console.warn("[GitHub Warning] Resposta da API inválida.");
      return [];
    }

    /**
     * FILTRAGEM E TRANSFORMAÇÃO MULTILINGUE
     * 1. Remove forks.
     * 2. Filtra apenas projetos com a tag 'portfolio'.
     */
    const filteredRepos = repos
      .filter((repo) => !repo.fork && (repo.topics?.includes("portfolio") ?? false))
      .map((repo): GitHubRepo => {
        // Lógica de Tradução de Descrição via Pipe (|)
        // Ordem esperada: PT | EN | ES
        let finalDescription = repo.description ?? "";
        
        if (finalDescription.includes('|')) {
          const parts = finalDescription.split('|').map((p) => p.trim());
          if (lang === 'en' && (parts[1] ?? "").length > 0) {
            finalDescription = parts[1] ?? "";
          } else if (lang === 'es' && (parts[2] ?? "").length > 0) {
            finalDescription = parts[2] ?? "";
          } else {
            finalDescription = parts[0] ?? "";
          }
        }

        return {
          id: repo.id,
          name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '), 
          description: finalDescription.length > 0 ? finalDescription : null,
          html_url: repo.html_url,
          homepage: repo.homepage ?? null,
          topics: repo.topics ?? [],
          updated_at: repo.updated_at,
          stargazers_count: repo.stargazers_count ?? 0,
        };
      });

    /**
     * ORDENAÇÃO ESTRATÉGICA (Ranking System)
     */
    return filteredRepos.sort((a, b) => {
      const getWeight = (repo: GitHubRepo) => {
        const topics = repo.topics.map(t => t.toLowerCase());
        // Prioridade máxima para tags 'featured' ou 'destaque'
        if (topics.includes('featured') || topics.includes('destaque')) return 2;
        if (topics.includes('data-science') || topics.includes('python')) return 1;
        return 0;
      };

      const weightA = getWeight(a);
      const weightB = getWeight(b);

      if (weightA !== weightB) return weightB - weightA;

      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    
  } catch (error) {
    console.error("[GitHub Fatal Error] Falha na conexão:", error);
    return [];
  }
}
