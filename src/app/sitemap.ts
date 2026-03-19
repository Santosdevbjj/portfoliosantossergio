import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";
import { getAllArticlesRecursively } from "@/lib/github-scanner";

/**
 * CONFIGURAÇÃO SITEMAP - NEXT.JS 16.2.0 + TS 6.0
 * -----------------------------------------------------------------------------
 * ✔ Node 24: Uso de process.env['KEY'] para compatibilidade com TS 6
 * ✔ React 19: Otimizado para geração assíncrona
 * ✔ SEO: Implementação estrita de hreflang (alternates)
 */

// Acesso seguro via colchetes para TS 6.0
const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, "");
const lastModified = new Date();

// Rotas base do sistema
const pages = [
  "",
  "about",
  "experience",
  "projects",
  "artigos",
  "contact",
] as const;

/**
 * Constrói o objeto de idiomas alternativos para evitar conteúdo duplicado.
 */
function buildAlternates(pathname: string) {
  const languages: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((locale) => {
    languages[locale] = `${baseUrl}/${locale}${pathname}`;
  });
  // x-default aponta para o seu idioma principal (pt-BR)
  languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${pathname}`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. Entrada da Raiz (Canonical)
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "daily",
    priority: 1,
  };

  // 2. Páginas Estáticas Multilingues
  // Resolve o erro 404 garantindo que as rotas batam com /[lang]/page
  const localizedPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    pages.map((page) => {
      const pathname = page ? `/${page}` : "";
      return {
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 0.9 : 0.8,
        alternates: buildAlternates(pathname),
      };
    })
  );

  // 3. Artigos Dinâmicos (Markdown do GitHub)
  let articles: MetadataRoute.Sitemap = [];
  try {
    const dynamicArticlesData = await getAllArticlesRecursively();
    articles = dynamicArticlesData.flatMap((art) => {
      const slugPath = Array.isArray(art.slug) ? art.slug.join("/") : art.slug;
      return SUPPORTED_LOCALES.map((locale) => ({
        url: `${baseUrl}/${locale}/artigos/${slugPath}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: buildAlternates(`/artigos/${slugPath}`),
      }));
    });
  } catch (e) {
    console.error("❌ Erro ao gerar sitemap de artigos:", e);
  }

  // 4. Documentos PDFs Oficiais (Mapeamento Exato conforme sua lista)
  // Corrigido para evitar 404: usamos os locais exatos que você forneceu.
  const documents: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: `${baseUrl}/pdf/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 5. Ativos de Imagem Estratégicos (Google Imagens SEO)
  const keyImages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/images/sergio-santos-profile.png`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
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
