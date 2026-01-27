import type { MetadataRoute } from "next";

/**
 * SITEMAP DINÂMICO — NEXT.JS 15/16 (APP ROUTER)
 * -----------------------------------------------------------------------------
 * Objetivo: Indexação máxima e SEO internacional.
 * Correção: Alterado 'quarterly' para 'monthly' para cumprir a tipagem rigorosa.
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
   * Informa ao Google que as páginas são traduções uma da outra.
   */
  const languagesMap = {
    pt: `${baseUrl}/pt`,
    en: `${baseUrl}/en`,
    es: `${baseUrl}/es`,
    "x-default": `${baseUrl}/pt`,
  };

  /**
   * 1️⃣ Home Pages (Internacionalizadas)
   */
  const localeEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: locale === "pt" ? 1.0 : 0.9,
    alternates: {
      languages: languagesMap,
    },
  }));

  /**
   * 2️⃣ Documentos Estratégicos (CVs)
   * CORREÇÃO: 'quarterly' removido por não ser um valor válido na tipagem do Next.js.
   */
  const documentEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "monthly" as const, // Valor alterado para conformidade técnica
    priority: 0.7,
  }));

  /**
   * 3️⃣ Entrada Raiz (Redirect Target)
   */
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 1.0,
    alternates: {
      languages: languagesMap,
    },
  };

  // Retorna a união de todas as entradas
  return [rootEntry, ...localeEntries, ...documentEntries];
}
