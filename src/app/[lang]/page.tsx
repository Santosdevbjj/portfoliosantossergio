import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ProjectSection } from '@/components/ProjectSection';
import { getDictionary, isValidLocale, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

/**
 * ISR (Incremental Static Regeneration)
 * Atualiza o conteúdo a cada 1 hora sem necessidade de novo deploy.
 */
export const revalidate = 3600; 

// Interface estrita para o Next.js 15
interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * GENERATE METADATA - SEO AVANÇADO
 * Personaliza a aba do navegador e o card de compartilhamento por idioma.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');
  
  const pageTitle = dict.about?.headline ?? 'Data Specialist';
  const pageDesc = (dict.about?.bio ?? 'Portfolio de Sérgio Santos').substring(0, 160).replace(/\n/g, ' ');
  
  return {
    title: `Sérgio Santos | ${pageTitle}`,
    description: pageDesc,
    alternates: {
      canonical: `${baseUrl}/${currentLang}`,
      languages: {
        'pt': `${baseUrl}/pt`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/pt`,
      },
    },
    openGraph: {
      title: `Sérgio Santos | ${pageTitle}`,
      description: pageDesc,
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

/**
 * PÁGINA PRINCIPAL
 * Renderizada no servidor para máxima performance e SEO.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /**
   * CARGA DE DADOS PARALELA
   * Otimiza o Time-to-First-Byte (TTFB).
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects(currentLang) 
  ]);

  return (
    <PageWrapper>
      {/* Navegação Fixa */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] transition-colors duration-500 antialiased">
        
        {/* 1. HERO: Captura de atenção imediata */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* 2. SOBRE: Bio e Destaques (Highlights) */}
        <section id="about" className="mx-auto w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. EXPERIÊNCIA: Timeline profissional com fundo sutil */}
        <section id="experience" className="mt-24 scroll-mt-24 bg-slate-50/50 dark:bg-slate-900/10 py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* 4. ARTIGOS: Blog/Pensamento técnico */}
        <section id="featured" className="mx-auto w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 py-24 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 5. PORTFÓLIO: Projetos reais do GitHub */}
        <section id="projects" className="scroll-mt-24 py-12 lg:py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
            <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* 6. CONTATO: Fechamento e CTA */}
        <section id="contact" className="mx-auto mb-24 w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* Rodapé Informativo */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
