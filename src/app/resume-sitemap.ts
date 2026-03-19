import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";

/**
 * CONFIGURAÇÃO SITEMAP DE CURRÍCULOS - NEXT.JS 16.2 + TS 6.0
 * -----------------------------------------------------------------------------
 * ✔ Resolve Erro 404: Mapeamento exato das rotas /[lang]/resume
 * ✔ TypeScript 6.0: Acesso via process.env['KEY']
 * ✔ Node 24: Performance otimizada para loops de metadados
 */

export default function sitemap(): MetadataRoute.Sitemap {
  // Acesso seguro para evitar falha no build do Vercel (TS 6.0 pattern)
  const baseUrl = (
    process.env['NEXT_PUBLIC_SITE_URL'] ?? 
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const now = new Date();

  // 1. Gerar Alternates dinamicamente para evitar erro de duplicidade no Google
  const buildAlternates = (path: string) => {
    const languages: Record<string, string> = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${path}`;
    });
    // Define o padrão para usuários fora das regiões mapeadas
    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${path}`;
    return { languages };
  };

  const routes: MetadataRoute.Sitemap = [];

  // Mapeamos os idiomas suportados para garantir consistência com o page.tsx
  SUPPORTED_LOCALES.forEach((lang) => {
    
    // A: PÁGINA HTML (Acessível via /[lang]/resume)
    // Essencial para o Google Search Console indexar o conteúdo visual
    routes.push({
      url: `${baseUrl}/${lang}/resume`,
      lastModified: now,
      changeFrequency: "weekly", // Currículo muda pouco, mas a indexação deve ser frequente
      priority: 0.9,
      alternates: buildAlternates("/resume")
    });

    // B: ARQUIVO PDF FÍSICO (Acessível via /pdf/cv-sergio-santos-[lang].pdf)
    // Isso permite que o PDF apareça diretamente nos resultados de busca de arquivos
    routes.push({
      url: `${baseUrl}/pdf/cv-sergio-santos-${lang}.pdf`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    });
  });

  return routes;
}
