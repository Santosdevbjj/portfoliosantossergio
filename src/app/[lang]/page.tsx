// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Importação rigorosa de tipos conforme src/types/dictionary.ts
import type { Dictionary, Locale } from "@/types/dictionary";
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

/**
 * CONFIGURAÇÕES DE RENDERIZAÇÃO - Next.js 16+ (Turbopack Ready)
 */
export const dynamic = "force-static";
export const revalidate = 3600;

// Gera os caminhos estáticos para todos os idiomas suportados
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO) - Suporte Total Multilingue (PT, EN, ES-ES, ES-AR, ES-MX)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang) as SupportedLocale;

  if (!locales.includes(locale)) return {};

  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${locale}`;
  const ogImage = `${siteUrl}/og/og-image-${locale}.png`;

  // Mapeamento de títulos para SEO por localidade específica
  const titles: Record<SupportedLocale, string> = {
    "pt-BR": "Sérgio Santos | Cientista de Dados e Engenheiro de Software",
    "en-US": "Sérgio Santos | Data Scientist & Software Engineer",
    "es-ES": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
    "es-AR": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
    "es-MX": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
  };

  const title = titles[locale] || titles["en-US"];
  const description = "Especialista em Ciência de Dados e IA com foco em Sistemas Críticos e Missão Crítica.";

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      url: fullUrl,
      type: "website",
      title,
      description,
      siteName: "Sérgio Santos Portfolio",
      locale: locale.replace("-", "_"),
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: title 
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/icons/icon.png",
      shortcut: "/icons/favicon.ico",
      apple: "/icons/apple-touch-icon.png",
    }
  };
}

/**
 * NORMALIZAÇÃO DE PROJETOS GITHUB
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
 * COMPONENTE PRINCIPAL (SERVER COMPONENT - React 19 / Node 24)
 */
export default async function HomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);
  
  if (!locales.includes(locale)) notFound();
  const lang = locale as Locale;

  // Busca paralela de dados (Dicionário + Repositórios)
  const [dict, repos] = await Promise.all([
    getServerDictionary(lang) as Promise<Dictionary>,
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  const projects = normalizeProjects(repos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  return (
    <ProxyPage lang={lang}>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* HERO SECTION */}
        <HeroSection dictionary={dict} />

        {/* PROJETO DE RISCO (DESTAQUE) - Correção de Tipagem TypeScript */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-7xl">
            {dict.construction ? (
              /* Cast para 'any' ou adequação à interface esperada pelo componente para evitar erro de build */
              <ConstructionRiskProject dict={dict.construction as any} />
            ) : null}
          </div>
        </section>

        {/* SOBRE & HIGHLIGHTS */}
        <section id="about" className="scroll-mt-20">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 py-12">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {/* EXPERIÊNCIA PROFISSIONAL */}
        <ExperienceSection experience={dict.experience} />

        {/* GRID DE PROJETOS */}
        <section id="projects" className="py-20 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {lang === "pt-BR" ? "Projetos" : lang.startsWith("es") ? "Proyectos" : "Projects"}{" "}
              <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* CURRÍCULO (DINÂMICO PARA 5 IDIOMAS) */}
        <section id="resume" className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-800 scroll-mt-20">
          <div className="text-center mb-10 px-4">
            <h2 className="text-4xl font-black mb-8 text-slate-900 dark:text-white tracking-tighter">
              Curriculum <span className="text-blue-600">Vitae</span>
            </h2>
            <div className="max-w-xs mx-auto mb-12">
              <ResumeLangSelector currentLang={lang as SupportedLocale} dict={dict.resume} />
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>
        </section>

        {/* ARTIGOS E RECONHECIMENTO */}
        <section id="featured-articles" className="py-24 bg-white dark:bg-[#020617] scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4">
            <header className="mb-16 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                  {dict.articles.awardWinner}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
                {dict.articles.title}
              </h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* CARD MEDIUM - PREMIADO */}
              <div className="group relative flex flex-col bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                <div className="absolute top-8 right-8">
                  <span className="px-2 py-1 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                    {dict.articles.awardWinner}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 mt-6">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                    <Image 
                      src="/images/trofeus-vencedor-dio.png" 
                      alt="Troféus DIO" 
                      fill 
                      className="object-cover" 
                      sizes="128px"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-[10px] font-bold uppercase text-blue-600 mb-1">{dict.articles.items[0]?.category}</p>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{dict.articles.items[0]?.title}</h3>
                  </div>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                  <a href="https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e" target="_blank" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-colors">PT</a>
                  <a href="https://medium.com/@sergiosantosluiz/low-code-in-healthcare-how-to-build-medical-apps-in-weeks-2679bf08ba77" target="_blank" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-colors">EN</a>
                  <a href="https://medium.com/@sergiosantosluiz/low-code-en-la-salud-c%C3%B3mo-crear-apps-m%C3%A9dicos-em-semanas-5474e7dddfad" target="_blank" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-colors">ES</a>
                </div>
              </div>

              {/* CARD INTERNO */}
              <Link href={`/${lang}/artigos`} className="group flex flex-col bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl hover:border-blue-500 transition-all">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-slate-900 dark:bg-white rounded-2xl text-white dark:text-black">
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                      {lang === "pt-BR" ? "Artigos Internos" : lang.startsWith("es") ? "Artículos Internos" : "Internal Articles"}
                    </h3>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-800 text-xs font-black text-blue-600">
                  <span>{dict.articles.mediumProfile}</span>
                  <span>{dict.articles.readMore} →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* RODAPÉ E CONTATO */}
        <ContactSection contact={dict.contact} common={dict.common} locale={lang} />
      </main>
    </ProxyPage>
  );
}
