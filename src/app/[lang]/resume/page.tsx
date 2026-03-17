import type { Metadata } from "next"
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader"
import ResumeLangSelector from "@/components/pdf/ResumeLangSelector"
import {
  getResumeContent,
  SUPPORTED_LANGS,
  type Lang,
} from "@/lib/resume/resumeContent"

interface Props {
  params: { lang: string }
}

/**
 * ✅ SSG FORÇADO (evita erro com edge/runtime)
 */
export const dynamic = "force-static"

/**
 * ✅ GERAÇÃO ESTÁTICA
 */
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({
    lang,
  }))
}

/**
 * Helper seguro
 */
function resolveLang(param: string): Lang {
  return SUPPORTED_LANGS.includes(param as Lang)
    ? (param as Lang)
    : "en-US"
}

/**
 * ✅ SEO Metadata
 */
export function generateMetadata({ params }: Props): Metadata {
  const lang = resolveLang(params.lang)
  const seo = getResumeContent(lang)

  const siteUrl = "https://portfoliosantossergio.vercel.app"

  return {
    title: seo.title,
    description: seo.description,

    metadataBase: new URL(siteUrl),

    alternates: {
      canonical: `/${lang}/resume`,
      languages: {
        "pt-BR": "/pt-BR/resume",
        "en-US": "/en-US/resume",
        "es-ES": "/es-ES/resume",
        "es-AR": "/es-AR/resume",
        "es-MX": "/es-MX/resume",
      },
    },

    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/${lang}/resume`,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
        },
      ],
      type: "profile",
    },

    robots: {
      index: true,
      follow: true,
    },
  }
}

/**
 * JSON-LD (SEM Script -> evita bug do Turbopack)
 */
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}

/**
 * Página principal
 */
export default function ResumePage({ params }: Props) {
  const lang = resolveLang(params.lang)
  const seo = getResumeContent(lang)

  const pdfMap: Record<Lang, string> = {
    "pt-BR": "/pdf/cv-sergio-santos-pt-BR.pdf",
    "en-US": "/pdf/cv-sergio-santos-en-US.pdf",
    "es-ES": "/pdf/cv-sergio-santos-es-ES.pdf",
    "es-AR": "/pdf/cv-sergio-santos-es-AR.pdf",
    "es-MX": "/pdf/cv-sergio-santos-es-MX.pdf",
  }

  const content: Record<Lang, { h1: string; p: string }> = {
    "pt-BR": {
      h1: "Currículo Vitae",
      p: "Versão oficial para Ciência de Dados e Engenharia.",
    },
    "en-US": {
      h1: "Resume / CV",
      p: "Official version for Data Science and Engineering.",
    },
    "es-ES": {
      h1: "Currículum Vitae",
      p: "Versión oficial para España.",
    },
    "es-AR": {
      h1: "Currículum Vitae",
      p: "Versión oficial para Argentina.",
    },
    "es-MX": {
      h1: "Currículum Vitae",
      p: "Versión oficial para México.",
    },
  }

  const currentContent = content[lang]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 min-h-screen">
      
      {/* ✅ JSON-LD SEGURO */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: seo.name,
          jobTitle: seo.title,
          description: seo.description,
          url: seo.resumeUrl,
          image:
            "https://portfoliosantossergio.vercel.app/images/sergio-santos-profile.png",
          knowsAbout: seo.skills,
        }}
      />

      {/* HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
          {currentContent.h1}
        </h1>

        <div className="w-16 h-1.5 bg-blue-600 mx-auto mb-6 rounded-full" />

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {currentContent.p}
        </p>
      </header>

      {/* SELETOR */}
      <div className="mb-10 flex justify-center">
        <ResumeLangSelector />
      </div>

      {/* PDF */}
      <section className="w-full flex justify-center">
        <div className="w-full max-w-5xl">
          <PdfSafeLoader fileUrl={pdfMap[lang]} lang={lang} />
        </div>
      </section>
    </main>
  )
}
