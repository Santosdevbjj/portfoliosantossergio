// src/app/[lang]/page.tsx

/**
 * PAGE: Portfólio Principal (Sérgio Santos)
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Uso de 'params' como Promise e Turbopack habilitado.
 * ✔ TypeScript 6.0: Tipagem estrita e acesso seguro a variáveis de ambiente.
 * ✔ React 19: Melhor manuseio de Server Components e Suspense.
 * ✔ Tailwind 4.2: Classes utilitárias modernas e performance otimizada.
 */

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Integração com as Libs Corrigidas (SEO & Schema)
import { buildMetadata } from "@/lib/seo";
import { personSchema, websiteSchema } from "@/lib/schema";

// Dicionários e Tipos
import type { Locale, ConstructionDictionary } from "@/types/dictionary";
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

/**
 * Geração de Parâmetros Estáticos (Build-time optimization)
 */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Viewport Config (Next.js 16.2 Style)
 */
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
 * METADADOS DINÂMICOS (INTEGRAÇÃO COM SEO.TS)
 * Garante que cada idioma tenha sua OG Image correspondente.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang) as SupportedLocale;

  if (!locales.includes(locale)) return {};

  // Busca o dicionário para pegar as traduções de SEO específicas
  const dict = await getServerDictionary(locale);

  return buildMetadata({
    title: dict?.seo?.title,
    description: dict?.seo?.description,
    lang: locale,
    path: `/${locale}`,
  });
}

/**
 * Normalização de dados do GitHub para o Domínio da Aplicação
 */
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

/**
 * COMPONENTE PRINCIPAL (Next.js 16.2 / React 19)
 */
export default async function HomePage({ params }: PageProps) {
  // 1. Desembrulhar params (Obrigatório Next 16+)
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  
  if (!locales.includes(locale)) notFound();
  const lang = locale as Locale;

  // 2. Busca de dados paralela (Node 24 Performance)
  const [dict, repos] = await Promise.all([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  const projects = normalizeProjects(repos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`; // Mapeado conforme sua nova estrutura
  const featuredArticle = dict.articles?.items?.[0];

  // 3. Injeção de Schemas (INTEGRAÇÃO COM SCHEMA.TS)
  const jsonLd = [
    personSchema(),
    websiteSchema(),
  ];

  return (
    <ProxyPage lang={lang}>
      {/* Dados Estruturados para Google (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex min-h-screen flex-col bg-white dark:bg-[#020617] transition-colors duration-300 selection:bg-blue-500/30">
        
        {/* HERO SECTION */}
        <HeroSection dictionary={dict} />

        {/* PROJETO DE ANÁLISE DE RISCO (IA) */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]" />}>
              {dict.construction && (
                <ConstructionRiskProject 
                  dict={dict.construction as ConstructionDictionary} 
                />
              )}
            </Suspense>
          </div>
        </section>

        {/* SOBRE & HIGHLIGHTS */}
        <section id="about" className="scroll-mt-24">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {/* EXPERIÊNCIA PROFISSIONAL */}
        <ExperienceSection experience={dict.experience} />

        {/* PORTFÓLIO GRID (GITHUB INTEGRATION) */}
        <section id="projects" className="py-24 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {dict.projects.title} <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* CURRICULUM VITAE (PDF LOADER MULTILINGUE) */}
        <section id="resume" className="py-24 bg-slate-50/50 dark:bg-slate-900/10 border-y border-slate-200 dark:border-slate-800/50 scroll-mt-24">
          <div className="text-center mb-12 px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 dark:text-white tracking-tighter">
              Curriculum <span className="text-blue-600">Vitae</span>
            </h2>
            <div className="max-w-xs mx-auto">
              <ResumeLangSelector currentLang={lang as SupportedLocale} dict={dict.resume} />
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:shadow-blue-500/10">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>
        </section>

        {/* ARTIGOS PREMIADOS (DIO & MEDIUM) */}
        <section id="featured-articles" className="py-28 bg-white dark:bg-[#020617] scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-20 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400">
                  {dict.articles.awardWinner}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tightest mb-8">
                {dict.articles.title}
              </h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Card de Artigo Premiado com Foto do Troféu */}
              <div className="group relative flex flex-col bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-10 shadow-xl transition-all hover:scale-[1.01]">
                <div className="absolute top-10 right-10">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                    {dict.articles.bestOfMonth}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10 mt-6">
                  <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Image 
                      src="/images/trofeus-vencedor-dio.png" 
                      alt="Troféus DIO - Sérgio Santos" 
                      fill 
                      className="object-cover" 
                      sizes="144px"
                      priority 
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs font-bold uppercase text-blue-600 mb-2 tracking-widest">
                      {featuredArticle?.category || "Data Strategy"}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                      {featuredArticle?.title}
                    </h3>
                  </div>
                </div>
                <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
                  <a 
                    href={featuredArticle?.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                  >
                    {dict.articles.readMore}
                  </a>
                </div>
              </div>

              {/* Link para Perfil Medium */}
              <Link 
                href={`/${lang}/artigos`} 
                className="group flex flex-col bg-slate-900 dark:bg-slate-800/20 border border-slate-800 dark:border-slate-700/50 rounded-[3rem] p-10 shadow-2xl transition-all hover:border-blue-500 overflow-hidden relative"
              >
                <div className="flex items-center gap-5 mb-10 relative z-10">
                  <div className="p-4 bg-white rounded-2xl text-black">
                    <Image src="/icons/icon.svg" width={32} height={32} alt="Icon" className="dark:invert-0" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black text-white">
                    {dict.common.nav.articles}
                  </h3>
                </div>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed relative z-10">
                  {dict.seo.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-800 text-sm font-black text-blue-400 relative z-10">
                  <span>{dict.articles.mediumProfile}</span>
                  <span className="group-hover:translate-x-2 transition-transform">{dict.articles.readMore} →</span>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
              </Link>
            </div>
          </div>
        </section>

        {/* CONTATO & FOOTER */}
        <ContactSection contact={dict.contact} common={dict.common} locale={lang} />
      </main>
    </ProxyPage>
  );
}
