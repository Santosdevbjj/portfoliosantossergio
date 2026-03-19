/**
 * LIB: Resume Content (SSO - Single Source of Truth)
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Suporte a SEO programático e metadados dinâmicos.
 * ✔ TypeScript 6.0: Acesso via colchetes para variáveis de ambiente.
 * ✔ Node 24: Otimização de strings e constantes de mapeamento.
 * ✔ Multilingue: PT-BR, EN-US, ES-ES, ES-AR, ES-MX.
 */

// CORREÇÃO TS 6: Acesso seguro ao index signature do process.env
export const BASE_URL =
  process.env['NEXT_PUBLIC_BASE_URL'] ||
  "https://portfoliosantossergio.vercel.app";

export const SUPPORTED_LANGS = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX"
] as const;

export type Lang = typeof SUPPORTED_LANGS[number];

export interface ResumeContent {
  lang: Lang;
  name: string;
  title: string;
  description: string;
  skills: string[];
  pdfUrl: string;
  resumeUrl: string;
  ogImage: string;
  keywords: string[];
}

/**
 * Utilitários de Resolução de Caminhos (Node 24 Optimized)
 */
const getPdfUrl = (lang: Lang) => `/pdf/cv-sergio-santos-${lang}.pdf`;

const getResumeUrl = (lang: Lang) => `${BASE_URL}/${lang}/resume`;

const getOgImage = (lang: Lang) => `${BASE_URL}/og/og-image-${lang}.png`;

export const resumeContent: Record<Lang, ResumeContent> = {
  "pt-BR": {
    lang: "pt-BR",
    name: "Sérgio Santos",
    title: "Especialista em Ciência de Dados e Inteligência Artificial",
    description:
      "Currículo de Sérgio Santos, especialista em Data Science, IA generativa, Python, Java, Cloud e Arquitetura de Sistemas Críticos.",
    skills: ["Python", "Machine Learning", "IA Generativa", "Cloud Azure", "Sistemas Críticos", "Node.js 24"],
    pdfUrl: getPdfUrl("pt-BR"),
    resumeUrl: getResumeUrl("pt-BR"),
    ogImage: getOgImage("pt-BR"),
    keywords: ["currículo cientista de dados", "engenheiro de IA", "sistemas de missão crítica", "portfólio data science"]
  },

  "en-US": {
    lang: "en-US",
    name: "Sergio Santos",
    title: "Data Science and AI Specialist",
    description:
      "Resume of Sergio Santos, expert in Data Science, Generative AI, Python, Java, Cloud Computing and Critical Systems Architecture.",
    skills: ["Python", "Machine Learning", "Generative AI", "Azure Cloud", "Critical Systems", "Node.js 24"],
    pdfUrl: getPdfUrl("en-US"),
    resumeUrl: getResumeUrl("en-US"),
    ogImage: getOgImage("en-US"),
    keywords: ["data scientist resume", "AI engineer CV", "critical systems architecture", "data science portfolio"]
  },

  "es-ES": {
    lang: "es-ES",
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum de Sergio Santos, experto en Data Science, IA generativa, Python y arquitectura de sistemas críticos.",
    skills: ["Python", "Machine Learning", "IA Generativa", "Azure", "Sistemas Críticos"],
    pdfUrl: getPdfUrl("es-ES"),
    resumeUrl: getResumeUrl("es-ES"),
    ogImage: getOgImage("es-ES"),
    keywords: ["currículum data scientist", "ingeniero IA", "sistemas críticos", "portafolio ciencia de datos"]
  },

  "es-AR": {
    lang: "es-AR",
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum profesional de Sergio Santos, especialista en Data Science e IA para sistemas de alta disponibilidad.",
    skills: ["Python", "Data Science", "IA Generativa", "Cloud Computing", "Arquitectura"],
    pdfUrl: getPdfUrl("es-AR"),
    resumeUrl: getResumeUrl("es-AR"),
    ogImage: getOgImage("es-AR"),
    keywords: ["curriculum data science", "ingeniero IA", "tecnología argentina", "portfolio ciencia de datos"]
  },

  "es-MX": {
    lang: "es-MX",
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum profesional de Sergio Santos, especialista en Data Science e IA con enfoque en arquitectura escalable.",
    skills: ["Python", "Ciencia de Datos", "IA Generativa", "Azure MX", "MLOps"],
    pdfUrl: getPdfUrl("es-MX"),
    resumeUrl: getResumeUrl("es-MX"),
    ogImage: getOgImage("es-MX"),
    keywords: ["curriculum data science", "ingeniero IA", "tecnología méxico", "portfolio ciencia de datos"]
  }
};

/**
 * Segurança de idioma (Type-Safe)
 */
export function getResumeContent(lang: string): ResumeContent {
  const isSupported = SUPPORTED_LANGS.includes(lang as Lang);
  return isSupported ? resumeContent[lang as Lang] : resumeContent["en-US"];
}

/**
 * Utilitário para geração de Sitemaps e SEO Dinâmico (Next.js 16.2.0)
 */
export function getAllResumes(): ResumeContent[] {
  return Object.values(resumeContent);
}
