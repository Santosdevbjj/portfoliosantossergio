
/**
 * src/lib/github/types.ts
 * Definições de tipos para a API do GitHub - TS 6 & React 19 compatível.
 */

export interface GitHubItem {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  download_url: string | null;
  category: string; // Garantimos que a categoria sempre exista após o mapeamento
}

// Tipo auxiliar para a resposta crua da API do GitHub antes do processamento
export interface GitHubRawItem {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  download_url: string | null;
}



/**
 * src/lib/github/service.ts 
 * Evolução: Paralelismo + Tipagem + AbortController (Timeout)
 */

export async function getArticlesWithRetry(retries = 2): Promise<GitHubItem[]> {
  const rawToken = process.env['GITHUB_TOKEN'];
  const GITHUB_TOKEN = typeof rawToken === 'string' ? rawToken.trim() : undefined;
  
  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

  async function fetchRecursive(url: string): Promise<GitHubItem[]> {
    // 1. TIMEOUT: Se a API não responder em 8s, cancelamos para não travar o build
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
        next: { revalidate: 3600, tags: ['github-articles'] },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return [];
        throw new Error(`GH Error: ${res.status}`);
      }

      const items: GitHubItem[] = await res.json();
      if (!Array.isArray(items)) return [];

      // 2. PARALELISMO: Disparamos todas as subpastas ao mesmo tempo
      const folderPromises = items
        .filter(item => item.type === 'dir')
        .map(dir => fetchRecursive(dir.url));

      const filesFromSubfolders = await Promise.all(folderPromises);

      // 3. MAPEAMENTO: Filtramos apenas MDs e formatamos
      const currentLevelFiles = items
        .filter(item => item.name.endsWith('.md') && item.name.toLowerCase() !== 'readme.md')
        .map(file => ({
          ...file,
          category: file.path.split('/').slice(-2, -1)[0] || 'geral'
        }));

      return [...currentLevelFiles, ...filesFromSubfolders.flat()];
      
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  try {
    return await fetchRecursive(BASE_URL);
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return getArticlesWithRetry(retries - 1);
    }
    return [];
  }
}
