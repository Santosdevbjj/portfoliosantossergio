// components/featured/projects.data.ts
export type Locale = "pt" | "en" | "es";

export type Project = {
  id: string;
  repo: string;
  featured: boolean;
  size: "lg" | "md";
  tags: string[];
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const projects: Project[] = [
  {
    id: "analise-riscos-obras",
    repo: "https://github.com/Santosdevbjj/analiseRiscosAtrasoObras",
    featured: true,
    size: "lg",
    tags: ["Data Science", "Risk Analysis", "Python"],
    title: {
      pt: "Análise de Riscos de Atraso em Obras",
      en: "Construction Delay Risk Analysis",
      es: "Análisis de Riesgos de Retraso en Obras",
    },
    description: {
      pt: "Projeto analítico para prever atrasos em obras usando dados climáticos, fornecedores e cronogramas.",
      en: "Analytical project to predict construction delays using climate, suppliers, and schedule data.",
      es: "Proyecto analítico para predecir retrasos en obras usando datos climáticos, proveedores y cronogramas.",
    },
  },
  {
    id: "analise-dados-pratica",
    repo: "https://github.com/Santosdevbjj/analiseDadosNaPratica",
    featured: true,
    size: "md",
    tags: ["Data Analysis", "Python", "EDA"],
    title: {
      pt: "Análise de Dados na Prática",
      en: "Hands-on Data Analysis",
      es: "Análisis de Datos en la Práctica",
    },
    description: {
      pt: "Estudos práticos de análise exploratória de dados com Python.",
      en: "Practical exploratory data analysis studies using Python.",
      es: "Estudios prácticos de análisis exploratorio de datos con Python.",
    },
  },
  {
    id: "genai-etl",
    repo: "https://github.com/Santosdevbjj/genAIpipeETLPython",
    featured: true,
    size: "md",
    tags: ["GenAI", "ETL", "Pipelines"],
    title: {
      pt: "Pipeline ETL com GenAI",
      en: "GenAI-powered ETL Pipeline",
      es: "Pipeline ETL con GenAI",
    },
    description: {
      pt: "Pipeline ETL automatizado utilizando inteligência artificial generativa.",
      en: "Automated ETL pipeline using generative artificial intelligence.",
      es: "Pipeline ETL automatizado utilizando inteligencia artificial generativa.",
    },
  },
];
