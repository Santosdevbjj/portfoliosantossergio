// src/config/categories.ts

/**
 * Ordem oficial das categorias exibidas no portfólio
 * Não alterar os números sem atualizar a UI
 */
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
  "CSS": 16,
  "Javascript": 17,
  "Typescript": 18,
  "Next.js": 19,
  "Node": 20,
  "React": 21,
  "Artigos Técnicos": 22,
  "Outros": 99,
};

/**
 * Mapeia topics do GitHub para categorias do portfólio
 */
export const TOPIC_TO_CATEGORY: Record<string, string> = {
  // DATA SCIENCE
  "data-science": "Ciência de Dados",
  "ciencia-de-dados": "Ciência de Dados",

  // AZURE / DATABRICKS
  "databricks": "Azure Databricks",
  "azure-databricks": "Azure Databricks",
  "azure": "Azure Databricks",
  "azure-cloud": "Azure Databricks",

  // NEO4J
  "neo4j": "Neo4J",
  "graph-analysis": "Neo4J",
  "analise-de-grafos": "Neo4J",

  // POWER BI / ANALYTICS
  "power-bi": "Power BI e Análise de Dados",
  "data-analysis": "Power BI e Análise de Dados",
  "analise-de-dados": "Power BI e Análise de Dados",

  // EXCEL
  "excel": "Excel",

  // DATABASE
  "sql": "Banco de Dados",
  "database": "Banco de Dados",
  "banco-de-dados": "Banco de Dados",

  // PYTHON
  "python": "Python",

  // .NET
  "dotnet": "C# / .NET",
  "csharp": "C# / .NET",

  // JAVA
  "java": "Java",

  // MACHINE LEARNING
  "machine-learning": "Machine Learning",

  // ARTIFICIAL INTELLIGENCE
  "ia": "Inteligência Artificial",
  "ai": "Inteligência Artificial",
  "artificial-intelligence": "Inteligência Artificial",
  "inteligencia-artificial": "Inteligência Artificial",

  // AWS
  "amazon-aws": "Amazon AWS",
  "aws": "Amazon AWS",

  // CYBERSECURITY
  "cybersecurity": "Cibersegurança",
  "ciberseguranca": "Cibersegurança",

  // PROGRAMMING LOGIC
  "programming-logic": "Lógica de Programação",
  "logica-de-programacao": "Lógica de Programação",

  // FRONTEND
  "html": "HTML",
  "css": "CSS",
  "javascript": "Javascript",
  "typescript": "Typescript",

  // FRAMEWORKS
  "next": "Next.js",
  "nextjs": "Next.js",
  "next.js": "Next.js",

  "node": "Node",
  "nodejs": "Node",

  "react": "React",

  // ARTICLES
  "articles": "Artigos Técnicos",
  "artigos": "Artigos Técnicos",
  "artigos-tecnicos": "Artigos Técnicos",
};
