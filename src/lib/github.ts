// src/lib/github.ts

/**
 * Interface rigorosa para os dados do GitHub.
 * Garante que o TypeScript valide o contrato de dados entre a API e a UI.
 */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string; // Garantimos string para evitar erros de tipagem na UI
  html_url: string;
  homepage: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
}

/**
 * SERVIÇO DE INTEGRAÇÃO GITHUB (Server-Side Only)
 * Busca, filtra e ordena repositórios com lógica de prioridade.
 */
export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = "Santosdevbjj";
  
  // URL dinâmica baseada na presença do Token (Segurança e Limite de Requisições)
  const url = token 
    ? `https://api.github.com/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner`
    : `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }), // Padrão Bearer recomendado
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sergio-Santos-Data-Science',
      },
      /**
       * NEXT.JS 15 CACHING (ISR)
       * Revalidação em background a cada 1 hora. 
       * Mantém o site rápido mesmo se a API do GitHub estiver lenta.
       */
      next: { revalidate: 3600 }, 
    });

    if (!response.ok) {
      console.error(`[GitHub Error] Status: ${response.status} para o usuário ${username}`);
      return []; 
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      console.warn("[GitHub Warning] Resposta da API inválida.");
      return [];
    }

    /**
     * FILTRAGEM E TRANSFORMAÇÃO
     * 1. Remove forks.
     * 2. Filtra apenas projetos com a tag 'portfolio'.
     */
    const filteredRepos = repos
      .filter((repo: any) => !repo.fork && repo.topics?.includes("portfolio"))
      .map((repo: any): GitHubRepo => ({
        id: repo.id,
        name: repo.name, 
        description: repo.description ?? "", // Fallback para string vazia (Evita erro de build)
        html_url: repo.html_url,
        homepage: repo.homepage ?? null,
        topics: repo.topics ?? [],
        updated_at: repo.updated_at,
        stargazers_count: repo.stargazers_count ?? 0,
      }));

    /**
     * ORDENAÇÃO ESTRATÉGICA (Ranking System)
     * Prioridade máxima para tags específicas de destaque.
     */
    return filteredRepos.sort((a, b) => {
      const getWeight = (repo: GitHubRepo) => {
        if (repo.topics.includes('primeiro')) return 2;
        if (repo.topics.includes('destaque')) return 1;
        return 0;
      };

      const weightA = getWeight(a);
      const weightB = getWeight(b);

      if (weightA !== weightB) {
        return weightB - weightA;
      }

      // Critério de desempate: Data de atualização
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    
  } catch (error) {
    // Degradação graciosa: Loga o erro mas retorna array vazio para não quebrar a página
    console.error("[GitHub Fatal Error] Falha na conexão:", error);
    return [];
  }
}
