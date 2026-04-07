import type { Metadata } from "next";

/**
 * CONFIGURAÇÃO SEO - PORTFÓLIO SÉRGIO SANTOS
 * ✔ Resolução de erro "Cópia sem página canônica" do Search Console.
 */

export const siteConfig = {
  name: "Sérgio Santos",
  title: "Sérgio Santos — Especialista em IA e Ciência de Dados",
  description:
    "Portfólio de Sérgio Santos — Engenheiro de Software especializado em IA Generativa, Next.js, Python e Arquiteturas de Missão Crítica.",
  url: process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app",
  author: "Sérgio Santos",
  links: {
    github: "https://github.com/Santosdevbjj",
    linkedin: "https://www.linkedin.com/in/santossergioluiz",
  },
};

export function absoluteUrl(path: string = "") {
  const base = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string; // Ex: "/artigos/meu-post"
  image?: string;
  lang?: "pt-BR" | "en-US" | "es-ES" | "es-AR" | "es-MX";
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  lang = "pt-BR",
}: MetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const metaDescription = description ?? siteConfig.description;

  // Define a URL canônica correta: Base + Idioma + Caminho da página
  // Isso remove o erro de "Cópia sem canônica"
  const canonicalUrl = absoluteUrl(`/${lang}${path}`);
  
  // OG Image baseada no idioma ou imagem personalizada do artigo
  const ogImagePath = image || `/og/og-image-${lang}.png`;

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "pt-BR": absoluteUrl(`/pt-BR${path}`),
        "en-US": absoluteUrl(`/en-US${path}`),
        "es-ES": absoluteUrl(`/es-ES${path}`),
        "es-AR": absoluteUrl(`/es-AR${path}`),
        "es-MX": absoluteUrl(`/es-MX${path}`),
        "x-default": absoluteUrl(`/pt-BR${path}`),
      },
    },
    authors: [{ name: siteConfig.author }],
    openGraph: {
      type: "website",
      locale: lang.replace("-", "_"),
      url: canonicalUrl,
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
