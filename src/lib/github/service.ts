/**
 * src/lib/github/service.ts
 * Versão Resiliente (v2026) - Otimizada para CI&T
 * STATUS: CORRIGIDO (Recursão manual estável + Suporte .md e .mdx)
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
 * Esta abordagem é mais lenta que Git Trees, porém MUITO mais estável no Vercel Edge.
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
      next: { revalidate: 3600 } // ISR: Atualiza a cada 1 hora
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
        // Pega a pasta imediatamente acima do arquivo como categoria
        const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : 'geral';

        return [{
          name: item.name,
          path: item.path,
          url: item.url,
          type: 'file',
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
 * Função exportada com cache do React 19 para evitar Over-fetching
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    // Garante contexto dinâmico no Next.js 16.2.2
    try { await headers(); } catch { /* Build-time fallback */ }

    if (!GITHUB_TOKEN) {
      console.warn("[GitHub Service] Aviso: GITHUB_TOKEN não configurado. Usando requisição não autenticada (Limite reduzido).");
    }

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
