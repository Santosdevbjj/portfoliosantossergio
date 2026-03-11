import type { Metadata } from "next"

export const siteConfig = {
  name: "Sergio Santos",
  title: "Sergio Santos — Software Engineer",
  description:
    "Portfolio of Sergio Santos — Software Engineer specialized in Next.js, React, TypeScript and modern web architecture.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app",
  ogImage: "/og-image.png",
  author: "Sergio Santos",
  links: {
    github: "https://github.com/Santosdevbjj",
    linkedin: "https://www.linkedin.com/in/santossergioluiz",
  },
}

export function absoluteUrl(path: string = "") {
  const base = siteConfig.url.replace(/\/$/, "")
  return `${base}${path}`
}

export function buildMetadata({
  title,
  description,
  path = "",
}: {
  title?: string
  description?: string
  path?: string
}): Metadata {
  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title

  const metaDescription = description ?? siteConfig.description

  const url = absoluteUrl(path)

  return {
    title: metaTitle,
    description: metaDescription,

    metadataBase: new URL(siteConfig.url),

    authors: [{ name: siteConfig.author }],

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [absoluteUrl("/twitter-image")],
      creator: "@sergiosantos",
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
  }
}
