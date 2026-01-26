import type { MetadataRoute } from "next";

/**
 * SITEMAP DINÂMICO — NEXT.JS 15 (APP ROUTER)
 * -----------------------------------------------------------------------------
 * Objetivo: Indexação máxima e SEO internacional.
 * Padrão: Protocolo XML Sitemap com suporte a Hreflang.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const lastModified = new Date();
  const locales = ["pt", "en", "es"] as const;

  /**
   * Mapeamento de Alternates (Hreflang)
   * Essencial para o Google não considerar conteúdo duplicado.
   */
  const languagesMap = {
    pt: `${baseUrl}/pt`,
    en: `${baseUrl}/en`,
    es: `${baseUrl}/es`,
    "x-default": `${baseUrl}/pt`,
  };

  /**
   * 1️⃣ Home Pages (Internacionalizadas)
   * Cada entrada informa ao crawler sobre suas "irmãs" em outros idiomas.
   */
  const localeEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "pt" ? 1.0 : 0.9, // Prioridade levemente maior para o idioma principal
    alternates: {
      languages: languagesMap,
    },
  }));

  /**
   * 2️⃣ Documentos Estratégicos (CVs)
   * Indexar o PDF ajuda a aparecer em buscas por "Especialista em Dados Sergio Santos CV".
   */
  const documentEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "quarterly",
    priority: 0.7,
  }));

  /**
   * 3️⃣ Entrada Raiz (Redirect Target)
   */
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "monthly",
    priority: 1.0,
    alternates: {
      languages: languagesMap,
    },
  };

  return [rootEntry, ...localeEntries, ...documentEntries];
}
