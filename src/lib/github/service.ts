/**
 * src/lib/github/service.ts
 * Implementação Otimizada (v2026)
 * CORRIGIDO: Prevenção de erro de Prerender Random e Tipagem TS 6.0
 */
import { Octokit } from "octokit";
import { cache } from 'react'; 
import { headers } from "next/headers"; // Necessário para Next 16.2
import type { GitHubItem, GitHubRawTreeItem } from './types';

const GITHUB_TOKEN = process.env['GITHUB_TOKEN']?.trim();
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const API_VERSION = "2026-03-10";

export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    // ESSENCIAL NEXT 16.2: Consumir um dado de request ANTES de operações que usem Math.random() 
    // internamente (como o Octokit/Fetch no Node 24).
    try { await headers(); } catch { /* Ignore se estiver fora de request context */ }

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
        const fileName = pathParts[pathParts.length - 1] || "artigo.md";
        const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "geral";

        return {
          name: fileName,
          path: fullPath,
          url: item.url || "",
          type: 'file',
          download_url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${fullPath}`,
          category: categoryName
        };
      });

    return articles;

  } catch (error: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return getArticlesWithRetry(retries - 1);
    }
    return [];
  }
});
