import type { Metadata } from "next"
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

  const dict = await getServerDictionary(locale as Locale).catch(() => null);
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

/**
 * NORMALIZAÇÃO CORRIGIDA
 * Garante compatibilidade com os nomes de campos exatos da API v3 do GitHub
 */
function normalizeProjects(projects: any[]): ProjectDomain[] {
  if (!Array.isArray(projects)) {
    console.error("❌ normalizeProjects: Recebido dado que não é array:", projects);
    return [];
  }

  return projects
    .map((p, index): ProjectDomain => {
      // O GitHub entrega 'topics' ou 'repository_topics' dependendo da chamada
      const topics: string[] = Array.isArray(p.topics) ? p.topics : [];
      const flags = resolveProjectFlags(topics);
      
      // Prioriza html_url (padrão GitHub) mas aceita camelCase
      const link = p.html_url || p.htmlUrl || "";

      return {
        id: String(p.id || p.name || index),
        name: p.name || "Projeto Sem Nome",
        description: p.description || "",
        htmlUrl: link,
        homepage: p.homepage || null,
        topics: topics,
        technology: resolveProjectTechnology(topics),
        isPortfolio: topics.includes("portfolio"), // Sua regra estrita
        isFeatured: topics.includes("featured") || index < 3,
        isFirst: index === 0,
      };
    })
    .filter((p) => p.isPortfolio && p.htmlUrl !== ""); // Filtra estritamente pela sua TAG
}

export default async function HomePage(props: PageProps) {
  const { lang: rawLang } = await props.params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const lang = locale as Locale;

  // Busca de dados com log de depuração para o console da Vercel
  const [dict, rawProjects] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getGitHubProjects("Santosdevbjj").catch((err) => {
      console.error("❌ Erro crítico ao buscar do GitHub:", err);
      return [];
    }),
  ]);

  if (!dict) notFound();

  // Processa os projetos
  const safeProjects = normalizeProjects(rawProjects as any[]);

  // Debug log para você ver no painel da Vercel quantos projetos passaram no filtro
  console.log(`📊 Locale: ${lang} | Projetos brutos: ${rawProjects?.length || 0} | Com tag portfolio: ${safeProjects.length}`);

  const typedDict = dict as any;

  return (
    <ProxyPage lang={lang}>
      <main
        id="main-content"
        className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-500 selection:bg-blue-500/30 dark:bg-slate-950"
      >
        <section className="pt-24 lg:pt-0">
          <HeroSection dictionary={dict} />
        </section>

        <section className="w-full px-4 py-12 md:py-20 bg-gradient-to-b from-transparent to-slate-100/50 dark:to-slate-900/20">
          <div className="mx-auto max-w-7xl">
             {typedDict.constructionProject && (
               <ConstructionRiskProject dict={typedDict.constructionProject} />
             )}
          </div>
        </section>

        <section id="about" className="relative w-full overflow-hidden">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        <section id="experience" className="w-full">
          <ExperienceSection experience={dict.experience} />
        </section>

        {/* Se safeProjects.length for 0 aqui, o componente PortfolioGrid 
            provavelmente exibe a mensagem de "Em breve".
        */}
        <section id="projects" className="w-full py-20">
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
