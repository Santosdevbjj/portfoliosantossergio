// src/lib/github.ts

/**
 * Interface rigorosa para os dados do GitHub.
 * Garante que o TypeScript valide o contrato de dados entre a API e a UI.
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
 * Busca e filtra repositórios para demonstrar autoridade técnica.
 */
export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = "Santosdevbjj";
  
  // URL dinâmica: se houver token, acessa repositórios privados/organizações se necessário.
  // Caso contrário, busca apenas os públicos do usuário especificado.
  const url = token 
    ? `https://api.github.com/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner`
    : `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `token ${token}` }),
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sergio-Santos-Data-Science',
      },
      /**
       * NEXT.JS 15 CACHING (ISR)
       * O cache é mantido no servidor e revalidado a cada 1 hora.
       * Isso garante que o site seja ultrarrápido (não consulta a API a cada clique).
       */
      next: { revalidate: 3600 }, 
    });

    if (!response.ok) {
      console.error(`[GitHub Error] Status: ${response.status} para o usuário ${username}`);
      return []; 
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      console.warn("[GitHub Warning] Resposta da API não é um array.");
      return [];
    }

    /**
     * FILTRAGEM E MAPEAMENTO (Data Transformation)
     * 1. Ignoramos forks para mostrar apenas trabalho original.
     * 2. Exigimos a tag 'portfolio' (controle de qualidade do que aparece no site).
     */
    const filteredRepos = repos
      .filter((repo) => !repo.fork && repo.topics?.includes("portfolio"))
      .map((repo): GitHubRepo => ({
        id: repo.id,
        name: repo.name, 
        description: repo.description || "",
        html_url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        stargazers_count: repo.stargazers_count,
      }));

    /**
     * ORDENAÇÃO ESTRATÉGICA
     * Prioridade 1: Tag 'primeiro' (Seu projeto principal de Ciência de Dados/Azure)
     * Prioridade 2: Tag 'destaque' (Projetos secundários de alto impacto)
     * Prioridade 3: Ordem cronológica (Mais recentes primeiro)
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

      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    
  } catch (error) {
    console.error("[GitHub Fatal Error] Falha na conexão com a API:", error);
    return []; // Degradação graciosa: o grid de projetos apenas não aparece, mas o site não cai.
  }
}
