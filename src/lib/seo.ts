import type { Metadata } from "next"

export const siteConfig = {
  name: "Sérgio Santos",
  title: "Sérgio Santos — Analista de Ciência de Dados",
  description:
    "Portfolio de Sérgio Santos — Especialista em Ciência de Dados, Machine Learning e Engenharia de Software.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app",
  author: "Sérgio Santos",
  links: {
    github: "https://github.com/Santosdevbjj",
    linkedin: "https://www.linkedin.com/in/santossergioluiz",
  },
}

export function absoluteUrl(path: string = "") {
  const base = siteConfig.url.replace(/\/$/, "")
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildMetadata({
  title,
  description,
  path = "",
  locale = "pt-BR",
  verificationGoogle,
}: {
  title?: string
  description?: string
  path?: string
  locale?: string
  verificationGoogle?: string
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const metaDescription = description ?? siteConfig.description
  const url = absoluteUrl(path)

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(siteConfig.url),
    authors: [{ name: siteConfig.author }],
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": absoluteUrl("/pt-BR"),
        "en-US": absoluteUrl("/en-US"),
        "es-ES": absoluteUrl("/es-ES"),
        "es-MX": absoluteUrl("/es-MX"),
        "es-AR": absoluteUrl("/es-AR"),
      },
    },
    verification: {
      google: verificationGoogle, // Mantém sua tag
    },
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(`/og-image-${locale}.png`),
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
      images: [absoluteUrl(`/og-image-${locale}.slice.png`)], // Ajustado para padrão X
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
