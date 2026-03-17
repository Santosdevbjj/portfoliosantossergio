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
import ResumeLangSelector from "@/components/pdf/ResumeLangSelector"

import { PortfolioGrid } from "@/components/PortfolioGrid"
import { CareerHighlights } from "@/components/CareerHighlights"
import ConstructionRiskProject from "@/components/ConstructionRiskProject"

interface PageProps {
  params: { lang: string }
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
 * METADATA (100% SEGURO)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = normalizeLocale(params.lang)

  if (!locales.includes(locale)) return {}

  const dict = await getServerDictionary(locale as Locale).catch(() => null)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://portfoliosantossergio.vercel.app"

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

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/og/og-image-${locale}.png`],
    },
  }
}

/**
 * NORMALIZA REPOSITÓRIOS (SAFE)
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
 * PAGE (ANTI-CRASH)
 */
export default async function HomePage({ params }: PageProps) {
  const locale = normalizeLocale(params.lang)

  if (!locales.includes(locale)) notFound()

  const lang = locale as Locale

  const [dictResult, reposResult] = await Promise.allSettled([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj"),
  ])

  const dict =
    dictResult.status === "fulfilled" ? dictResult.value : null

  const repos =
    reposResult.status === "fulfilled" ? reposResult.value : []

  if (!dict) notFound()

  const projects = normalizeProjects(repos)

  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`

  return (
    <ProxyPage lang={lang}>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">

        {/* HERO */}
        <HeroSection dictionary={dict} />

        {/* PROJETO RISCO - SAFE */}
        {dict?.construction ? (
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4">
              <ConstructionRiskProject dict={dict.construction} />
            </div>
          </section>
        ) : null}

        {/* ABOUT */}
        <section>
          {dict?.about && <AboutSection dict={dict.about} />}

          <div className="mx-auto max-w-7xl px-4 py-12">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {/* EXPERIENCE */}
        {dict?.experience && (
          <ExperienceSection experience={dict.experience} />
        )}

        {/* PROJECTS */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 mb-10">
            <h2 className="text-4xl font-black">
              Projetos <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>

          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* PDF */}
        <section className="py-20">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black">
              Curriculum <span className="text-blue-600">Vitae</span>
            </h2>

            <ResumeLangSelector />
          </div>

          <div className="max-w-5xl mx-auto">
            <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <Link
            href={`/${lang}/artigos`}
            className="px-10 py-5 bg-blue-600 text-white rounded-full"
          >
            ARTIGOS
          </Link>
        </section>

        {/* CONTACT */}
        <ContactSection
          contact={dict.contact}
          common={dict.common}
          locale={lang}
        />
      </main>
    </ProxyPage>
  )
}
