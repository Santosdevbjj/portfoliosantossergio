import type { Metadata } from "next";

/**
 * CONFIGURAÇÃO SEO - PORTFÓLIO SÉRGIO SANTOS
 * ✔ Resolução de erro "Cópia sem página canônica" do Search Console.
 * ✔ Suporte total a hreflang para 5 idiomas.
 */

export const siteConfig = {
  name: "Sérgio Santos",
  title: "Sérgio Santos — Especialista em IA e Ciência de Dados",
  description:
    "Portfólio de Sérgio Santos — Engenheiro de Software especializado em IA Generativa, Next.js, Python e Arquiteturas de Missão Crítica.",
  // Garante que não haja barra no final para evitar duplicidade de //
  url: (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, ""),
  author: "Sérgio Santos",
  links: {
    github: "https://github.com/Santosdevbjj",
    linkedin: "https://www.linkedin.com/in/santossergioluiz",
  },
};

export function absoluteUrl(path: string = "") {
  // Limpa o path para evitar barras duplas (ex: //pt-BR)
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string; // Ex: "/artigos" ou "/artigos/meu-post"
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

  // Garante que o path não venha com o locale duplicado se já for passado no path
  const cleanPath = path.replace(/^\/(pt-BR|en-US|es-ES|es-AR|es-MX)/, "");

  // Define a URL canônica correta para a página atual
  const canonicalUrl = absoluteUrl(`/${lang}${cleanPath}`);
  
  // OG Image: Prioriza imagem do artigo, senão usa a imagem padrão do idioma
  const ogImagePath = image || `/og/og-image-${lang}.png`;

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "pt-br": absoluteUrl(`/pt-BR${cleanPath}`),
        "en-us": absoluteUrl(`/en-US${cleanPath}`),
        "es-es": absoluteUrl(`/es-ES${cleanPath}`),
        "es-ar": absoluteUrl(`/es-AR${cleanPath}`),
        "es-mx": absoluteUrl(`/es-MX${cleanPath}`),
        // x-default é essencial: o Google recomenda apontar para a versão principal 
        // ou para uma página de seleção de idioma.
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
      ],
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
