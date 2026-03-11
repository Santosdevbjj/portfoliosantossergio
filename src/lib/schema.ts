export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app"

export function getPersonSchema(dict: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sérgio Santos",
    url: baseUrl,
    image: `${baseUrl}/avatar.png`,
    jobTitle: dict.hero.title || "Analista de Ciência de Dados",
    sameAs: [
      "https://github.com/Santosdevbjj",
      "https://www.linkedin.com/in/santossergioluiz",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Independent Developer",
    },
    description: dict.about.description
  }
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sérgio Santos Portfolio",
    url: baseUrl,
  }
}
