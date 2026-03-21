/**
 * src/lib/github/service.ts
 * Nível: Principal Engineer
 * Stack: Next.js 16.2.0, TS 6, Node 24, React 19.
 */

import type { GitHubItem, GitHubRawItem } from './types';

export async function getArticlesWithRetry(retries = 2): Promise<GitHubItem[]> {
  const rawToken = process.env['GITHUB_TOKEN'];
  const GITHUB_TOKEN = typeof rawToken === 'string' ? rawToken.trim() : undefined;
  
  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

  async function fetchRecursive(url: string): Promise<GitHubItem[]> {
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
        next: { 
          revalidate: 3600, 
          tags: ['github-articles'] 
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          console.error(`[GitHub Service] Erro ${res.status}: Auth/Rate Limit.`);
          return [];
        }
        throw new Error(`GitHub API Error: ${res.status}`);
      }

      const items = (await res.json()) as GitHubRawItem[];
      if (!Array.isArray(items)) return [];

      // 1. Processamento paralelo de subpastas
      const folderPromises = items
        .filter(item => item.type === 'dir')
        .map(dir => fetchRecursive(dir.url));

      const nestedResults = await Promise.all(folderPromises);
      const filesFromSubfolders = nestedResults.flat();

      // 2. Mapeamento explícito para garantir compatibilidade com GitHubItem[]
      const currentLevelFiles: GitHubItem[] = items
        .filter(item => item.name.endsWith('.md') && item.name.toLowerCase() !== 'readme.md')
        .map((file): GitHubItem => {
          const pathParts = file.path.split('/');
          // Garante que categoryName seja string (evita undefined para o TS 6)
          const categoryName = (pathParts.length > 2 ? pathParts[pathParts.length - 2] : 'geral') || 'geral';
          
          return {
            name: file.name,
            path: file.path,
            url: file.url,
            type: file.type,
            download_url: file.download_url,
            category: categoryName
          };
        });

      return [...currentLevelFiles, ...filesFromSubfolders];
      
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.error(`[GitHub Service] Timeout em: ${url}`);
      }
      throw err;
    }
  }

  try {
    return await fetchRecursive(BASE_URL);
  } catch (error) {
    if (retries > 0) {
      console.warn(`[GitHub Service] Falha. Retentando... Restam: ${retries}`);
      await new Promise(r => setTimeout(r, 1000));
      return getArticlesWithRetry(retries - 1);
    }
    console.error("[GitHub Service] Erro crítico final:", error);
    return [];
  }
}
