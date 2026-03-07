// src/services/githubService.ts
import { Octokit } from 'octokit';
import { processRepositories } from "@/lib/github-service";
import type { ProcessedProject, GitHubRepo } from "@/types/github";

/**
 * SERVIÇO UNIFICADO GITHUB (Next.js 16 + Octokit)
 * -----------------------------------------------------------------------------
 * ✔ Utiliza Octokit para maior segurança e facilidade com Tokens.
 * ✔ Utiliza sua lógica personalizada de 'processRepositories' (Pipes e Categorias).
 * ✔ Cache nativo via Next.js configurado no nível do servidor.
 */

// Instancia o Octokit (o servidor Vercel pegará o GITHUB_TOKEN das Env Vars)
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

export async function getGitHubProjects(username: string): Promise<ProcessedProject[]> {
  try {
    // Busca os repositórios usando Octokit
    // Nota: O Octokit no servidor não faz cache automático como o 'fetch' do Next,
    // mas em Server Components, o Next.js lida com a revalidação da página.
    const { data: rawRepos } = await octokit.request('GET /users/{username}/repos', {
      username,
      per_page: 100,
      sort: 'updated',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    // Cast seguro para o seu tipo GitHubRepo do TS 6.0
    const repos = rawRepos as unknown as GitHubRepo[];

    // Retorna os dados processados com sua lógica de Negócio (Filtro 'portfolio', Pipes, etc)
    return processRepositories(repos, username);

  } catch (error) {
    console.error('❌ Erro ao buscar projetos do GitHub:', error);
    return [];
  }
}

/**
 * ALIAS DE COMPATIBILIDADE
 * Garante que componentes que chamam 'getProjects' ou 'fetchUserRepos' não quebrem.
 */
export { getGitHubProjects as getProjects, getGitHubProjects as fetchUserRepos };
