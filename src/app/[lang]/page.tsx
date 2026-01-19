// src/app/[lang]/page.tsx
import { getGitHubProjects } from '@/lib/github';
import { getDictionary } from '@/i18n-config'; 
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';

// CORREÇÃO CRÍTICA: Importação de tipos para VerbatimModuleSyntax (TS 5.7)
import type { Metadata } from 'next';
import { i18n, isValidLocale, type Locale } from '@/i18n-config';

// ISR: Revalida os dados do GitHub a cada 1 hora para manter performance máxima
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Sênior)
 * Resolve o erro de compilação da Vercel ao usar 'import type'
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = await getDictionary(lang as Locale);
  
  return {
    title: `Sérgio Santos | ${dict.about.headline.split('.')[0]}`,
    description: dict.about.bio.substring(0, 160),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'pt-BR': '/pt',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 * Totalmente Responsiva e Multilingue (PT, EN, ES)
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
   * Carrega dicionário e projetos do GitHub simultaneamente (Performance)
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* NAVBAR: Traduzida dinamicamente conforme o 'lang' */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex flex-col w-full overflow-x-hidden min-h-screen">
        
        {/* 1. HERO: Proposta de valor imediata */}
        <section id="hero" className="relative">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Scroll-mt garante que o menu fixo não cubra o título no mobile */}
        <section id="about" className="scroll-mt-20 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. ARTICLES: Thought Leadership */}
        <section id="articles" className="scroll-mt-20 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. PROJECTS: Dados reais do GitHub */}
        <section id="projects" className="scroll-mt-20 lg:scroll-mt-32">
          <PortfolioGrid projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 5. CONTACT: Call to Action final */}
        <section id="contact" className="scroll-mt-20 lg:scroll-mt-32 pb-20">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER: Encerramento com créditos e stack */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
