// src/app/[lang]/page.tsx

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Integração com as Libs (SEO & Schema)
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

/**
 * Geração de Parâmetros Estáticos
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
 * METADADOS DINÂMICOS
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
  });
}

/**
 * Normalização de dados do GitHub
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
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  
  if (!locales.includes(locale)) notFound();
  const lang = locale as Locale;

  /**
   * 2. BUSCA DE DADOS EM PARALELO (Node 24 Performance)
   * Importante: Carregamos o dicionário principal e o de erros.
   */
  const [dict, repos] = await Promise.all([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  // Mock de carregamento do dicionário de erros (deve ser ajustado conforme sua lib de fetch)
  // Normalmente: const errorDict = await getErrorDictionary(lang);
  // Para este exemplo, assumimos que o getServerDictionary já compõe ou carregamos manualmente:
  const errorDict = (await import(`@/dictionaries/errors/${lang}.json`)).default as ErrorDictionary;

  const projects = normalizeProjects(repos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;
  const featuredArticle = dict.articles?.items?.[0];

  const jsonLd = [personSchema(), websiteSchema()];

  return (
    <ProxyPage lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex min-h-screen flex-col bg-white dark:bg-[#020617] transition-colors duration-300">
        
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

        {/* INTEGRANDO O PROFILE FORM (SERVER ACTION + ERROR DICT) */}
        <section id="settings" className="py-16 bg-zinc-50 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-4 text-center mb-10">
            <h2 className="text-3xl font-black tracking-tighter dark:text-white">
              {lang.startsWith('pt') ? 'Configurações de Perfil' : 'Profile Settings'}
            </h2>
          </div>
          {/* Aqui passamos o dict unido ao errorDict para o formulário cliente */}
          <ProfileForm 
            lang={lang} 
            dict={{ ...dict, errors: errorDict }} 
          />
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

        {/* PORTFÓLIO GRID */}
        <section id="projects" className="py-24 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {dict.projects.title} <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* CURRICULUM VITAE */}
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
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>
        </section>

        {/* ARTIGOS */}
        <section id="featured-articles" className="py-28 bg-white dark:bg-[#020617] scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-20 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tightest">
                {dict.articles.title}
              </h2>
            </header>
            {/* ... restante do código de artigos ... */}
          </div>
        </section>

        {/* CONTATO & FOOTER */}
        <ContactSection contact={dict.contact} common={dict.common} locale={lang} />
      </main>
    </ProxyPage>
  );
}
