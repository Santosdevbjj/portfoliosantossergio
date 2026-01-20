// src/lib/github.ts

/**
 * Interface rigorosa para os dados do GitHub.
 * Garante que o TypeScript valide o contrato de dados entre a API e a UI.
 */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
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
export async function getGitHubProjects(lang: string = 'pt'): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = "Santosdevbjj";
  
  // URL dinâmica baseada na presença do Token (Segurança e Limite de Requisições)
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
      /**
       * NEXT.JS 15 CACHING (ISR)
       * Revalidação em background a cada 1 hora.
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
     * FILTRAGEM E TRANSFORMAÇÃO MULTILINGUE
     * 1. Remove forks.
     * 2. Filtra apenas projetos com a tag 'portfolio'.
     * 3. Trata descrições multilingues (formato: "Desc PT | Desc EN | Desc ES")
     */
    const filteredRepos = repos
      .filter((repo: any) => !repo.fork && repo.topics?.includes("portfolio"))
      .map((repo: any): GitHubRepo => {
        // Lógica de Tradução de Descrição via Pipe (|)
        let finalDescription = repo.description ?? "";
        if (finalDescription.includes('|')) {
          const parts = finalDescription.split('|').map((p: string) => p.trim());
          // Ordem esperada na descrição do GitHub: PT (0) | EN (1) | ES (2)
          if (lang === 'en' && parts[1]) finalDescription = parts[1];
          else if (lang === 'es' && parts[2]) finalDescription = parts[2];
          else finalDescription = parts[0];
        }

        return {
          id: repo.id,
          name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '), // Nome mais limpo para UI
          description: finalDescription,
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
        if (repo.topics.includes('destaque') || repo.topics.includes('featured')) return 2;
        if (repo.topics.includes('data-science')) return 1;
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
