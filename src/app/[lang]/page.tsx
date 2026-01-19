// src/app/[lang]/page.tsx
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { getDictionary, isValidLocale, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

// ISR: Revalida os dados do GitHub a cada 1 hora para manter performance máxima
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Sênior)
 * Resolve as relações hreflang e títulos dinâmicos para PT, EN e ES.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = await getDictionary(lang as Locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';
  
  return {
    title: `Sérgio Santos | ${dict.about?.headline?.split('.')[0] || 'Data Specialist'}`,
    description: dict.about?.bio?.substring(0, 160) || 'Data Specialist Portfolio',
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'pt-BR': `${baseUrl}/pt`,
        'en-US': `${baseUrl}/en`,
        'es-ES': `${baseUrl}/es`,
      },
    },
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 * Orquestra as seções do portfólio com injeção de dicionário i18n.
 */
export default async function Page({ params }: PageProps) {
  // No Next.js 15, params deve ser aguardado (awaited)
  const { lang } = await params;
  
  // Segurança: Se o idioma na URL não for suportado, exibe 404
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * DATA FETCHING PARALELIZADO
   * Performance: Carrega o dicionário e a API do GitHub ao mesmo tempo.
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* NAVBAR: Passagem de dicionário para links traduzidos */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex min-h-screen w-full flex-col overflow-x-hidden">
        
        {/* 1. HERO: Proposta de valor imediata */}
        <section id="hero" className="relative">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Scroll-mt ajustado para a altura da Navbar no mobile */}
        <section id="about" className="scroll-mt-20 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. ARTICLES: Autoridade Técnica */}
        <section id="articles" className="scroll-mt-20 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. PROJECTS: Grid alimentado dinamicamente pelo GitHub */}
        <section id="projects" className="scroll-mt-20 lg:scroll-mt-32">
          <PortfolioGrid projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 5. CONTACT: Conversão e Leads */}
        <section id="contact" className="scroll-mt-20 pb-20 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER: Encerramento com controle de versão e stack */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
