// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react"; 

// Importações de tipos corrigidas para TypeScript 6.0
// Alterado ProjectDictionary para ConstructionDictionary conforme seu arquivo de tipos
import type { Locale, ConstructionDictionary } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import { resolveProjectTechnology } from "@/domain/projects";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getPortfolioRepos } from "@/lib/github";
import { locales, normalizeLocale, type SupportedLocale } from "@/dictionaries/locales";

// Componentes de Interface
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
 * METADADOS DINÂMICOS (SEO) - React 19 / TS 6.0
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang) as SupportedLocale;

  if (!locales.includes(locale)) return {};

  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${locale}`;
  const ogImage = `${siteUrl}/og/og-image-${locale}.png`;

  const titles: Record<SupportedLocale, string> = {
    "pt-BR": "Sérgio Santos | Cientista de Dados e Engenheiro de Software",
    "en-US": "Sérgio Santos | Data Scientist & Software Engineer",
    "es-ES": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
    "es-AR": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
    "es-MX": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
  };

  const title = titles[locale] || titles["en-US"];
  
  return {
    title,
    description: "Especialista em Ciência de Dados e IA com foco em Sistemas Críticos.",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      url: fullUrl,
      type: "website",
      title,
      description: "Data Scientist specialist in Critical Systems.",
      siteName: "Sérgio Santos Portfolio",
      locale: locale.replace("-", "_"),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImage],
    },
    icons: {
      icon: "/icons/icon.png",
      shortcut: "/icons/favicon.ico",
      apple: "/icons/apple-touch-icon.png",
    }
  };
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

/**
 * COMPONENTE PRINCIPAL - Next.js 16.2 SSR/PPR
 */
export default async function HomePage({ params }: PageProps) {
  // Consumo da Promise de params (Obrigatório Next 16.2)
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  
  if (!locales.includes(locale)) notFound();
  const lang = locale as Locale;

  // Busca paralela otimizada (Node 24 safe)
  const [dict, repos] = await Promise.all([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  const projects = normalizeProjects(repos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;
  
  // Acesso seguro ao primeiro item de artigos (TypeScript 6.0 Safe)
  const featuredArticle = dict.articles?.items?.[0];

  return (
    <ProxyPage lang={lang}>
      <main className="flex min-h-screen flex-col bg-white dark:bg-[#020617] transition-colors duration-300 selection:bg-blue-500/30">
        <HeroSection dictionary={dict} />

        {/* PROJETO DE RISCO - Envolvido em Suspense para PPR / Turbopack Ready */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]" />}>
              {dict.construction && (
                <ConstructionRiskProject 
                  // Cast corrigido para ConstructionDictionary
                  dict={dict.construction as ConstructionDictionary} 
                />
              )}
            </Suspense>
          </div>
        </section>

        <section id="about" className="scroll-mt-24">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        <ExperienceSection experience={dict.experience} />

        <section id="projects" className="py-24 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {dict.projects.title} <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

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
              {/* Artigo Premiado / Destaque */}
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
                      {featuredArticle?.title || dict.articles.title}
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

              {/* Link para Perfil Medium / Todos os Artigos */}
              <Link 
                href={`/${lang}/artigos`} 
                className="group flex flex-col bg-slate-900 dark:bg-slate-800/20 border border-slate-800 dark:border-slate-700/50 rounded-[3rem] p-10 shadow-2xl transition-all hover:border-blue-500 overflow-hidden relative"
              >
                <div className="flex items-center gap-5 mb-10 relative z-10">
                  <div className="p-4 bg-white dark:bg-white rounded-2xl text-black">
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
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
                {/* Efeito visual de fundo Tailwind 4.2 */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
              </Link>
            </div>
          </div>
        </section>

        <ContactSection contact={dict.contact} common={dict.common} locale={lang} />
      </main>
    </ProxyPage>
  );
}
