/**
 * HOME PAGE - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16, React 19, TS 6.0, Tailwind 4.2, Node 24
 * ✔ Fix: Proteção contra erro 'labelKey' via fallback de dicionário
 * ✔ Responsividade: Mobile-first com containers dinâmicos Tailwind 4.2
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
  params: Promise<{ lang: string }>;
}

// Configurações de Cache Vercel / Next.js 16
export const dynamic = "force-static";
export const revalidate = 3600;

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
  if (!dict) return {};

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
  // 1. Resolver Params de forma assíncrona (React 19/Next 16 Pattern)
  const { lang: rawLang } = await params;

  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  // 2. Busca paralela de alta performance (Node 24)
  const [dictData, rawProjects] = await Promise.all([
    getServerDictionary(lang),
    getGitHubProjects("Santosdevbjj")
  ]);

  // 3. Fallback Crítico para evitar erro de 'labelKey'
  if (!dictData) {
    console.error(`❌ Erro crítico: Dicionário não encontrado para o idioma: ${lang}`);
    notFound();
  }

  // Cast seguro para o domínio de projetos
  const allProjects = rawProjects as unknown as ProjectDomain[];

  // 4. Sanitização do Dicionário (Impede erros de tradução ausente no build)
  const dict: Dictionary = {
    ...dictData,
    contact: {
      ...dictData.contact,
      cvLabel: dictData.contact?.cvLabel ?? (lang === 'pt-BR' ? 'Baixar CV' : 'Download CV'),
    }
  };

  return (
    <ProxyPage lang={lang}>
      <main id="main-content" className="flex flex-col min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
        
        {/* HERO SECTION - Mobile-First Adjustment */}
        <div className="pt-20 lg:pt-0">
          <HeroSection dictionary={dict} />
        </div>

        {/* ABOUT & HIGHLIGHTS */}
        <section id="about" className="relative overflow-hidden w-full">
          <AboutSection dict={dict.about} />
          
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <CareerHighlights dict={dict} />
          </div>

          {/* CV CTA - Tailwind 4.2 Utility Patterns */}
          <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 flex justify-center md:justify-start max-w-7xl">
            <a 
              href={`/cv-sergio-santos-${lang}.pdf`} 
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 px-6 py-4 md:px-8 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-[1.03] transition-all shadow-xl active:scale-95"
            >
              <span className="group-hover:translate-y-1 transition-transform inline-block">↓</span>
              {dict.contact.cvLabel}
            </a>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <ExperienceSection experience={dict.experience} />

        {/* PORTFOLIO GRID - Responsividade garantida via container interno */}
        <div className="w-full bg-slate-50/50 dark:bg-slate-900/20 py-10">
          <PortfolioGrid 
            projects={allProjects} 
            lang={lang} 
            dict={dict} 
          />
        </div>

        {/* ARTICLES & CONTENT */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

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
