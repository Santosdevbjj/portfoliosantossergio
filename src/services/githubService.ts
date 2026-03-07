// src/services/githubService.ts
import { Octokit } from 'octokit';
import { RequestError } from 'octokit';
import { processRepositories } from "@/lib/github-service";
import type { ProcessedProject, GitHubRepo } from "@/types/github";

/**
 * SERVIÇO UNIFICADO GITHUB (Next.js 16 + Octokit 5.0.5)
 * -----------------------------------------------------------------------------
 * ✔ Stack: TypeScript 6.0, Node 24, Next.js 16 (App Router)
 * ✔ Performance: Paginação automática via Octokit Iterator
 * ✔ Segurança: Tipagem rigorosa contra RequestError e Headers atualizados
 * ✔ Resiliência: Timeout configurado para evitar travamentos no build da Vercel
 */

// Configuração do cliente com boas práticas de 2026
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN,
  // Node 24 utiliza o fetch nativo; aqui configuramos o comportamento global
  request: {
    timeout: 7000, // 7 segundos de limite para chamadas na API
  }
});

/**
 * Busca e processa projetos do GitHub com suporte a paginação total e tratamento de erros.
 */
export async function getGitHubProjects(username: string): Promise<ProcessedProject[]> {
  if (!username) {
    console.warn('⚠️ GitHub Service: Username não fornecido.');
    return [];
  }

  try {
    // Em 2026, preferimos o iterator mesmo para listas pequenas para garantir 
    // que nenhum repositório "portfolio" fique de fora por limite de página.
    const reposList: GitHubRepo[] = [];
    
    const iterator = octokit.paginate.iterator(octokit.rest.repos.listForUser, {
      username,
      per_page: 100,
      sort: 'updated',
      type: 'owner', // Garante que não peguemos forks indesejados se não houver lógica no pipe
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    for await (const { data: repos } of iterator) {
      // O TS 6.0 infere corretamente aqui após o mapeamento do tipo
      reposList.push(...(repos as unknown as GitHubRepo[]));
    }

    // Processamento centralizado na lógica de negócio (Pipes, Filtros, Categorias)
    return processRepositories(reposList, username);

  } catch (error: unknown) {
    // Tratamento de erro conforme documentação oficial do Octokit
    if (error instanceof RequestError) {
      console.error(`❌ GitHub API Error [${error.status}]: ${error.message}`);
      
      // Se o erro for de Rate Limit (403), você pode logar avisos específicos para a Vercel
      if (error.status === 403) {
        console.error('🛑 Rate limit atingido. Verifique o GITHUB_TOKEN.');
      }
    } else {
      console.error('❌ Erro inesperado no GitHubService:', error);
    }
    
    return []; // Retorna array vazio para evitar quebra do PortfolioGrid
  }
}

/**
 * ALIAS DE COMPATIBILIDADE (Next.js 16 Patterns)
 * Permite flexibilidade de nomenclatura em Server Components e Route Handlers.
 */
export { getGitHubProjects as getProjects, getGitHubProjects as fetchUserRepos };
