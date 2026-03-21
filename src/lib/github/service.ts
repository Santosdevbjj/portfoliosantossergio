/**
 * src/lib/github/service.ts
 * Implementação Resiliente e Recursiva - Next.js 16.2.0 & TS 6.
 * Capaz de varrer subpastas para encontrar todos os seus artigos .md
 */

export async function getArticlesWithRetry(retries = 2): Promise<any[]> {
  const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];
  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  
  // Começamos pela pasta principal 'artigos'
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

  async function fetchRecursive(url: string): Promise<any[]> {
    const res = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${GITHUB_TOKEN ?? ''}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Sergio-Santos-v16"
      },
      next: { revalidate: 3600, tags: ['github-articles'] },
    });

    if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);

    const items = await res.json();
    let allFiles: any[] = [];

    for (const item of items) {
      if (item.type === 'dir') {
        // Se for uma pasta (ex: low_code), entra nela recursivamente
        const subFiles = await fetchRecursive(item.url);
        allFiles = [...allFiles, ...subFiles];
      } else if (item.name.endsWith('.md') && item.name !== 'README.md') {
        // Se for um arquivo markdown, adiciona à lista
        allFiles.push({
          ...item,
          category: url.split('/').pop() // Usa o nome da pasta como categoria
        });
      }
    }
    return allFiles;
  }

  try {
    return await fetchRecursive(BASE_URL);
  } catch (error) {
    if (retries > 0) {
      console.warn(`[GitHub Service] Falha na recursão. Tentando novamente... (${retries})`);
      return getArticlesWithRetry(retries - 1);
    }
    console.error("[GitHub Service] Erro crítico na estrutura de pastas:", error);
    return []; // Retorno seguro para evitar Erro 500
  }
}
