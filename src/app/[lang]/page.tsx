import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"

import type { Locale } from "@/types/dictionary"
import type { ProjectDomain } from "@/domain/projects"

import { resolveProjectTechnology, resolveProjectFlags } from "@/domain/projects"

import { getServerDictionary } from "@/lib/getServerDictionary"
import { getGitHubProjects } from "@/services/githubService"

import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales"

import ProxyPage from "@/components/ProxyPage"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ExperienceSection from "@/components/ExperienceSection"
import FeaturedArticleSection from "@/components/FeaturedArticleSection"
import ContactSection from "@/components/ContactSection"

import { PortfolioGrid } from "@/components/PortfolioGrid"
import { CareerHighlights } from "@/components/CareerHighlights"

interface PageProps {
  readonly params: {
    lang: string
  }
}

export const dynamic = "force-static"
export const revalidate = 3600

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const rawLang = params.lang

  if (!isValidLocale(rawLang)) {
    return {}
  }

  const lang = rawLang as Locale

  const dict = await getServerDictionary(lang)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"

  return {
    title:
      dict?.seo?.pages?.home?.title ??
      "Sérgio Santos | Data & Cloud Engineer",

    description:
      dict?.seo?.pages?.home?.description ??
      "Portfolio of Sérgio Santos — Data Engineering, Cloud and AI.",

    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },

    openGraph: {
      title:
        dict?.seo?.pages?.home?.title ??
        "Sérgio Santos | Data & Cloud Engineer",

      description:
        dict?.seo?.pages?.home?.description ??
        "Portfolio of Sérgio Santos — Data Engineering, Cloud and AI.",

      url: `${siteUrl}/${lang}`,
      siteName: "Sérgio Santos Portfolio",
      locale: lang,
      type: "website",
    },
  }
}

/*
Normaliza dados GitHub → ProjectDomain
*/
function normalizeProjects(
  projects: readonly any[] | null | undefined
): ProjectDomain[] {
  if (!Array.isArray(projects)) return []

  return projects
    .filter(
      (p) =>
        p &&
        typeof p.name === "string" &&
        (p.htmlUrl || p.html_url)
    )
    .map((p, index): ProjectDomain => {
      const topics: string[] = Array.isArray(p.topics)
        ? p.topics
        : []

      const flags = resolveProjectFlags(topics)

      return {
        id: String(p.id ?? p.name),

        name: p.name,

        description:
          typeof p.description === "string"
            ? p.description
            : "",

        htmlUrl: p.htmlUrl ?? p.html_url,

        homepage:
          typeof p.homepage === "string"
            ? p.homepage
            : null,

        topics,

        technology: resolveProjectTechnology(topics),

        isPortfolio: flags.isPortfolio ?? false,

        isFeatured: flags.isFeatured ?? index < 3,

        isFirst: flags.isFirst ?? index === 0,
      }
    })
}

export default async function HomePage({
  params,
}: PageProps) {
  const rawLang = params.lang

  if (!isValidLocale(rawLang)) {
    notFound()
  }

  const lang = rawLang as Locale

  const [dict, rawProjects] = await Promise.all([
    getServerDictionary(lang),
    getGitHubProjects("Santosdevbjj"),
  ])

  const safeProjects: ProjectDomain[] =
    normalizeProjects(rawProjects ?? [])

  return (
    <ProxyPage lang={lang}>
      <main
        id="main-content"
        className="flex min-h-screen flex-col bg-white transition-colors duration-500 selection:bg-blue-500/30 dark:bg-slate-950"
      >
        <section className="pt-24 lg:pt-0">
          <HeroSection dictionary={dict} />
        </section>

        <section
          id="about"
          className="relative w-full overflow-hidden"
        >
          <AboutSection dict={dict.about} />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        <section id="experience" className="w-full">
          <ExperienceSection
            experience={dict.experience}
          />
        </section>

        <section
          id="projects"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <PortfolioGrid
            projects={safeProjects}
            lang={lang}
            dict={dict}
          />
        </section>

        <section id="articles" className="w-full">
          <FeaturedArticleSection
            articles={dict.articles}
            common={dict.common}
          />
        </section>

        <section id="contact" className="w-full pb-20">
          <ContactSection
            contact={dict.contact}
            common={dict.common}
            locale={lang}
          />
        </section>
      </main>
    </ProxyPage>
  )
}
