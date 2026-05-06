import type { Metadata } from "next";

/**
 * CONFIGURAÇÃO SEO - PORTFÓLIO SÉRGIO SANTOS
 * ✔ Resolução de erro "Cópia sem página canônica"
 * ✔ Suporte total a hreflang genérico (pt, en, es) e regional (BR, US, ES, AR, MX)
 */

export const siteConfig = {
  name: "Sérgio Santos",
  title: "Sérgio Santos — Especialista em IA e Ciência de Dados",
  description:
    "Portfólio de Sérgio Santos — Engenheiro de Software especializado em IA Generativa, Next.js, Python e Arquiteturas de Missão Crítica.",
  url: (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, ""),
  author: "Sérgio Santos",
  links: {
    github: "https://github.com/Santosdevbjj",
    linkedin: "https://www.linkedin.com/in/santossergioluiz",
  },
};

export function absoluteUrl(path: string = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string; 
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

  // Limpa o path para evitar duplicação de locale
  const cleanPath = path.replace(/^\/(pt-BR|en-US|es-ES|es-AR|es-MX)/, "");

  // URL Canônica absoluta
  const canonicalUrl = absoluteUrl(`/${lang}${cleanPath}`);
  
  const ogImagePath = image || `/og/og-image-${lang}.png`;

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        // Regionais
        "pt-br": absoluteUrl(`/pt-BR${cleanPath}`),
        "en-us": absoluteUrl(`/en-US${cleanPath}`),
        "es-es": absoluteUrl(`/es-ES${cleanPath}`),
        "es-ar": absoluteUrl(`/es-AR${cleanPath}`),
        "es-mx": absoluteUrl(`/es-MX${cleanPath}`),
        
        // GENÉRICOS (Resolve o alerta "Missing region-independent link")
        "pt": absoluteUrl(`/pt-BR${cleanPath}`),
        "en": absoluteUrl(`/en-US${cleanPath}`),
        "es": absoluteUrl(`/es-ES${cleanPath}`),
        
        // Padrão global
        "x-default": absoluteUrl(`/pt-BR${cleanPath}`),
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
      icon: [
        { url: "/icons/favicon.ico", sizes: "any" },
        { url: "/icons/icon.png", type: "image/png", sizes: "32x32" },
        { url: "/icons/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
        { url: "/icons/apple-icon.png", sizes: "180x180" },
      ],
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
    verification: {
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
    },
  };
}
