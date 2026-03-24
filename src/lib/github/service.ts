/**
 * src/lib/github/service.ts
 */
import type { GitHubItem, GitHubRawItem } from './types';

export async function getArticlesWithRetry(retries = 2): Promise<GitHubItem[]> {
  const GITHUB_TOKEN = process.env['GITHUB_TOKEN']?.trim();
  
  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  // Importante: A API do GitHub exige User-Agent e o Header de Auth correto
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

  async function fetchRecursive(url: string): Promise<GitHubItem[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Portfolio-Sergio-Santos-v16",
          ...(GITHUB_TOKEN && { "Authorization": `Bearer ${GITHUB_TOKEN}` }) // Alterado para Bearer (padrão moderno)
        },
        signal: controller.signal,
        next: { revalidate: 3600 }
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`[GitHub Service] Erro ${res.status} em ${url}`);
        // Se for erro de Auth/Quota, lançamos para o catch tratar o retry
        throw new Error(`GH_ERROR_${res.status}`);
      }

      const items = (await res.json()) as GitHubRawItem[];
      if (!Array.isArray(items)) return [];

      const results = await Promise.all(items.map(async (item): Promise<GitHubItem[]> => {
        if (item.type === 'dir') {
          return fetchRecursive(item.url);
        }
        
        if (item.name.endsWith('.md') && item.name.toLowerCase() !== 'readme.md') {
          const pathParts = item.path.split('/');
          const categoryName = pathParts[pathParts.length - 2] || 'geral';
          
          return [{
            ...item,
            category: categoryName
          }];
        }
        return [];
      }));

      return results.flat();
      
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  try {
    return await fetchRecursive(BASE_URL);
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1500));
      return getArticlesWithRetry(retries - 1);
    }
    // Em caso de erro total, logamos mas não retornamos vazio para não quebrar o build do Next 16.2
    console.error("[GitHub Service] Falha após retentativas.");
    return []; 
  }
}
