// src/lib/github/service.ts
export async function getArticlesWithRetry(retries = 2): Promise<any[]> {
  try {
    const res = await fetch("https://api.github.com/...", {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      next: { revalidate: 3600 }, // Cache de 1 hora
    });

    if (!res.ok) throw new Error("Falha no GitHub");
    return res.json();
  } catch (error) {
    if (retries > 0) return getArticlesWithRetry(retries - 1);
    console.error("GitHub offline:", error);
    return []; // Retorna vazio em vez de estourar erro
  }
}
