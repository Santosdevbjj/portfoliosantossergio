// config/categories.ts

export const CATEGORY_ORDER: Record<string, number> = {
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
};

// Mapeia o tópico do GitHub para a categoria visual
export const TOPIC_TO_CATEGORY: Record<string, string> = {
  "data-science": "Ciência de Dados",
  "ciencia-de-dados": "Ciência de Dados",
  "azure-databricks": "Azure Databricks",
  "neo4j": "Neo4J",
  "power-bi": "Power BI e Análise de Dados",
  "excel": "Excel",
  "sql": "Banco de Dados",
  "python": "Python",
  "dotnet": "C# / .NET",
  "java": "Java",
  "machine-learning": "Machine Learning",
  "ia": "Inteligência Artificial",
  "ai": "Inteligência Artificial",
  "amazon-aws": "Amazon AWS",
  "cybersecurity": "Cibersegurança",
  "programming-logic": "Lógica de Programação",
  "html": "HTML", 
  "react": "Node - React - TS",
  "articles": "Artigos Técnicos",
};
