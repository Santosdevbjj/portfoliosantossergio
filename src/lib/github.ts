// src/lib/github.ts

/**
 * Interface rigorosa para os dados do GitHub.
 * Alinhada com as necessidades do ProjectCard e PortfolioGrid.
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
 * EXTRAÇÃO E TRATAMENTO DE DADOS (ETL)
 * Busca os repositórios do GitHub com foco em performance e segurança.
 * No Next.js 15, esta função roda no servidor durante a geração das páginas.
 */
export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = "Santosdevbjj";
  
  // Rota autenticada tem limite maior (5000 req/hora). 
  // Se o token não estiver no .env, usa a API pública (limite 60 req/hora).
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
      // Revalidação ISR (Incremental Static Regeneration)
      // O Next.js manterá uma versão em cache e atualizará em background a cada 1 hora.
      next: { revalidate: 3600 }, 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GitHub API Error] Status: ${response.status} | Context: ${errorText}`);
      return []; 
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      console.warn("[GitHub API Warning] Response is not an array. Check username or token.");
      return [];
    }

    /**
     * TRANSFORMAÇÃO E FILTRAGEM
     * 1. Removemos forks (foco em autoria própria).
     * 2. Exigimos a tag 'portfolio' para aparecer no site.
     * 3. Mapeamos apenas os campos necessários para reduzir o payload.
     */
    const filteredRepos = repos
      .filter((repo) => !repo.fork && repo.topics?.includes("portfolio"))
      .map((repo) => ({
        id: repo.id,
        name: repo.name, 
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        stargazers_count: repo.stargazers_count,
      }));

    // Ordenação final: Repositórios com 'primeiro' ou 'destaque' no topo, 
    // seguidos pelos mais recentes.
    return filteredRepos.sort((a, b) => {
      if (a.topics.includes('primeiro')) return -1;
      if (b.topics.includes('primeiro')) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    
  } catch (error) {
    console.error("[GitHub API Fatal Error] Connection failed:", error);
    return []; // Graceful degradation: o site continua no ar mesmo sem projetos
  }
}
