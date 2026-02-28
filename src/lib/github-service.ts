// src/lib/github-service.ts

export function processRepositories(repos: GitHubRepo[]): ProcessedProject[] {
  return repos
    .filter(repo => repo.topics.includes("portfolio")) // FILTRO CRUCIAL: Remove o que não é seu
    .map(repo => {
      // Split dos Pipes (|)
      const descriptionParts = repo.description?.split("|") || [];
      const problem = descriptionParts[0]?.trim() || "Descrição não informada";
      const solution = descriptionParts[1]?.trim() || "";
      const impact = descriptionParts[2]?.trim() || "";

      // Identificar Categoria baseada nos tópicos e na ordem de prioridade
      let category = "Outros";
      const techTopics = repo.topics.filter(t => TOPIC_TO_CATEGORY[t]);
      if (techTopics.length > 0) {
        // Pega a categoria de maior prioridade se houver múltiplos tópicos
        category = techTopics
          .map(t => TOPIC_TO_CATEGORY[t])
          .sort((a, b) => CATEGORY_ORDER[a] - CATEGORY_ORDER[b])[0];
      }

      return {
        id: repo.id,
        name: repo.name,
        url: repo.html_url,
        liveUrl: repo.homepage,
        problem,
        solution,
        impact,
        isFeatured: repo.topics.includes("destaque") || repo.topics.includes("featured"),
        isHead: repo.topics.includes("primeiro"),
        category,
        technologies: repo.topics.filter(t => 
          !["portfolio", "destaque", "featured", "primeiro"].includes(t)
        ),
      };
    })
    .sort((a, b) => {
      // 1. O "Cabeça" (isHead) sempre primeiro
      if (a.isHead) return -1;
      if (b.isHead) return 1;

      // 2. Destaques (isFeatured) depois
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 3. Ordem por categoria definida por você
      return CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category];
    });
}
