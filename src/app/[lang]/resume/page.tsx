import type { Metadata } from "next"
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader"
import ResumeLangSelector from "@/components/pdf/ResumeLangSelector"
import {
  getResumeContent,
  SUPPORTED_LANGS,
  type Lang,
} from "@/lib/resume/resumeContent"

/**
 * REQUISITOS TÉCNICOS ATENDIDOS:
 * ✔ Next.js 16 (App Router) - Params as Promise
 * ✔ React 19 - Server Components otimizados
 * ✔ TypeScript 6.0 - Tipagem estrita e segura
 * ✔ Tailwind CSS 4.2 - Classes utilitárias modernas
 * ✔ Totalmente Responsivo & Multilingue (PT, EN, ES-ES, ES-AR, ES-MX)
 */

interface Props {
  params: Promise<{ lang: string }>
}

export const dynamic = "force-static"
export const revalidate = 3600

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({
    lang,
  }))
}

function resolveLang(param: string): Lang {
  return SUPPORTED_LANGS.includes(param as Lang)
    ? (param as Lang)
    : "en-US"
}

/**
 * ✅ SEO Metadata Corrigido (Async params)
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = resolveLang(langParam);
  const seo = getResumeContent(lang);

  const siteUrl = "https://portfoliosantossergio.vercel.app"

  return {
    title: seo.title,
    description: seo.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
      languages: {
        "pt-BR": `${siteUrl}/pt-BR/resume`,
        "en-US": `${siteUrl}/en-US/resume`,
        "es-ES": `${siteUrl}/es-ES/resume`,
        "es-AR": `${siteUrl}/es-AR/resume`,
        "es-MX": `${siteUrl}/es-MX/resume`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/${lang}/resume`,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `Resume Sérgio Santos - ${lang}`,
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
 * ✅ Página Principal do Currículo
 */
export default async function ResumePage(props: Props) {
  // O segredo para funcionar no Next.js 16:
  const { lang: langParam } = await props.params;
  const lang = resolveLang(langParam);
  const seo = getResumeContent(lang);

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
    <main className="mx-auto w-full max-w-6xl px-4 py-12 min-h-screen animate-in fade-in duration-700">
      
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: seo.name,
          jobTitle: seo.title,
          description: seo.description,
          url: `https://portfoliosantossergio.vercel.app/${lang}/resume`,
          image: "https://portfoliosantossergio.vercel.app/images/sergio-santos-profile.png",
          knowsAbout: seo.skills,
        }}
      />

      {/* HEADER - Responsivo e Moderno */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">
          {currentContent.h1}
        </h1>

        <div className="w-20 h-2 bg-blue-600 mx-auto mb-8 rounded-full shadow-lg shadow-blue-500/20" />

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          {currentContent.p}
        </p>
      </header>

      {/* SELETOR DE IDIOMAS */}
      <nav className="mb-16 flex justify-center" aria-label="Seletor de idioma do currículo">
        <ResumeLangSelector />
      </nav>

      {/* VISUALIZADOR DE PDF - Responsividade Fluída */}
      <section className="w-full flex justify-center transition-all duration-500 ease-in-out">
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <PdfSafeLoader fileUrl={pdfMap[lang]} lang={lang} />
        </div>
      </section>

    </main>
  )
}
