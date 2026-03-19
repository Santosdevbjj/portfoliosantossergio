import type { Metadata } from "next";

/**
 * CONFIGURAÇÃO SEO - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Metadados dinâmicos com suporte a Turbopack.
 * ✔ TypeScript 6.0: Correção de acesso ao process.env['KEY'].
 * ✔ Node 24: Resolução de URLs otimizada.
 * ✔ Tailwind 4.2: Preparado para renderização de metatags de UI moderna.
 */

export const siteConfig = {
  name: "Sérgio Santos",
  title: "Sérgio Santos — Especialista em IA e Ciência de Dados",
  description:
    "Portfólio de Sérgio Santos — Engenheiro de Software especializado em IA Generativa, Next.js, Python e Arquiteturas de Missão Crítica.",
  // CORREÇÃO TS 6: Acesso via string literal para evitar erro de Index Signature
  url:
    process.env['NEXT_PUBLIC_SITE_URL'] ??
    "https://portfoliosantossergio.vercel.app",
  author: "Sérgio Santos",
  links: {
    github: "https://github.com/Santosdevbjj",
    linkedin: "https://www.linkedin.com/in/santossergioluiz",
  },
};

/**
 * Utilitário para gerar URLs absolutas (Node 24 Optimized)
 */
export function absoluteUrl(path: string = "") {
  const base = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  lang?: "pt-BR" | "en-US" | "es-ES" | "es-AR" | "es-MX";
}

/**
 * Builder de Metadados compatível com Next.js 16.2.0 e React 19
 */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  lang = "pt-BR",
}: MetadataProps = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;

  const metaDescription = description ?? siteConfig.description;

  // Seleciona a OG Image correta baseada no idioma conforme seus novos arquivos
  const ogImagePath = image || `/og/og-image-${lang}.png`;
  const url = absoluteUrl(path);

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": absoluteUrl("/pt-BR"),
        "en-US": absoluteUrl("/en-US"),
        "es-ES": absoluteUrl("/es-ES"),
        "es-AR": absoluteUrl("/es-AR"),
        "es-MX": absoluteUrl("/es-MX"),
      },
    },
    authors: [{ name: siteConfig.author }],
    openGraph: {
      type: "website",
      locale: lang.replace("-", "_"),
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(ogImagePath),
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [absoluteUrl(ogImagePath)],
      creator: "@sergiosantos",
    },
    icons: {
      icon: "/icons/favicon.ico",
      shortcut: "/icons/icon.png",
      apple: "/icons/apple-touch-icon.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
