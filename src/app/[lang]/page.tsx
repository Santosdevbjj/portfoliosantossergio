/**
 * HOME PAGE - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16, React 19, TS 6.0, Tailwind 4.2, Node 24
 * ✔ I18n: Suporte nativo a pt-BR, en-US, es-ES (e variantes AR/MX)
 * ✔ Responsividade: Mobile-first com containers Max-7xl
 */

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getProjects } from "@/services/github"; // Serviço unificado com Octokit
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

export const dynamic = "force-static";
export const revalidate = 3600; // Revalida a cada hora para atualizar projetos do GitHub

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
    title: dict?.seo?.pages?.home?.title,
    description: dict?.seo?.pages?.home?.description,
    alternates: {
      canonical: `${siteUrl}/${rawLang}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;

  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  // Busca paralela de Dicionário e Projetos (Direct Server Fetching)
  const [dictData, allProjects] = await Promise.all([
    getServerDictionary(lang),
    getProjects() 
  ]);

  if (!dictData) notFound();

  // Tratamento de segurança para o dicionário
  const dict: Dictionary = {
    ...dictData,
    contact: {
      ...dictData.contact,
      cvLabel: dictData.contact.cvLabel || "Ver CV",
    }
  };

  return (
    <ProxyPage lang={lang}>
      <main id="main-content" className="flex flex-col min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
        
        {/* HERO - Header responsivo com padding para mobile */}
        <div className="pt-20 lg:pt-0">
          <HeroSection dictionary={dict} />
        </div>

        {/* SOBRE & HIGHLIGHTS */}
        <section id="about" className="relative overflow-hidden">
          <AboutSection dict={dict.about} />
          
          <div className="container mx-auto px-6 max-w-7xl">
            <CareerHighlights dict={dict} />
          </div>

          {/* Botão de CV Adaptativo */}
          <div className="container mx-auto px-6 py-16 flex justify-center md:justify-start max-w-7xl">
            <a 
              href={`/cv-sergio-santos-${lang}.pdf`} 
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              <span className="group-hover:mr-2 transition-all">↓</span>
              {dict.contact.cvLabel}
            </a>
          </div>
        </section>

        {/* EXPERIÊNCIA - Server Side Rendered */}
        <ExperienceSection experience={dict.experience} />

        {/* PORTFÓLIO - Injeção de dados do GitHub já filtrados */}
        <PortfolioGrid 
          projects={allProjects} 
          lang={lang} 
          dict={dict} 
        />

        {/* CONTEÚDO TÉCNICO */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

        {/* FOOTER & CTA */}
        <ContactSection 
          contact={dict.contact} 
          common={dict.common} 
          locale={lang} 
        />
      </main>
    </ProxyPage>
  );
}
