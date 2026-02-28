// src/lib/github-service.ts

/**
 * DEFINIÇÃO DE TIPOS (Interfaces)
 */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  homepage: string | null;
}

export interface ProcessedProject {
  id: number;
  name: string;
  url: string;
  liveUrl: string | null;
  problem: string;
  solution: string;
  impact: string;
  isFeatured: boolean;
  isHead: boolean;
  category: string;
  technologies: string[];
}

/**
 * CONFIGURAÇÃO DE ORDEM E CATEGORIAS
 */
// Usamos Record<string, number> para permitir acesso dinâmico por string sem erro de índice
const CATEGORY_ORDER: Record<string, number> = {
  "Ciência de Dados": 1,
  "Azure Databricks": 2,
  "Neo4J": 3,
  "Power BI e Análise de Dados": 4,
  "Excel": 5,
  "Banco de Dados": 6,
  "Python": 7,
  "C# / .NET": 8,
  "Java": 9,
  "Machine Learning": 10,
  "Inteligência Artificial": 11,
  "Amazon AWS": 12,
  "Cibersegurança": 13,
  "Lógica de Programação": 14,
  "HTML": 15,
  "Node - React - TS": 16,
  "Artigos Técnicos": 17,
  "Outros": 99
};

const TOPIC_TO_CATEGORY: Record<string, string> = {
  "data-science": "Ciência de Dados",
  "ciencia-de-dados": "Ciência de Dados",
  "databricks": "Azure Databricks",
  "azure-databricks": "Azure Databricks",
  "neo4j": "Neo4J",
  "graph-analysis": "Neo4J",
  "power-bi": "Power BI e Análise de Dados",
  "data-analysis": "Power BI e Análise de Dados",
  "analise-de-dados": "Power BI e Análise de Dados",
  "excel": "Excel",
  "database": "Banco de Dados",
  "banco-de-dados": "Banco de Dados",
  "sql": "Banco de Dados",
  "python": "Python",
  "csharp": "C# / .NET",
  "dotnet": "C# / .NET",
  "java": "Java",
  "machine-learning": "Machine Learning",
  "inteligencia-artificial": "Inteligência Artificial",
  "artificial-intelligence": "Inteligência Artificial",
  "ia": "Inteligência Artificial",
  "ai": "Inteligência Artificial",
  "azure": "Azure Databricks",
  "amazon-aws": "Amazon AWS",
  "aws": "Amazon AWS",
  "cybersecurity": "Cibersegurança",
  "ciberseguranca": "Cibersegurança",
  "programming-logic": "Lógica de Programação",
  "logica-de-programacao": "Lógica de Programação",
  "html": "HTML",
  "node": "Node - React - TS",
  "react": "Node - React - TS",
  "typescript": "Node - React - TS",
  "nextjs": "Node - React - TS",
  "articles": "Artigos Técnicos",
  "artigos-tecnicos": "Artigos Técnicos"
};

/**
 * FUNÇÃO PRINCIPAL DE PROCESSAMENTO
 */
export function processRepositories(repos: GitHubRepo[]): ProcessedProject[] {
  if (!repos || !Array.isArray(repos)) return [];

  return repos
    .filter(repo => repo.topics?.includes("portfolio"))
    .map(repo => {
      // 1. Processamento dos Pipes (|)
      const descriptionParts = repo.description?.split("|") || [];
      const problem = descriptionParts[0]?.trim() || "Descrição não definida";
      const solution = descriptionParts[1]?.trim() || "";
      const impact = descriptionParts[2]?.trim() || "";

      // 2. Determinação da Categoria
      let category = "Outros";
      
      // Filtramos tópicos que existem no nosso de-para
      const matchedCategories = repo.topics
        .map(topic => TOPIC_TO_CATEGORY[topic])
        .filter((cat): cat is string => !!cat);

      if (matchedCategories.length > 0) {
        // Ordenação segura para TypeScript 6.0
        matchedCategories.sort((a, b) => {
          const valA = CATEGORY_ORDER[a] ?? 99;
          const valB = CATEGORY_ORDER[b] ?? 99;
          return valA - valB;
        });
        category = matchedCategories[0];
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
      // 1. Prioridade Máxima: Tag "primeiro"
      if (a.isHead && !b.isHead) return -1;
      if (!a.isHead && b.isHead) return 1;

      // 2. Segunda Prioridade: Tag "featured/destaque"
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 3. Terceira Prioridade: Ordem das Categorias (1 a 17)
      const orderA = CATEGORY_ORDER[a.category] ?? 99;
      const orderB = CATEGORY_ORDER[b.category] ?? 99;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // 4. Quarta Prioridade: Alfabeto
      return a.name.localeCompare(b.name);
    });
}
