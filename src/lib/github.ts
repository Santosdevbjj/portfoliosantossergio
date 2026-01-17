// src/lib/github.ts

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  updatedAt: string;
}

export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  // Use variáveis de ambiente SEM NEXT_PUBLIC para o Token (Segurança Máxima)
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Santosdevbjj';
  const token = process.env.GITHUB_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Portfolio-Sergio-Santos', // Boa prática para API do GitHub
        },
        // No Next.js 15, o fetch é estático por padrão. 
        // Aqui configuramos o revalidate para 1 hora (3600s)
        next: { revalidate: 3600 }, 
      }
    );

    if (!response.ok) {
      console.error(`Erro GitHub: ${response.status} ${response.statusText}`);
      return [];
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      console.error("Resposta do GitHub não é um array");
      return [];
    }

    // Filtra repositórios que tenham o tópico 'portfolio'
    return repos
      .filter((repo: any) => repo.topics?.includes("portfolio"))
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        // Mapeamos para camelCase para facilitar o uso no frontend
        updatedAt: repo.updated_at, 
      }));
    
  } catch (error) {
    console.error("Erro na conexão com GitHub:", error);
    return [];
  }
}
