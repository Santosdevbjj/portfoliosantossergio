/**
 * src/lib/github/service.ts
 * Implementação Resiliente e Recursiva - Next.js 16.2.0 & TS 6.
 * Focado em Node 24 e performance de build na Vercel.
 */

export async function getArticlesWithRetry(retries = 2): Promise<any[]> {
  // Acesso via colchetes para conformidade com index signature do TS 6
  const rawToken = process.env['GITHUB_TOKEN'];
  const GITHUB_TOKEN = typeof rawToken === 'string' ? rawToken.trim() : undefined;
  
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

    // Uso do prefixo 'token' ou 'Bearer' conforme padrão GitHub PAT
    if (GITHUB_TOKEN) {
      headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    }

    const res = await fetch(url, {
      headers,
      // Estratégia de Cache do Next.js 16.2
      next: { 
        revalidate: 3600, 
        tags: ['github-articles'] 
      },
    });

    if (!res.ok) {
      // Se for erro de autenticação ou limite, não adianta tentar recursão
      if (res.status === 401 || res.status === 403) {
        console.error(`[GitHub Service] Erro ${res.status}: Verifique o GITHUB_TOKEN na Vercel.`);
        return [];
      }
      throw new Error(`GitHub API Error: ${res.status}`);
    }

    const items = await res.json();
    
    if (!Array.isArray(items)) return [];

    let allFiles: any[] = [];

    for (const item of items) {
      if (item.type === 'dir') {
        // Recursão assíncrona para subpastas
        const subFiles = await fetchRecursive(item.url);
        allFiles = [...allFiles, ...subFiles];
      } else if (item.name.endsWith('.md') && item.name.toLowerCase() !== 'readme.md') {
        
        // Lógica de Categoria baseada na estrutura de pastas
        const pathParts = item.path.split('/');
        // O nome da pasta imediata vira a categoria
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
      console.warn(`[GitHub Service] Falha na requisição. Tentando novamente... (${retries})`);
      // Aguarda 500ms antes de tentar novamente (backoff simples)
      await new Promise(resolve => setTimeout(resolve, 500));
      return getArticlesWithRetry(retries - 1);
    }
    console.error("[GitHub Service] Erro crítico na estrutura de pastas:", error);
    return []; // Fallback seguro para não quebrar o build do Next.js
  }
}
