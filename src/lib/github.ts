// src/lib/github.ts

/**
 * Interface rigorosa para os dados do GitHub.
 * Alinhada com as necessidades do ProjectCard (Framework Meigarom).
 */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  updated_at: string;
}

/**
 * EXTRAÇÃO DE DADOS (ETL)
 * Busca os repositórios do GitHub com foco em performance e segurança.
 */
export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = "Santosdevbjj";
  
  // Rota autenticada tem limite de 5000 req/hora, pública apenas 60.
  const url = token 
    ? `https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner`
    : `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sergio-Data-Science-V2',
      },
      // Next.js 15: Cache persistente com revalidação automática a cada 1 hora
      next: { revalidate: 3600 }, 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GitHub API] Erro: ${response.status} - ${errorText}`);
      return []; 
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      console.warn("[GitHub API] Formato de resposta inesperado (não é um array).");
      return [];
    }

    /**
     * TRANSFORMAÇÃO DE DADOS
     * 1. Filtramos apenas repositórios com a tag 'portfolio'.
     * 2. Limpamos os dados para o formato esperado pelos nossos componentes.
     */
    return repos
      .filter((repo) => repo.topics?.includes("portfolio"))
      .map((repo) => ({
        id: repo.id,
        // Mantemos o nome original ou formatado conforme a necessidade da UI
        name: repo.name, 
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
      }));
    
  } catch (error) {
    console.error("[GitHub API] Erro fatal na conexão:", error);
    return []; // Graceful degradation: o site continua no ar mesmo sem projetos
  }
}
