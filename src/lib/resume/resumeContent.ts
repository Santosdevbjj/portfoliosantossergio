export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://portfoliosantossergio.vercel.app"

export const SUPPORTED_LANGS = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX"
] as const

export type Lang = typeof SUPPORTED_LANGS[number]

export interface ResumeContent {
  lang: Lang

  name: string
  title: string
  description: string

  skills: string[]

  pdfUrl: string
  resumeUrl: string

  ogImage: string

  keywords: string[]
}

/**
 * PDFs estão em /public/pdf
 */
function getPdfUrl(lang: Lang) {
  return `/pdf/cv-sergio-santos-${lang}.pdf`
}

/**
 * Página de currículo (App Router)
 */
function getResumeUrl(lang: Lang) {
  return `${BASE_URL}/${lang}/resume`
}

/**
 * OG Images estão em /public/og
 */
function getOgImage(lang: Lang) {
  return `${BASE_URL}/og/og-image-${lang}.png`
}

export const resumeContent: Record<Lang, ResumeContent> = {

  "pt-BR": {
    lang: "pt-BR",
    name: "Sérgio Santos",
    title: "Especialista em Ciência de Dados e Inteligência Artificial",
    description:
      "Currículo de Sérgio Santos, especialista em Data Science, IA generativa, Python, Java, Cloud e Arquitetura de Sistemas.",

    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing",
      "AWS",
      "Azure",
      "Arquitetura de Sistemas"
    ],

    pdfUrl: getPdfUrl("pt-BR"),
    resumeUrl: getResumeUrl("pt-BR"),
    ogImage: getOgImage("pt-BR"),

    keywords: [
      "currículo cientista de dados",
      "engenheiro de IA",
      "machine learning currículo",
      "portfólio data science brasil"
    ]
  },

  "en-US": {
    lang: "en-US",
    name: "Sergio Santos",
    title: "Data Science and AI Specialist",
    description:
      "Resume of Sergio Santos, expert in Data Science, Generative AI, Python, Java, Cloud Computing and Systems Architecture.",

    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing",
      "AWS",
      "Azure",
      "AI Engineering"
    ],

    pdfUrl: getPdfUrl("en-US"),
    resumeUrl: getResumeUrl("en-US"),
    ogImage: getOgImage("en-US"),

    keywords: [
      "data scientist resume",
      "AI engineer CV",
      "machine learning engineer resume",
      "data science portfolio"
    ]
  },

  "es-ES": {
    lang: "es-ES",
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum de Sergio Santos, experto en Data Science, IA generativa, Python, Java y arquitectura cloud.",

    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing",
      "AWS",
      "Azure"
    ],

    pdfUrl: getPdfUrl("es-ES"),
    resumeUrl: getResumeUrl("es-ES"),
    ogImage: getOgImage("es-ES"),

    keywords: [
      "currículum data scientist",
      "ingeniero IA",
      "machine learning CV",
      "portafolio data science"
    ]
  },

  "es-AR": {
    lang: "es-AR",
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum profesional de Sergio Santos, especialista en Data Science, IA generativa y arquitectura cloud.",

    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing"
    ],

    pdfUrl: getPdfUrl("es-AR"),
    resumeUrl: getResumeUrl("es-AR"),
    ogImage: getOgImage("es-AR"),

    keywords: [
      "curriculum data science",
      "ingeniero IA",
      "machine learning CV",
      "portfolio tecnologia argentina"
    ]
  },

  "es-MX": {
    lang: "es-MX",
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum profesional de Sergio Santos, especialista en Data Science, IA generativa y arquitectura cloud.",

    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing"
    ],

    pdfUrl: getPdfUrl("es-MX"),
    resumeUrl: getResumeUrl("es-MX"),
    ogImage: getOgImage("es-MX"),

    keywords: [
      "curriculum data science",
      "ingeniero IA",
      "machine learning CV",
      "portafolio tecnologia mexico"
    ]
  }
}

/**
 * Segurança de idioma
 */
export function getResumeContent(lang: string): ResumeContent {
  if (SUPPORTED_LANGS.includes(lang as Lang)) {
    return resumeContent[lang as Lang]
  }

  return resumeContent["en-US"]
}

/**
 * Usado para sitemap, feeds e SEO programático
 */
export function getAllResumes(): ResumeContent[] {
  return Object.values(resumeContent)
}
