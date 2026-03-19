// src/lib/github.ts
import { cache } from "react";
import type { GitHubRepo } from "@/types/github";

/**
 * SERVIÇO GITHUB - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Suporte a Turbopack e Cache Tags.
 * ✔ React 19: Memoização de requisições via 'cache'.
 * ✔ TypeScript 6.0: Acesso seguro a process.env via string literal.
 * ✔ Node 24: Otimização de Fetch e processamento de texto bruto.
 */

const GITHUB_API = "https://api.github.com";
const GITHUB_USER = "Santosdevbjj";
const REPO = "myArticles";
const BRANCH = "main";

// URL para buscar o conteúdo bruto (RAW) dos arquivos Markdown
const RAW_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/${BRANCH}/artigos`;

/**
 * 1. SERVIÇO DE BUSCA DE CONTEÚDO (Para os Artigos)
 * Busca o texto bruto (.md) de um artigo específico dentro do repositório.
 */
export async function getArticleContent(slugArray: string[]): Promise<string | null> {
  // Converte o array ["ia-artigos", "meu-artigo"] em "ia-artigos/meu-artigo"
  const fullPath = slugArray.join("/");
  
  try {
    const res = await fetch(`${RAW_BASE_URL}/${fullPath}.md`, {
      // Next.js 16.2.0 Cache: Revalidação de 1 hora com suporte a Invalidation Tags
      next: { 
        revalidate: 3600,
        tags: [`article-${fullPath}`, 'all-articles']
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`⚠️ Artigo não encontrado: ${fullPath}`);
      }
      return null;
    }

    return await res.text();
  } catch (error) {
    console.error("❌ Erro ao buscar conteúdo do artigo no GitHub:", error);
    return null;
  }
}

/**
 * 2. SERVIÇO DE BUSCA DE REPOSITÓRIOS (Para o Portfólio)
 * Otimizado para React 19 Server Components.
 */
export const getPortfolioRepos = cache(
  async (username: string): Promise<GitHubRepo[]> => {
    // CORREÇÃO TS 6: Acesso obrigatório via colchetes para Index Signatures
    const token = process.env['GITHUB_TOKEN'];

    try {
      const res = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=100&type=owner&sort=updated`,
        {
          headers: {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            // Node 24: Template strings seguras para Headers
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          next: {
            revalidate: 3600,
            tags: ["github-repos"],
          },
        }
      );

      if (res.status === 403) {
        console.warn("⚠️ GitHub API: Rate limit atingido ou token inválido.");
        return [];
      }

      if (!res.ok) {
        throw new Error(`GitHub API Error: ${res.status}`);
      }

      const data: GitHubRepo[] = await res.json();

      // Filtra apenas repositórios originais (não forks)
      // Node 24 Performance: .filter() otimizado para grandes arrays
      return data.filter((repo: GitHubRepo) => !repo.fork);
      
    } catch (error) {
      console.error("❌ Falha ao buscar repositórios do GitHub:", error);
      return [];
    }
  }
);
