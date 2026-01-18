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

👨‍💻 SOBRE MIM
Analista de Ciência de Dados com base sólida em sistemas críticos bancários e foco em transformar dados em decisões, redução de custos e eficiência operacional.

Atuei por mais de 15 anos no Banco Bradesco em ambientes regulados de missão crítica, onde segurança, governança e continuidade do negócio eram requisitos essenciais. Essa experiência me deu visão sistêmica, capacidade de análise de risco e disciplina operacional — competências que hoje aplico diretamente em projetos de dados.

Atualmente direciono minha atuação para Ciência de Dados e Inteligência Artificial, aplicando o rigor de sistemas críticos à criação de modelos preditivos, análises avançadas e automação de processos.

Utilizo Python, SQL, Azure Databricks e Neo4J para desenvolver pipelines governados, construir modelos e gerar insights acionáveis com impacto no negócio — conectando dados técnicos à tomada de decisão corporativa.

Meu foco é transformar dados em inteligência estratégica, garantindo soluções escaláveis, seguras e alinhadas aos desafios de negócios modernos.

EXPERIÊNCIA TÉCNICA
Sistemas críticos desenvolvidos:
• Sistema automatizado de IPVA que eliminou 2.920 horas anuais de processamento manual
• Infraestrutura de rede corporativa para 500+ usuários com 99,5% de disponibilidade
• Sistemas jurídicos interdepartamentais com rastreabilidade completa e conformidade LGPD

Stack consolidado: Visual Basic, C, SQL Server, Windows Server, Emulação Mainframe IBM, Active Directory
Stack em atualização: Java, C#/.NET, Python, Azure Databricks, Azure AI, Power BI, Machine Learning, Docker, Neo4J (bancos de dados de grafos)

TRANSIÇÃO E RESKILLING
Desde 2008 atuo como consultor independente enquanto invisto em atualização contínua através de bootcamps e certificações especializadas. Recentemente concluí formação em Ciência de Dados com Python e Neo4J para análise de dados com grafos — habilidade aplicável a cenários de detecção de fraudes, análise de relacionamentos e compliance em ambientes corporativos.

Formações concluídas: Santander Coders, Microsoft AI Agents, IBM AI Fundamentals, Azure Databricks, Azure Cloud, Java, C#/.NET, Cibersegurança, Power BI, Ciência de Dados.

Os projetos deste portfólio refletem essa transição de sistemas legados para tecnologias modernas, com foco em análise de dados e governança.

DIFERENCIAL
Combino profundo conhecimento de ambientes regulados (compliance bancário, segurança de dados, auditoria) com capacidade técnica para modernizar infraestrutura legada e aplicar análise avançada de dados. Experiência prática em avaliar não apenas viabilidade técnica, mas também riscos, conformidade e impacto organizacional de cada solução.

OBJETIVO
Busco oportunidades em projetos que envolvam governança de dados, modernização de infraestrutura ou sistemas corporativos regulados — preferencialmente em formato remoto ou híbrido — onde minha experiência bancária e stack técnico diversificado possam gerar impacto mensurável.`,
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

👨‍💻 ABOUT ME
Data Science Analyst with a solid background in critical banking systems and a focus on transforming data into decisions, cost reduction, and operational efficiency.

I worked for more than 15 years at Banco Bradesco in regulated mission-critical environments, where security, governance, and business continuity were essential. This experience gave me a systemic view, risk analysis capability, and operational discipline — skills I now apply directly to data projects.

Currently, I direct my efforts toward Data Science and Artificial Intelligence, applying the rigor of critical systems to the creation of predictive models, advanced analysis, and process automation.

I use Python, SQL, Azure Databricks, and Neo4J to develop governed pipelines, build models, and generate actionable insights with business impact — connecting technical data to corporate decision-making.

My focus is on transforming data into strategic intelligence, ensuring scalable, secure solutions aligned with modern business challenges.

TECHNICAL EXPERIENCE
Critical systems developed:
• Automated IPVA system that eliminated 2,920 annual hours of manual processing
• Corporate network infrastructure for 500+ users with 99.5% availability
• Interdepartmental legal systems with full traceability and LGPD (Brazilian Data Protection Law) compliance

Consolidated Stack: Visual Basic, C, SQL Server, Windows Server, IBM Mainframe Emulation, Active Directory
Stack in updating: Java, C#/.NET, Python, Azure Databricks, Azure AI, Power BI, Machine Learning, Docker, Neo4J (graph databases)

TRANSITION AND RESKILLING
Since 2008, I have been working as an independent consultant while investing in continuous updates through bootcamps and specialized certifications. Recently, I completed training in Data Science with Python and Neo4J for graph data analysis — a skill applicable to fraud detection scenarios, relationship analysis, and compliance in corporate environments.

Completed training: Santander Coders, Microsoft AI Agents, IBM AI Fundamentals, Azure Databricks, Azure Cloud, Java, C#/.NET, Cybersecurity, Power BI, Data Science.

The projects in this portfolio reflect this transition from legacy systems to modern technologies, focusing on data analysis and governance.

DIFFERENTIAL
I combine deep knowledge of regulated environments (banking compliance, data security, auditing) with the technical capacity to modernize legacy infrastructure and apply advanced data analysis. Practical experience in evaluating not only technical feasibility but also risks, compliance, and organizational impact of each solution.

OBJECTIVE
I am looking for opportunities in projects involving data governance, infrastructure modernization, or regulated corporate systems — preferably in a remote or hybrid format — where my banking experience and diversified technical stack can generate measurable impact.`,
    cvButton: "Download CV (EN)",
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

