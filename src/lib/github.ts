// src/lib/github.ts
import { cache } from "react";
import type { GitHubRepo } from "@/types/github";

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
export async function getArticleContent(slugArray: string[]) {
  // Converte o array ["ia-artigos", "meu-artigo"] em "ia-artigos/meu-artigo"
  const fullPath = slugArray.join("/");
  
  try {
    const res = await fetch(`${RAW_BASE_URL}/${fullPath}.md`, {
      // Cache do Next.js: mantém os dados por 1 hora (3600 segundos)
      next: { 
        revalidate: 3600,
        tags: [`article-${fullPath}`]
      },
    });

    if (!res.ok) {
      console.warn(`⚠️ Artigo não encontrado no GitHub: ${fullPath}`);
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
 * Busca repositórios do usuário de forma otimizada para Next.js 15/16.
 */
export const getPortfolioRepos = cache(
  async (username: string): Promise<GitHubRepo[]> => {
    const token = process.env.GITHUB_TOKEN;

    try {
      const res = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=100&type=owner&sort=updated`,
        {
          headers: {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
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
      }

      if (!res.ok) {
        throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
      }

      const data: GitHubRepo[] = await res.json();

      // Filtra apenas repositórios originais (não forks)
      return data.filter(repo => !repo.fork);
      
    } catch (error) {
      console.error("❌ Falha ao buscar repositórios do GitHub:", error);
      return [];
    }
  }
);
