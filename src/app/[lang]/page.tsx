// src/app/[lang]/page.tsx

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// SEO & Schema (Recuperando a inteligência de compartilhamento)
import { buildMetadata } from "@/lib/seo";
import { personSchema, websiteSchema } from "@/lib/schema";

// Dicionários e Tipos
import type { Locale, ConstructionDictionary } from "@/types/dictionary";
import type { ErrorDictionary } from "@/types/error-dictionary";
import type { ProjectDomain } from "@/domain/projects";
import { resolveProjectTechnology } from "@/domain/projects";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getPortfolioRepos } from "@/lib/github";
import { locales, normalizeLocale, type SupportedLocale } from "@/dictionaries/locales";

// Componentes de UI
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader";
import { ResumeLangSelector } from "@/components/pdf/ResumeLangSelector";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CareerHighlights } from "@/components/CareerHighlights";
import ConstructionRiskProject from "@/components/ConstructionRiskProject";
import ProfileForm from "@/components/profile/ProfileForm";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  viewportFit: "cover",
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * SEO DINÂMICO RECUPERADO:
 * Garante que o compartilhamento no LinkedIn mostre os dados do artigo
 * se houver um slug ou contexto, caso contrário usa o padrão do portfólio.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang) as SupportedLocale;
  if (!locales.includes(locale)) return {};
  
  const dict = await getServerDictionary(locale);

  return buildMetadata({
    title: dict?.seo?.title,
    description: dict?.seo?.description,
    lang: locale,
    path: `/${locale}`,
    // A imagem aqui volta a ser dinâmica baseada no dicionário de SEO
    image: `/api/og?lang=${locale}&title=${encodeURIComponent(dict?.seo?.title ?? "")}`
  });
}

function normalizeProjects(repos: any[]): ProjectDomain[] {
  if (!Array.isArray(repos)) return [];
  return repos
    .map((repo, index): ProjectDomain => {
      const topics = Array.isArray(repo?.topics) ? repo.topics.map((t: string) => t.toLowerCase()) : [];
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
      };
    })
    .filter((p) => p.isPortfolio && p.htmlUrl);
}

export default async function HomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  if (!locales.includes(locale)) notFound();
  const lang = locale as Locale;

  const [dict, repos] = await Promise.all([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  // Carregamento do dicionário de erros
  const errorDict = (await import(`@/dictionaries/errors/${lang}.json`)).default as ErrorDictionary;

  const projects = normalizeProjects(repos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;
  const featuredArticle = dict.articles?.items?.[0];

  return (
    <ProxyPage lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema(), websiteSchema()]) }}
      />

      <main className="flex min-h-screen flex-col bg-white dark:bg-[#020617]">
        
        <HeroSection dictionary={dict} />

        {/* PROJETO IA - RISCO */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-[3rem]" />}>
              {dict.construction && <ConstructionRiskProject dict={dict.construction as ConstructionDictionary} />}
            </Suspense>
          </div>
        </section>

        {/* PROFILE FORM (Integrado discretamente) */}
        <section className="py-10 bg-zinc-50 dark:bg-zinc-900/30">
          <ProfileForm lang={lang} dict={{ ...dict, errors: errorDict }} />
        </section>

        <AboutSection dict={dict.about} />
        
        <div className="mx-auto max-w-7xl px-4 py-16">
          <CareerHighlights dict={dict} />
        </div>

        <ExperienceSection experience={dict.experience} />

        <section id="projects" className="py-24">
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* -----------------------------------------------------------
            OS TRÊS CARDS FINAIS (RESTAURADOS E CORRIGIDOS)
        -------------------------------------------------------------- */}
        
        <section className="py-24 space-y-12">
          
          {/* 1) CARD DO CURRÍCULO (PDF) */}
          <div id="resume" className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black dark:text-white tracking-tighter">
                Curriculum <span className="text-blue-600">Vitae</span>
              </h2>
              <div className="mt-6 max-w-xs mx-auto">
                <ResumeLangSelector currentLang={lang as SupportedLocale} dict={dict.resume} />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>

          {/* GRID PARA OS OUTROS DOIS CARDS (ARTIGO PREMIADO E GITHUB) */}
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 2) CARD DO ARTIGO PREMIADO */}
            <div className="group relative flex flex-col bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-xl transition-all hover:scale-[1.01]">
              <div className="absolute top-10 right-10">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                  {dict.articles.bestOfMonth}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 mt-6">
                <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Image 
                    src="/images/trofeus-vencedor-dio.png" 
                    alt="Troféu DIO" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase text-blue-600 mb-2">{featuredArticle?.category}</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {featuredArticle?.title}
                  </h3>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <a 
                  href={featuredArticle?.link} 
                  target="_blank" 
                  className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                >
                  {dict.articles.readMore}
                </a>
              </div>
            </div>

            {/* 3) CARD REPOSITÓRIO GITHUB (Artigos Técnicos) */}
            <Link 
              href={`/${lang}/artigos`} 
              className="group flex flex-col bg-slate-900 dark:bg-slate-800/20 border border-slate-800 dark:border-slate-700/50 rounded-[3rem] p-10 shadow-2xl transition-all hover:border-blue-500 overflow-hidden relative"
            >
              <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="p-4 bg-white rounded-2xl">
                  <Image src="/icons/icon.svg" width={32} height={32} alt="GitHub" />
                </div>
                <h3 className="text-3xl font-black text-white">
                  {dict.common.nav.articles}
                </h3>
              </div>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed relative z-10">
                {dict.seo.description}
              </p>
              <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-800 text-sm font-black text-blue-400 relative z-10">
                <span>{dict.articles.mediumProfile}</span>
                <span className="group-hover:translate-x-2 transition-transform">
                  {dict.articles.readMore} →
                </span>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
            </Link>

          </div>
        </section>

        <ContactSection contact={dict.contact} common={dict.common} locale={lang} />
      </main>
    </ProxyPage>
  );
}
