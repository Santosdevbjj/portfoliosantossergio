import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"

import type { Locale } from "@/types/dictionary"
import type { ProjectDomain } from "@/domain/projects"

import {
  resolveProjectTechnology,
  resolveProjectFlags,
} from "@/domain/projects"

import { getServerDictionary } from "@/lib/getServerDictionary"
import { getGitHubProjects } from "@/services/githubService"
import { locales, normalizeLocale } from "@/dictionaries/locales"

import ProxyPage from "@/components/ProxyPage"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ExperienceSection from "@/components/ExperienceSection"
import FeaturedArticleSection from "@/components/FeaturedArticleSection"
import ContactSection from "@/components/ContactSection"

import { PortfolioGrid } from "@/components/PortfolioGrid"
import { CareerHighlights } from "@/components/CareerHighlights"
import ConstructionRiskProject from "@/components/ConstructionRiskProject"

interface PageProps {
  params: Promise<{ lang: string }>
}

export const dynamic = "force-static"
export const revalidate = 3600

export async function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) return {};

  const dict = await getServerDictionary(locale).catch(() => null);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  return {
    title: dict?.meta?.description?.split(",")[0] ?? "Sérgio Santos",
    description: dict?.meta?.description ?? "Portfolio of Sérgio Santos",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title: "Sérgio Santos | Data Science & Engineering",
      description: dict?.meta?.description,
      url: `${siteUrl}/${locale}`,
      siteName: "Sérgio Santos Portfolio",
      locale: locale.replace("-", "_"),
      type: "website",
    },
  }
}

// Normalização de Projetos do GitHub
function normalizeProjects(projects: unknown): ProjectDomain[] {
  if (!Array.isArray(projects)) return []
  return projects
    .filter((p: any) => p && typeof p.name === "string" && (p.htmlUrl || p.html_url))
    .map((p: any, index): ProjectDomain => {
      const topics: string[] = Array.isArray(p.topics) ? p.topics : []
      const flags = resolveProjectFlags(topics)
      return {
        id: String(p.id ?? p.name),
        name: p.name,
        description: typeof p.description === "string" ? p.description : "",
        htmlUrl: p.htmlUrl ?? p.html_url,
        homepage: typeof p.homepage === "string" ? p.homepage : null,
        topics,
        technology: resolveProjectTechnology(topics),
        isPortfolio: flags.isPortfolio ?? false,
        isFeatured: flags.isFeatured ?? index < 3,
        isFirst: flags.isFirst ?? index === 0,
      }
    })
}

export default async function HomePage(props: PageProps) {
  const { lang: rawLang } = await props.params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const [dict, rawProjects] = await Promise.all([
    getServerDictionary(locale).catch(() => null),
    getGitHubProjects("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  const safeProjects = normalizeProjects(rawProjects);

  return (
    <ProxyPage lang={locale}>
      <main
        id="main-content"
        className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-500 selection:bg-blue-500/30 dark:bg-slate-950"
      >
        {/* HERO SECTION */}
        <section className="pt-24 lg:pt-0">
          <HeroSection dictionary={dict} />
        </section>

        {/* PROJETO DE DESTAQUE: Predição de Risco de Obras */}
        <section className="w-full px-4 py-12 md:py-20 bg-gradient-to-b from-transparent to-slate-100/50 dark:to-slate-900/20">
          <div className="container mx-auto">
             <ConstructionRiskProject dict={dict.constructionProject} />
          </div>
        </section>

        {/* SOBRE & HIGHLIGHTS */}
        <section id="about" className="relative w-full overflow-hidden">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {/* EXPERIÊNCIA (BRADESCO E OUTROS) */}
        <section id="experience" className="w-full">
          <ExperienceSection experience={dict.experience} />
        </section>

        {/* GRID DE PROJETOS GITHUB */}
        <section id="projects" className="w-full py-20">
          <PortfolioGrid
            projects={safeProjects}
            lang={locale}
            dict={dict}
          />
        </section>

        {/* ARTIGOS */}
        <section id="articles" className="w-full">
          <FeaturedArticleSection
            articles={dict.articles}
            common={dict.common}
          />
        </section>

        {/* CONTATO */}
        <section id="contact" className="w-full pb-20">
          <ContactSection
            contact={dict.contact}
            common={dict.common}
            locale={locale}
          />
        </section>
      </main>
    </ProxyPage>
  )
}
