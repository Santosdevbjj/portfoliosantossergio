// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense, JSX } from "react";

// SEO & Schema
import { buildMetadata } from "@/lib/seo";
import { personSchema, websiteSchema } from "@/lib/schema";

// Dicionários e Tipos
import type { Locale, ConstructionDictionary, Dictionary } from "@/types/dictionary";
import type { ErrorDictionary } from "@/types/error-dictionary";
import type { ProjectDomain } from "@/domain/projects";
import { resolveProjectTechnology } from "@/domain/projects";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getPortfolioRepos } from "@/lib/github";
import { getArticlesWithRetry } from "@/lib/github/service";
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
import { CategoryBadge } from "@/components/ui/CategoryBadge";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  viewportFit: "cover",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang) as SupportedLocale;
  if (!locales.includes(locale)) return {};
  const dict = await getServerDictionary(locale);
  
  return buildMetadata({
    title: dict?.seo?.title,
    description: dict?.seo?.description,
    lang: locale,
    path: `/${locale}`,
    image: `/og/og-image-${locale}.png`
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

async function ResilientPortfolio({ lang, dict }: { lang: Locale, dict: Dictionary }) {
  try {
    const repos = await getPortfolioRepos("Santosdevbjj").catch(() => []);
    const projects = normalizeProjects(repos);
    return <PortfolioGrid projects={projects} lang={lang} dict={dict} />;
  } catch (error) {
    return <div className="text-center py-10 opacity-50">Serviço temporariamente indisponível.</div>;
  }
}

async function ResilientProfileForm({ lang, dict }: { lang: Locale, dict: Dictionary }) {
  let errorDict: ErrorDictionary = {} as ErrorDictionary;
  try {
    const errorModule = await import(`@/dictionaries/errors/${lang}.json`);
    errorDict = errorModule.default;
  } catch (e) {
    console.warn("Dicionário de erro não encontrado.");
  }
  return <ProfileForm lang={lang} dict={{ ...dict, errors: errorDict }} />;
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }): Promise<JSX.Element> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  
  if (!locales.includes(locale)) notFound();
  const lang = locale as Locale;

  const dict = await getServerDictionary(lang);
  if (!dict) notFound();

  // URL correta conforme sua estrutura de pastas informada
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  const githubArticles = await getArticlesWithRetry(1);
  const latestArticle = githubArticles[0] || null;

  return (
    <ProxyPage lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema(), websiteSchema()]) }}
      />

      <main className="flex min-h-screen flex-col bg-white dark:bg-[#020617]">
        
        <HeroSection dictionary={dict} />

        <section className="py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-[3rem]" />}>
              {dict.construction && <ConstructionRiskProject dict={dict.construction as ConstructionDictionary} />}
            </Suspense>
          </div>
        </section>

        <section className="py-10 bg-slate-50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800/50">
          <Suspense fallback={<div className="h-20 animate-pulse bg-blue-50/50 dark:bg-blue-900/10 rounded-full mx-auto max-w-3xl" />}>
            <ResilientProfileForm lang={lang} dict={dict} />
          </Suspense>
        </section>

        {/* CORREÇÃO DO ERRO DE BUILD: Passando 'dict' e 'lang' conforme interface AboutSectionProps */}
        <AboutSection dict={dict.about} lang={lang} />
        
        <div className="mx-auto max-w-7xl px-4 py-16">
          <CareerHighlights dict={dict} />
        </div>

        <ExperienceSection experience={dict.experience} />

        <section id="projects" className="py-24">
          <Suspense fallback={<div className="h-96 animate-pulse bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] max-w-7xl mx-auto" />}>
            <ResilientPortfolio lang={lang} dict={dict} />
          </Suspense>
        </section>

        <section className="py-24 space-y-12 bg-slate-50/30 dark:bg-transparent">
          
          <div id="resume" className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                Curriculum <span className="text-blue-600">Vitae</span>
              </h2>
              <div className="mt-6 max-w-xs mx-auto">
                <ResumeLangSelector currentLang={lang} dict={dict.resume} />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-blue-100 dark:border-blue-900/30">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CARD DO ARTIGO PREMIADO */}
            <div className="group relative flex flex-col bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-[3rem] p-8 md:p-12 shadow-xl hover:shadow-blue-500/10 transition-all">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-50 rotate-[-3deg] group-hover:rotate-0 transition-transform">
                    <Image 
                      src="/images/trofeus-vencedor-dio.png" 
                      alt="Troféu DIO" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">
                    🏆 {dict.articles.awardWinner}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                  Low-Code na Saúde: Como Criar Apps Médicos em Semanas
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                  35ª Competição da DIO (Set/2025). Publicado no Medium em três idiomas.
                </p>
                <div className="mt-auto space-y-6">
                  <div className="flex flex-wrap gap-4 items-center py-4 border-y border-slate-100 dark:border-slate-800">
                    <a href="https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e" target="_blank" rel="noopener" className="hover:scale-110 transition-transform text-2xl">🇧🇷</a>
                    <a href="https://medium.com/@sergiosantosluiz/low-code-in-healthcare-how-to-build-medical-apps-in-weeks-2679bf08ba77" target="_blank" rel="noopener" className="hover:scale-110 transition-transform text-2xl">🇺🇸</a>
                    <a href="https://medium.com/@sergiosantosluiz/low-code-en-la-salud-c%C3%B3mo-crear-apps-m%C3%A9dicos-em-semanas-5474e7dddfad" target="_blank" rel="noopener" className="hover:scale-110 transition-transform text-2xl">🇪🇸</a>
                  </div>
                  <a href={dict.common.externalLinks.medium} target="_blank" rel="noopener" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-black text-sm hover:underline">
                    📚 {dict.articles.mediumProfile} <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* CARD REPOSITÓRIO GITHUB DINÂMICO */}
            <Link 
              href={`/${lang}/artigos`} 
              className="group relative flex flex-col bg-slate-900 dark:bg-blue-950/20 border border-blue-900/30 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden hover:border-blue-500 transition-all"
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-white rounded-xl shadow-inner">
                    <Image src="/icons/icon.svg" width={28} height={28} alt="GitHub" />
                  </div>
                  {latestArticle && <CategoryBadge category={latestArticle.category} />}
                </div>
                
                <div className="space-y-4 mb-10">
                  <h3 className="text-2xl font-black text-white leading-none">
                    {latestArticle ? latestArticle.name.replace('.md', '') : "Artigos Técnicos"}
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    Cloud, IA Generativa e Engenharia de Software aplicadas a problemas reais.
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-blue-400 font-black text-sm">
                  <span>Explore {githubArticles.length} publicações</span>
                  <span className="group-hover:translate-x-2 transition-transform">Ler Artigos →</span>
                </div>
              </div>
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-colors" />
            </Link>
          </div>
        </section>

        <ContactSection contact={dict.contact} common={dict.common} locale={lang} />
      </main>
    </ProxyPage>
  );
}
