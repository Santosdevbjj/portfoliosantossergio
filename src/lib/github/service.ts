/**
 * src/lib/github/service.ts
 * * Implementação resiliente seguindo Next.js 16.2.0, React 19 e TS 6.
 * Resolve o erro de acesso ao index signature do process.env.
 */

export async function getArticlesWithRetry(retries = 2): Promise<any[]> {
  // Acessamos via colchetes para satisfazer o TypeScript 6 ou garantimos a tipagem
  const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];
  
  // URL do seu repositório de artigos (ajuste para o seu endpoint real)
  const GITHUB_API_URL = "https://api.github.com/repos/Santosdevbjj/NOME_DO_REPO/contents/artigos";

  try {
    const res = await fetch(GITHUB_API_URL, {
      headers: { 
        // Uso de Template Literals padrão ES2026/Node 24
        Authorization: `Bearer ${GITHUB_TOKEN ?? ''}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Sergio-Santos"
      },
      // Next.js 16.2.0 Data Fetching (Time-based Revalidation)
      next: { 
        revalidate: 3600,
        tags: ['github-articles'] 
      },
    });

    if (!res.ok) {
      // Log detalhado para o Browser Log Forwarding da 16.2
      console.error(`[GitHub Service] Erro HTTP: ${res.status}`);
      throw new Error(`Falha no GitHub: ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    if (retries > 0) {
      console.warn(`[GitHub Service] Tentando novamente... Restam ${retries} tentativas.`);
      return getArticlesWithRetry(retries - 1);
    }
    
    // Fallback silencioso para não quebrar a UI conforme o padrão "Veredito"
    console.error("[GitHub Service] Limite de retentativas atingido ou erro crítico:", error);
    return []; 
  }
}
