/**
 * src/lib/github/service.ts
 * Implementação Otimizada (v2026)
 * STATUS: CORRIGIDO (Tipagem Strict + Octokit Paginate + Estrutura de Pastas)
 */
import { Octokit } from "octokit";
import { cache } from 'react'; 
import { headers } from "next/headers"; // Essencial para Next 16.2.2
import type { GitHubItem, GitHubRawTreeItem } from './types';

const GITHUB_TOKEN = process.env['GITHUB_TOKEN']?.trim();
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const API_VERSION = "2026-03-10";

/**
 * Busca artigos no GitHub utilizando octokit.paginate para garantir escalabilidade.
 * Filtra e categoriza os ficheiros .md conforme a estrutura do repositório.
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    /**
     * ESSENCIAL NEXT 16.2: Consumir headers() antes de operações assíncronas 
     * que utilizam o motor de fetch/random do Node 24 para evitar erros de Prerender.
     */
    try { await headers(); } catch { /* Contexto de build/edge */ }

    // Usando paginate para garantir que pegamos TODOS os itens da Tree se o repo crescer
    const treeData = await octokit.paginate(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: OWNER,
        repo: REPO,
        tree_sha: "main",
        recursive: "1",
        headers: {
          "X-GitHub-Api-Version": API_VERSION,
          "User-Agent": "Portfolio-Sergio-Santos-v16",
        },
      }
    ) as GitHubRawTreeItem[];

    // Processamento com Type Guard Rigoroso (TS 6.0.2)
    const articles: GitHubItem[] = treeData
      .filter((item): item is Required<Pick<GitHubRawTreeItem, 'path' | 'type' | 'url'>> & GitHubRawTreeItem => {
        return (
          item.type === "blob" && 
          !!item.path &&
          item.path.startsWith("artigos/") && // Garante que está na pasta raiz de artigos
          item.path.endsWith(".md") &&        // Apenas ficheiros markdown
          !item.path.toLowerCase().endsWith("readme.md") // Ignora documentação interna
        );
      })
      .map((item) => {
        const fullPath = item.path;
        const pathParts = fullPath.split("/");
        
        // Exemplo: "artigos/ia-artigos/artigo.md" -> pathParts = ["artigos", "ia-artigos", "artigo.md"]
        const fileName = pathParts[pathParts.length - 1] || "artigo.md";
        
        /**
         * Lógica de Categoria Baseada na Estrutura Enviada:
         * Se o pathParts tiver mais de 2 elementos, o elemento do meio é a subpasta (categoria).
         */
        const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "geral";
        
        // Garantia de String para evitar erro de atribuição no TypeScript
        const safeCategory: string = categoryName ?? "geral";

        return {
          name: fileName,
          path: fullPath,
          url: item.url,
          type: 'file', 
          download_url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${fullPath}`,
          category: safeCategory
        };
      });

    return articles;

  } catch (error: any) {
    console.error(`[GitHub Service] Erro ao buscar artigos: ${error.message}`);
    
    // Estratégia de Exponential Backoff para Retries
    if (retries > 0) {
      const waitTime = (3 - retries) * 1000;
      await new Promise(r => setTimeout(r, waitTime));
      return getArticlesWithRetry(retries - 1);
    }
    
    return [];
  }
});
