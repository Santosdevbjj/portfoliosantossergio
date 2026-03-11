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
   * Páginas do portfólio
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
   * Gera alternates hreflang
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

    if (page === "projects") return 0.9
    if (page === "artigos") return 0.85
    if (page === "about") return 0.8
    if (page === "experience") return 0.8
    if (page === "contact") return 0.7

    return 0.7
  }

  /**
   * Frequência de atualização
   */
  function getChangeFrequency(page: string) {
    if (page === "") return "weekly" as const
    if (page === "projects") return "weekly" as const
    if (page === "artigos") return "weekly" as const

    return "monthly" as const
  }

  /**
   * 1️⃣ Páginas localizadas
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
   * 2️⃣ URL raiz
   */
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: buildAlternates(""),
  }

  /**
   * 3️⃣ Documentos públicos
   */
  const documentEntries: MetadataRoute.Sitemap =
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    }))

  return [rootEntry, ...localizedPages, ...documentEntries]
}
