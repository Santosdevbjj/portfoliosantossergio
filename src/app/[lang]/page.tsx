// src/app/[lang]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectSection } from '@/components/ProjectSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { getDictionary, isValidLocale, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

/**
 * ISR (Incremental Static Regeneration)
 * Revalida os dados do GitHub e o dicionário a cada 1 hora.
 */
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Internacional)
 * Configuração robusta para ranqueamento em PT, EN e ES.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';
  
  const pageTitle = dict.about?.headline?.split('.')[0] || 'Data & Systems Specialist';
  const pageDesc = dict.about?.bio?.substring(0, 160) || 'Portfólio de Especialista em Dados e Sistemas Críticos';
  
  return {
    title: `Sérgio Santos | ${pageTitle}`,
    description: pageDesc,
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
      description: pageDesc,
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`, 
          width: 1200,
          height: 630,
          alt: `Sérgio Santos | ${pageTitle}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Sérgio Santos | ${pageTitle}`,
      description: pageDesc,
    },
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 * Orquestra a composição da página injetando i18n em todos os componentes.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  // Validação de rota (Impede idiomas não suportados)
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * FETCH PARALELO: Otimização de tempo de resposta (TTFB)
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* A Navbar recebe o dicionário para traduzir itens como 
          "Sobre", "Projetos", "Contato" e o seletor de idiomas.
      */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex min-h-screen w-full flex-col overflow-x-hidden relative bg-white dark:bg-[#020617] transition-colors duration-500">
        
        {/* HERO SECTION - Landing de Impacto */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* As margens de rolagem (scroll-mt) garantem que, ao clicar no menu,
            o título da seção não fique escondido atrás da Navbar fixa.
        */}
        <div id="about" className="scroll-mt-24 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </div>

        <div id="experience" className="scroll-mt-24 lg:scroll-mt-32">
          <ExperienceSection lang={currentLang} dict={dict} />
        </div>

        <div id="featured" className="scroll-mt-24 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </div>

        <div id="projects" className="scroll-mt-24 lg:scroll-mt-32">
          <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
        </div>

        <div id="contact" className="scroll-mt-24 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </div>
        
      </main>

      {/* FOOTER - Mantém consistência visual e linguística */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
