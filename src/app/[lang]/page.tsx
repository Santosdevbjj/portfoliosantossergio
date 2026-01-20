// src/app/[lang]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ExperienceSection } from '@/components/ExperienceSection'; // Importação da nova seção
import { ProjectSection } from '@/components/ProjectSection'; // Ajustado para o nome correto do componente
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { getDictionary, isValidLocale, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

// ISR: Revalida os dados do GitHub a cada 1 hora
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Internacional)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';
  
  const pageTitle = dict.about?.headline?.split('.')[0] || 'Data Specialist';
  
  return {
    title: `Sérgio Santos | ${pageTitle}`,
    description: dict.about?.bio?.substring(0, 160) || 'Portfólio de Especialista em Dados e Sistemas Críticos',
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
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * DATA FETCHING PARALELIZADO
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* NAVBAR */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex min-h-screen w-full flex-col overflow-x-hidden">
        
        {/* 1. HERO: Impacto imediato */}
        <section id="hero" className="relative">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Quem é o profissional por trás dos dados */}
        <section id="about" className="scroll-mt-20 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. EXPERIENCE: Onde o valor foi gerado (Seção Crítica de Autoridade) */}
        <section id="experience" className="scroll-mt-20 lg:scroll-mt-32">
          <ExperienceSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. ARTICLES: Autoridade Técnica (Thought Leadership) */}
        <section id="articles" className="scroll-mt-20 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 5. PROJECTS: Prova social e técnica via GitHub */}
        <section id="projects" className="scroll-mt-20 lg:scroll-mt-32">
          <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 6. CONTACT: Próximo passo */}
        <section id="contact" className="scroll-mt-20 pb-20 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
