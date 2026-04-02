/**
 * src/lib/github/service.ts
 * Implementação Otimizada com Paginate e Recursive Trees (v2026)
 * CORRIGIDO: Tipagem estrita para evitar erro de build no Vercel
 */
import { Octokit } from "octokit";
import { cache } from 'react'; 
import type { GitHubItem, GitHubRawTreeItem } from './types';

const GITHUB_TOKEN = process.env['GITHUB_TOKEN']?.trim();
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const API_VERSION = "2026-03-10";

/**
 * Busca todos os artigos usando a estratégia de Tree Recursiva + Paginate.
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    console.log(`[GitHub Service] Iniciando busca otimizada de artigos...`);

    // 1. Usamos o paginate para buscar a árvore completa
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

    // 2. Processamos a lista plana retornada
    const articles: GitHubItem[] = treeData
      .filter((item): item is Required<Pick<GitHubRawTreeItem, 'path' | 'type' | 'url'>> & GitHubRawTreeItem => {
        // Filtramos: apenas arquivos na pasta 'artigos/', que terminam em .md e não são README
        // Garantimos que 'path' existe para satisfazer o TS no próximo passo (.map)
        return (
          item.type === "blob" && 
          !!item.path &&
          item.path.startsWith("artigos/") &&
          item.path.endsWith(".md") &&
          !item.path.toLowerCase().endsWith("readme.md")
        );
      })
      .map((item) => {
        const fullPath = item.path; // Aqui o TS já sabe que path existe devido ao filtro
        const pathParts = fullPath.split("/");
        
        // O nome do arquivo é a última parte. Se por algum motivo for vazio, usamos fallback.
        const fileName = pathParts[pathParts.length - 1] || "arquivo-sem-nome.md";
        
        // A categoria é a pasta imediatamente anterior ao arquivo
        // Ex: artigos/frontend/react.md -> categoria é 'frontend'
        const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "geral";

        return {
          name: fileName,
          path: fullPath,
          url: item.url || "",
          type: 'file', // Forçamos o literal 'file' conforme exigido no GitHubItem
          download_url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${fullPath}`,
          category: categoryName || "geral" // Garante que nunca será undefined
        };
      });

    return articles;

  } catch (error: any) {
    if (error.status === 403 || error.status === 401) {
      console.error(`[GitHub Service] Erro de Cota/Auth: ${error.status}. Verifique o GITHUB_TOKEN na Vercel.`);
    }

    if (retries > 0) {
      const waitTime = 2000 * (3 - retries);
      console.warn(`[GitHub Service] Erro detectado. Tentando novamente em ${waitTime/1000}s...`);
      await new Promise(r => setTimeout(r, waitTime));
      return getArticlesWithRetry(retries - 1);
    }

    console.error("[GitHub Service] Falha total. Retornando array vazio.");
    return [];
  }
});
