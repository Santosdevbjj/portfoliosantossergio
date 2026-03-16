import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";
import { getAllArticlesRecursively } from "@/lib/github-scanner";

const baseUrl = "https://portfoliosantossergio.vercel.app";
const lastModified = new Date();

// Lista de rotas base do sistema
const pages = [
  "",
  "about",
  "experience",
  "projects",
  "artigos",
  "contact",
  "resume",
] as const;

/**
 * Gera os links alternativos (hreflang) para o Google não penalizar 
 * por conteúdo duplicado em idiomas semelhantes (es-ES, es-MX, es-AR).
 */
function buildAlternates(pathname: string) {
  const languages: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((locale) => {
    languages[locale] = `${baseUrl}/${locale}${pathname}`;
  });
  languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Entrada Principal (Raiz)
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: buildAlternates(""),
  };

  // 2. Páginas Estáticas em todos os idiomas
  const localizedPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const pathname = page ? `/${page}` : "";
      return {
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified,
        changeFrequency: page === "" || page === "artigos" ? "weekly" : "monthly",
        priority: page === "" ? 0.9 : 0.8,
        alternates: buildAlternates(pathname),
      };
    })
  );

  // 3. Artigos Dinâmicos (Markdown do GitHub)
  const dynamicArticlesData = await getAllArticlesRecursively();
  const articles: MetadataRoute.Sitemap = dynamicArticlesData.flatMap((art) => {
    const slugPath = art.slug.join("/");
    return SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/artigos/${slugPath}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: buildAlternates(`/artigos/${slugPath}`),
    }));
  });

  // 4. Documentos PDFs e Ativos de Imagem Importantes
  // Adicionamos os PDFs para que apareçam em buscas de "Sérgio Santos PDF"
  const documents: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: `${baseUrl}/pdf/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Adicionamos as imagens de troféus e perfil para indexação no Google Imagens
  const keyImages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/images/sergio-santos-profile.png`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/images/trofeus-vencedor-dio.png`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    }
  ];

  return [rootEntry, ...localizedPages, ...articles, ...documents, ...keyImages];
}
