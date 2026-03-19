/**
 * LIB: GitHub Scanner (Recursivo)
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Fetch API com revalidação baseada em tempo (Turbopack).
 * ✔ TypeScript 6.0: Correção de Index Signature Access em process.env.
 * ✔ Node 24: Otimização de processamento de strings e recursão.
 */

export interface DynamicArticle {
  slug: string[]; // ex: ["ia-artigos", "meu-novo-artigo"]
  category: string;
}

/**
 * Busca todos os artigos (.md) recursivamente no repositório do GitHub.
 * TS 6.0: Exige acesso via string literal para propriedades de index signature.
 */
export async function getAllArticlesRecursively(
  path: string = "artigos"
): Promise<DynamicArticle[]> {
  // CORREÇÃO TS 6: Acesso via colchetes para evitar erro de Index Signature
  const token = process.env['GITHUB_TOKEN'];
  const owner = "Santosdevbjj";
  const repo = "myArticles";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          "Accept": "application/vnd.github.object+json",
          "X-GitHub-Api-Version": "2026-03-10", // API de Missão Crítica (GitHub 2026)
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        // Next.js 16.2.0 Cache Strategy
        next: { 
          revalidate: 3600, 
          tags: ['github-articles'] 
        } 
      }
    );

    if (!res.ok) {
      console.error(`[GitHub API] Erro: ${res.status} em ${path}`);
      return [];
    }

    const data = await res.json();
    
    /**
     * Node 24 & TS 6: Garantia de tipagem do retorno da API
     */
    const items = (data.entries || []) as any[];
    let articles: DynamicArticle[] = [];

    // Processamento assíncrono paralelo para melhor performance no Node 24
    const results = await Promise.all(
      items.map(async (item) => {
        if (item.type === "dir") {
          // Recursividade otimizada
          return await getAllArticlesRecursively(item.path);
        } else if (typeof item.name === "string" && item.name.endsWith(".md")) {
          // Normalização do caminho (slug)
          const relativePath = item.path.replace("artigos/", "").replace(".md", "");
          const slugArray = relativePath.split("/");
          
          return [{
            slug: slugArray,
            category: slugArray[0] || "Geral"
          }];
        }
        return [];
      })
    );

    // Achata o array de resultados (Flatten)
    articles = results.flat();
    return articles;

  } catch (error) {
    console.error("❌ [Scanner] Erro na busca de artigos:", error);
    return [];
  }
}
