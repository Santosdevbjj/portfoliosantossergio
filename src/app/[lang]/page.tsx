import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import type { Locale } from "@/types/dictionary"
import type { ProjectDomain } from "@/domain/projects"

import { resolveProjectTechnology } from "@/domain/projects"
import { getServerDictionary } from "@/lib/getServerDictionary"
import { getPortfolioRepos } from "@/lib/github"
import { locales, normalizeLocale } from "@/dictionaries/locales"

import ProxyPage from "@/components/ProxyPage"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ExperienceSection from "@/components/ExperienceSection"
import ContactSection from "@/components/ContactSection"

import PdfSafeLoader from "@/components/pdf/PdfSafeLoader"
import { ResumeLangSelector } from "@/components/pdf/ResumeLangSelector"

import { PortfolioGrid } from "@/components/PortfolioGrid"
import { CareerHighlights } from "@/components/CareerHighlights"
import ConstructionRiskProject from "@/components/ConstructionRiskProject"

interface PageProps {
  params: Promise<{ lang: string }>
}

export const dynamic = "force-static"
export const revalidate = 3600

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
}

/**
 * METADATA (FIX COMPLETO)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params
  const locale = normalizeLocale(rawLang)

  if (!locales.includes(locale)) return {}

  const dict = await getServerDictionary(locale as Locale).catch(() => null)

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const fullUrl = `${siteUrl}/${locale}`

  const description =
    dict?.meta?.description ??
    "Portfólio de Sérgio Santos - Especialista em IA e Data Science"

  const title =
    dict?.meta?.author && dict?.hero?.title
      ? `${dict.meta.author} | ${dict.hero.title}`
      : "Sérgio Santos"

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),

    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },

    openGraph: {
      title,
      description,
      url: fullUrl,
      type: "website",
      images: [
        {
          url: `${siteUrl}/og/og-image-${locale}.png`,
          width: 1200,
          height: 630,
        },
      ],
    },

    other: {
      "fb:app_id": "672839201123456",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/og/og-image-${locale}.png`],
    },
  }
}

/**
 * NORMALIZA REPOSITÓRIOS
 */
function normalizeProjects(repos: unknown): ProjectDomain[] {
  if (!Array.isArray(repos)) return []

  return repos
    .map((repo: any, index): ProjectDomain => {
      const topics = Array.isArray(repo?.topics)
        ? repo.topics.map((t: string) => t.toLowerCase())
        : []

      return {
        id: String(repo?.id ?? index),
        name: (repo?.name ?? "Projeto").replace(/-/g, " "),
        description: repo?.description ?? "",
        htmlUrl: repo?.html_url ?? "",
        homepage: repo?.homepage ?? null,
        topics,
        technology: resolveProjectTechnology(topics),
        isPortfolio: topics.includes("portfolio"),
        isFeatured: topics.includes("featured") || index < 2,
        isFirst: index === 0,
      }
    })
    .filter((p) => p.isPortfolio && p.htmlUrl)
}

/**
 * PAGE COMPONENT (SERVER COMPONENT)
 */
export default async function HomePage({ params }: PageProps) {
  // Em Next.js 16, params é uma Promise que deve ser aguardada
  const { lang: rawLang } = await params
  const locale = normalizeLocale(rawLang)

  if (!locales.includes(locale)) notFound()

  const lang = locale as Locale

  // Chamadas assíncronas em paralelo para performance
  const [dictResult, reposResult] = await Promise.allSettled([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj"),
  ])

  const dict = dictResult.status === "fulfilled" ? dictResult.value : null
  const repos = reposResult.status === "fulfilled" ? reposResult.value : []

  if (!dict) notFound()

  const projects = normalizeProjects(repos)
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`
  const construction = (dict as any)?.construction

  return (
    <ProxyPage lang={lang}>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">

        <HeroSection dictionary={dict} />

        {construction ? (
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4">
              <ConstructionRiskProject dict={construction} />
            </div>
          </section>
        ) : null}

        <section>
          {dict?.about && <AboutSection dict={dict.about} />}
          <div className="mx-auto max-w-7xl px-4 py-12">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {dict?.experience && (
          <ExperienceSection experience={dict.experience} />
        )}

        <section id="projects" className="py-20">
          <div className="mx-auto max-w-7xl px-4 mb-10">
            <h2 className="text-4xl font-black">
              Projetos <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>

          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* SEÇÃO CURRÍCULO - INTEGRADA COM PROPS */}
        <section id="resume" className="py-20">
          <div className="text-center mb-10 px-4">
            <h2 className="text-4xl font-black mb-8">
              Curriculum <span className="text-blue-600">Vitae</span>
            </h2>

            {/* Injeção correta das propriedades para controle de idioma e scroll */}
            <div className="max-w-xs mx-auto">
              <ResumeLangSelector 
                currentLang={lang} 
                dict={dict.resume} 
              />
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
          </div>
        </section>

        <section className="py-20 text-center">
          <Link
            href={`/${lang}/artigos`}
            className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-colors"
          >
            ARTIGOS
          </Link>
        </section>

        <ContactSection
          contact={dict.contact}
          common={dict.common}
          locale={lang}
        />
      </main>
    </ProxyPage>
  )
}
