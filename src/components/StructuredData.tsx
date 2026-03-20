// src/components/StructuredData.tsx
export default function StructuredData({ lang }: { lang: string }) {
  const baseUrl = "https://portfoliosantossergio.vercel.app";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "Sérgio Santos",
        "jobTitle": "Cientista de Dados",
        "url": `${baseUrl}/${lang}`,
        "image": `${baseUrl}/images/sergio-santos-profile.png`,
        "description": "Especialista em Ciência de Dados e Sistemas Críticos.",
        "sameAs": [
          "https://www.linkedin.com/in/santossergioluiz",
          "https://github.com/Santosdevbjj"
        ]
      },
      {
        "@type": "WebSite",
        "url": `${baseUrl}/${lang}`,
        "name": "Sérgio Santos Portfolio",
        "inLanguage": lang
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
