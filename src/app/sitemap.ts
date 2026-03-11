import type { MetadataRoute } from "next"
import fs from "fs"
import path from "path"

import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/dictionaries/locales"

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://portfoliosantossergio.vercel.app"
).replace(/\/$/, "")

const lastModified = new Date()

/**
 * páginas principais
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
 * prioridade SEO
 */
function getPriority(page: string, locale: string) {
  if (page === "") {
    return locale === DEFAULT_LOCALE ? 1 : 0.9
  }

  switch (page) {
    case "projects":
      return 0.95
    case "artigos":
      return 0.9
    case "about":
      return 0.85
    case "experience":
      return 0.85
    case "contact":
      return 0.75
    default:
      return 0.7
  }
}

/**
 * frequência
 */
function getChangeFrequency(page: string) {
  if (page === "") return "weekly"
  if (page === "projects") return "weekly"
  if (page === "artigos") return "weekly"
  if (page === "experience") return "monthly"
  return "monthly"
}

/**
 * hreflang alternates
 */
function buildAlternates(pathname: string) {
  const languages: Record<string, string> = {}

  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = `${baseUrl}/${locale}${pathname}`
  }

  languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`

  return { languages }
}

/**
 * descobrir artigos MDX automaticamente
 */
function getArticles(): string[] {
  const articlesDir = path.join(process.cwd(), "content/artigos")

  if (!fs.existsSync(articlesDir)) return []

  return fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(".mdx", ""))
}

export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * ROOT
   */
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: buildAlternates(""),
  }

  /**
   * páginas localizadas
   */
  const localizedPages: MetadataRoute.Sitemap =
    SUPPORTED_LOCALES.flatMap((locale: SupportedLocale) =>
      pages.map((page) => {
        const pathname = page ? `/${page}` : ""

        return {
          url: `${baseUrl}/${locale}${pathname}`,
          lastModified,
          changeFrequency: getChangeFrequency(page),
          priority: getPriority(page, locale),
          alternates: buildAlternates(pathname),
        }
      })
    )

  /**
   * artigos dinâmicos
   */
  const articleSlugs = getArticles()

  const articles: MetadataRoute.Sitemap =
    articleSlugs.flatMap((slug) =>
      SUPPORTED_LOCALES.map((locale) => ({
        url: `${baseUrl}/${locale}/artigos/${slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: buildAlternates(`/artigos/${slug}`),
      }))
    )

  /**
   * documentos públicos
   */
  const documents: MetadataRoute.Sitemap =
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    }))

  return [
    rootEntry,
    ...localizedPages,
    ...articles,
    ...documents,
  ]
}
