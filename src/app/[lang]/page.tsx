// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link"; 

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
import ContactSection from "@/components/ContactSection";
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader"; // Importado

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
  const fullUrl = `${siteUrl}/${locale}`;

  const baseDescription = dict?.meta?.description ?? "Portfolio de Sérgio Santos";
  const longDescription = baseDescription.length < 100 
    ? `${baseDescription}. Especialista em Ciência de Dados, IA Generativa e Engenharia de Software de alto desempenho.` 
    : baseDescription;

  const ogLocaleMap: Record<string, string> = {
    'pt-BR': 'pt_BR', 'en-US': 'en_US', 'es-ES': 'es_ES', 'es-AR': 'es_AR', 'es-MX': 'es_MX',
  };

  const pageTitle = dict?.meta?.author ? `${dict.meta.author} | ${dict.hero?.title}` : "Sérgio Santos";

  return {
    title: pageTitle,
    description: longDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title: pageTitle,
      description: longDescription,
      url: fullUrl,
      siteName: "Sérgio Santos Portfolio",
      locale: ogLocaleMap[locale] || 'pt_BR',
      type: "website",
      images: [{ url: `/og/og-image-${locale}.png`, width: 1200, height: 630 }],
    },
    facebook: { appId: '672839201123456' },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: longDescription,
      images: [`/og/og-image-${locale}.png`],
    },
  };
}

function normalizeProjects(repos: any[]): ProjectDomain[] {
  if (!repos || !Array.isArray(repos)) return [];
  return repos
    .map((repo, index): ProjectDomain => {
      const rawTopics = repo?.topics || repo?.repository_topics || [];
      const topics = Array.isArray(rawTopics) ? rawTopics.map((t: string) => String(t).toLowerCase()) : [];
      return {
        id: String(repo?.id || index),
        name: (repo?.name || "Projeto").replace(/-/g, ' '),
        description: repo?.description || "",
        htmlUrl: repo?.html_url || "",
        homepage: repo?.homepage || null,
        topics,
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

  const [dict, rawRepos] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();
  const safeProjects = normalizeProjects(rawRepos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  return (
    <ProxyPage lang={lang}>
      <main id="main-content" className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <HeroSection dictionary={dict} />

        {/* DATA SCIENCE HIGHLIGHT */}
        <section className="w-full px-4 py-12 bg-linear-to-b from-transparent to-slate-100/50 dark:to-slate-900/20">
          <div className="mx-auto max-w-7xl">
             <ConstructionRiskProject dict={dict as any} />
          </div>
        </section>

        <AboutSection dict={dict.about} />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <CareerHighlights dict={dict} />
        </div>

        <ExperienceSection experience={dict.experience} />

        <section id="projects" className="w-full py-20">
          <div className="mx-auto max-w-7xl px-4 mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic">
              Projetos <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={safeProjects} lang={lang} dict={dict} />
        </section>

        {/* NOVA SEÇÃO: RESUME PREVIEW INTEGRADO NA HOME */}
        <section id="resume-preview" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase mb-4">
                Currículo <span className="text-blue-600">Oficial</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Visualize ou baixe a versão PDF atualizada para {lang}.
              </p>
            </div>
            <div className="max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-2 md:p-8">
               <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>
        </section>

        {/* ARTICLES CTA */}
        <section id="articles" className="py-20 bg-slate-50/50 dark:bg-slate-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-6 text-slate-900 dark:text-white">
              Conhecimento <span className="text-blue-600">Compartilhado</span>
            </h2>
            <Link 
              href={`/${lang}/artigos`}
              className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 shadow-xl shadow-blue-500/20 group"
            >
              ACESSAR PORTAL DE ARTIGOS
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        <ContactSection contact={dict.contact} common={dict.common} locale={lang} />
      </main>
    </ProxyPage>
  );
}
