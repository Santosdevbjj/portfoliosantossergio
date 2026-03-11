export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://portfoliosantossergio.vercel.app"

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sergio Santos",
    url: baseUrl,
    image: `${baseUrl}/avatar.png`,
    jobTitle: "Software Engineer",
    sameAs: [
      "https://github.com/Santosdevbjj",
      "https://www.linkedin.com/in/santossergioluiz",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Independent Developer",
    },
  }
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sergio Santos Portfolio",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function articleSchema({
  title,
  description,
  slug,
  datePublished,
}: {
  title: string
  description: string
  slug: string
  datePublished: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: "Sergio Santos",
    },
    datePublished,
    url: `${baseUrl}/artigos/${slug}`,
  }
}

export function projectSchema({
  name,
  description,
  repo,
}: {
  name: string
  description: string
  repo: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    codeRepository: repo,
    author: {
      "@type": "Person",
      name: "Sergio Santos",
    },
  }
}
