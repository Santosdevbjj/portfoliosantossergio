import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, "");
  const now = new Date();

  const buildAlternates = (path: string) => {
    const languages: Record<string, string> = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${path}`;
    });
    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${path}`;
    return { languages };
  };

  const routes: MetadataRoute.Sitemap = [];

  SUPPORTED_LOCALES.forEach((lang) => {
    // Página do Currículo (HTML)
    routes.push({
      url: `${baseUrl}/${lang}/resume`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: buildAlternates("/resume")
    });

    // Arquivo PDF (Indexação de documento)
    routes.push({
      url: `${baseUrl}/pdf/cv-sergio-santos-${lang}.pdf`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    });
  });

  return routes;
}
