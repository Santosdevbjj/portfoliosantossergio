// src/services/githubService.ts
import { Octokit } from 'octokit';
import { RequestError } from 'octokit';
import { processRepositories } from "@/lib/github-service";
import type { ProcessedProject, GitHubRepo } from "@/types/github";

/**
 * SERVIÇO UNIFICADO GITHUB (Next.js 16 + Octokit 5.0.5)
 * -----------------------------------------------------------------------------
 * ✔ Stack: TypeScript 6.0, Node 24, Next.js 16 (App Router)
 * ✔ Usuário Padrão: Santosdevbjj
 * ✔ Performance: Paginação automática via Octokit Iterator
 * ✔ Resiliência: Timeout de 7s e tratamento de erro 'RequestError'
 */

// Configuração do cliente utilizando o fetch nativo do Node 24
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN,
  request: {
    timeout: 7000, 
  }
});

// Nome de usuário centralizado para evitar hardcoding espalhado
const DEFAULT_USERNAME = "Santosdevbjj";

/**
 * Busca e processa projetos do GitHub.
 * Se nenhum username for passado, utiliza 'Santosdevbjj' por padrão.
 */
export async function getGitHubProjects(username: string = DEFAULT_USERNAME): Promise<ProcessedProject[]> {
  if (!username) {
    console.warn('⚠️ GitHub Service: Username não disponível.');
    return [];
  }

  try {
    const reposList: GitHubRepo[] = [];
    
    // O Iterator é a melhor prática para garantir que todos os repositórios 
    // sejam capturados, mesmo que ultrapassem 100 itens no futuro.
    const iterator = octokit.paginate.iterator(octokit.rest.repos.listForUser, {
      username,
      per_page: 100,
      sort: 'updated',
      type: 'owner', // Filtra apenas repositórios próprios (evita forks)
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    for await (const { data: repos } of iterator) {
      // Cast seguro conforme padrões do TS 6.0
      reposList.push(...(repos as unknown as GitHubRepo[]));
    }

    // Processamento com sua lógica de negócio (Filtros por tópico 'portfolio', categorias, etc)
    return processRepositories(reposList, username);

  } catch (error: unknown) {
    // Tratamento de erro especializado do Octokit
    if (error instanceof RequestError) {
      console.error(`❌ GitHub API Error [${error.status}]: ${error.message}`);
      
      if (error.status === 403) {
        console.error('🛑 Rate limit atingido. Verifique o seu GITHUB_TOKEN nas variáveis de ambiente da Vercel.');
      }
    } else {
      console.error('❌ Erro inesperado ao buscar repositórios:', error);
    }
    
    // Retorna array vazio para manter a estabilidade do componente React (PortfolioGrid)
    return []; 
  }
}

/**
 * ALIAS DE COMPATIBILIDADE
 * Facilitam a exportação para diferentes padrões de consumo no Next.js 16.
 */
export { getGitHubProjects as getProjects, getGitHubProjects as fetchUserRepos };
