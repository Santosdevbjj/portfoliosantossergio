// src/lib/github-service.ts

import { CATEGORY_ORDER, TOPIC_TO_CATEGORY } from "@/config/categories";

import type {
  GitHubRepo,
  ProcessedProject
} from "@/types/github";

/**
 * Normaliza tópicos do GitHub.
 */
function normalizeTopics(topics?: readonly string[]): string[] {
  return (topics ?? []).map((t: string) => t.toLowerCase());
}

/**
 * Processa repositórios do GitHub em projetos de portfólio.
 */
export function processRepositories(
  repos: readonly GitHubRepo[],
  username: string
): ProcessedProject[] {

  if (!repos || !Array.isArray(repos)) return [];

  const normalizedUsername = username.toLowerCase();

  return repos

    .filter((repo): repo is GitHubRepo => {

      const topics = normalizeTopics(repo.topics);

      const hasTag = topics.includes("portfolio");

      const isNotFork = !repo.fork;

      const isMine =
        repo.owner?.login?.toLowerCase() === normalizedUsername;

      return hasTag && isNotFork && isMine;
    })

    .map((repo): ProcessedProject => {

      const topics = normalizeTopics(repo.topics);

      const descriptionParts =
        repo.description?.split("|") ?? [];

      const problem =
        descriptionParts[0]?.trim() ||
        "Detalhamento técnico em desenvolvimento.";

      const solution =
        descriptionParts[1]?.trim() || "";

      const impact =
        descriptionParts[2]?.trim() || "";

      let category = "Outros";

      const matchedCategories = topics
        .map(topic => TOPIC_TO_CATEGORY[topic])
        .filter((c): c is string => Boolean(c));

      if (matchedCategories.length > 0) {

        matchedCategories.sort((a, b) =>
          (CATEGORY_ORDER[a] ?? 99) -
          (CATEGORY_ORDER[b] ?? 99)
        );

        category = matchedCategories[0] ?? "Outros";
      }

      const controlTags = [
        "portfolio",
        "featured",
        "destaque",
        "primeiro"
      ];

      const isFeatured =
        topics.includes("featured") ||
        topics.includes("destaque");

      const isHead =
        topics.includes("primeiro");

      const technologies = topics.filter(
        topic =>
          !controlTags.includes(topic) &&
          !TOPIC_TO_CATEGORY[topic]
      );

      return {
        id: repo.id,
        name: repo.name.replace(/-/g, " "),
        url: repo.html_url,
        liveUrl: repo.homepage ?? null,
        problem,
        solution,
        impact,
        isFeatured,
        isHead,
        category,
        technologies,
      };
    })

    .sort((a, b) => {

      if (a.isHead && !b.isHead) return -1;
      if (!a.isHead && b.isHead) return 1;

      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      const orderA = CATEGORY_ORDER[a.category] ?? 99;
      const orderB = CATEGORY_ORDER[b.category] ?? 99;

      if (orderA !== orderB) return orderA - orderB;

      return a.name.localeCompare(b.name);
    });
}
