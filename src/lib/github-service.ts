// src/lib/github-service.ts
import { CATEGORY_ORDER, TOPIC_TO_CATEGORY } from "@/config/categories";
import type { GitHubRepo, ProcessedProject } from "@/types/github";

/**
 * FUNÇÃO PRINCIPAL DE PROCESSAMENTO
 * ✔ Filtra apenas repositórios do usuário (evita forks e projetos de terceiros)
 * ✔ Exige a tag 'portfolio'
 * ✔ Processa a estrutura de Pipes (|)
 * ✔ TS 6.0 & Next.js 16 Compliant
 */
export function processRepositories(repos: GitHubRepo[], username: string): ProcessedProject[] {
  if (!repos || !Array.isArray(repos)) return [];

  return repos
    .filter(repo => {
      // TRAVA DE SEGURANÇA: 
      // 1. Deve ter a tag 'portfolio'
      // 2. Não pode ser Fork (agora reconhecido pelo TS)
      // 3. O dono deve ser o usuário configurado
      const hasTag = repo.topics?.includes("portfolio");
      const isNotFork = !repo.fork;
      const isMine = repo.owner?.login.toLowerCase() === username.toLowerCase();
      
      return hasTag && isNotFork && isMine;
    })
    .map(repo => {
      // 1. Processamento dos Pipes (|)
      const descriptionParts = repo.description?.split("|") || [];
      const problem = descriptionParts[0]?.trim() || "Descrição não definida";
      const solution = descriptionParts[1]?.trim() || "";
      const impact = descriptionParts[2]?.trim() || "";

      // 2. Determinação da Categoria
      let category = "Outros";
      const matchedCategories = (repo.topics ?? [])
        .map(topic => TOPIC_TO_CATEGORY[topic])
        .filter((cat): cat is string => typeof cat === 'string');

      if (matchedCategories.length > 0) {
        matchedCategories.sort((a, b) => (CATEGORY_ORDER[a] ?? 99) - (CATEGORY_ORDER[b] ?? 99));
        category = matchedCategories[0] ?? "Outros";
      }

      return {
        id: repo.id,
        name: repo.name,
        url: repo.html_url,
        liveUrl: repo.homepage,
        problem,
        solution,
        impact,
        isFeatured: repo.topics.includes("featured") || repo.topics.includes("destaque"),
        isHead: repo.topics.includes("primeiro"),
        category,
        technologies: repo.topics.filter(t => 
          !["portfolio", "destaque", "featured", "primeiro"].includes(t)
        ),
      };
    })
    .sort((a, b) => {
      // ORDEM DE PRIORIDADE:
      // 1. Tag "primeiro" (Cabeça do portfólio)
      if (a.isHead && !b.isHead) return -1;
      if (!a.isHead && b.isHead) return 1;

      // 2. Tag "featured/destaque" (Cards principais)
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 3. Ordem das Categorias definida no config
      const orderA = CATEGORY_ORDER[a.category] ?? 99;
      const orderB = CATEGORY_ORDER[b.category] ?? 99;
      if (orderA !== orderB) return orderA - orderB;

      // 4. Alfabeto (Desempate)
      return a.name.localeCompare(b.name);
    });
}
