/**
 * src/lib/github/service.ts
 * Implementação Sênior (v2026)
 * STATUS: REVISADO com Plugin de Paginação e Tipagem Strict
 * STACK: Next.js 16.2.2, React 19, TS 6.0.2, Node 24
 */
import { Octokit } from "octokit";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { cache } from 'react'; 
import { headers } from "next/headers";
import type { GitHubItem, GitHubRawTreeItem } from './types';

// 1. Estendendo o Octokit com o plugin de paginação conforme docs 2026
const MyOctokit = Octokit.plugin(paginateRest);

const GITHUB_TOKEN = process.env['GITHUB_TOKEN']?.trim();

// 2. Instância única e segura
const octokit = new MyOctokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const API_VERSION = "2026-03-10";

/**
 * Busca artigos no GitHub utilizando a estratégia de Plugins e Paginação.
 * O cache do React garante que múltiplas chamadas na mesma requisição não onerem a API.
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    /**
     * WORKAROUND NEXT 16.2: Invocar headers() garante que o Next.js trate 
     * esta função como dinâmica, evitando que o cache estático do build
     * congele um estado vazio da API.
     */
    try { await headers(); } catch { /* Fallback para build time */ }

    if (!GITHUB_TOKEN) {
      console.warn("[GitHub Service] GITHUB_TOKEN não configurado. Verifique as variáveis de ambiente.");
    }

    // 3. Chamada utilizando o método paginate do plugin
    // O endpoint de Trees com recursive=1 pode ser paginado se for muito grande
    const treeData = await octokit.paginate(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: OWNER,
        repo: REPO,
        tree_sha: "main",
        recursive: "true", // String "true" para compatibilidade com alguns tipos da API
        headers: {
          "X-GitHub-Api-Version": API_VERSION,
          "User-Agent": "Portfolio-Sergio-Santos-v2026",
        },
      }
    ) as GitHubRawTreeItem[];

    // 4. Filtragem e Processamento com Type Guard
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
        
        // Extração da Categoria (Ex: artigos/ia-artigos/slug.md -> ia-artigos)
        const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "geral";
        
        // Garantia de string para conformidade com TypeScript 6.0
        const safeCategory: string = categoryName || "geral";
        const fileName = pathParts[pathParts.length - 1] || "artigo.md";

        return {
          name: fileName,
          path: fullPath,
          url: item.url,
          type: 'file', 
          download_url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${fullPath}`,
          category: safeCategory
        };
      });

    console.log(`[GitHub Service] Sucesso: ${articles.length} artigos carregados.`);
    return articles;

  } catch (error: any) {
    console.error(`[GitHub Service] Erro (Tentativas restantes: ${retries}): ${error.message}`);
    
    if (retries > 0) {
      // Exponential Backoff
      const wait = (3 - retries) * 1000;
      await new Promise(r => setTimeout(r, wait));
      return getArticlesWithRetry(retries - 1);
    }
    
    return [];
  }
});
