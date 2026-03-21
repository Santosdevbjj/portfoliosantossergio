/**
 * src/lib/github/service.ts
 * Implementação Resiliente e Recursiva - Next.js 16.2.0 & TS 6.
 * Focado em Node 24 e performance de build na Vercel.
 */

export async function getArticlesWithRetry(retries = 2): Promise<any[]> {
  // Lemos o token garantindo que não existam espaços acidentais
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN?.trim();
  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  
  // URL base para iniciar a varredura na pasta 'artigos'
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

  /**
   * Função interna para navegação recursiva em diretórios
   */
  async function fetchRecursive(url: string): Promise<any[]> {
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Sergio-Santos-v16",
    };

    // Só adicionamos o Authorization se o token existir para evitar 401 por "Bearer undefined"
    if (GITHUB_TOKEN) {
      headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    }

    const res = await fetch(url, {
      headers,
      // Revalidação de 1 hora para manter o build rápido e dados atualizados
      next: { revalidate: 3600, tags: ['github-articles'] },
    });

    if (!res.ok) {
      // Se for erro de autenticação (401) ou proibido (403), logamos e paramos
      if (res.status === 401 || res.status === 403) {
        console.error(`[GitHub Service] Erro de Autenticação (${res.status}). Verifique o GITHUB_TOKEN.`);
        return [];
      }
      throw new Error(`GitHub API Error: ${res.status}`);
    }

    const items = await res.json();
    
    // Garantimos que items seja um array (caso a pasta esteja vazia ou seja um arquivo único)
    if (!Array.isArray(items)) return [];

    let allFiles: any[] = [];

    for (const item of items) {
      if (item.type === 'dir') {
        // Recursão: entra na subpasta
        const subFiles = await fetchRecursive(item.url);
        allFiles = [...allFiles, ...subFiles];
      } else if (item.name.endsWith('.md') && item.name.toLowerCase() !== 'readme.md') {
        // Adiciona arquivo Markdown à lista
        const pathParts = item.path.split('/');
        // Pega o nome da pasta pai imediata como categoria
        const category = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'geral';

        allFiles.push({
          ...item,
          category: category === 'artigos' ? 'geral' : category
        });
      }
    }
    return allFiles;
  }

  try {
    return await fetchRecursive(BASE_URL);
  } catch (error) {
    if (retries > 0) {
      console.warn(`[GitHub Service] Tentativa falhou. Restam ${retries} tentativas...`);
      // Pequeno delay antes de tentar novamente para evitar rate limit
      await new Promise(res => setTimeout(res, 500));
      return getArticlesWithRetry(retries - 1);
    }
    
    console.error("[GitHub Service] Erro crítico após retries:", error);
    return []; // Retorno resiliente para não quebrar o build do Next.js
  }
}
