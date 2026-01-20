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

// ISR: Revalida os dados do GitHub a cada 1 hora (3600 segundos)
export const revalidate = 3600; 

/**
 * No Next.js 15, os params são tratados como Promises.
 * Definimos a interface de forma rigorosa para evitar erros de tipagem no build.
 */
interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Internacional)
 * Gera tags hreflang e Open Graph específicas para cada idioma.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';
  
  // SEO: Extraímos o título de forma segura do dicionário
  const pageTitle = dict.about?.headline?.split('.')[0] || 'Data Specialist';
  
  return {
    title: `Sérgio Santos | ${pageTitle}`,
    description: dict.about?.bio?.substring(0, 160) || 'Portfólio de Especialista em Dados e IA',
    alternates: {
      canonical: `${baseUrl}/${currentLang}`,
      languages: {
        'pt': `${baseUrl}/pt`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
      },
    },
    openGraph: {
      title: `Sérgio Santos | ${pageTitle}`,
      description: dict.about?.bio?.substring(0, 160),
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      images: [
        {
          url: `/og-image-${currentLang}.png`,
          width: 1200,
          height: 630,
          alt: `Sérgio Santos - ${currentLang}`,
        },
      ],
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 * Orquestra as seções injetando o dicionário e dados do GitHub.
 */
export default async function Page({ params }: PageProps) {
  // Obrigatório no Next.js 15: await params
  const { lang } = await params;
  
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * DATA FETCHING PARALELIZADO (Performance Sênior)
   * Carregamos o dicionário local e os projetos externos (GitHub) em paralelo
   * para reduzir o tempo total de carregamento (LCP).
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* NAVBAR: Navegação contextualizada ao idioma */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex min-h-screen w-full flex-col overflow-x-hidden">
        
        {/* 1. HERO: Primeira seção que o usuário vê (LCP) */}
        <section id="hero" className="relative">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Scroll-margin ajustado para não ficar sob a Navbar no clique */}
        <section id="about" className="scroll-mt-20 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. ARTICLES: Seção de autoridade técnica e prêmios */}
        <section id="articles" className="scroll-mt-20 lg:scroll-mt-32">
          {/* Agora o dict é passado corretamente, evitando o erro do build anterior */}
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. PROJECTS: Grid de projetos vindo do GitHub via Server-side Fetching */}
        <section id="projects" className="scroll-mt-20 lg:scroll-mt-32">
          <PortfolioGrid projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 5. CONTACT: Seção final para conversão */}
        <section id="contact" className="scroll-mt-20 pb-20 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER: Rodapé com suporte multilingue */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
