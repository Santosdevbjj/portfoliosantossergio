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
  repoTitle: string; // Título da seção de repositórios
  categories: Record<string, string>; // Mapeamento de categorias
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
    aboutText: "Analista de Ciência de Dados com base sólida em sistemas críticos bancários e foco em transformar dados em decisões, redução de custos e eficiência operacional. Atuei por mais de 15 anos no Banco Bradesco...",
    cvButton: "Baixar Currículo (PT)",
    cvLink: "/cv-sergio-santos-pt.pdf",
    repoTitle: "Repositório de Projetos por Tecnologia",
    categories: {
      "Ciência de Dados": "Ciência de Dados",
      "Azure Databricks": "Azure Databricks",
      "Neo4J": "Neo4J",
      "Banco de Dados": "Banco de Dados",
      "Python": "Python",
      "Java": "Java",
      "Machine Learning": "Machine Learning",
      "Cibersegurança": "Cibersegurança",
      "Lógica de Programação": "Lógica de Programação",
      "HTML": "HTML",
      "Artigos Técnicos": "Artigos Técnicos"
    },
    impactStats: [
      { label: "Horas economizadas/ano", value: "2.920" },
      { label: "Disponibilidade de rede", value: "99,5%" },
      { label: "Usuários atendidos", value: "500+" }
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
    role: "Data Science Analyst | Operational Efficiency",
    aboutText: "Data Science Analyst with a solid background in critical banking systems, focusing on transforming data into decisions and cost reduction. I worked for 15+ years at Bradesco Bank...",
    cvButton: "Download Resume (EN)",
    cvLink: "/cv-sergio-santos-en.pdf",
    repoTitle: "Project Repository by Technology",
    categories: {
      "Ciência de Dados": "Data Science",
      "Azure Databricks": "Azure Databricks",
      "Neo4J": "Neo4J",
      "Banco de Dados": "Database",
      "Python": "Python",
      "Java": "Java",
      "Machine Learning": "Machine Learning",
      "Cibersegurança": "Cybersecurity",
      "Lógica de Programação": "Programming Logic",
      "HTML": "HTML",
      "Artigos Técnicos": "Technical Articles"
    },
    impactStats: [
      { label: "Hours saved/year", value: "2,920" },
      { label: "Network availability", value: "99.5%" },
      { label: "Users served", value: "500+" }
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
    role: "Analista de Ciencia de Datos | Eficiencia Operativa",
    aboutText: "Analista de Ciencia de Datos con una sólida base en sistemas bancarios críticos, enfocado en transformar datos en decisiones y reducción de costos. Trabajé por más de 15 años en Banco Bradesco...",
    cvButton: "Descargar Currículum (ES)",
    cvLink: "/cv-sergio-santos-es.pdf",
    repoTitle: "Repositorio de Proyectos por Tecnología",
    categories: {
      "Ciência de Dados": "Ciencia de Datos",
      "Azure Databricks": "Azure Databricks",
      "Neo4J": "Neo4J",
      "Banco de Dados": "Base de Datos",
      "Python": "Python",
      "Java": "Java",
      "Machine Learning": "Machine Learning",
      "Cibersegurança": "Ciberseguridad",
      "Lógica de Programação": "Lógica de Programación",
      "HTML": "HTML",
      "Artigos Técnicos": "Artículos Técnicos"
    },
    impactStats: [
      { label: "Horas ahorradas/año", value: "2.920" },
      { label: "Disponibilidad de red", value: "99,5%" },
      { label: "Usuarios atendidos", value: "500+" }
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
