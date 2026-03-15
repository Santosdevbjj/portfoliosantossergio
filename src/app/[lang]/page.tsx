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

/**
 * SEO & METADATA INTEGRATION
 * Corrigindo og:url, og:type e garantindo descrições > 100 caracteres
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  if (!locales.includes(locale)) return {};

  const dict = await getServerDictionary(locale as Locale).catch(() => null);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${locale}`;

  // Fallback para descrição > 100 caracteres conforme exigência do LinkedIn
  const baseDescription = dict?.meta?.description ?? "Portfolio de Sérgio Santos";
  const longDescription = baseDescription.length < 100 
    ? `${baseDescription}. Especialista em Ciência de Dados, IA Generativa e Engenharia de Software de alto desempenho.` 
    : baseDescription;

  // Mapa de locales para o formato da Meta (Facebook/WhatsApp)
  const ogLocaleMap: Record<string, string> = {
    'pt-BR': 'pt_BR',
    'en-US': 'en_US',
    'es-ES': 'es_ES',
    'es-AR': 'es_AR',
    'es-MX': 'es_MX',
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
      url: fullUrl, // CORRIGE og:url
      siteName: "Sérgio Santos Portfolio",
      locale: ogLocaleMap[locale] || 'pt_BR', // CORRIGE locale para formato Meta (ex: pt_BR)
      type: "website", // CORRIGE og:type
      images: [
        {
          url: `/og/og-image-${locale}.png`, // Nova estrutura da pasta /og/
          width: 1200,
          height: 630,
          alt: `Portfolio Sérgio Santos - ${locale}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: longDescription,
      images: [`/og/og-image-${locale}.png`],
    },
    icons: {
      icon: [
        { url: '/icons/favicon.ico', sizes: 'any' },
        { url: '/icons/icon.png', type: 'image/png', sizes: '32x32' },
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
        { url: '/icons/apple-icon.png', sizes: '180x180' },
      ],
    },
    other: {
      // fb:app_id opcional - se tiver um ID real da Meta, coloque aqui
      'fb:app_id': '672839201123456', 
    }
  };
}

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

  const [dict, rawRepos] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();
  const safeProjects = normalizeProjects(rawRepos);
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
             <PortfolioGrid projects={safeProjects} lang={lang} dict={dict} />
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>Projetos em fase de sincronização...</p>
            </div>
          )}
        </section>

        {/* --- SEÇÃO "PONTE" PARA ARTIGOS --- */}
        <section id="articles" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-6 text-slate-900 dark:text-white">
              Conhecimento <span className="text-blue-600">Compartilhado</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
              Explore minha biblioteca de artigos técnicos sobre IA, Engenharia de Software e Cloud, 
              sincronizados em tempo real com meu repositório oficial no GitHub.
            </p>
            
            <Link 
              href={`/${lang}/artigos`}
              className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 shadow-2xl shadow-blue-500/20 group"
            >
              ACESSAR PORTAL DE ARTIGOS
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
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
