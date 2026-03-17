import { NextRequest, NextResponse } from "next/server"

const BASE_URL = "https://portfoliosantossergio.vercel.app"

const supportedLangs = ["pt-BR","en-US","es-ES","es-AR","es-MX"] as const

type Lang = typeof supportedLangs[number]

const contentMap: Record<Lang, {
  name: string
  role: string
  description: string
  keywords: string[]
}> = {

  "pt-BR": {
    name: "Sérgio Santos",
    role: "Especialista em Ciência de Dados e IA",
    description: "Currículo profissional com foco em Data Science, IA e Engenharia de Software.",
    keywords: [
      "currículo cientista de dados",
      "engenheiro de IA",
      "machine learning currículo"
    ]
  },

  "en-US": {
    name: "Sergio Santos",
    role: "Data Science and AI Specialist",
    description: "Professional resume focused on Data Science, AI and Software Engineering.",
    keywords: [
      "data scientist resume",
      "AI engineer CV",
      "machine learning engineer resume"
    ]
  },

  "es-ES": {
    name: "Sergio Santos",
    role: "Especialista en Ciencia de Datos e IA",
    description: "Currículum profesional enfocado en Data Science, IA y desarrollo de software.",
    keywords: [
      "currículum data scientist",
      "ingeniero IA",
      "machine learning CV"
    ]
  },

  "es-AR": {
    name: "Sergio Santos",
    role: "Especialista en Ciencia de Datos e IA",
    description: "Currículum profesional enfocado en ciencia de datos, IA y software.",
    keywords: [
      "curriculum data science",
      "ingeniero IA",
      "machine learning CV"
    ]
  },

  "es-MX": {
    name: "Sergio Santos",
    role: "Especialista en Ciencia de Datos e IA",
    description: "Currículum profesional enfocado en Data Science, IA y desarrollo de software.",
    keywords: [
      "curriculum data science",
      "ingeniero IA",
      "machine learning CV"
    ]
  }
}

function getPdfUrl(lang: string) {
  return `${BASE_URL}/pdf/cv-sergio-santos-${lang}.pdf`
}

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)

  let lang = searchParams.get("lang") || "en-US"

  if (!supportedLangs.includes(lang as Lang)) {
    lang = "en-US"
  }

  const typedLang = lang as Lang

  const data = contentMap[typedLang]

  const response = {
    lang: typedLang,

    name: data.name,
    role: data.role,
    description: data.description,

    pdfUrl: getPdfUrl(typedLang),

    resumePage: `${BASE_URL}/${typedLang}/resume`,

    keywords: data.keywords,

    alternates: supportedLangs.map(l => ({
      lang: l,
      url: `${BASE_URL}/${l}/resume`
    }))
  }

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  })
}
