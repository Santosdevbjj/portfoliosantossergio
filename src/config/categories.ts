// src/config/categories.ts

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
  "Outros": 99
};

export const TOPIC_TO_CATEGORY: Record<string, string> = {
  "data-science": "Ciência de Dados",
  "ciencia-de-dados": "Ciência de Dados",
  "databricks": "Azure Databricks",
  "azure-databricks": "Azure Databricks",
  "neo4j": "Neo4J",
  "graph-analysis": "Neo4J",
  "power-bi": "Power BI e Análise de Dados",
  "data-analysis": "Power BI e Análise de Dados",
  "analise-de-dados": "Power BI e Análise de Dados", // Adicionado para cobertura total
  "excel": "Excel",
  "sql": "Banco de Dados",
  "database": "Banco de Dados",
  "banco-de-dados": "Banco de Dados", // Adicionado
  "python": "Python",
  "dotnet": "C# / .NET",
  "csharp": "C# / .NET",
  "java": "Java",
  "machine-learning": "Machine Learning",
  "ia": "Inteligência Artificial",
  "ai": "Inteligência Artificial",
  "artificial-intelligence": "Inteligência Artificial", // Adicionado
  "amazon-aws": "Amazon AWS",
  "aws": "Amazon AWS",
  "cybersecurity": "Cibersegurança",
  "ciberseguranca": "Cibersegurança", // Adicionado
  "programming-logic": "Lógica de Programação",
  "logica-de-programacao": "Lógica de Programação", // Adicionado
  "html": "HTML", 
  "react": "Node - React - TS",
  "nextjs": "Node - React - TS",
  "typescript": "Node - React - TS",
  "node": "Node - React - TS", // Adicionado
  "articles": "Artigos Técnicos",
  "artigos": "Artigos Técnicos", // Adicionado para redundância
  "artigos-tecnicos": "Artigos Técnicos" // ADICIONADO (A tag que você usa no GitHub)
};
