import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";
import { getArticlesWithRetry } from "@/lib/github/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://portfoliosantossergio.vercel.app";
  const lastModified = new Date();

  // 1. Definição das páginas estáticas traduzidas
  const pages = ["", "about", "experience", "projects", "artigos", "contact", "resume"] as const;

  // Helper para construir os alternates (Hreflang no Sitemap)
  // Isso evita o erro de "página duplicada sem canônica" no GSC
  const buildAlternates = (pathname: string) => {
    const languages: Record<string, string> = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${pathname}`;
    });
    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`;
    return { languages };
  };

  // 2. Geração das Páginas Estáticas Multilingues
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

  // 3. Artigos Dinâmicos do GitHub
  let articles: MetadataRoute.Sitemap = [];
  try {
    const gitHubItems = await getArticlesWithRetry();
    articles = gitHubItems.flatMap((item) => {
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

  // 4. Arquivos PDF (Currículos por Idioma)
  // Adicionados aqui para garantir indexação no "Google Documentos/Busca"
  const resumePdfs: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((lang) => ({
    url: `${baseUrl}/pdf/cv-sergio-santos-${lang}.pdf`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6, // Prioridade um pouco menor que a página HTML correspondente
  }));

  // 5. Imagens e Ativos Estratégicos (SEO de Imagem)
  const keyImages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/images/sergio-santos-profile.png`, lastModified, priority: 0.5 },
    { url: `${baseUrl}/images/trofeus-vencedor-dio.png`, lastModified, priority: 0.5 },
    // Adicionando as OGs principais para indexação rápida
    ...SUPPORTED_LOCALES.map(lang => ({
      url: `${baseUrl}/og/og-image-${lang}.png`,
      lastModified,
      priority: 0.4
    }))
  ];

  // Retorno final unificado
  return [...localizedPages, ...articles, ...resumePdfs, ...keyImages];
}
