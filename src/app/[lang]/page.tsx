/**
 * HOME PAGE - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16, React 19, TS 6.0, Tailwind 4.2, Node 24
 * ✔ I18n: Suporte nativo a pt-BR, en-US, es-ES, es-AR, es-MX
 * ✔ Responsividade: Mobile-first otimizado para Vercel
 */

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getGitHubProjects } from "@/services/githubService"; // Importação unificada
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

// Configurações de Cache e Renderização da Vercel
export const dynamic = "force-static";
export const revalidate = 3600; // Atualiza o cache do GitHub a cada hora

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

  // Validação de Locale para Next.js 16
  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  /**
   * DATA FETCHING - SERVER SIDE
   * ✔ getGitHubProjects utiliza o Octokit internamente.
   * ✔ O processamento de "Pipes" (|) ocorre dentro do serviço.
   */
  const [dictData, allProjects] = await Promise.all([
    getServerDictionary(lang),
    getGitHubProjects("Santosdevbjj") // Nome de usuário injetado corretamente
  ]);

  if (!dictData) notFound();

  // Tratamento de segurança para o dicionário (TS 6.0 Strict Null Checks)
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
        
        {/* SEÇÃO HERO - Otimizada para Tailwind 4.2 */}
        <div className="pt-20 lg:pt-0">
          <HeroSection dictionary={dict} />
        </div>

        {/* SOBRE & HIGHLIGHTS - Responsividade 7xl */}
        <section id="about" className="relative overflow-hidden">
          <AboutSection dict={dict.about} />
          
          <div className="container mx-auto px-6 max-w-7xl">
            <CareerHighlights dict={dict} />
          </div>

          {/* Chamada para Ação: Download CV Multilíngue */}
          <div className="container mx-auto px-6 py-16 flex justify-center md:justify-start max-w-7xl">
            <a 
              href={`/cv-sergio-santos-${lang}.pdf`} 
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              <span className="group-hover:translate-y-1 transition-transform">↓</span>
              {dict.contact.cvLabel}
            </a>
          </div>
        </section>

        {/* EXPERIÊNCIA PROFISSIONAL */}
        <ExperienceSection experience={dict.experience} />

        {/* GRID DE PORTFÓLIO - Projetos do GitHub Processados */}
        <PortfolioGrid 
          projects={allProjects} 
          lang={lang} 
          dict={dict} 
        />

        {/* ARTIGOS TÉCNICOS */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

        {/* CONTATO & RODAPÉ */}
        <ContactSection 
          contact={dict.contact} 
          common={dict.common} 
          locale={lang} 
        />
      </main>
    </ProxyPage>
  );
}
