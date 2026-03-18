import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Importação necessária para os novos cards

import type { Locale } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import { resolveProjectTechnology } from "@/domain/projects";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getPortfolioRepos } from "@/lib/github";
import { locales, normalizeLocale, type SupportedLocale } from "@/dictionaries/locales";

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
 * REQUISITOS TÉCNICOS ATENDIDOS:
 * ✔ Next.js 16 - Params as Promise, Turbopack, force-static
 * ✔ React 19 - Server Components assíncronos
 * ✔ SEO Premium - Fix fb:app_id (property), Title (57ch), Desc (152ch)
 * ✔ Tailwind 4.2 - Estrutura de layout moderna e efeitos visuais
 */

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/**
 * METADATA (VERSÃO FINAL E RECALIBRADA)
 * Resolve: Erro fb:app_id no Facebook, Avisos de tamanho no OpenGraph.xyz
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang) as SupportedLocale;

  if (!locales.includes(locale)) return {};

  const dict = await getServerDictionary(locale as Locale).catch(() => null);

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const fullUrl = `${siteUrl}/${locale}`;

  // 1. AJUSTE DE UX (OpenGraph.xyz): Título descritivo (~57 caracteres)
  const titleMap: Record<SupportedLocale, string> = {
    "pt-BR": "Sérgio Santos | Cientista de Dados e Engenheiro de Software",
    "en-US": "Sérgio Santos | Data Scientist and Software Engineer",
    "es-ES": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
    "es-AR": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
    "es-MX": "Sérgio Santos | Científico de Datos e Ingeniero de Software",
  };
  const title = titleMap[locale] || titleMap["pt-BR"];

  // 2. AJUSTE DE UX (OpenGraph.xyz): Descrição enxuta (~152 caracteres)
  const descriptionMap: Record<SupportedLocale, string> = {
    "pt-BR": "Especialista em Ciência de Dados e IA com foco em Sistemas Críticos. Veja projetos de alta disponibilidade e artigos técnicos de Sérgio Santos.",
    "en-US": "Data Science and AI Expert focused on Critical Systems. Explore high-availability projects and technical articles by Sérgio Santos.",
    "es-ES": "Especialista en Ciencia de Datos e IA en Sistemas Críticos. Explore proyectos de alta disponibilidad y artículos técnicos de Sérgio Santos.",
    "es-AR": "Especialista en Ciencia de Datos e IA en Sistemas Críticos. Explore proyectos de alta disponibilidad y artículos técnicos de Sérgio Santos.",
    "es-MX": "Especialista en Ciencia de Datos e IA en Sistemas Críticos. Explore proyectos de alta disponibilidad y artículos técnicos de Sérgio Santos.",
  };
  const description = descriptionMap[locale] || descriptionMap["pt-BR"];

  const ogImage = `${siteUrl}/og/og-image-${locale}.png`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),

    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },

    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Sérgio Santos Portfolio",
      type: "website",
      locale: locale.replace("-", "_"),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },

    /**
     * CORREÇÃO TÉCNICA (Facebook Debugeer):
     * Mapeia fb:app_id como 'property' em vez de 'name'.
     */
    facebook: {
      appId: "672839201123456", 
    },

    other: {
      "image": ogImage,
      "og:image:secure_url": ogImage,
      "og:image:type": "image/png",
    },
  };
}

/**
 * NORMALIZA REPOSITÓRIOS DO GITHUB
 */
