// src/constants/translations.ts

export interface ImpactStat {
  label: string;
  value: string;
}

export interface TranslationContent {
  role: string;
  aboutText: string;
  cvButton: string;
  cvLink: string;
  repoTitle: string;
  excellenceDescription: string;
  categories: Record<string, string>;
  impactStats: ImpactStat[];
  featuredArticle: {
    title: string;
    description: string;
    links: {
      pt: string;
      en: string;
      es: string;
    };
  };
}

export interface ITranslations {
  pt: TranslationContent;
  en: TranslationContent;
  es: TranslationContent;
}

export const translations: ITranslations = {
  pt: {
    role: "Analista de Ciência de Dados | Sistemas de Missão Crítica",
    aboutText: "Analista de Ciência de Dados com base sólida em sistemas críticos bancários e foco em transformar dados em decisões, redução de custos e eficiência operacional. Atuei por mais de 15 anos no Banco Bradesco, liderando automações que otimizaram processos complexos de infraestrutura e governança de dados.",
    cvButton: "Baixar Currículo (PT)",
    cvLink: "/cv-sergio-santos-pt.pdf",
    repoTitle: "Soluções de Dados & Engenharia",
    excellenceDescription: "Premiado pela DIO (Digital Innovation One) por análises técnicas de alto impacto sobre Low-Code na saúde e eficiência operacional.",
    categories: {
      "data-science": "Ciência de Dados",
      "databricks": "Azure Databricks",
      "neo4j": "Banco de Grafo (Neo4J)",
      "database": "Engenharia de Dados",
      "python": "Python & Automação",
      "java": "Desenvolvimento Java",
      "machine-learning": "Inteligência Artificial",
      "cybersecurity": "Cibersegurança",
      "programming-logic": "Lógica & Algoritmos",
      "html": "Front-end",
      "articles": "Publicações Técnicas"
    },
    impactStats: [
      { label: "Horas economizadas/ano", value: "2.920" },
      { label: "Disponibilidade de rede", value: "99,5%" },
      { label: "Projetos no GitHub", value: "40+" }
    ],
    featuredArticle: {
      title: "Vencedor DIO: Low-Code na Saúde",
      description: "Artigo premiado sobre a aplicação de plataformas Low-Code no setor médico.",
      links: {
        pt: "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e",
        en: "https://medium.com/@sergiosantosluiz/low-code-in-healthcare-how-to-build-medical-apps-in-weeks-2679bf08ba77",
        es: "https://medium.com/@sergiosantosluiz/low-code-en-la-salud-c%C3%B3mo-crear-apps-m%C3%A9dicos-en-semanas-5474e7dddfad"
      }
    }
  },
  en: {
    role: "Data Science Analyst | Mission-Critical Systems",
    aboutText: "Data Science Analyst with a solid background in critical banking systems, focusing on transforming data into decisions, cost reduction, and operational efficiency. I worked for 15+ years at Bradesco Bank, leading automations that optimized complex infrastructure and data governance processes.",
    cvButton: "Download Resume (EN)",
    cvLink: "/cv-sergio-santos-en.pdf",
    repoTitle: "Data Solutions & Engineering",
    excellenceDescription: "Awarded by DIO (Digital Innovation One) for high-impact technical analysis on Low-Code in healthcare and operational efficiency.",
    categories: {
      "data-science": "Data Science",
      "databricks": "Azure Databricks",
      "neo4j": "Graph Database (Neo4J)",
      "database": "Data Engineering",
      "python": "Python & Automation",
      "java": "Java Development",
      "machine-learning": "Artificial Intelligence",
      "cybersecurity": "Cybersecurity",
      "programming-logic": "Logic & Algorithms",
      "html": "Front-end",
      "articles": "Technical Publications"
    },
    impactStats: [
      { label: "Hours saved/year", value: "2,920" },
      { label: "Network availability", value: "99.5%" },
      { label: "GitHub Projects", value: "40+" }
    ],
    featuredArticle: {
      title: "DIO Winner: Low-Code in Healthcare",
      description: "Award-winning article on the application of Low-Code platforms in the medical sector.",
      links: {
        pt: "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e",
        en: "https://medium.com/@sergiosantosluiz/low-code-in-healthcare-how-to-build-medical-apps-in-weeks-2679bf08ba77",
        es: "https://medium.com/@sergiosantosluiz/low-code-en-la-salud-c%C3%B3mo-crear-apps-m%C3%A9dicos-en-semanas-5474e7dddfad"
      }
    }
  },
  es: {
    role: "Analista de Ciencia de Datos | Sistemas Críticos",
    aboutText: "Analista de Ciencia de Datos con una sólida base en sistemas bancarios críticos, enfocado en transformar datos en decisiones, reducción de costos y eficiencia operativa. Trabajé por más de 15 años en Banco Bradesco, liderando automatizaciones que optimizaron procesos complejos de infraestructura y gobernanza de datos.",
    cvButton: "Descargar Currículum (ES)",
    cvLink: "/cv-sergio-santos-es.pdf",
    repoTitle: "Soluciones de Datos e Ingeniería",
    excellenceDescription: "Premiado por DIO (Digital Innovation One) por análisis técnicos de alto impacto sobre Low-Code en salud y eficiencia operativa.",
    categories: {
      "data-science": "Ciencia de Datos",
      "databricks": "Azure Databricks",
      "neo4j": "Base de Datos de Grafos (Neo4J)",
      "database": "Ingeniería de Datos",
      "python": "Python y Automatización",
      "java": "Desarrollo Java",
      "machine-learning": "Inteligencia Artificial",
      "cybersecurity": "Ciberseguridad",
      "programming-logic": "Lógica y Algoritmos",
      "html": "Front-end",
      "articles": "Publicaciones Técnicas"
    },
    impactStats: [
      { label: "Horas ahorradas/año", value: "2.920" },
      { label: "Disponibilidad de red", value: "99,5%" },
      { label: "Proyectos en GitHub", value: "40+" }
    ],
    featuredArticle: {
      title: "Ganador DIO: Low-Code en Salud",
      description: "Artículo premiado sobre la aplicación de plataformas Low-Code en el sector médico.",
      links: {
        pt: "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e",
        en: "https://medium.com/@sergiosantosluiz/low-code-in-healthcare-how-to-build-medical-apps-in-weeks-2679bf08ba77",
        es: "https://medium.com/@sergiosantosluiz/low-code-en-la-salud-c%C3%B3mo-crear-apps-m%C3%A9dicos-en-semanas-5474e7dddfad"
      }
    }
  }
};
