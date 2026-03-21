export async function getArticlesWithRetry(retries = 2): Promise<any[]> {
  const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];

  if (!GITHUB_TOKEN) {
    throw new Error("Missing GITHUB_TOKEN environment variable");
  }

  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/artigos`;

  async function fetchRecursive(url: string, depth = 0): Promise<any[]> {
    if (depth > 5) return [];

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Sergio-Santos-v16"
      },
      next: { revalidate: 3600, tags: ['github-articles'] },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized - invalid GitHub token");
      }
      throw new Error(`GitHub API Error: ${res.status}`);
    }

    const items = await res.json();

    const promises = items.map(async (item: any) => {
      if (item.type === 'dir') {
        return fetchRecursive(item.url, depth + 1);
      }

      if (item.name.endsWith('.md') && item.name !== 'README.md') {
        return [{
          ...item,
          category: url.split('/').pop() || 'root'
        }];
      }

      return [];
    });

    const results = await Promise.all(promises);
    return results.flat();
  }

  try {
    return await fetchRecursive(BASE_URL);
  } catch (error: any) {
    if (retries > 0 && !error.message.includes("Unauthorized")) {
      console.warn(`[GitHub Service] Retry (${retries})...`);
      await new Promise(r => setTimeout(r, 500));
      return getArticlesWithRetry(retries - 1);
    }

    console.error("[GitHub Service] Erro crítico:", error);
    return [];
  }
}
