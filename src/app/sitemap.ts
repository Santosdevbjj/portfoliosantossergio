import type { MetadataRoute } from "next"
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/dictionaries/locales"

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "")

  const lastModified = new Date()

  /**
   * Páginas principais do portfólio
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
   * Alternates hreflang
   */
  function buildAlternates(path: string) {
    const languages: Record<string, string> = {}

    for (const locale of SUPPORTED_LOCALES) {
      languages[locale] = `${baseUrl}/${locale}${path}`
    }

    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${path}`

    return { languages }
  }

  /**
   * Prioridade SEO
   */
  function getPriority(page: string, locale: string) {

    if (page === "") {
      return locale === DEFAULT_LOCALE ? 1.0 : 0.9
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
   * Frequência de atualização
   */
  function getChangeFrequency(page: string) {

    if (page === "") return "weekly"

    if (page === "projects") return "weekly"

    if (page === "artigos") return "weekly"

    if (page === "experience") return "monthly"

    return "monthly"
  }

  /**
   * 1️⃣ Root canonical
   */
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: buildAlternates(""),
  }

  /**
   * 2️⃣ Páginas localizadas
   */
  const localizedPages: MetadataRoute.Sitemap =
    SUPPORTED_LOCALES.flatMap((locale: SupportedLocale) =>
      pages.map((page) => {

        const path = page ? `/${page}` : ""

        return {
          url: `${baseUrl}/${locale}${path}`,
          lastModified,
          changeFrequency: getChangeFrequency(page),
          priority: getPriority(page, locale),
          alternates: buildAlternates(path),
        }
      })
    )

  /**
   * 3️⃣ Documentos públicos (CV)
   */
  const documents: MetadataRoute.Sitemap =
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    }))

  /**
   * 4️⃣ Preparação futura para artigos dinâmicos
   * (MDX ou CMS)
   */

  const articles: MetadataRoute.Sitemap = []

  return [
    rootEntry,
    ...localizedPages,
    ...documents,
    ...articles,
  ]
}
