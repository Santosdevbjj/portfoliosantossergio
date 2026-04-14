/**
 * src/lib/github/service.ts
 * Versão Resiliente (v2026)
 * STATUS: CORRIGIDO (TypeScript Strict Mode Fixed)
 * STACK: Next.js 16.2.2, React 19, TS 6.0.2, Node 24
 */
import { cache } from "react";
import { headers } from "next/headers";
import type { GitHubItem, GitHubRawItem } from "./types";

// Tenta ler de ambas as variáveis possíveis para máxima compatibilidade no Deploy
const GITHUB_TOKEN = (process.env["GITHUB_ACCESS_TOKEN"] || process.env["GITHUB_TOKEN"])?.trim();

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

/**
 * Busca artigos de forma recursiva. 
 * Esta abordagem garante que todos os arquivos em subpastas sejam encontrados.
 */
async function fetchRecursive(url: string): Promise<GitHubItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Sergio-Santos-v2026",
        ...(GITHUB_TOKEN && { "Authorization": `Bearer ${GITHUB_TOKEN}` })
      },
      signal: controller.signal,
      next: { revalidate: 3600 } 
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`[GitHub Service] Erro ${res.status} em ${url}`);
      throw new Error(`GH_ERROR_${res.status}`);
    }

    const items = (await res.json()) as GitHubRawItem[];
    if (!Array.isArray(items)) return [];

    const results = await Promise.all(items.map(async (item): Promise<GitHubItem[]> => {
      // 1. Se for diretório, entra nele (Recursão)
      if (item.type === 'dir') {
        return fetchRecursive(item.url);
      }

      // 2. Filtra arquivos: .md ou .mdx (Ignora README)
      const isMarkdown = item.name.endsWith('.md') || item.name.endsWith('.mdx');
      const isNotReadme = !item.name.toLowerCase().includes('readme');

      if (isMarkdown && isNotReadme) {
        const pathParts = item.path.split('/');
        
        // CORREÇÃO TS: Garantindo que categoryName seja sempre string (fallback para 'geral')
        const categoryName: string = pathParts.length > 2 
          ? (pathParts[pathParts.length - 2] ?? 'geral') 
          : 'geral';

        return [{
          name: item.name,
          path: item.path,
          url: item.url,
          type: 'file' as const, // Força o literal 'file' para bater com a Interface
          download_url: item.download_url,
          category: categoryName
        }];
      }

      return [];
    }));

    return results.flat();

  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error(`[GitHub Service] Falha ao buscar em ${url}:`, err.message);
    throw err;
  }
}

/**
 * Função principal com retry e cache do React 19
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    // Força comportamento dinâmico para evitar cache estático antigo no build
    try { await headers(); } catch { /* Ignore build-time */ }

    const articles = await fetchRecursive(BASE_URL);
    console.log(`[GitHub Service] Sucesso: ${articles.length} artigos encontrados.`);
    return articles;

  } catch (error: any) {
    if (retries > 0) {
      console.log(`[GitHub Service] Tentando novamente... (${retries} restantes)`);
      await new Promise(r => setTimeout(r, 2000));
      return getArticlesWithRetry(retries - 1);
    }

    console.error("[GitHub Service] Falha crítica após todas as tentativas.");
    return [];
  }
});
