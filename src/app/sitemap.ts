import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";
import { getArticlesWithRetry } from "@/lib/github/service";

/**
 * CONFIGURAÇÃO SITEMAP - NEXT.JS 16.2.1 + TS 6.0.2
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, "");
  const lastModified = new Date();

  // Rotas estáticas principais
  const pages = ["", "about", "experience", "projects", "artigos", "contact", "resume"] as const;

  // Helper para construir os alternates (hreflang) multilingues
  const buildAlternates = (pathname: string) => {
    const languages: Record<string, string> = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${pathname}`;
    });
    // SEO: x-default deve apontar para a versão principal (pt-BR)
    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`;
    return { languages };
  };

  // 1. Páginas Estáticas Multilingues
  const localizedPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const pathname = page ? `/${page}` : "";
      const frequency: "daily" | "weekly" = page === "" ? "daily" : "weekly";

      return {
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified,
        changeFrequency: frequency,
        priority: page === "" ? 1.0 : 0.8,
        alternates: buildAlternates(pathname),
      };
    })
  );

  // 2. Artigos Dinâmicos do GitHub
  let articles: MetadataRoute.Sitemap = [];
  try {
    const gitHubItems = await getArticlesWithRetry();
    articles = gitHubItems.flatMap((item) => {
      const slug = item.path.replace(/^artigos\//, "").replace(/\.md$/, "");
      
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

  // 3. Documentos PDFs Oficiais (CVs por idioma)
  const documents: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: `${baseUrl}/pdf/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 4. Imagens Estratégicas para o Google Images
  const keyImages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/images/sergio-santos-profile.png`,
      lastModified,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/images/trofeus-vencedor-dio.png`,
      lastModified,
      priority: 0.5,
    }
  ];

  return [...localizedPages, ...articles, ...documents, ...keyImages];
}
