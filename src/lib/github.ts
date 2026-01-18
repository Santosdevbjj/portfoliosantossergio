// src/lib/github.ts

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  updated_at: string;
}

export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  
  // Rota otimizada: 'user/repos' busca os repositórios do dono do token (mais estável)
  // Se não houver token, ele usará a rota pública como fallback
  const url = token 
    ? `https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner`
    : `https://api.github.com/users/Santosdevbjj/repos?sort=updated&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }), // Mudança para Bearer
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sergio-Data-Science',
      },
      // Revalidação de 1 hora (Next.js 15 Cache)
      next: { revalidate: 3600 }, 
    });

    // Se o token estiver expirado ou errado (401/403), não derruba o site
    if (!response.ok) {
      console.error(`GitHub API Error: ${response.status} na rota ${url}`);
      return []; 
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) return [];

    // Filtro: Apenas repositórios com a tag 'portfolio'
    return repos
      .filter((repo) => repo.topics?.includes("portfolio"))
      .map((repo) => ({
        id: repo.id,
        name: repo.name.replace(/-/g, ' '), 
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
      }));
    
  } catch (error) {
    console.error("Erro fatal no fetch do GitHub:", error);
    return []; // Retorna lista vazia para a página carregar (mesmo sem projetos)
  }
}
