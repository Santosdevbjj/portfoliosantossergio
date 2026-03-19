/**
 * LIB: JSON-LD Structured Data (SEO)
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Otimizado para metadados dinâmicos e Turbopack.
 * ✔ TypeScript 6.0: Acesso seguro a process.env via ['KEY'].
 * ✔ Node 24: Manipulação eficiente de strings para Schemas.
 * ✔ SEO: Integrado com Person, WebSite, Article e SoftwareSourceCode.
 */

// CORREÇÃO TS 6: Acesso via colchetes para evitar erro de Index Signature
export const baseUrl =
  process.env['NEXT_PUBLIC_SITE_URL'] ??
  "https://portfoliosantossergio.vercel.app";

/**
 * Schema de Pessoa (Sérgio Santos)
 * Utiliza a foto oficial e links sociais.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sérgio Santos",
    url: baseUrl,
    // Aponta para a imagem oficial confirmada por você
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
    knowsAbout: [
      "Data Science",
      "Artificial Intelligence",
      "Critical Systems",
      "Next.js 16",
      "Python"
    ]
  };
}

/**
 * Schema do Website com busca integrada
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sérgio Santos | Portfólio de Ciência de Dados & IA",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema para Artigos Técnicos
 * Adaptado para as competições da DIO (Troféus 2025)
 */
export function articleSchema({
  title,
  description,
  slug,
  datePublished,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
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
    url: `${baseUrl}/artigos/${slug}`,
  };
}

/**
 * Schema para Projetos de Software / Repositórios
 */
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