👨‍💻 SOBRE MÍ
Analista de Ciencia de Dados com base sólida em sistemas críticos bancários e foco em transformar dados em decisões, redução de custos e eficiência operacional.

Atuei por mais de 15 anos no Banco Bradesco em ambientes regulados de missão crítica, onde segurança, governança e continuidade do negócio eram requisitos essenciais. Esta experiência me deu uma visão sistêmica, capacidade de análise de riscos e disciplina operativa — competências que hoje aplico diretamente em projetos de dados.

Actualmente, dirijo mi actuación hacia la Ciencia de Datos e Inteligencia Artificial, aplicando el rigor de los sistemas críticos a la creación de modelos predictivos, análisis avanzados y automatización de procesos.

Utilizo Python, SQL, Azure Databricks y Neo4J para desarrollar pipelines governados, construir modelos y generar insights accionables con impacto en el negocio — conectando datos técnicos a la toma de decisiones corporativas.

Mi enfoque es transformar datos en inteligencia estratégica, garantizando soluciones escalables, seguras y alineadas con los desafíos comerciales modernos.

EXPERIENCIA TÉCNICA
Sistemas críticos desenvolvidos:
• Sistema automatizado de IPVA que eliminou 2.920 horas anuais de processamento manual
• Infraestructura de red corporativa para más de 500 usuarios con 99,5% de disponibilidad
• Sistemas legales interdepartamentales con trazabilidad completa y cumplimiento de LGPD (Ley de Protección de Datos)

Stack consolidado: Visual Basic, C, SQL Server, Windows Server, Emulación de Mainframe IBM, Active Directory
Stack en actualización: Java, C#/.NET, Python, Azure Databricks, Azure AI, Power BI, Machine Learning, Docker, Neo4J (bases de datos de grafos)

TRANSICIÓN Y RESKILLING
Desde 2008 actúo como consultor independiente mientras invierto en actualización continua a través de bootcamps y certificaciones especializadas. Recientemente completé mi formación en Ciencia de Datos con Python y Neo4J para el análisis de datos con grafos, una habilidad aplicable a escenarios de detección de fraudes, análisis de relaciones y cumplimiento en entornos corporativos.

Formaciones completadas: Santander Coders, Microsoft AI Agents, IBM AI Fundamentals, Azure Databricks, Azure Cloud, Java, C#/.NET, Ciberseguridad, Power BI, Ciencia de Datos.

Los proyectos de este portafolio reflejan esta transición de sistemas heredados a tecnologías modernas, con un enfoque en el análisis de datos y la gobernanza.

DIFERENCIAL
Combino un profundo conocimiento de entornos regulados (cumplimiento bancario, seguridad de datos, auditoria) con la capacidad técnica para modernizar la infraestructura heredada y aplicar análisis de datos avanzados. Experiencia práctica en evaluar no solo la viabilidad técnica, sino también los riesgos, el cumplimiento y el impacto organizacional de cada solución.

OBJETIVO
Busco oportunidades en proyectos que involucren gobernanza de datos, modernización de infraestructura o sistemas corporativos regulados, preferiblemente en formato remoto o híbrido, donde mi experiencia bancaria y mi stack técnico diversificado puedan generar un impacto mensurable.`,
    cvButton: "Descargar CV (ES)",
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
