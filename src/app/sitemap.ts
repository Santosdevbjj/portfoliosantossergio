import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";
import { getArticlesWithRetry } from "@/lib/github/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://portfoliosantossergio.vercel.app";
  const lastModified = new Date();

  // Rotas estáticas que possuem tradução
  const pages = ["", "about", "experience", "projects", "artigos", "contact", "resume"] as const;

  // Helper para construir os alternates (essencial para evitar o erro de "Cópia sem canônica")
  const buildAlternates = (pathname: string) => {
    const languages: Record<string, string> = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${pathname}`;
    });
    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`;
    return { languages };
  };

  // 1. Páginas Estáticas Multilingues
  const localizedPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const pathname = page ? `/${page}` : "";
      return {
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: buildAlternates(pathname),
      };
    })
  );

  // 2. Artigos Dinâmicos do GitHub (Com slug corrigido)
  let articles: MetadataRoute.Sitemap = [];
  try {
    const gitHubItems = await getArticlesWithRetry();
    articles = gitHubItems.flatMap((item) => {
      // Remove o prefixo da pasta e a extensão .md
      const slug = item.path.split('/').pop()?.replace(/\.md$/, "") || "";
      
      return SUPPORTED_LOCALES.map((locale) => ({
        url: `${baseUrl}/${locale}/artigos/${slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: buildAlternates(`/artigos/${slug}`),
      }));
    });
  } catch (e) {
    console.error("❌ Erro ao gerar sitemap de artigos:", e);
  }

  // 3. Imagens Estratégicas (Importante para aparecer no Google Images)
  const keyImages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/images/sergio-santos-profile.png`,
      lastModified,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/images/trofeus-vencedor-dio.png`,
      lastModified,
      priority: 0.6,
    }
  ];

  return [...localizedPages, ...articles, ...keyImages];
}
