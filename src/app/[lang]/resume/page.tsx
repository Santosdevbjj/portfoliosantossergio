import type { Metadata } from "next"
import Script from "next/script"
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
 * ✅ GERAÇÃO ESTÁTICA (OBRIGATÓRIO)
 */
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({
    lang,
  }))
}

/**
 * ✅ SEO Metadata
 */
export function generateMetadata({ params }: Props): Metadata {
  const lang: Lang = SUPPORTED_LANGS.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en-US"

  const seo = getResumeContent(lang)
  const siteUrl = "https://portfoliosantossergio.vercel.app"

  return {
    title: seo.title,
    description: seo.description,

    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
    },

    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/${lang}/resume`,
      images: [seo.ogImage],
      type: "profile",
    },
  }
}

/**
 * Página principal
 */
export default function ResumePage({ params }: Props) {
  const lang: Lang = SUPPORTED_LANGS.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en-US"

  const seo = getResumeContent(lang)
  const pdfFile = seo.pdfUrl

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
    <main className="container mx-auto px-4 py-12 min-h-screen selection:bg-blue-600/10">
      
      {/* ✅ JSON-LD SEGURO (SEM QUEBRAR BUILD) */}
      <Script
        id="resume-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: seo.name,
            jobTitle: seo.title,
            description: seo.description,
            url: seo.resumeUrl,
            image:
              "https://portfoliosantossergio.vercel.app/images/sergio-santos-profile.png",
            knowsAbout: seo.skills,
          }),
        }}
      />

      {/* HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          {currentContent.h1}
        </h1>

        <div className="w-20 h-2 bg-blue-600 mx-auto mb-6 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]" />

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          {currentContent.p}
        </p>
      </header>

      {/* SELETOR */}
      <ResumeLangSelector />

      {/* PDF */}
      <section className="w-full max-w-5xl mx-auto flex justify-center">
        <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
      </section>
    </main>
  )
}
