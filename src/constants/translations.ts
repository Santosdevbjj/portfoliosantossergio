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
    aboutText: `Seja bem-vindo(a). Sou um profissional com mais de 15 anos de experiência em sistemas de missão crítica no setor bancário (Bradesco), agora transformando dados em inteligência estratégica.

Utilizo um stack moderno baseado em Python, Azure Databricks, SQL e Neo4J para desenvolver soluções com rigor técnico, conformidade e foco em impacto direto no negócio e eficiência operacional.`,
    cvButton: "Baixar Currículo",
    cvLink: "/cv-sergio-santos-pt.pdf",
    impactStats: [
      { label: "Horas Economizadas/Ano", value: "2.920" },
      { label: "Disponibilidade de Rede", value: "99,5%" },
      { label: "Experiência Bancária", value: "15+ Anos" }
    ],
    featuredArticle: {
      title: "Vencedor DIO: Low-Code na Saúde",
      description: "Artigo premiado sobre a aplicação de plataformas Low-Code no setor médico e aceleração de soluções.",
      links: {
        pt: "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e",
        en: "https://medium.com/@sergiosantosluiz/low-code-in-healthcare-how-to-build-medical-apps-in-weeks-2679bf08ba77",
        es: "https://medium.com/@sergiosantosluiz/low-code-en-la-salud-c%C3%B3mo-crear-apps-m%C3%A9dicos-en-semanas-5474e7dddfad"
      }
    }
  },
  en: {
    role: "Data Science Analyst | Mission-Critical Systems",
    aboutText: `Welcome. I am a professional with over 15 years of experience in mission-critical banking systems (Bradesco), now transforming data into strategic intelligence.

I use a modern stack based on Python, Azure Databricks, SQL, and Neo4J to develop solutions with technical rigor, compliance, and a focus on direct business impact and operational efficiency.`,
    cvButton: "Download Resume",
    cvLink: "/cv-sergio-santos-en.pdf",
    impactStats: [
      { label: "Hours Saved/Year", value: "2,920" },
      { label: "Network Availability", value: "99.5%" },
      { label: "Banking Expertise", value: "15+ Years" }
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
    role: "Analista de Ciencia de Datos | Sistemas de Misión Crítica",
    aboutText: `Bienvenido(a). Soy un profesional con más de 15 años de experiencia en sistemas de misión crítica en el sector bancario (Bradesco), ahora transformando datos en inteligencia estratégica.

Utilizo un stack moderno basado en Python, Azure Databricks, SQL y Neo4J para desarrollar soluciones con rigor técnico, cumplimiento y enfoque en el impacto directo en el negocio y la eficiencia operativa.`,
    cvButton: "Descargar CV",
    cvLink: "/cv-sergio-santos-es.pdf",
    impactStats: [
      { label: "Horas Ahorradas/Año", value: "2.920" },
      { label: "Disponibilidad de Red", value: "99,5%" },
      { label: "Experiencia Bancaria", value: "15+ Años" }
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
