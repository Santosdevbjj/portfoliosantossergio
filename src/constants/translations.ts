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
    role: "Analista de Ciência de Dados | Python | SQL | Azure Databricks | Eficiência Operacional e Governança de Dados",
    aboutText: `Seja bem-vindo(a). Sou um profissional com mais de 15 anos de experiência em sistemas de missão crítica no setor bancário, agora dedicando minha atuação a transformar dados em inteligência estratégica e suporte à tomada de decisão.

Utilizo um stack moderno baseado em Python, Azure Databricks, SQL e Neo4J para desenvolver soluções de dados com rigor técnico, conformidade e foco em impacto direto no negócio.

👨‍💻 Sobre mim
Analista de Ciência de Dados com base sólida em sistemas críticos bancários e foco em transformar dados em decisões, redução de custos e eficiência operacional.

Atuei por mais de 15 anos no Banco Bradesco em ambientes regulados de missão crítica, onde segurança, governança e continuidade do negócio eram requisitos essenciais. Essa experiência me deu visão sistêmica, capacidade de análise de risco e disciplina operacional — competências que hoje aplico diretamente em projetos de dados.

Atualmente direciono minha atuação para Ciência de Dados e Inteligência Artificial, aplicando o rigor de sistemas críticos à criação de modelos preditivos, análises avançadas e automação de processos.

Experiência Técnica
Sistemas críticos desenvolvidos:
• Sistema automatizado de IPVA que eliminou 2.920 horas anuais de processamento manual
• Infraestrutura de rede corporativa para 500+ usuários com 99,5% de disponibilidade
• Sistemas jurídicos interdepartamentais com conformidade LGPD

Diferencial
Combino profundo conhecimento de ambientes regulados com capacidade técnica para modernizar infraestrutura legada e aplicar análise avançada de dados.`,
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
    role: "Data Science Analyst | Python | SQL | Azure Databricks | Operational Efficiency & Data Governance",
    aboutText: `Welcome. I am a professional with over 15 years of experience in mission-critical systems in the banking sector, now focusing on transforming data into strategic intelligence and decision support.

I use a modern stack based on Python, Azure Databricks, SQL, and Neo4J to develop data solutions with technical rigor, compliance, and focus on direct business impact.

👨‍💻 About Me
Data Science Analyst with a solid background in critical banking systems and a focus on transforming data into decisions, cost reduction, and operational efficiency.

I worked for more than 15 years at Banco Bradesco in regulated mission-critical environments, where security, governance, and business continuity were essential. This experience gave me a systemic view, risk analysis capability, and operational discipline — skills I now apply directly to data projects.

Technical Experience
Critical systems developed:
• Automated IPVA system that eliminated 2,920 annual hours of manual processing
• Corporate network infrastructure for 500+ users with 99.5% availability
• Interdepartmental legal systems with LGPD compliance

Differential
I combine deep knowledge of regulated environments with technical capacity to modernize legacy infrastructure and apply advanced data analysis.`,
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
    role: "Analista de Ciencia de Datos | Python | SQL | Azure Databricks | Eficiencia Operativa y Gobernanza de Datos",
    aboutText: `Bienvenido(a). Soy un profesional con más de 15 años de experiencia en sistemas de misión crítica en el sector bancario, ahora dedicando mi actuación a transformar datos en inteligencia estratégica y soporte a la toma de decisiones.

Utilizo un stack moderno basado en Python, Azure Databricks, SQL y Neo4J para desarrollar soluciones de datos con rigor técnico, cumplimiento y enfoque en el impacto directo en el negocio.

👨‍💻 Sobre mí
Analista de Ciencia de Datos con una sólida base en sistemas bancarios críticos y enfoque en transformar datos en decisiones, reducción de costos y eficiencia operativa.

Trabajé por más de 15 años en Banco Bradesco en entornos regulados de misión crítica, donde la seguridad, la gobernanza y la continuidad del negocio eran requisitos esenciales. Esta experiencia me dio una visión sistémica, capacidad de análisis de riesgos y disciplina operativa.

Experiencia Técnica
Sistemas críticos desarrollados:
• Sistema automatizado de IPVA que eliminó 2.920 horas anuales de procesamiento manual
• Infraestructura de red corporativa para 500+ usuarios con 99,5% de disponibilidad
• Sistemas legales interdepartamentales con cumplimiento de LGPD

Diferencial
Combino un profundo conocimiento de entornos regulados con la capacidad técnica para modernizar la infraestructura heredada y aplicar análisis de datos avanzados.`,
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
      "cybersecurity": "Cibersegurança",
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
