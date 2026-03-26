import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";
import { getArticlesWithRetry } from "@/lib/github/service"; // Importação corrigida conforme seu arquivo service.ts

/**
 * CONFIGURAÇÃO SITEMAP - NEXT.JS 16.2.1 + TS 6.0.2
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Acesso via colchetes para TS 6.0
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, "");
  const lastModified = new Date();

  // Páginas base
  const pages = ["", "about", "experience", "projects", "artigos", "contact", "resume"] as const;

  // Helper para Hreflang (SEO Internacional)
  const buildAlternates = (pathname: string) => {
    const languages: Record<string, string> = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${pathname}`;
    });
    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`;
    return { languages };
  };

  // 1. Páginas Estáticas Multilingues (Home, About, etc)
  const localizedPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const pathname = page ? `/${page}` : "";
      return {
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified,
        changeFrequency: (page === "" ? "daily" : "weekly") as const,
        priority: page === "" ? 1.0 : 0.8,
        alternates: buildAlternates(pathname),
      };
    })
  );

  // 2. Artigos Dinâmicos do GitHub (Usando seu service.ts corrigido)
  let articles: MetadataRoute.Sitemap = [];
  try {
    const gitHubItems = await getArticlesWithRetry();
    articles = gitHubItems.flatMap((item) => {
      // Remove a extensão .md para a URL amigável
      const slug = item.path.replace("artigos/", "").replace(".md", "");
      
      return SUPPORTED_LOCALES.map((locale) => ({
        url: `${baseUrl}/${locale}/artigos/${slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: buildAlternates(`/artigos/${slug}`),
      }));
    });
  } catch (e) {
    console.error("❌ Erro ao gerar sitemap de artigos:", e);
  }

  // 3. Documentos PDF (Conforme sua lista oficial)
  const documents: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: `${baseUrl}/pdf/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 4. Imagens Estratégicas (SEO de Imagens)
  const keyImages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/images/sergio-santos-profile.png`, lastModified, priority: 0.5 },
    { url: `${baseUrl}/images/trofeus-vencedor-dio.png`, lastModified, priority: 0.5 }
  ];

  return [...localizedPages, ...articles, ...documents, ...keyImages];
}
