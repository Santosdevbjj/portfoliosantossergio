import type { MetadataRoute } from "next"
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/dictionaries/locales"

const baseUrl = "https://portfoliosantossergio.vercel.app"
const lastModified = new Date()

/**
 * PÁGINAS ESTÁTICAS DO SISTEMA
 */
const pages = [
  "",
  "about",
  "experience",
  "projects",
  "artigos",
  "contact",
] as const

/**
 * LISTA DE ARTIGOS (Sincronizado com seu repositório GitHub)
 * Como os artigos são buscados via API, listamos os slugs aqui para o SEO
 */
const articleRoutes = [
  "autoconhecimento/aprend-continuo",
  "autoconhecimento/home-office",
  "autoconhecimento/inteligencia-emocional",
  "aws-artigos/microsservicos-aws-step-functions",
  "azure-cloud-native/azure-cloud-native-article",
  "data-artigos/dados-para-reduzir-custos",
  "data-artigos/privacidade-de-dados",
  "dio_Campus_Expert_14/analise-grafos-carreira",
  "dio_Campus_Expert_14/conclusao-dio-Campus-Expert14",
  "dio_Campus_Expert_14/contrato-compromisso",
  "dio_Campus_Expert_14/neo4J-dados-conectados",
  "dio_Campus_Expert_14/resultados-concretos-jornada",
  "dotnet-artigos/visual-studio-vscode-guia-das-ides",
  "ia-artigos/ia-generativa-com-sete-guardrails",
  "ia-artigos/implementar-ia-generativa-com-eficiencia",
  "java-artigos/java-pensar-como-engenheiro-software",
  "low_code/low-code-saude",
  "python-artigos/pycharm-spyder-vscode-ides",
  "typescript-artigos/typescript-strict-padrao",
]

/**
 * CONSTRUTOR DE ALTERNATES (SEO Internacional)
 */
function buildAlternates(pathname: string) {
  const languages: Record<string, string> = {}
  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = `${baseUrl}/${locale}${pathname}`
  }
  languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`
  return { languages }
}

export default function sitemap(): MetadataRoute.Sitemap {
  
  // 1. Entrada da Raiz (/)
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: buildAlternates(""),
  }

  // 2. Páginas Localizadas (/pt-BR/about, etc.)
  const localizedPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const pathname = page ? `/${page}` : ""
      return {
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified,
        changeFrequency: page === "" || page === "artigos" ? "weekly" : "monthly",
        priority: page === "" ? 0.9 : 0.8,
        alternates: buildAlternates(pathname),
      }
    })
  )

  // 3. Artigos Dinâmicos (Vindo do GitHub mapeado acima)
  const articles: MetadataRoute.Sitemap = articleRoutes.flatMap((slug) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/artigos/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: buildAlternates(`/artigos/${slug}`),
    }))
  )

  // 4. Documentos Públicos (PDFs de currículo)
  const documents: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [rootEntry, ...localizedPages, ...articles, ...documents]
}
