/**
 * src/lib/github/service.ts
 * Implementação Sênior (v2026)
 * STATUS: CORRIGIDO (Nome da Variável de Ambiente: GITHUB_ACCESS_TOKEN)
 * STACK: Next.js 16.2.2, React 19, TS 6.0.2, Node 24
 */
import { Octokit } from "octokit";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { cache } from "react";
import { headers } from "next/headers";
import type { GitHubItem } from "./types";

// 1. Extensão do Octokit com plugin de paginação
const MyOctokit = Octokit.plugin(paginateRest);

// CORREÇÃO: Lendo a variável conforme configurado no Dashboard da Vercel
const GITHUB_TOKEN = process.env["GITHUB_ACCESS_TOKEN"]?.trim();

// 2. Inicialização segura
const octokit = new MyOctokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";
const API_VERSION = "2026-03-10";

/**
 * Busca artigos no GitHub utilizando octokit.paginate.
 * O uso do cache('react') evita múltiplas requisições idênticas no mesmo ciclo de render.
 */
export const getArticlesWithRetry = cache(async (retries = 2): Promise<GitHubItem[]> => {
  try {
    // Workaround Next 16.2: headers() para garantir contexto dinâmico
    try {
      await headers();
    } catch {
      /* Fallback build-time */
    }

    if (!GITHUB_TOKEN) {
      console.error(
        "[GitHub Service] ERRO CRÍTICO: GITHUB_ACCESS_TOKEN não encontrado nas variáveis de ambiente."
      );
      return [];
    }

    // 3. Execução da paginação para buscar todos os arquivos dentro de /artigos
    const files: any[] = await octokit.paginate(
      octokit.rest.repos.getContent,
      {
        owner: OWNER,
        repo: REPO,
        path: "artigos",
        per_page: 100,
        headers: {
          "X-GitHub-Api-Version": API_VERSION,
          "User-Agent": "Portfolio-Sergio-Santos-v2026",
        },
      },
      (response): any[] => {
        // Filtra apenas arquivos .md
        if (Array.isArray(response.data)) {
          return response.data.filter(
            (item: any) =>
              item.type === "file" &&
              item.name.endsWith(".md") &&
              !item.name.toLowerCase().includes("readme")
          );
        }
        return [];
      }
    );

    // 4. Processamento dos arquivos
    const articles: GitHubItem[] = files.map((item: any) => {
      const fullPath = item.path;
      const pathParts = fullPath.split("/");

      // Lógica de Categoria: artigos/[categoria]/arquivo.md
      const categoryName =
        pathParts.length > 2 ? pathParts[pathParts.length - 2] : "geral";
      const safeCategory: string = categoryName || "geral";
      const fileName = pathParts[pathParts.length - 1] || "artigo.md";

      return {
        name: fileName,
        path: fullPath,
        url: item.url,
        type: "file",
        download_url: item.download_url,
        category: safeCategory,
      };
    });

    console.log(`[GitHub Service] Sucesso: ${articles.length} artigos encontrados.`);
    return articles;
  } catch (error: any) {
    console.error(
      `[GitHub Service] Falha na requisição (Tentativas restantes: ${retries}): ${error.message}`
    );

    if (retries > 0) {
      const wait = (3 - retries) * 1000;
      await new Promise((r) => setTimeout(r, wait));
      return getArticlesWithRetry(retries - 1);
    }

    return [];
  }
});
