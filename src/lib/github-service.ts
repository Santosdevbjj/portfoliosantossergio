// src/lib/github-service.ts
import { CATEGORY_ORDER, TOPIC_TO_CATEGORY } from "@/config/categories";
import type { GitHubRepo, ProcessedProject } from "@/types/github";

/**
 * LÓGICA DE PROCESSAMENTO DE DADOS (Next.js 16 + TS 6.0)
 * -----------------------------------------------------------------------------
 * ✔ Filtra: Apenas repositórios com a tag 'portfolio' e que não são forks.
 * ✔ Pipes (|): Divide a descrição em 'Problema', 'Solução' e 'Impacto'.
 * ✔ Categorização: Mapeia tópicos do GitHub para categorias de negócio.
 * ✔ Ordenação: Prioriza tags 'primeiro', 'featured' e ordem de categorias.
 */

export function processRepositories(
  repos: readonly GitHubRepo[], 
  username: string
): ProcessedProject[] {
  if (!repos || !Array.isArray(repos)) return [];

  const normalizedUsername = username.toLowerCase();

  return repos
    .filter((repo): repo is GitHubRepo => {
      // TS 6.0: Verificações rigorosas de nulidade
      const topics = repo.topics ?? [];
      const hasTag = topics.includes("portfolio");
      const isNotFork = !repo.fork;
      const isMine = repo.owner?.login.toLowerCase() === normalizedUsername;
      
      return hasTag && isNotFork && isMine;
    })
    .map((repo): ProcessedProject => {
      // 1. Processamento Resiliente dos Pipes (|)
      // Padrão: "Problema | Solução | Impacto"
      const descriptionParts = repo.description?.split("|") ?? [];
      const problem = descriptionParts[0]?.trim() || "Detalhamento técnico em desenvolvimento.";
      const solution = descriptionParts[1]?.trim() || "";
      const impact = descriptionParts[2]?.trim() || "";

      // 2. Determinação Inteligente da Categoria
      const repoTopics = repo.topics ?? [];
      let category = "Outros";

      // Mapeia tópicos para categorias conhecidas e filtra nulos
      const matchedCategories = repoTopics
        .map(topic => TOPIC_TO_CATEGORY[topic])
        .filter((cat): cat is string => typeof cat === 'string');

      if (matchedCategories.length > 0) {
        // Ordena com base no peso definido no CATEGORY_ORDER config
        matchedCategories.sort((a, b) => 
          (CATEGORY_ORDER[a] ?? 99) - (CATEGORY_ORDER[b] ?? 99)
        );
        category = matchedCategories[0] ?? "Outros";
      }

      // 3. Extração de Tags de Controle (Removidas da lista de tecnologias)
      const controlTags = ["portfolio", "destaque", "featured", "primeiro"];
      const isFeatured = repoTopics.some(t => t === "featured" || t === "destaque");
      const isHead = repoTopics.includes("primeiro");

      return {
        id: repo.id,
        name: repo.name.replace(/-/g, ' '), // Formata nome para exibição (UI)
        url: repo.html_url,
        liveUrl: repo.homepage ?? null,
        problem,
        solution,
        impact,
        isFeatured,
        isHead,
        category,
        // Tecnologias são todos os tópicos que não são de controle/categoria
        technologies: repoTopics.filter(t => 
          !controlTags.includes(t) && !TOPIC_TO_CATEGORY[t]
        ),
      };
    })
    .sort((a, b) => {
      // 1. Prioridade Máxima: Tag "primeiro"
      if (a.isHead && !b.isHead) return -1;
      if (!a.isHead && b.isHead) return 1;

      // 2. Destaques: Tag "featured"
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 3. Ordem de Categoria (Data Engineering > Analytics > etc)
      const orderA = CATEGORY_ORDER[a.category] ?? 99;
      const orderB = CATEGORY_ORDER[b.category] ?? 99;
      if (orderA !== orderB) return orderA - orderB;

      // 4. Fallback: Ordem Alfabética
      return a.name.localeCompare(b.name);
    });
}
