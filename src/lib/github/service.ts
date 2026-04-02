/**
 * src/lib/github/service.ts
 * Implementação Otimizada com Paginate e Recursive Trees (v2026)
 */
import { Octokit } from "octokit";
import { cache } from 'react'; // Importante para o Next.js 16 não repetir chamadas no build
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
 * Isso evita o erro "Request quota exhausted" pois faz pouquíssimas requisições.
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    console.log(`[GitHub Service] Iniciando busca otimizada de artigos...`);

    // 1. Usamos o paginate para buscar a árvore completa do repositório de forma recursiva
    // O parâmetro recursive: "1" faz o GitHub varrer todas as subpastas de uma vez.
    const treeData = await octokit.paginate(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: OWNER,
        repo: REPO,
        tree_sha: "main", // ou a branch padrão do seu repo myArticles
        recursive: "1",
        headers: {
          "X-GitHub-Api-Version": API_VERSION,
          "User-Agent": "Portfolio-Sergio-Santos-v16",
        },
      }
    ) as GitHubRawTreeItem[];

    // 2. Processamos a lista plana retornada
    const articles: GitHubItem[] = treeData
      .filter((item) => {
        // Filtramos: apenas arquivos na pasta 'artigos/', que terminam em .md e não são README
        return (
          item.type === "blob" && 
          item.path?.startsWith("artigos/") &&
          item.path?.endsWith(".md") &&
          !item.path?.toLowerCase().endsWith("readme.md")
        );
      })
      .map((item) => {
        const fullPath = item.path || "";
        const pathParts = fullPath.split("/");
        
        // O nome do arquivo é a última parte
        const fileName = pathParts[pathParts.length - 1];
        
        // A categoria é a pasta imediatamente anterior ao arquivo
        // Ex: artigos/frontend/react.md -> categoria é 'frontend'
        const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "geral";

        return {
          name: fileName,
          path: fullPath,
          url: item.url || "",
          type: 'file',
          // Construímos a URL de download bruto (raw) manualmente para evitar mais chamadas de API
          download_url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${fullPath}`,
          category: categoryName
        };
      });

    return articles;

  } catch (error: any) {
    // Tratamento de Rate Limit (403) ou Erros de Token (401)
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
