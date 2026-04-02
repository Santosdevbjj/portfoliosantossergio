/**
 * src/lib/github/service.ts
 * Implementação Otimizada (v2026)
 * STATUS: CORRIGIDO para TypeScript 6.0.2 Strict Mode
 * FOCO: Resolução de conflito de tipos 'string | undefined' e erro Prerender Random
 */
import { Octokit } from "octokit";
import { cache } from 'react'; 
import { headers } from "next/headers"; // Necessário para Next 16.2.2
import type { GitHubItem, GitHubRawTreeItem } from './types';

const GITHUB_TOKEN = process.env['GITHUB_TOKEN']?.trim();
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const API_VERSION = "2026-03-10";

/**
 * Busca artigos no GitHub com estratégia de Retry e Tipagem Estrita.
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    /**
     * ESSENCIAL NEXT 16.2: Consumir headers() antes de chamar a Octokit.
     * Isso sinaliza ao motor de renderização que a execução possui contexto de request,
     * evitando o erro de segurança 'next-prerender-random' causado pelo Node 24/Octokit.
     */
    try { await headers(); } catch { /* Silencioso se estiver fora do contexto de renderização */ }

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

    // Processamento com Type Guard para garantir que 'path' e 'url' existam
    const articles: GitHubItem[] = treeData
      .filter((item): item is Required<Pick<GitHubRawTreeItem, 'path' | 'type' | 'url'>> & GitHubRawTreeItem => {
        return (
          item.type === "blob" && 
          !!item.path &&
          item.path.startsWith("artigos/") &&
          item.path.endsWith(".md") &&
          !item.path.toLowerCase().endsWith("readme.md")
        );
      })
      .map((item) => {
        const fullPath = item.path;
        const pathParts = fullPath.split("/");
        
        // Nome do arquivo
        const fileName = pathParts[pathParts.length - 1] || "artigo.md";
        
        // Lógica de Categoria: artigos/categoria/nome.md
        // CORREÇÃO TS: Garantimos que seja string usando fallback imediato
        const rawCategory = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "geral";
        const safeCategory: string = rawCategory ?? "geral";

        return {
          name: fileName,
          path: fullPath,
          url: item.url, // Já garantido pelo .filter() acima
          type: 'file',  // Literal exigido pela interface GitHubItem
          download_url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${fullPath}`,
          category: safeCategory
        };
      });

    return articles;

  } catch (error: any) {
    console.error(`[GitHub Service] Erro na tentativa: ${error.message}`);
    
    if (retries > 0) {
      const backoff = 1000 * (3 - retries);
      await new Promise(r => setTimeout(r, backoff));
      return getArticlesWithRetry(retries - 1);
    }
    
    return [];
  }
});
