// src/lib/github.ts

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string; // Mantido o nome original da API para evitar erros de mapeamento
  homepage: string | null;
  topics: string[];
  updated_at: string; // Padronizado com o que a API envia e o componente espera
}

export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Santosdevbjj';
  const token = process.env.GITHUB_ACCESS_TOKEN;

  // No Next.js 15, o fetch é cacheado no servidor. 
  // Revalidamos a cada 3600 segundos (1 hora).
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          ...(token && { Authorization: `token ${token}` }), // GitHub aceita 'token' ou 'Bearer'
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Data-Science-Sergio',
        },
        next: { revalidate: 3600 }, 
      }
    );

    if (response.status === 403) {
      console.warn("GitHub API Rate Limit atingido. Verifique seu GITHUB_ACCESS_TOKEN.");
      return [];
    }

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    const repos: any[] = await response.json();

    if (!Array.isArray(repos)) return [];

    // Filtro e Mapeamento Rigoroso
    return repos
      .filter((repo) => repo.topics?.includes("portfolio"))
      .map((repo) => ({
        id: repo.id,
        name: repo.name.replace(/-/g, ' '), // Formata nome-do-repo para Nome Do Repo
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
      }));
    
  } catch (error) {
    // Em produção, aqui você enviaria o erro para o Sentry ou LogDNA
    console.error("Falha ao buscar projetos do GitHub:", error);
    return [];
  }
}
