/**
 * HOME PAGE - PORTFÓLIO SÉRGIO SANTOS (CORRIGIDO v2026)
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16 (Promise Params), React 19 (Async Components)
 * ✔ TS 6.0: Strict variance e inference para Dictionaries
 * ✔ Tailwind 4.2: Dynamic Viewports e Containers
 * ✔ Fix: Resolução de categorias de projeto via labelKey
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
  readonly params: Promise<{ lang: string }>;
}

// Configurações de Cache Next.js 16 / Vercel Edge
export const dynamic = "force-static";
export const revalidate = 3600; // Revalida a cada 1 hora

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isValidLocale(rawLang)) return {};

  const dict = await getServerDictionary(rawLang as Locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  return {
    title: dict.seo?.pages?.home?.title ?? "Sérgio Santos | Portfolio",
    description: dict.seo?.pages?.home?.description ?? "Data Engineering Portfolio",
    alternates: {
      canonical: `${siteUrl}/${rawLang}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  // 1. Resolver Params (Next 16 obriga o await)
  const { lang: rawLang } = await params;

  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  // 2. Data Fetching Paralelo (Node 24 Performance)
  // Nota: getGitHubProjects já possui fallback interno para array vazio
  const [dict, rawProjects] = await Promise.all([
    getServerDictionary(lang),
    getGitHubProjects("Santosdevbjj")
  ]);

  // 3. Tipagem e Sanitização (TS 6.0)
  const allProjects = rawProjects as unknown as ProjectDomain[];

  return (
    <ProxyPage lang={lang}>
      <main 
        id="main-content" 
        className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 selection:bg-blue-500/30"
      >
        
        {/* HERO - Adaptativo para Safe Areas de Mobile */}
        <section className="pt-24 lg:pt-0">
          <HeroSection dictionary={dict} />
        </section>

        {/* SOBRE E DESTAQUES - Tailwind 4.2 Max-Width Patterns */}
        <section id="about" className="relative w-full overflow-hidden">
          <AboutSection dict={dict.about} />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CareerHighlights dict={dict} />
          </div>

          {/* CTA DOWNLOAD CV - Design Sistêmico */}
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex justify-center md:justify-start">
              <a 
                href={`/cv-sergio-santos-${lang}.pdf`} 
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 rounded-2xl bg-slate-900 px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] hover:bg-blue-600 active:scale-95 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white shadow-2xl shadow-blue-500/10"
              >
                <span className="text-lg transition-transform group-hover:translate-y-1">↓</span>
                {dict.contact.cvLabel}
              </a>
            </div>
          </div>
        </section>

        {/* EXPERIÊNCIA - Server Component Pattern */}
        <section id="experience" className="w-full">
          <ExperienceSection experience={dict.experience} />
        </section>

        {/* PORTFÓLIO - Com Grid Inteligente */}
        <section id="projects" className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10">
          <PortfolioGrid 
            projects={allProjects} 
            lang={lang} 
            dict={dict} 
          />
        </section>

        {/* ARTIGOS E CONTEÚDO */}
        <section id="articles" className="w-full">
          <FeaturedArticleSection 
            articles={dict.articles} 
            common={dict.common} 
          />
        </section>

        {/* CONTATO */}
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
