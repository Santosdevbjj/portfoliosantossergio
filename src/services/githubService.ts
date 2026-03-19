// src/services/githubService.ts

/**
 * SERVIÇO UNIFICADO GITHUB - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Otimizado para chamadas do lado do servidor (SSR/PPR).
 * ✔ TypeScript 6.0: Acesso via string literal process.env['KEY'].
 * ✔ Node 24: Suporte a Iterators assíncronos de alta performance.
 * ✔ Octokit: Gerenciamento de Rate Limit e Cache.
 */

import { Octokit, RequestError } from "octokit";
import { processRepositories } from "@/lib/github-service";
import type { GitHubRepo, ProcessedProject } from "@/types/github";

// CORREÇÃO TS 6.0: Acesso via colchetes para evitar erro de Index Signature
const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];

/**
 * Instância do Octokit com configurações de Resiliência
 */
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  
  // Identificação da aplicação conforme boas práticas do GitHub
  userAgent: "sergio-santos-portfolio/1.1",

  // Configurações de Request para Node 24 (Timeout agressivo para evitar gargalos)
  request: {
    timeout: 7000,
  },
});

const DEFAULT_USERNAME = "Santosdevbjj";

/**
 * Busca e Processa Projetos do GitHub
 * Otimizado para Next.js 16 (Pode ser usado em Server Components)
 */
export async function getGitHubProjects(
  username: string = DEFAULT_USERNAME
): Promise<ProcessedProject[]> {
  if (!username) {
    console.warn("GitHub Service: username não definido");
    return [];
  }

  try {
    const reposList: GitHubRepo[] = [];

    // Uso de Async Iterator - Padrão recomendado para Node 24 e performance
    const iterator = octokit.paginate.iterator(
      octokit.rest.repos.listForUser,
      {
        username,
        per_page: 100,
        sort: "updated",
        type: "owner",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          "Accept": "application/vnd.github+json",
        },
      }
    );

    // Loop assíncrono otimizado pelo Turbopack
    for await (const { data: repos } of iterator) {
      const normalized = repos.map((repo) => ({
        ...repo,
        // Normalização de tópicos para lowercase (Consistência com Dicionários)
        topics: (repo.topics ?? []).map((t: string) => t.toLowerCase()),
      })) as unknown as GitHubRepo[];

      reposList.push(...normalized);
    }

    // Processamento final através da lib de domínio
    return processRepositories(reposList, username);

  } catch (error) {
    // Tratamento de erros específico para a API do GitHub
    if (error instanceof RequestError) {
      console.error(
        `GitHub API Error [${error.status}]: ${error.message}`
      );

      if (error.status === 403) {
        console.error(
          "Rate limit atingido ou Token inválido. Verifique o GITHUB_TOKEN na Vercel."
        );
      }
    } else {
      console.error("Erro inesperado no GitHub Service:", error);
    }

    // Fallback: retorna lista vazia para não quebrar a renderização da página
    return [];
  }
}

/**
 * Aliases para compatibilidade com componentes antigos
 */
export {
  getGitHubProjects as getProjects,
  getGitHubProjects as fetchUserRepos,
};
