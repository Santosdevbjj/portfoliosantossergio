/**
 * src/lib/github/service.ts
 * Nível: Principal Engineer
 * Stack: Next.js 16.2.0, TS 6, Node 24, React 19.
 */

import { GitHubItem, GitHubRawItem } from './types';

export async function getArticlesWithRetry(retries = 2): Promise<GitHubItem[]> {
  // Acesso via colchetes para conformidade rigorosa com TS 6
  const rawToken = process.env['GITHUB_TOKEN'];
  const GITHUB_TOKEN = typeof rawToken === 'string' ? rawToken.trim() : undefined;
  
  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

  async function fetchRecursive(url: string): Promise<GitHubItem[]> {
    // TIMEOUT: Aborta a requisição se o GitHub demorar mais de 8 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Portfolio-Sergio-Santos-v16",
          ...(GITHUB_TOKEN && { "Authorization": `token ${GITHUB_TOKEN}` })
        },
        signal: controller.signal,
        // Cache granular do Next.js 16.2
        next: { 
          revalidate: 3600, 
          tags: ['github-articles'] 
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          console.error(`[GitHub Service] Erro Crítico ${res.status}: Credenciais inválidas.`);
          return [];
        }
        throw new Error(`GitHub API Error: ${res.status}`);
      }

      const items: GitHubRawItem[] = await res.json();
      if (!Array.isArray(items)) return [];

      /**
       * PROCESSAMENTO PARALELO (Big Tech Pattern)
       * Em vez de esperar cada pasta terminar para começar a próxima,
       * dispar Deck as promessas de todas as subpastas simultaneamente.
       */
      const folderPromises = items
        .filter(item => item.type === 'dir')
        .map(dir => fetchRecursive(dir.url));

      // Aguarda todas as recursões terminarem em paralelo
      const nestedResults = await Promise.all(folderPromises);
      const filesFromSubfolders = nestedResults.flat();

      // Processa os arquivos Markdown do nível atual
      const currentLevelFiles: GitHubItem[] = items
        .filter(item => item.name.endsWith('.md') && item.name.toLowerCase() !== 'readme.md')
        .map(file => {
          const pathParts = file.path.split('/');
          // Se o arquivo estiver na raiz de /artigos, categoria é 'geral'
          // Se estiver em /artigos/react/intro.md, categoria é 'react'
          const categoryName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : 'geral';
          
          return {
            ...file,
            category: categoryName
          };
        });

      return [...currentLevelFiles, ...filesFromSubfolders];
      
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.error(`[GitHub Service] Timeout na URL: ${url}`);
      }
      throw err; // Propaga para o bloco catch do getArticlesWithRetry
    }
  }

  try {
    return await fetchRecursive(BASE_URL);
  } catch (error) {
    if (retries > 0) {
      console.warn(`[GitHub Service] Tentativa falhou. Retentando em 1s... Restam: ${retries}`);
      // Backoff de 1 segundo para evitar spam na API
      await new Promise(r => setTimeout(r, 1000));
      return getArticlesWithRetry(retries - 1);
    }
    console.error("[GitHub Service] Erro final após retries:", error);
    return []; // Retorno resiliente para manter o build da Vercel vivo
  }
}