function normalizeProjects(repos: unknown): ProjectDomain[] {
  if (!Array.isArray(repos)) return [];

  return repos
    .map((repo: any, index): ProjectDomain => {
      const topics = Array.isArray(repo?.topics)
        ? repo.topics.map((t: string) => t.toLowerCase())
        : [];

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
 * COMPONENTE DA PÁGINA PRINCIPAL
 */
export default async function HomePage({ params }: PageProps) {
  // Em Next.js 16, params deve ser aguardado
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) notFound();

  const lang = locale as Locale;

  // Busca paralela para performance
  const [dictResult, reposResult] = await Promise.allSettled([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj"),
  ]);

  const dict = dictResult.status === "fulfilled" ? dictResult.value : null;
  const repos = reposResult.status === "fulfilled" ? reposResult.value : [];

  if (!dict) notFound();

  const projects = normalizeProjects(repos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;
  const construction = (dict as any)?.construction;

  return (
    <ProxyPage lang={lang}>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        
        <HeroSection dictionary={dict} />

        {construction && (
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4">
              <ConstructionRiskProject dict={construction} />
            </div>
          </section>
        )}

        {/* SEÇÃO SOBRE E DESTAQUES DE CARREIRA */}
        <section id="about">
          {dict.about && <AboutSection dict={dict.about} />}
          <div className="mx-auto max-w-7xl px-4 py-12">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {/* SEÇÃO DE EXPERIÊNCIA PROFISSIONAL */}
        {dict.experience && (
          <ExperienceSection experience={dict.experience} />
        )}

        {/* GRID DE PROJETOS GITHUB */}
        <section id="projects" className="py-20">
          <div className="mx-auto max-w-7xl px-4 mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Projetos <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* SEÇÃO CURRÍCULO (RESUME) */}
        <section id="resume" className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50">
          <div className="text-center mb-10 px-4">
            <h2 className="text-4xl font-black mb-8 text-slate-900 dark:text-white tracking-tighter">
              Curriculum <span className="text-blue-600">Vitae</span>
            </h2>

            <div className="max-w-xs mx-auto mb-12">
              <ResumeLangSelector 
                currentLang={lang as SupportedLocale} 
                dict={dict.resume} 
              />
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>
        </section>

        {/* 🏆 SEÇÃO DE ARTIGOS PREMIADOS E CURADORIA ESTRATÉGICA (NOVOS CARDS) */}
        <section id="featured-articles" className="py-24 bg-white dark:bg-[#020617]">
          <div className="mx-auto max-w-7xl px-4">
            
            <header className="mb-16 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                  Reconhecimento Técnico & Curadoria
                </span>
              </div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-6">
                Liderança Através do <span className="text-blue-600">Conhecimento</span>
              </h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* CARD 1: ARTIGO PREMIADO (MEDIUM) */}
              <div className="group relative flex flex-col bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 transition-all hover:border-blue-100 dark:hover:border-blue-900 shadow-xl hover:shadow-blue-500/10">
                <div className="absolute top-8 right-8 flex items-center gap-2.5">
                  <div className="px-3 py-1 rounded-full bg-amber-400 text-[#020617] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-400/20">
                    Vencedor DIO
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                    Set/2025
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 mb-8 mt-6">
                  <div className="relative flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group-hover:scale-105 transition-transform duration-500">
                    <Image 
                      src="/images/trofeus-vencedor-dio.png" 
                      alt="Troféus Vencedor DIO"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                      Artigo premiado na 35ª Competição da DIO
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                      Low-Code na Saúde: Como Criar Apps Médicos em Semanas
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                  Publicado no Medium em três idiomas — português, inglês e espanhol — explorando como plataformas low-code podem acelerar o desenvolvimento de aplicações médicas sem abrir mão de segurança e conformidade regulatória.
                </p>

                <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-4">
                    Ler no Medium:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { lang: 'PT', href: 'https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e' },
                      { lang: 'EN', href: 'https://medium.com/@sergiosantosluiz/low-code-in-healthcare-how-to-build-medical-apps-in-weeks-2679bf08ba77' },
                      { lang: 'ES', href: 'https://medium.com/@sergiosantosluiz/low-code-en-la-salud-c%C3%B3mo-crear-apps-m%C3%A9dicos-em-semanas-5474e7dddfad' },
                    ].map(link => (
                      <a 
                        key={link.lang}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95"
                      >
                        {link.lang}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 2: REPOSITÓRIO ESTRATÉGICO (GITHUB) */}
              <a 
                href="https://github.com/Santosdevbjj/myArticles"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 transition-all hover:border-blue-100 dark:hover:border-blue-900 shadow-xl hover:shadow-blue-500/10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3.5 bg-slate-900 dark:bg-white rounded-2xl text-white dark:text-[#020617] group-hover:scale-110 transition-transform">
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                      myArticles: Curadoria Estratégica
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Santosdevbjj/myArticles • Repositório GitHub
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Este repositório não é apenas uma lista de links. É uma <strong className="text-slate-800 dark:text-slate-100 font-semibold">mostra do meu raciocínio aplicado</strong> a problemas reais de engenharia e negócios. Cada artigo documenta decisões técnicas, trade-offs e frameworks aplicáveis em ambientes que exigem alta disponibilidade e conformidade.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {['Sistemas Críticos', 'Governança', 'FinOps', 'MloPS', 'Zero Trust', 'LGPD'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-5 border-t border-slate-200/50 dark:border-slate-800/50">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                    Análise completa no README
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                    Acessar Repositório
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* CONTATO */}
        <ContactSection
          contact={dict.contact}
          common={dict.common}
          locale={lang}
        />
      </main>
    </ProxyPage>
  );
}
