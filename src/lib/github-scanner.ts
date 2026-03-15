// src/lib/github-scanner.ts

export interface DynamicArticle {
  slug: string[]; // ex: ["ia-artigos", "meu-novo-artigo"]
  category: string;
}

export async function getAllArticlesRecursively(path: string = "artigos"): Promise<DynamicArticle[]> {
  const token = process.env.GITHUB_TOKEN;
  const owner = "Santosdevbjj";
  const repo = "myArticles";

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        "Accept": "application/vnd.github.object+json",
        "X-GitHub-Api-Version": "2026-03-10",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: 3600 } // Cache de 1 hora para não estourar o rate limit
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const items = data.entries || [];
  let articles: DynamicArticle[] = [];

  for (const item of items) {
    if (item.type === "dir") {
      // Se for pasta, entra nela (Recursividade)
      const subDirArticles = await getAllArticlesRecursively(item.path);
      articles = [...articles, ...subDirArticles];
    } else if (item.name.endsWith(".md")) {
      // Se for arquivo MD, limpa o caminho e adiciona na lista
      const relativePath = item.path.replace("artigos/", "").replace(".md", "");
      articles.push({
        slug: relativePath.split("/"),
        category: relativePath.split("/")[0]
      });
    }
  }

  return articles;
}
