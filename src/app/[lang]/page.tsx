/**
 * HOME PAGE - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16, React 19, TS 6.0, Tailwind 4.2
 * ✔ Responsividade Total (Mobile-First)
 * ✔ Multilíngue (PT, EN, ES, ES-AR, ES-MX)
 * ✔ Integração com PortfolioGrid e GitHub Service corrigida
 */

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getGitHubProjects } from "@/services/githubService";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";
import { resolveProjectTechnology, resolveProjectFlags } from "@/domain/projects";

// Components
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import ContactSection from "@/components/ContactSection";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CareerHighlights } from "@/components/CareerHighlights";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  if (!rawLang || !isValidLocale(rawLang)) return {};

  try {
    const dict: Dictionary = await getServerDictionary(rawLang as Locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

    return {
      title: dict?.seo?.pages?.home?.title ?? "Sérgio Santos",
      description: dict?.seo?.pages?.home?.description ?? "Portfolio",
      alternates: {
        canonical: `${siteUrl}/${rawLang}`,
        languages: {
          "pt-BR": `${siteUrl}/pt-BR`,
          "en-US": `${siteUrl}/en-US`,
          "es-ES": `${siteUrl}/es-ES`,
          "es-AR": `${siteUrl}/es-AR`,
          "es-MX": `${siteUrl}/es-MX`,
        },
      },
    };
  } catch {
    return { title: "Sérgio Santos" };
  }
}

export default async function HomePage(props: PageProps) {
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  // Fetch de dados em paralelo para performance
  const [dictData, githubProjects] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getGitHubProjects("Santosdevbjj").catch(() => [])
  ]);

  if (!dictData) {
    notFound();
  }

  /**
   * PROCESSAMENTO DOS PROJETOS PARA DOMAIN PATTERN
   * Correção do Erro de Tipo: Fazemos o cast seguro para 'any' ou 
   * garantimos a existência de topics para satisfazer o compilador.
   */
  const domainProjects: readonly ProjectDomain[] = (githubProjects as any[])
    .filter(p => {
      const name = (p.name || "").toLowerCase();
      return !name.includes("articles") && !name.includes("artigos");
    })
    .map(p => {
      const topics: string[] = Array.isArray(p.topics) ? p.topics : [];
      const flags = resolveProjectFlags(topics);
      const tech = resolveProjectTechnology(topics);
      
      return {
        id: String(p.id),
        name: p.name || "Untitled Project",
        description: p.description || p.problem || "",
        htmlUrl: p.html_url || p.url || p.htmlUrl || "",
        homepage: p.homepage || null,
        topics: topics,
        technology: tech,
        isPortfolio: true, 
        isFeatured: flags.isFeatured,
        isFirst: flags.isFirst,
      };
    });

  const cvPath = `/cv-sergio-santos-${lang}.pdf`;

  // Sanitização do dicionário para evitar erros de runtime em propriedades opcionais
  const dict: Dictionary = {
    ...dictData,
    contact: {
      ...dictData.contact,
      cvLabel: dictData.contact.cvLabel || "Ver CV",
    }
  };

  return (
    <ProxyPage lang={lang}>
      {/* Acessibilidade: Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] bg-blue-600 text-white p-4 rounded-lg font-bold"
      >
        {dict.common.skipToContent}
      </a>

      <main id="main-content" className="flex flex-col min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
        
        {/* HERO SECTION */}
        <div className="pt-20 md:pt-0">
          <HeroSection dictionary={dict} />
        </div>

        {/* ABOUT & HIGHLIGHTS */}
        <section id="about" className="relative overflow-hidden">
          <AboutSection dict={dict.about} />
          
          <div className="container mx-auto px-6 max-w-7xl">
            <CareerHighlights dict={dict} />
          </div>

          {/* CTA: Visualizar CV */}
          <div className="container mx-auto px-6 py-16 flex flex-wrap gap-4 justify-center md:justify-start max-w-7xl">
            <a 
              href={cvPath} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl active:scale-95 border border-transparent dark:border-slate-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {dict.contact.cvLabel}
            </a>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <ExperienceSection experience={dict.experience} />

        {/* PORTFOLIO GRID SECTION */}
        <PortfolioGrid 
          projects={domainProjects} 
          lang={lang} 
          dict={dict} 
        />

        {/* ARTICLES SECTION */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

        {/* KNOWLEDGE BASE / BLOG LINK */}
        <section className="container mx-auto px-6 py-24 max-w-7xl border-t border-slate-100 dark:border-slate-900" id="knowledge-base">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
                Journal & <span className="text-blue-600">Artigos</span>
            </h2>
            <div className="h-2 w-24 bg-blue-600 mt-6 rounded-full" />
          </header>

          <div className="grid grid-cols-1">
            <article className="group flex flex-col justify-between p-10 md:p-16 rounded-[3rem] border-2 border-blue-600 bg-blue-50/10 dark:bg-blue-900/5 relative overflow-hidden transition-all hover:bg-blue-50/20 dark:hover:bg-blue-900/10">
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black italic text-blue-600 mb-6">myArticles</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mb-12 text-lg md:text-xl leading-relaxed font-medium">
                  Exploração técnica aprofundada, artigos de arquitetura e documentação renderizada dinamicamente via MDX diretamente do meu ecossistema GitHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <a href={`/${lang}/artigos`} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs text-center hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                    Explorar Biblioteca →
                  </a>
                  <a href={`/${lang}/artigos/README`} className="border-2 border-slate-200 dark:border-slate-800 px-10 py-5 rounded-2xl font-black uppercase text-xs dark:text-white text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                    Documentação (README)
                  </a>
                </div>
              </div>
              
              <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-600">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                 </svg>
              </div>
            </article>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <ContactSection 
          contact={dict.contact} 
          common={dict.common} 
          locale={lang} 
        />
      </main>
    </ProxyPage>
  );
}
