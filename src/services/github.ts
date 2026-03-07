// src/services/github.ts
import { Octokit } from 'octokit';

// O TS 6.0 infere automaticamente a string aqui, mas o '!' garante que o token existe
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getPortfolioRepos() {
  try {
    const { data: repos } = await octokit.request('GET /user/repos', {
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
      type: 'public'
    });

    // Filtro essencial para evitar que todos os repositórios apareçam
    return repos.filter(repo => 
      !repo.fork && 
      repo.topics?.includes('portfolio')
    );
  } catch (error) {
    console.error('Erro na API do GitHub:', error);
    return [];
  }
}
