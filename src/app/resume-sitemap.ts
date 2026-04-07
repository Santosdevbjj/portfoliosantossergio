import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://portfoliosantossergio.vercel.app";
  const now = new Date();

  return SUPPORTED_LOCALES.flatMap((lang) => [
    // Rota HTML do currículo (A que o Google prefere indexar)
    {
      url: `${baseUrl}/${lang}/resume`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "pt-BR": `${baseUrl}/pt-BR/resume`,
          "en-US": `${baseUrl}/en-US/resume`,
          "es-ES": `${baseUrl}/es-ES/resume`,
          "es-AR": `${baseUrl}/es-AR/resume`,
          "es-MX": `${baseUrl}/es-MX/resume`,
          "x-default": `${baseUrl}/${DEFAULT_LOCALE}/resume`,
        }
      }
    },
    // O arquivo PDF propriamente dito (Para aparecer na busca de documentos)
    {
      url: `${baseUrl}/pdf/cv-sergio-santos-${lang}.pdf`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8
    }
  ]);
}
