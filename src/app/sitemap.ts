// src/app/sitemap.ts
import type { MetadataRoute } from "next"
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from "@/dictionaries/locales"
import { getAllArticlesRecursively } from "@/lib/github-scanner"

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
 * CONSTRUTOR DE ALTERNATES (SEO Internacional)
 * Gera os links hreflang para que o Google entenda as versões traduzidas
 */
function buildAlternates(pathname: string) {
  const languages: Record<string, string> = {}
  
  SUPPORTED_LOCALES.forEach((locale) => {
    languages[locale] = `${baseUrl}/${locale}${pathname}`
  })

  languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`
  
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. Entrada da Raiz (https://portfoliosantossergio.vercel.app)
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: buildAlternates(""),
  }

  // 2. Páginas Localizadas (/pt-BR/about, /en-US/about, etc.)
  const localizedPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const pathname = page ? `/${page}` : ""
      return {
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified,
        changeFrequency: (page === "" || page === "artigos") ? "weekly" : "monthly",
        priority: page === "" ? 0.9 : 0.8,
        alternates: buildAlternates(pathname),
      }
    })
  )

  // 3. Artigos Dinâmicos (Buscados automaticamente do GitHub via Scanner)
  // Agora o scanner varre pastas e subpastas recursivamente
  const dynamicArticlesData = await getAllArticlesRecursively();

  const articles: MetadataRoute.Sitemap = dynamicArticlesData.flatMap((art) => {
    const slugPath = art.slug.join("/");
    return SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/artigos/${slugPath}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: buildAlternates(`/artigos/${slugPath}`),
    }))
  })

  // 4. Documentos Públicos (Currículos PDF na pasta public/)
  const documents: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [rootEntry, ...localizedPages, ...articles, ...documents]
}
