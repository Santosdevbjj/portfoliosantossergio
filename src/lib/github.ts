/**
 * Interface rigorosa para os dados do GitHub.
 * Sincronizada com ProjectCard para evitar erros de build 'Property missing'.
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
 * SERVIÇO DE INTEGRAÇÃO GITHUB (Server-Side Only)
 * Busca, filtra e ordena repositórios com lógica de prioridade.
 */
export async function getGitHubProjects(lang: string = 'pt'): Promise<GitHubRepo[]> {
  /**
   * CORREÇÃO CRÍTICA PARA VERCEL:
   * Em configurações rigorosas de TS (Index Signature), o acesso deve ser via ['CHAVE'].
   */
  const token = process.env['GITHUB_ACCESS_TOKEN'];
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
     */
    const filteredRepos = repos
      .filter((repo: any) => !repo.fork && repo.topics?.includes("portfolio"))
      .map((repo: any): GitHubRepo => {
        // Lógica de Tradução de Descrição via Pipe (|)
        // Ordem esperada na descrição do GitHub: PT (0) | EN (1) | ES (2)
        let finalDescription = repo.description ?? "";
        
        if (finalDescription.includes('|')) {
          const parts = finalDescription.split('|').map((p: string) => p.trim());
          if (lang === 'en' && parts[1]) finalDescription = parts[1];
          else if (lang === 'es' && parts[2]) finalDescription = parts[2];
          else finalDescription = parts[0];
        }

        return {
          id: repo.id,
          name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '), 
          description: finalDescription || null,
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
        if (topics.includes('destaque') || topics.includes('featured') || topics.includes('primeiro')) return 2;
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
