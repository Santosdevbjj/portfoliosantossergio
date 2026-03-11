// src/lib/github.ts
import { cache } from "react";
import type { GitHubRepo } from "@/types/github";

const GITHUB_API = "https://api.github.com";

/**
 * Busca repositórios do GitHub de forma otimizada para o Next.js 16 / React 19.
 * * Melhorias aplicadas:
 * 1. Headers de Autorização: Adicionado suporte ao GITHUB_TOKEN para evitar Rate Limit.
 * 2. Cache do React 19: O uso de cache() garante a desduplicação de requisições dentro de um mesmo ciclo de renderização.
 * 3. Next.js Fetch: Otimizado com revalidate e tags para controle fino de cache.
 * 4. Tipagem Rigorosa: Tratamento de erros compatível com TypeScript 6.
 */
export const getPortfolioRepos = cache(
  async (username: string): Promise<GitHubRepo[]> => {
    // É altamente recomendável configurar o GITHUB_TOKEN nas variáveis de ambiente da Vercel
    const token = process.env.GITHUB_TOKEN;

    try {
      const res = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=100&type=owner&sort=updated`,
        {
          headers: {
            // Header padrão recomendado pela documentação oficial do GitHub
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          // Cache do Next.js: mantém os dados por 1 hora (3600 segundos)
          next: {
            revalidate: 3600,
            tags: ["github-repos"], // Permite revalidação sob demanda se necessário
          },
        }
      );

      // Tratamento específico de erros da API
      if (res.status === 403) {
        console.warn("⚠️ GitHub API: Rate limit atingido ou token inválido.");
      }

      if (!res.ok) {
        throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
      }

      const data: GitHubRepo[] = await res.json();

      // Opcional: Filtrar apenas repositórios que não são forks
      return data.filter(repo => !repo.fork);
      
    } catch (error) {
      console.error("❌ Falha ao buscar repositórios do GitHub:", error);
      // Retorna um array vazio para evitar que o componente quebre o Layout
      return [];
    }
  }
);
