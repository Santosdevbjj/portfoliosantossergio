/**
 * src/lib/github/service.ts
 * Implementação utilizando Octokit e Next.js 16.2.3 Server-side
 */
import { Octokit } from "octokit";
import type { GitHubItem, GitHubRawItem } from './types';

// Inicialização do cliente Octokit com suporte a variáveis de ambiente da Vercel
const GITHUB_TOKEN = process.env['GITHUB_TOKEN']?.trim();
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const API_VERSION = "2026-03-10"; // Versão exigida pela documentação de 2026

export async function getArticlesWithRetry(retries = 2): Promise<GitHubItem[]> {
  
  /**
   * Função interna para busca recursiva de arquivos .md
   */
  async function fetchRecursive(path: string): Promise<GitHubItem[]> {
    try {
      const response = await octokit.rest.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: path,
        headers: {
          "X-GitHub-Api-Version": API_VERSION,
          "User-Agent": "Portfolio-Sergio-Santos-v16",
        },
      });

      const items = response.data;

      if (!Array.isArray(items)) {
        return [];
      }

      const results = await Promise.all(items.map(async (item: any): Promise<GitHubItem[]> => {
        // Tipagem interna usando o GitHubRawItem para validar a estrutura vinda da API
        const rawItem = item as GitHubRawItem;

        // Se for um diretório, mergulha recursivamente
        if (rawItem.type === 'dir') {
          return fetchRecursive(rawItem.path);
        }
        
        // Filtra apenas arquivos Markdown, ignorando README
        if (rawItem.name.endsWith('.md') && rawItem.name.toLowerCase() !== 'readme.md') {
          const pathParts = rawItem.path.split('/');
          // A categoria é o nome da pasta pai ou 'geral'
          const categoryName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'geral';
          
          return [{
            name: rawItem.name,
            path: rawItem.path,
            url: rawItem.url,
            type: 'file',
            download_url: rawItem.download_url,
            category: categoryName
          }];
        }
        return [];
      }));

      return results.flat();
      
    } catch (err: any) {
      // Tratamento específico para erros de limite de taxa ou autenticação
      if (err.status === 403 || err.status === 401) {
        console.error(`[GitHub Service] Erro Crítico de Acesso: ${err.status}`);
      }
      throw err;
    }
  }

  try {
    // Iniciamos a busca a partir da pasta 'artigos'
    return await fetchRecursive("artigos");
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`[GitHub Service] Tentativa falhou. Restam ${retries} retentativas...`);
      // Aguarda 1.5s antes de tentar novamente (Backoff simples)
      await new Promise(r => setTimeout(r, 1500));
      return getArticlesWithRetry(retries - 1);
    }
    
    console.error("[GitHub Service] Falha total após retentativas. Retornando array vazio.");
    return []; 
  }
}
