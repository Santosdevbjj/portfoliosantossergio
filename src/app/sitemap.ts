import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";
import { getArticlesWithRetry } from "@/lib/github/service";

/**
 * CONFIGURAÇÃO SITEMAP - NEXT.JS 16.2.1 + TS 6.0.2
 * -----------------------------------------------------------------------------
 * ✔️ Correção do Erro de Type Check (as const em ternários)
 * ✔️ Compatibilidade com Node 24 e TypeScript 6.0
 * ✔️ SEO Internacional com Hreflang (alternates)
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Acesso seguro via colchetes para TS 6.0 e Node 24
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, "");
  const lastModified = new Date();

  // Rotas estáticas
  const pages = ["", "about", "experience", "projects", "artigos", "contact", "resume"] as const;

  // Helper para construir os alternates (hreflang) de forma robusta
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
      
      // CORREÇÃO TS 6.0: Definindo a frequência antes para evitar erro de asserção no ternário
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

  // 2. Artigos Dinâmicos do GitHub (Usando seu service.ts)
  let articles: MetadataRoute.Sitemap = [];
  try {
    const gitHubItems = await getArticlesWithRetry();
    articles = gitHubItems.flatMap((item) => {
      // Limpeza do slug: remove 'artigos/' e '.md'
      const slug = item.path.replace(/^artigos\//, "").replace(/\.md$/, "");
      
      return SUPPORTED_LOCALES.map((locale) => ({
        url: `${baseUrl}/${locale}/artigos/${slug}`,
        lastModified,
        changeFrequency: "weekly" as const, // Literal direto é aceito pelo TS 6.0
        priority: 0.7,
        alternates: buildAlternates(`/artigos/${slug}`),
      }));
    });
  } catch (e) {
    console.error("❌ Erro ao gerar sitemap de artigos:", e);
  }

  // 3. Documentos PDFs Oficiais (Mapeamento exato da sua lista)
  const documents: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: `${baseUrl}/pdf/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 4. Ativos de Imagem Estratégicos (SEO Google Images)
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
