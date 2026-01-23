/**
 * Interface rigorosa para os dados do GitHub.
 * Garante tipagem segura em todo o fluxo da aplicação.
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
 * Interface para a resposta bruta da API do GitHub.
 * Evita o uso de 'any' e garante conformidade com a v3 da API.
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
 * SERVIÇO DE INTEGRAÇÃO GITHUB (Server-Side)
 * Lógica centralizada para busca, tradução e rankeamento de projetos.
 * * @param lang - Idioma atual da requisição ('pt' | 'en' | 'es')
 */
export async function getGitHubProjects(lang: string = 'pt'): Promise<GitHubRepo[]> {
  const token = process.env['GITHUB_ACCESS_TOKEN'];
  const username = "Santosdevbjj";
  
  // Se houver token, usa a API de autenticado para evitar Rate Limit
  const url = token 
    ? `https://api.api.github.com/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner`
    : `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Sergio-Santos-Data-Science',
      },
      next: { revalidate: 3600 }, // Cache de 1 hora para otimizar LCP e evitar 403 Rate Limit
    });

    if (!response.ok) {
      console.error(`[GitHub Service] Erro ${response.status} para o usuário ${username}`);
      return []; 
    }

    const repos = (await response.json()) as RawGitHubRepo[];

    if (!Array.isArray(repos)) return [];

    /**
     * PROCESSAMENTO E TRADUÇÃO DINÂMICA
     */
    const processedRepos = repos
      .filter((repo) => {
        // Regra de Ouro: Apenas projetos marcados com a tag 'portfolio' aparecem no site
        const isPublic = !repo.fork;
        const isPortfolio = repo.topics?.includes("portfolio") ?? false;
        return isPublic && isPortfolio;
      })
      .map((repo): GitHubRepo => {
        
        // LÓGICA MULTILINGUE (Pipe Separation)
        // Formato esperado no GitHub: "Descrição PT | Descrição EN | Descrição ES"
        let description = repo.description ?? "";
        
        if (description.includes('|')) {
          const parts = description.split('|').map(p => p.trim());
          if (lang === 'en') description = parts[1] || parts[0];
          else if (lang === 'es') description = parts[2] || parts[0];
          else description = parts[0];
        }

        return {
          id: repo.id,
          // Normalização estética do nome (Snake_case para Title Case)
          name: repo.name
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()), 
          description: description.length > 0 ? description : null,
          html_url: repo.html_url,
          homepage: repo.homepage ?? null,
          topics: repo.topics ?? [],
          updated_at: repo.updated_at,
          stargazers_count: repo.stargazers_count ?? 0,
        };
      });

    /**
     * RANKING SYSTEM (Algoritmo de Prioridade)
     * Garante que os melhores projetos apareçam primeiro, independente da data.
     */
    return processedRepos.sort((a, b) => {
      const calculateWeight = (repo: GitHubRepo) => {
        const topics = repo.topics.map(t => t.toLowerCase());
        let weight = 0;
        
        if (topics.includes('featured') || topics.includes('destaque')) weight += 100;
        if (topics.includes('data-science')) weight += 50;
        if (topics.includes('python') || topics.includes('azure')) weight += 20;
        
        return weight;
      };

      const weightA = calculateWeight(a);
      const weightB = calculateWeight(b);

      // Se os pesos forem diferentes, ordena por relevância técnica
      if (weightA !== weightB) return weightB - weightA;

      // Fallback: Ordena pelo mais recentemente atualizado
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    
  } catch (error) {
    console.error("[GitHub Service] Falha crítica na integração:", error);
    return [];
  }
}
