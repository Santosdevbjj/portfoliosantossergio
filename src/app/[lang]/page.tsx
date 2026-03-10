/**
 * HOME PAGE - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16
 * ✔ React 19 Async Server Components
 * ✔ TypeScript 6 Strict
 * ✔ Node 24 Runtime
 * ✔ Tailwind 4.2
 * ✔ Vercel Edge Compatible
 * ✔ i18n Safe Rendering
 */

import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"

// Types
import type { Locale } from "@/types/dictionary"
import type { ProjectDomain } from "@/domain/projects"

// Services
import { getServerDictionary } from "@/lib/getServerDictionary"
import { getGitHubProjects } from "@/services/githubService"

// i18n
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales"

// Components
import ProxyPage from "@/components/ProxyPage"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ExperienceSection from "@/components/ExperienceSection"
import FeaturedArticleSection from "@/components/FeaturedArticleSection"
import ContactSection from "@/components/ContactSection"
import { PortfolioGrid } from "@/components/PortfolioGrid"
import { CareerHighlights } from "@/components/CareerHighlights"

interface PageProps {
  readonly params: Promise<{ lang: string }>
}

export const dynamic = "force-static"
export const revalidate = 3600

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617"
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {

  const { lang: rawLang } = await params

  if (!isValidLocale(rawLang)) return {}

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
      )
    }
  }
}

/**
 * Converte projetos GitHub → ProjectDomain
 */
function normalizeProjects(projects: any[]): ProjectDomain[] {
  return projects
    .filter((p) => p && p.name && (p.htmlUrl || p.html_url))
    .map((p) => ({
      id: p.id ?? p.name,
      name: p.name,
      description: p.description ?? "",
      htmlUrl: p.htmlUrl ?? p.html_url,
      homepage: p.homepage ?? null,
      topics: p.topics ?? [],
      technology: p.technology ?? p.topics ?? [],
      stars: p.stars ?? p.stargazers_count ?? 0,
      updatedAt: p.updatedAt ?? p.updated_at ?? null
    }))
}

export default async function HomePage({ params }: PageProps) {

  const { lang: rawLang } = await params

  if (!isValidLocale(rawLang)) {
    notFound()
  }

  const lang = rawLang as Locale

  const [dict, rawProjects] = await Promise.all([
    getServerDictionary(lang),
    getGitHubProjects("Santosdevbjj")
  ])

  const safeProjects: ProjectDomain[] = normalizeProjects(rawProjects ?? [])

  return (
    <ProxyPage lang={lang}>

      <main
        id="main-content"
        className="
        flex flex-col
        min-h-screen
        bg-white
        dark:bg-slate-950
        transition-colors
        duration-500
        selection:bg-blue-500/30
      "
      >

        {/* HERO */}
        <section className="pt-24 lg:pt-0">
          <HeroSection dictionary={dict} />
        </section>

        {/* ABOUT */}
        <section id="about" className="relative w-full overflow-hidden">

          <AboutSection dict={dict.about} />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CareerHighlights dict={dict} />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

            <div className="flex justify-center md:justify-start">

              <a
                href={`/cv-sergio-santos-${lang}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                group
                inline-flex
                items-center
                gap-4
                rounded-2xl
                bg-slate-900
                px-8
                py-5
                text-[11px]
                font-black
                uppercase
                tracking-[0.2em]
                text-white
                transition-all
                hover:scale-[1.02]
                hover:bg-blue-600
                active:scale-95
                dark:bg-slate-50
                dark:text-slate-900
                dark:hover:bg-blue-500
                dark:hover:text-white
                shadow-2xl
                shadow-blue-500/10
              >
                <span className="text-lg transition-transform group-hover:translate-y-1">
                  {"↓"}
                </span>

                {dict?.contact?.cvLabel ?? "Download CV"}

              </a>

            </div>
          </div>

        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="w-full">
          <ExperienceSection experience={dict.experience} />
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="
          w-full
          bg-slate-50/50
          py-20
          dark:bg-slate-900/10
        "
        >

          <PortfolioGrid
            projects={safeProjects}
            lang={lang}
            dict={dict}
          />

        </section>

        {/* ARTICLES */}
        <section id="articles" className="w-full">
          <FeaturedArticleSection
            articles={dict.articles}
            common={dict.common}
          />
        </section>

        {/* CONTACT */}
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
