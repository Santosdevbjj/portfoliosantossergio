// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import { resolveProjectTechnology } from "@/domain/projects";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getPortfolioRepos } from "@/lib/github"; 
import { locales, normalizeLocale } from "@/dictionaries/locales";

import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import ContactSection from "@/components/ContactSection";

import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CareerHighlights } from "@/components/CareerHighlights";
import ConstructionRiskProject from "@/components/ConstructionRiskProject";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
} 

// coloquei o abaixo
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  if (!locales.includes(locale)) return {};

  const dict = await getServerDictionary(locale as Locale).catch(() => null);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  return {
    title: dict?.meta?.author ? `${dict.meta.author} | ${dict.hero?.title}` : "Sérgio Santos",
    description: dict?.meta?.description ?? "Portfolio",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
  };
}

/**
 * Normalização robusta de repositórios do GitHub
 */
function normalizeProjects(repos: any[]): ProjectDomain[] {
  if (!repos || !Array.isArray(repos)) return [];

  return repos
    .map((repo, index): ProjectDomain => {
      const rawTopics = repo?.topics || repo?.repository_topics || [];
      const topics = Array.isArray(rawTopics) 
        ? rawTopics.map((t: string) => String(t).toLowerCase()) 
        : [];
      
      return {
        id: String(repo?.id || index),
        name: (repo?.name || "Projeto").replace(/-/g, ' '),
        description: repo?.description || "",
        htmlUrl: repo?.html_url || "",
        homepage: repo?.homepage || null,
        topics: topics,
        technology: resolveProjectTechnology(topics),
        isPortfolio: topics.includes("portfolio"), 
        isFeatured: topics.includes("featured") || index < 2,
        isFirst: index === 0,
      };
    })
    .filter((p) => p.isPortfolio && p.htmlUrl !== ""); 
}

export default async function HomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) notFound();
  const lang = locale as Locale;

  // Busca paralela otimizada (Node 24)
  const [dict, rawRepos] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  const safeProjects = normalizeProjects(rawRepos);

  // Verificação de segurança para o componente de projeto específico
  // O erro 'pipeline' ocorre porque o componente tenta acessar dict.dataScienceProject.pipeline
  // Se a chave não existir no dicionário, não renderizamos para não quebrar o build.
  const hasDataScienceData = !!(dict as any).dataScienceProject || !!(dict as any).constructionProject;

  return (
    <ProxyPage lang={lang}>
      <main
        id="main-content"
        className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-500 selection:bg-blue-500/30 dark:bg-slate-950"
      >
        <section className="pt-24 lg:pt-0">
          <HeroSection dictionary={dict} />
        </section>

        {/* SOLUÇÃO DO PRERENDER ERROR:
            Renderização condicional rigorosa. Se 'pipeline' for lido de dentro deste componente,
            garantimos que passamos o objeto correto ou nada.
        */}
        {hasDataScienceData && (
          <section className="w-full px-4 py-12 md:py-20 bg-linear-to-b from-transparent to-slate-100/50 dark:to-slate-900/20">
            <div className="mx-auto max-w-7xl">
               <ConstructionRiskProject dict={dict as any} />
            </div>
          </section>
        )}

        <section id="about" className="relative w-full overflow-hidden">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        <section id="experience" className="w-full">
          <ExperienceSection experience={dict.experience} />
        </section>

        <section id="projects" className="w-full py-20">
          <div className="mx-auto max-w-7xl px-4 mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dict.hero.ctaPrimary}
            </h2>
          </div>
          
          {safeProjects.length > 0 ? (
             <PortfolioGrid
               projects={safeProjects}
               lang={lang}
               dict={dict}
             />
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>Projetos em fase de sincronização...</p>
            </div>
          )}
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
  );
}
