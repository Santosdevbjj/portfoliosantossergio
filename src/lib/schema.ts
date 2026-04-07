/**
 * LIB: JSON-LD Structured Data (SEO) - Sérgio Santos
 * ✔ Integrado com os troféus da DIO e fotos oficiais.
 */

export const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sérgio Santos",
    url: baseUrl,
    image: `${baseUrl}/images/sergio-santos-profile.png`,
    jobTitle: "Cientista de Dados e Especialista em IA",
    description: "Especialista em Ciência de Dados, IA Generativa e Sistemas de Missão Crítica.",
    sameAs: [
      "https://github.com/Santosdevbjj",
      "https://www.linkedin.com/in/santossergioluiz",
      "https://medium.com/@sergiosantosluiz",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Sérgio Santos Consulting",
    },
    knowsAbout: ["Data Science", "Artificial Intelligence", "Critical Systems", "Next.js 16", "Python"]
  };
}

export function websiteSchema(lang: string = "pt-BR") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sérgio Santos | Portfólio",
    url: `${baseUrl}/${lang}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${lang}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema({
  title,
  description,
  slug,
  datePublished,
  image,
  lang = "pt-BR"
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  image?: string;
  lang?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    // Usa a imagem do troféu da DIO como fallback para artigos
    image: image || `${baseUrl}/images/trofeus-vencedor-dio.png`,
    author: {
      "@type": "Person",
      name: "Sérgio Santos",
    },
    datePublished,
    publisher: {
      "@type": "Organization",
      name: "Sérgio Santos",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icons/icon.png`
      }
    },
    url: `${baseUrl}/${lang}/artigos/${slug}`,
  };
}

export function projectSchema({
  name,
  description,
  repo,
}: {
  name: string;
  description: string;
  repo: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    codeRepository: repo,
    programmingLanguage: ["Python", "TypeScript", "SQL"],
    author: {
      "@type": "Person",
      name: "Sérgio Santos",
    },
  };
}
