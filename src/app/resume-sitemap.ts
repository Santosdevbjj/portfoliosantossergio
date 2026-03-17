import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl = "https://portfoliosantossergio.vercel.app"

  const langs = ["pt-BR","en-US","es-ES","es-AR","es-MX"]

  const now = new Date()

  const routes: MetadataRoute.Sitemap = []

  for (const lang of langs) {

    // Página HTML do currículo (SEO principal)
    routes.push({
      url: `${baseUrl}/${lang}/resume`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "pt-BR": `${baseUrl}/pt-BR/resume`,
          "en-US": `${baseUrl}/en-US/resume`,
          "es-ES": `${baseUrl}/es-ES/resume`,
          "es-AR": `${baseUrl}/es-AR/resume`,
          "es-MX": `${baseUrl}/es-MX/resume`
        }
      }
    })

    // PDF (indexação direta)
    routes.push({
      url: `${baseUrl}/pdf/cv-sergio-santos-${lang}.pdf`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7
    })
  }

  return routes
}
